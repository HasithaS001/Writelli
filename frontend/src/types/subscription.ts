export enum SUBSCRIPTION_FEATURES {
  ADVANCED_TOOLS = 'advanced_tools',
  UNLIMITED_WORDS = 'unlimited_words',
  PRIORITY_SUPPORT = 'priority_support',
  CUSTOM_BRANDING = 'custom_branding'
}

export interface Subscription {
  id: string;
  status: 'active' | 'canceled' | 'expired';
  features: SUBSCRIPTION_FEATURES[];
  expiresAt?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: SUBSCRIPTION_FEATURES[];
  isPopular?: boolean;
}
