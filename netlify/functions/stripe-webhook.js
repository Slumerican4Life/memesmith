
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key to bypass RLS
const supabaseUrl = 'https://btbifnkqslcleqyxptec.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper for debugging logs
const logStep = (step, details) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

exports.handler = async (event) => {
  try {
    logStep("Webhook received", { method: event.httpMethod });
    
    // Verify the webhook signature
    const stripeSignature = event.headers['stripe-signature'];
    
    // Use a different endpoint secret for each webhook endpoint
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let stripeEvent;
    
    try {
      logStep("Verifying webhook signature");
      stripeEvent = stripe.webhooks.constructEvent(
        event.body,
        stripeSignature,
        endpointSecret
      );
      logStep("Webhook signature verified", { type: stripeEvent.type });
    } catch (err) {
      logStep("Webhook signature verification failed", { error: err.message });
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }),
      };
    }
    
    // Handle the event
    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object;
      logStep("Processing checkout.session.completed", { sessionId: session.id });
      
      // Get the userId from the client_reference_id
      const userId = session.client_reference_id;
      const planType = session.metadata?.planType;
      
      if (!userId) {
        logStep("No userId found in session metadata");
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'No userId found in session metadata' }),
        };
      }
      
      logStep("Updating user profile", { userId, planType });
      
      // Different handling based on plan type
      if (planType === 'monthly' || planType === 'lifetime') {
        // For monthly or lifetime plans, set user as Pro
        const { error } = await supabase
          .from('users')
          .update({ is_pro: true })
          .eq('id', userId);
        
        if (error) {
          logStep("Error updating user profile", { error });
          return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error updating user profile' }),
          };
        }
        
        logStep(`Successfully upgraded user ${userId} to Pro with ${planType} plan!`);
      } else if (planType === 'paymeme') {
        // For pay-per-meme plan, we'd add credits to the user
        // First check if the user has a credits field, if not add it
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, meme_credits')
          .eq('id', userId)
          .single();
        
        if (userError) {
          logStep("Error fetching user data", { error: userError });
          return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error fetching user data' }),
          };
        }
        
        // Default to 10 credits (for $5 at $0.50 per meme)
        const currentCredits = userData.meme_credits || 0;
        const newCredits = currentCredits + 10; // Add 10 credits
        
        const { error } = await supabase
          .from('users')
          .update({ meme_credits: newCredits })
          .eq('id', userId);
        
        if (error) {
          logStep("Error updating user credits", { error });
          return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error updating user credits' }),
          };
        }
        
        logStep(`Successfully added 10 credits to user ${userId}, new total: ${newCredits}`);
      }
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
    
  } catch (error) {
    logStep("Webhook error", { message: error.message });
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
