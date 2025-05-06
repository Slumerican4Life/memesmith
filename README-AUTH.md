
# MemeSmith Authentication Setup

This document outlines the authentication system implemented for MemeSmith using Supabase.

## Setup Instructions

### 1. Supabase Configuration

After creating your Supabase project:

1. **Configure Authentication Providers:**
   - Navigate to Authentication > Providers
   - Email/Password auth is enabled by default
   - To enable social providers (Google, GitHub):
     - Follow the provider-specific setup instructions in the Supabase dashboard
     - Add the OAuth credentials to your Supabase project

2. **URL Configuration:**
   - Navigate to Authentication > URL Configuration
   - Set the Site URL to your app's domain
   - Add redirect URLs for all authentication flows
   - For local development, add `http://localhost:5173` (or your local dev server)

3. **Email Templates (Optional):**
   - Customize email templates for confirmation, password reset, etc.

### 2. Environment Variables

For local development:

```toml
# supabase/config.toml
project_id = "your-project-id"
```

### 3. Row Level Security (RLS) Policies

The following RLS policies are configured:

**Users Table:**
- Users can read their own profile
- Users can update their own profile

**Memes Table:**
- Users can read their own memes
- Users can insert their own memes (with user_id set to their auth.uid)
- Users can update their own memes
- Users can delete their own memes

## Authentication Flow

1. **Sign Up Flow:**
   - User fills registration form
   - On submit, Supabase creates a new user
   - A trigger automatically creates a user profile in the `users` table
   - User receives confirmation email (if enabled)

2. **Sign In Flow:**
   - Email/Password: Standard form-based authentication
   - Social Login (Google/GitHub): OAuth redirect flow

3. **Password Reset Flow:**
   - User requests password reset with email
   - User receives reset link via email
   - User sets new password

## Testing Authentication Locally

1. **Disable Email Confirmation (Development Only):**
   - In Supabase dashboard, go to Authentication > Settings
   - Under "Email Auth", disable "Confirm Email"
   - This allows immediate login without email verification

2. **Test Social Login:**
   - Ensure your OAuth app (Google/GitHub) allows localhost redirect URLs
   - Use http://localhost:5173 for local development

3. **Common Issues:**
   - If experiencing redirect issues, check URL configuration in Supabase
   - Ensure RLS policies are correctly configured for your tables

## User Data Structure

**Auth User:** Managed by Supabase in the `auth.users` table
**User Profile:** Stored in `public.users` table with:
  - id (references auth.users)
  - email
  - username (optional)
  - created_at
  - is_pro flag (for premium features)

## Premium Features Access

Premium features are gated behind the `is_pro` flag:
- Access to additional fonts
- Access to additional styles
- Future premium features

To test premium features, manually update a user's `is_pro` flag in the database.
