const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key for admin access
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Lemon Squeezy webhook signing secret
const LEMON_SQUEEZY_SIGNING_SECRET = process.env.LEMON_SQUEEZY_SIGNING_SECRET;

// Verify webhook signature from Lemon Squeezy
function verifyWebhookSignature(payload, signature) {
  const hmac = crypto.createHmac('sha256', LEMON_SQUEEZY_SIGNING_SECRET);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

// Lemon Squeezy webhook handler
router.post('/lemon-squeezy', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // Get the signature from the headers
    const signature = req.headers['x-signature'];  
    
    // For testing purposes, allow skipping signature validation
    // In production, remove this bypass
    const Validation = process.env.NODE_ENV === 'production';
    
    if (!signature && !Validation) {
      return res.status(400).send('Missing signature header');
    }
    
    // Ensure req.body is handled correctly as a Buffer
    const payload = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : JSON.stringify(req.body);
   
    // Verify the webhook signature (skip in development if needed)
    if (!Validation && !verifyWebhookSignature(payload, signature)) {
      return res.status(401).send('Invalid signature');
    }
    
    // Parse the webhook payload
    const event = Buffer.isBuffer(req.body) ? JSON.parse(payload) : req.body;
    console.log(`Received webhook event: ${event.meta.event_name}`);
    
    // Extract relevant data
    const { event_name, custom_data } = event.meta;
    const data = event.data;
    
    // Handle different event types
    switch (event_name) {
      case 'subscription_created':
        await handleSubscriptionCreated(data, custom_data);
        break;
        
      case 'subscription_updated':
        await handleSubscriptionUpdated(data, custom_data);
        break;
        
      case 'subscription_cancelled':
        await handleSubscriptionCancelled(data, custom_data);
        break;
        
      case 'subscription_payment_success':
        await handleSubscriptionPaymentSuccess(data, custom_data);
        break;
        
      case 'subscription_payment_failed':
        await handleSubscriptionPaymentFailed(data, custom_data);
        break;
        
      case 'subscription_expired':
        await handleSubscriptionExpired(data, custom_data);
        break;
        
      default:
        console.log(`Unhandled event type: ${event_name}`);
    }
    
    // Return a 200 response to acknowledge receipt
    res.status(200).send('Webhook received successfully');
    
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error processing webhook');
  }
});

// Handle subscription created event
async function handleSubscriptionCreated(data, custom_data) {
  const { id: lemon_squeezy_subscription_id } = data;
  const { user_id } = custom_data || {};
  const { customer_id: lemon_squeezy_customer_id } = data.attributes;
  const { status, variant_name: plan } = data.attributes;
  const current_period_end = new Date(data.attributes.renews_at);
  
  if (!user_id) {
    console.error('No user_id found in webhook custom_data');
    return;
  }
  
  // Check if subscription already exists
  const { data: existingSubscription, error: findError } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('profile_id', user_id)
    .single();
    
  if (findError && findError.code !== 'PGRST116') { // PGRST116 is the error when no rows returned
    console.error('Error finding subscription:', findError);
    return;
  }
  
  // If subscription exists, update it, otherwise create a new one
  if (existingSubscription) {
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        lemon_squeezy_customer_id,
        lemon_squeezy_subscription_id,
        status,
        plan,
        current_period_end,
        updated_at: new Date()
      })
      .eq('id', existingSubscription.id);
      
    if (updateError) {
      console.error('Error updating subscription:', updateError);
    }
  } else {
    const { error: insertError } = await supabase
      .from('subscriptions')
      .insert({
        profile_id: user_id,
        lemon_squeezy_customer_id,
        lemon_squeezy_subscription_id,
        status,
        plan,
        current_period_end
      });
      
    if (insertError) {
      console.error('Error creating subscription:', insertError);
    }
  }
}

// Handle subscription updated event
async function handleSubscriptionUpdated(data, custom_data) {
  const { id: lemon_squeezy_subscription_id } = data;
  const { status, variant_name: plan } = data.attributes;
  const current_period_end = new Date(data.attributes.renews_at);
  
  // Check if subscription has expired
  if (status === 'expired') {
    return await handleSubscriptionExpired(data, custom_data);
  }
  
  // Update the subscription in the database
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status,
      plan,
      current_period_end,
      updated_at: new Date()
    })
    .eq('lemon_squeezy_subscription_id', lemon_squeezy_subscription_id);
    
  if (error) {
    console.error('Error updating subscription:', error);
  }
}

