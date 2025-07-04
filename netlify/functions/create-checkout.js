
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://btbifnkqslcleqyxptec.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper for debugging logs
const logStep = (step, details) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };
  
  // Handle OPTIONS request (preflight)
  if (event.httpMethod === 'OPTIONS') {
    logStep('Handling preflight request');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Preflight request successful' }),
    };
  }
  
  try {
    if (event.httpMethod !== 'POST') {
      logStep('Invalid HTTP method', { method: event.httpMethod });
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }
    
    logStep('Processing checkout request');
    // Parse the request body
    const { userId, returnUrl, planType, amount, planName } = JSON.parse(event.body);
    
    if (!userId) {
      logStep('Missing userId');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'User ID is required' }),
      };
    }
    
    logStep('Creating Stripe session', { userId, planType, planName });
    
    // Determine the payment mode based on plan type
    const mode = planType === 'monthly' ? 'subscription' : 'payment';
    
    let lineItems = [];
    
    if (planType === 'monthly') {
      // Monthly subscription
      lineItems = [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'MemeSmith Pro Monthly',
            description: 'Monthly subscription to MemeSmith Pro',
            images: ['https://btbifnkqslcleqyxptec.supabase.co/storage/v1/object/public/memesmith/pro-pack.jpg'],
          },
          unit_amount: 999, // $9.99
          recurring: {
            interval: 'month',
          },
        },
        quantity: 1,
      }];
    } else if (planType === 'lifetime') {
      // Lifetime purchase
      lineItems = [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'MemeSmith Pro Lifetime',
            description: 'Lifetime access to MemeSmith Pro',
            images: ['https://btbifnkqslcleqyxptec.supabase.co/storage/v1/object/public/memesmith/pro-pack.jpg'],
          },
          unit_amount: 2999, // $29.99
        },
        quantity: 1,
      }];
    } else if (planType === 'paymeme') {
      // Pay per meme
      lineItems = [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'MemeSmith Pay Per Meme',
            description: '10 additional memes ($0.50 each)',
            images: ['https://btbifnkqslcleqyxptec.supabase.co/storage/v1/object/public/memesmith/pro-pack.jpg'],
          },
          unit_amount: 500, // $5.00 for 10 memes ($0.50 each)
        },
        quantity: 1,
      }];
    }
    
    // Create a Stripe Checkout Session with the determined configuration
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: mode,
      success_url: `${returnUrl}/upgrade-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}`,
      client_reference_id: userId,
      metadata: {
        userId,
        planType,
        planName
      }
    });
    
    logStep('Checkout session created', { sessionId: session.id, planType });
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ sessionId: session.id, url: session.url }),
    };
    
  } catch (error) {
    logStep('Stripe checkout error', { error: error.message });
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
