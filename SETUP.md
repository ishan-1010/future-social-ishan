# Setup Guide - Future Social

This guide will walk you through setting up the Future Social platform step by step.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Supabase account (free tier works perfectly)
- A GitHub account (for deployment)

## Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd future-social

# Install dependencies
npm install
```

## Step 2: Set Up Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Sign up or log in
   - Click "New Project"
   - Choose your organization
   - Enter project name (e.g., "future-social")
   - Set a database password
   - Choose a region close to you
   - Click "Create new project"

2. **Get Your API Keys**
   - In your Supabase dashboard, go to Settings > API
   - Copy the following values:
     - Project URL
     - anon/public key
     - service_role key (keep this secret!)

3. **Set Up Database Schema**
   - In Supabase dashboard, go to SQL Editor
   - Copy and paste the contents of `database-schema.sql`
   - Click "Run" to execute the SQL

## Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

```
If you decide to integrate NextAuth later, also set `NEXTAUTH_SECRET` and `NEXTAUTH_URL` in this file.

**Important Notes:**
- Replace `your_supabase_url_here` with your actual Supabase URL
- Replace `your_supabase_anon_key_here` with your actual anon key
- Replace `your_supabase_service_role_key_here` with your actual service role key

## Step 4: Configure Supabase Auth

1. **Enable Email Auth**
   - In Supabase dashboard, go to Authentication > Providers
   - Make sure "Email" is enabled
   - You can disable "Confirm email" for easier testing

2. **Set Up Auth Redirects**
   - Go to Authentication > URL Configuration
   - Add `http://localhost:3000` to Site URL
   - Add `http://localhost:3000` to Redirect URLs
    - If you add NextAuth later, include `http://localhost:3000/api/auth/callback/nextauth` in the redirect URLs.

## Step 5: Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 6: Test the Application

1. **Create an Account**
   - Click "Sign Up" in the header
   - Enter your email and password
   - Check your email for confirmation (if enabled)

2. **Create Your Profile**
   - After signing in, go to the "Profile" tab
   - Add a username, bio, and avatar URL
   - Click "Save Profile"

3. **Create a Post**
   - Go to the "Create Post" tab
   - Write some content
   - Optionally add an image URL
   - Click "Create Post"

4. **View and Like Posts**
   - Go to the "Feed" tab
   - You should see your post
   - Click the heart icon to like posts

## Step 7: Deploy to Vercel (Optional)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your repository
   - Add the same environment variables
   - Deploy!

3. **Update Supabase Auth Settings**
   - In Supabase dashboard, go to Authentication > URL Configuration
   - Update Site URL to your Vercel domain
   - Add your Vercel domain to Redirect URLs

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Double-check your Supabase URL and keys
   - Make sure you're using the correct keys (anon vs service role)

2. **"Database connection failed"**
   - Check if your Supabase project is active
   - Verify the database schema was created correctly

3. **"Authentication failed"**
   - Check your Supabase auth settings
   - Verify the redirect URLs are correct

4. **"Posts not loading"**
   - Check the browser console for errors
   - Verify the database policies are set up correctly

### Getting Help

- Check the browser console for error messages
- Verify all environment variables are set correctly
- Ensure the database schema was created successfully
- Check Supabase logs in the dashboard

## Next Steps

Once everything is working:

1. **Customize the UI**: Modify the Tailwind classes in components
2. **Add Features**: Implement comments, following, or notifications
3. **Improve Security**: Add email verification, rate limiting
4. **Optimize Performance**: Add caching, pagination
5. **Add Tests**: Write unit and integration tests

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the Supabase documentation
3. Check the Next.js documentation
4. Contact your course instructor

---

**Happy coding! 🚀** 