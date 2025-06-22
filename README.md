# Future Social - Social Media Platform

A simplified social media platform built for the Future University SDE Assignment. This application allows users to create posts, like content, and manage their profiles in a modern, responsive interface.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure signup and login using Supabase Auth
- **User Profiles**: Create and update profiles with username, bio, and avatar
- **Post Creation**: Share text posts with optional image URLs
- **Global Feed**: View all posts from users in chronological order
- **Like System**: Like posts multiple times (similar to Medium's Clap feature)
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Technical Features
- **Modern Stack**: Next.js 14 with App Router, TypeScript, and Tailwind CSS
- **Real-time Updates**: Posts and likes update in real-time
- **Secure API**: Protected routes with proper authentication
- **Database**: PostgreSQL with Supabase for data persistence
- **Deployment Ready**: Optimized for Vercel deployment

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel
- **UI Components**: Lucide React icons, React Hot Toast

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd future-social
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Get your project URL and anon key from Settings > API
3. Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

```
If you later integrate NextAuth, also set `NEXTAUTH_SECRET` and `NEXTAUTH_URL` here.

### 4. Set Up Database Schema

Run the following SQL in your Supabase SQL editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  image_url TEXT,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view all profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for posts
CREATE POLICY "Users can view all posts" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Users can create posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update posts" ON posts
  FOR UPDATE USING (auth.uid() = author_id);
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📱 Usage

### For Users
1. **Sign Up/Login**: Use the authentication form in the header
2. **Create Posts**: Navigate to the "Create Post" tab to share content
3. **View Feed**: See all posts in the "Feed" tab
4. **Like Posts**: Click the heart icon to like posts (multiple likes allowed)
5. **Edit Profile**: Update your username, bio, and avatar in the "Profile" tab

### For Developers
- The application uses a tab-based navigation system
- All API routes are protected and require authentication
- Real-time updates are handled through API calls
- The UI is fully responsive and mobile-friendly

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add the same environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 📁 Project Structure

```
future-social/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── posts/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/like/route.ts
│   │   │   └── profile/route.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── CreatePost.tsx
│   │   ├── Feed.tsx
│   │   ├── LoginForm.tsx
│   │   ├── Post.tsx
│   │   └── ProfileForm.tsx
│   ├── lib/
│   │   └── supabase.ts
│   └── types/
│       └── database.ts
├── public/
└── package.json
```

## 🔧 API Endpoints

- `GET /api/posts` - Fetch all posts
- `POST /api/posts` - Create a new post
- `POST /api/posts/[id]/like` - Like a post
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

## 🎨 Customization

### Styling
The application uses Tailwind CSS for styling. You can customize the design by modifying the classes in the components.

### Adding Features
- **Image Upload**: Integrate with Cloudinary or Supabase Storage
- **Comments**: Add a comments table and API endpoints
- **Follow System**: Implement user following functionality
- **Notifications**: Add real-time notifications using Supabase subscriptions

## 🐛 Known Issues

- Image URLs must be valid and accessible
- Profile updates require a page refresh to see changes in posts
- No email verification required for signup (can be enabled in Supabase)

## 📝 License

This project is created for the Future University SDE Assignment.

## 🤝 Contributing

This is an assignment project, but feel free to fork and improve upon it!

## 📞 Support

For any issues or questions, please refer to the assignment guidelines or contact the course instructor.

---

**Built with ❤️ for Future University SDE Assignment**
