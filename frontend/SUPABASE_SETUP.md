# Supabase Authentication Setup

This project uses Supabase for authentication. Follow these steps to set up your Supabase authentication:

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up or log in
2. Create a new project
3. Note your project URL and anon key from the API settings

## 2. Set Up Environment Variables

Create a `.env.local` file in the frontend directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 3. Enable Email Authentication

1. In your Supabase dashboard, go to Authentication > Providers
2. Make sure Email provider is enabled
3. Configure any additional settings like requiring email confirmation

## 4. Customize Email Templates (Optional)

1. Go to Authentication > Email Templates
2. Customize the templates for confirmation emails, magic links, etc.

## 5. Add Social Providers (Optional)

1. Go to Authentication > Providers
2. Enable and configure any social providers you want to use (Google, GitHub, etc.)
3. Follow the provider-specific instructions to set up OAuth credentials

## 6. Testing Authentication

The authentication system is now set up with:
- Sign up page at `/signup`
- Login page at `/login`
- Profile page at `/profile` (protected route)
- Authentication context available throughout the app
