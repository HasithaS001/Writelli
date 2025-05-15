import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import useSubscriptionStore from '@/stores/subscriptionStore';

export function useSubscription() {
  const { user } = useAuth();
  const { 
    subscription, 
    isLoading, 
    error, 
    fetchSubscription, 
    clearSubscription 
  } = useSubscriptionStore();

  useEffect(() => {
    if (user?.id) {
      fetchSubscription(user.id);
    } else {
      clearSubscription();
    }
  }, [user?.id]);

  const isSubscriptionActive = subscription?.status === 'active';
  const isTrialing = subscription?.status === 'trialing';
  const isPastDue = subscription?.status === 'past_due';
  const isCancelled = subscription?.status === 'cancelled';
  const hasActiveSubscription = isSubscriptionActive || isTrialing;
  const subscriptionPlan = subscription?.plan || 'free';
  const currentPeriodEnd = subscription?.current_period_end
    ? new Date(subscription.current_period_end)
    : null;

  return {
    subscription,
    isLoading,
    error,
    isSubscriptionActive,
    isTrialing,
    isPastDue,
    isCancelled,
    hasActiveSubscription,
    subscriptionPlan,
    currentPeriodEnd,
    refetch: () => user?.id && fetchSubscription(user.id)
  };
}