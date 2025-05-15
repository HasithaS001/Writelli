import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface Subscription {
  id: string;
  profile_id: string;
  lemon_squeezy_customer_id: string | null;
  lemon_squeezy_subscription_id: string | null;
  status: string;
  plan: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}

interface SubscriptionState {
  subscription: Subscription | null;
  isLoading: boolean;
  error: string | null;
  fetchSubscription: (userId: string) => Promise<void>;
  clearSubscription: () => void;
}

const useSubscriptionStore = create<SubscriptionState>((set) => ({
  subscription: null,
  isLoading: false,
  error: null,
  
  fetchSubscription: async (userId: string) => {
    if (!userId) {
      set({ subscription: null, isLoading: false });
      return;
    }
    
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('profile_id', userId)
        .maybeSingle();
      
      if (error) {
        throw error;
      }
      
      set({ subscription: data });
      
    } catch (err: any) {
      console.error('Error fetching subscription:', err);
      set({ error: err.message || 'Failed to fetch subscription' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  clearSubscription: () => {
    set({ subscription: null, error: null });
  }
}));

export default useSubscriptionStore;