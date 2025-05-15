import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// This is a test endpoint to simulate a webhook event for local development
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, subscriptionId = 'test-sub-123', customerId = 'test-cust-123' } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Create a test subscription in the database
    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        subscription_id: subscriptionId,
        customer_id: customerId,
        plan: 'pro',
        status: 'active',
        current_period_end: Math.floor((Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000), // 30 days from now
        cancel_at_period_end: false
      });

    if (error) {
      console.error('Error creating test subscription:', error);
      return NextResponse.json({ error: 'Error creating subscription' }, { status: 500 });
    }

    // Create a test webhook event
    await supabase
      .from('webhook_events')
      .insert({
        event_type: 'subscription_created',
        event_id: `test-event-${Date.now()}`,
        payload: {
          meta: { event_name: 'subscription_created' },
          data: {
            id: subscriptionId,
            attributes: {
              id: subscriptionId,
              customer_id: customerId,
              user_id: userId,
              renews_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              cancelled: false
            }
          }
        },
        processed: true
      });

    return NextResponse.json({ 
      success: true, 
      message: 'Test subscription created successfully',
      subscription: {
        user_id: userId,
        subscription_id: subscriptionId,
        plan: 'pro',
        status: 'active'
      }
    });
  } catch (error) {
    console.error('Error in test webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
