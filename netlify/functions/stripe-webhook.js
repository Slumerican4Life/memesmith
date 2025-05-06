
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key to bypass RLS
const supabaseUrl = 'https://btbifnkqslcleqyxptec.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

exports.handler = async (event) => {
  try {
    // Verify the webhook signature
    const stripeSignature = event.headers['stripe-signature'];
    
    // Use a different endpoint secret for each webhook endpoint
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let stripeEvent;
    
    try {
      stripeEvent = stripe.webhooks.constructEvent(
        event.body,
        stripeSignature,
        endpointSecret
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }),
      };
    }
    
    // Handle the event
    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object;
      
      // Get the userId from the client_reference_id
      const userId = session.client_reference_id;
      
      if (!userId) {
        console.error('No userId found in session metadata');
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'No userId found in session metadata' }),
        };
      }
      
      // Update the user's profile to set is_pro to true
      const { error } = await supabase
        .from('users')
        .update({ is_pro: true })
        .eq('id', userId);
      
      if (error) {
        console.error('Error updating user profile:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Error updating user profile' }),
        };
      }
      
      console.log(`Successfully upgraded user ${userId} to Pro!`);
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
    
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