// Handle subscription cancelled event
async function handleSubscriptionCancelled(data, custom_data) {
  const { id: lemon_squeezy_subscription_id } = data;
  
  // Update the subscription status
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'cancelled',
      updated_at: new Date()
    })
    .eq('lemon_squeezy_subscription_id', lemon_squeezy_subscription_id);
    
  if (error) {
    console.error('Error cancelling subscription:', error);
  }
}

// Handle subscription payment success
async function handleSubscriptionPaymentSuccess(data, custom_data) {
  console.log('Processing subscription_payment_success event');
  console.log('Custom data:', custom_data);
  
  // Extract subscription ID from the data
  const lemon_squeezy_subscription_id = data.attributes.subscription_id;
  
  // If there's a user_id in custom_data, we can use it directly
  const user_id = custom_data?.user_id;
  
  // For successful payments, always set plan to "Pro"
  const plan = "Pro";
  console.log(`Setting plan to Pro for successful payment`);
  
  // Calculate period end - typically this would be 1 month from now for monthly subscriptions
  const currentDate = new Date();
  const current_period_end = new Date(currentDate.setDate(currentDate.getDate() + 30));
  
  console.log(`Attempting to update subscription for subscription_id: ${lemon_squeezy_subscription_id}`);
  
  try {
    // Try to find the subscription
    let query = supabase.from('subscriptions');
    
    if (user_id) {
      // If we have user_id, find by profile_id
      const { data: existingSubscription, error: findError } = await query
        .select('*')
        .eq('profile_id', user_id)
        .single();
        
      if (findError && findError.code !== 'PGRST116') {
        console.error('Error finding subscription by user_id:', findError);
      } else if (existingSubscription) {
        // Update existing subscription
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            lemon_squeezy_subscription_id,
            status: 'active',
            plan,
            current_period_end,
            updated_at: new Date()
          })
          .eq('id', existingSubscription.id);
          
        if (updateError) {
          console.error('Error updating subscription:', updateError);
        } else {
          console.log(`Successfully updated subscription for user ${user_id} to Pro plan`);
          return;
        }
      }
    }
    
    // If we couldn't find by user_id or update failed, try by subscription ID
    const { data: subData, error: subError } = await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        plan,
        current_period_end,
        updated_at: new Date()
      })
      .eq('lemon_squeezy_subscription_id', lemon_squeezy_subscription_id)
      .select();
      
    if (subError) {
      console.error('Error updating subscription by subscription_id:', subError);
    } else if (subData && subData.length > 0) {
      console.log(`Successfully updated subscription by subscription_id ${lemon_squeezy_subscription_id}`);
    } else {
      console.log(`No subscription found to update. This might be an issue.`);
    }
  } catch (error) {
    console.error('Unexpected error in handleSubscriptionPaymentSuccess:', error);
  }
}

// Handle subscription payment failed
async function handleSubscriptionPaymentFailed(data, custom_data) {
  const { subscription_id: lemon_squeezy_subscription_id } = data.attributes;
  
  // Update the subscription status
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'past_due',
      updated_at: new Date()
    })
    .eq('lemon_squeezy_subscription_id', lemon_squeezy_subscription_id);
    
  if (error) {
    console.error('Error updating subscription after failed payment:', error);
  }
}

// Handle subscription expired event
async function handleSubscriptionExpired(data, custom_data) {
  const { id: lemon_squeezy_subscription_id } = data;
  console.log(`Processing subscription expiration for subscription ID: ${lemon_squeezy_subscription_id}`);
  
  // Update the subscription instead of deleting it
  const { data: updateData, error } = await supabase
    .from('subscriptions')
    .update({
      status: 'expired',
      updated_at: new Date()
    })
    .eq('lemon_squeezy_subscription_id', lemon_squeezy_subscription_id)
    .select();
    
  if (error) {
    console.error('Error updating expired subscription:', error);
  } else {
    console.log(`Successfully updated ${updateData?.length || 0} subscription(s) to expired status`);
  }
}

module.exports = router;
