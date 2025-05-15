'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface ProfileData {
  full_name?: string;
}

interface SubscriptionData {
  status?: string;
  plan?: string;
  current_period_end?: string;
}

export default function ProfilePage() {
  const { user, session, signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
  });
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/signin');
      return;
    }
    
    // TypeScript safety - ensure user is defined for this scope
    const currentUser = user;

    async function loadProfile() {
      try {
        setLoading(true);
        
        // Check if we can connect to Supabase
        try {
          await supabase.from('profiles').select('count').limit(1);
        } catch (connectionErr) {
          console.error('Supabase connection error:', connectionErr);
          setMessage({ 
            text: 'Cannot connect to the server. Please check your internet connection and try again.', 
            type: 'error' 
          });
          setLoading(false);
          return;
        }
        
        // Get profile data from profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading profile:', error);
          // Don't throw, just handle gracefully
          setMessage({ 
            text: 'Could not load your profile data. Some features may be limited.', 
            type: 'error' 
          });
        }

        if (data) {
          setProfileData({
            full_name: data.full_name || '',
          });
        } else {
          // Set email from auth if no profile exists yet
          setProfileData({
            ...profileData,
            full_name: currentUser.email?.split('@')[0] || '',
          });
        }
        
        // Add subscription data fetch
        try {
          const { data: subscriptionData, error: subscriptionError } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('profile_id', currentUser.id)
            .single();
            
          if (subscriptionError && subscriptionError.code !== 'PGRST116') {
            console.error('Error loading subscription:', subscriptionError);
            // Don't throw, just handle gracefully
          }
          
          if (subscriptionData) {
            setSubscription(subscriptionData);
          }
        } catch (subscriptionErr) {
          console.error('Error fetching subscription:', subscriptionErr);
          // Continue without subscription data
        }
        
      } catch (error) {
        console.error('Error loading profile:', error);
        setMessage({ 
          text: 'An error occurred while loading your profile. Please try refreshing the page.', 
          type: 'error' 
        });
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    // TypeScript safety - ensure user is defined for this scope
    const currentUser = user;
    
    try {
      setUpdating(true);
      setMessage(null);
      
      // Check connection to Supabase
      try {
        await supabase.from('profiles').select('count').limit(1);
      } catch (connectionErr) {
        console.error('Supabase connection error:', connectionErr);
        setMessage({ 
          text: 'Cannot connect to the server. Please check your internet connection and try again.', 
          type: 'error' 
        });
        setUpdating(false);
        return;
      }
      
      // Update profile
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: currentUser.id,
          email: currentUser.email,
          full_name: profileData.full_name,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage({ 
        text: error.message || 'Error updating profile. Please try again.', 
        type: 'error' 
      });
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    // TypeScript safety - ensure user is defined for this scope
    const currentUser = user;
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ text: 'New passwords do not match.', type: 'error' });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters long.', type: 'error' });
      return;
    }
    
    try {
      setChangingPassword(true);
      setMessage(null);
      
      // Check connection to Supabase
      try {
        await supabase.auth.getSession();
      } catch (connectionErr) {
        console.error('Supabase connection error:', connectionErr);
        setMessage({ 
          text: 'Cannot connect to the authentication server. Please check your internet connection and try again.', 
          type: 'error' 
        });
        setChangingPassword(false);
        return;
      }
      
      // First verify the current password
      try {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: currentUser.email || '',
          password: passwordData.currentPassword
        });
        
        if (signInError) {
          setMessage({ text: 'Current password is incorrect.', type: 'error' });
          setChangingPassword(false);
          return;
        }
      } catch (verifyErr) {
        console.error('Error verifying current password:', verifyErr);
        // Continue with password update attempt even if verification fails
      }
      
      // Update password
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;
      
      setMessage({ text: 'Password updated successfully!', type: 'success' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      console.error('Error updating password:', error);
      setMessage({ 
        text: error.message || 'Error updating password. Please try again.', 
        type: 'error' 
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !deleteConfirm) return;
    
    // TypeScript safety - ensure user is defined for this scope
    const currentUser = user;
    
    try {
      // Check connection to Supabase
      try {
        await supabase.from('profiles').select('count').limit(1);
      } catch (connectionErr) {
        console.error('Supabase connection error:', connectionErr);
        setMessage({ 
          text: 'Cannot connect to the server. Please check your internet connection and try again.', 
          type: 'error' 
        });
        setShowDeleteModal(false);
        setDeleteConfirm(false);
        return;
      }
      
      // Delete profile data first
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', currentUser.id);
      
      if (profileError) {
        console.error('Error deleting profile data:', profileError);
        // Continue with account deletion even if profile deletion fails
      }
      
      // Try to delete subscriptions if they exist
      try {
        await supabase
          .from('subscriptions')
          .delete()
          .eq('profile_id', currentUser.id);
      } catch (subError) {
        console.error('Error deleting subscription data:', subError);
        // Continue with account deletion
      }
      
      // Sign out and redirect regardless of auth deletion success
      await signOut();
      router.push('/');
      
    } catch (error: any) {
      console.error('Error deleting account:', error);
      setMessage({ 
        text: error.message || 'Error deleting account. Please try again.', 
        type: 'error' 
      });
      setShowDeleteModal(false);
      setDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0072df]"></div>
          </div>
          <p className="text-center mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  // Show a connection error state if we have a message but no profile data loaded
  if (message?.type === 'error' && !profileData.full_name) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <svg className="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-4 text-xl font-bold text-gray-900">Connection Error</h2>
            <p className="mt-2 text-gray-600">{message.text}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0072df] hover:bg-[#0058ab] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0072df]"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {message && (
          <div 
            className={`p-4 mb-6 rounded-lg shadow-sm ${
              message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <div className="flex items-center">
              {message.type === 'success' ? (
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              <p>{message.text}</p>
            </div>
          </div>
        )}
        
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0072df] to-[#00a3ff] px-6 py-10 text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,0 L100,0 L100,100 Z" fill="white"></path>
              </svg>
            </div>
            <div className="relative z-10">
              <h1 className="text-3xl font-bold">Your Profile</h1>
              <p className="mt-2 text-white/80">
                Manage your account information and preferences
              </p>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* User Info */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0072df] to-[#00a3ff] flex items-center justify-center overflow-hidden mb-4 shadow-lg">
                <span className="text-4xl font-bold text-white">
                  {(profileData.full_name?.charAt(0) || user?.email?.charAt(0) || '?').toUpperCase()}
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {profileData.full_name || (user?.email ? user.email.split('@')[0] : 'User')}
                </h3>
                <p className="text-gray-500 mb-4">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500">Your email cannot be changed</p>
                </div>

                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={profileData.full_name}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#0072df] focus:border-[#0072df] transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>




            </div>

            <div className="pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Subscription</h3>
              <div className="bg-gradient-to-r from-[#0072df]/5 to-[#0072df]/10 p-6 rounded-xl border border-[#0072df]/20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-3">
                    {/* Plan details */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <svg className="w-6 h-6 text-[#0072df]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">
                            {subscription?.plan || 'Free Plan'}
                          </span>
                          
                          {subscription?.status === 'active' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          )}
                          
                          {subscription?.status === 'cancelled' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Cancelled
                            </span>
                          )}
                        </div>
                        
                        {/* Subscription details */}
                        {subscription?.status === 'active' && subscription?.current_period_end && (
                          <p className="text-sm text-gray-600 mt-1">
                            Renews on {new Date(subscription.current_period_end).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        )}
                        
                        {subscription?.status === 'cancelled' && subscription?.current_period_end && (
                          <p className="text-sm text-gray-600 mt-1">
                            Access until {new Date(subscription.current_period_end).toLocaleDateString('en-US', { 
                              year: 'numeric',
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        )}
                        
                        {!subscription && (
                          <p className="text-sm text-gray-600 mt-1">
                            Basic features with limited usage
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    href="/pricing"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-[#0072df] hover:bg-[#0058ab] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0072df] transition-colors"
                  >
                    {subscription?.status === 'active' 
                      ? 'Manage Subscription' 
                      : subscription?.status === 'cancelled'
                        ? 'Renew Subscription'
                        : 'Upgrade to Pro'}
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={updating}
                className="inline-flex items-center px-5 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-[#0072df] hover:bg-[#0058ab] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0072df] transition-colors disabled:opacity-50"
              >
                {updating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Security Card */}
        <div className="mt-8 bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Security</h2>
          </div>
          <div className="p-8">
            <p className="text-gray-600 mb-6">Manage your password and account security settings</p>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#0072df] focus:border-[#0072df] transition-colors"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#0072df] focus:border-[#0072df] transition-colors"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#0072df] focus:border-[#0072df] transition-colors"
                  required
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-[#0072df] hover:bg-[#0058ab] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0072df] disabled:opacity-50"
                >
                  {changingPassword ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating Password...
                    </>
                  ) : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-8 bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
            <h2 className="text-xl font-semibold text-red-800">Danger Zone</h2>
          </div>
          <div className="p-8">
            <p className="text-gray-600 mb-6">Permanently delete your account and all associated data</p>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex justify-center items-center px-4 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Account</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.
              </p>
              
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.checked)}
                    className="h-4 w-4 text-[#0072df] focus:ring-[#0072df] border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    I understand that this action is irreversible
                  </span>
                </label>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirm(false);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0072df]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={!deleteConfirm}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
