'use client'

import { useState, useEffect, useCallback } from 'react'
import { Home as HomeIcon, Plus, User as UserIcon, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import LoginForm from '@/components/LoginForm'
import CreatePost from '@/components/CreatePost'
import Feed from '@/components/Feed'
import ProfileForm from '@/components/ProfileForm'

export default function Home() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'feed' | 'create' | 'profile'>('feed')

  const handleTabChange = useCallback(() => {
    setActiveTab('feed')
  }, [])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-slate-600 dark:text-slate-300">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Future Social
              </h1>
            </div>
            <LoginForm />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user ? (
          <>
            {/* Navigation Tabs */}
            <div className="flex space-x-1 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-modern p-2 mb-8 border border-slate-200/50 dark:border-slate-700/50">
              <button
                onClick={() => setActiveTab('feed')}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeTab === 'feed'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <HomeIcon className="w-4 h-4" />
                <span>Feed</span>
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeTab === 'create'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Create</span>
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeTab === 'profile'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span>Profile</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="space-y-8">
              {activeTab === 'feed' && (
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Posts</h2>
                  </div>
                  <Feed />
                </div>
              )}

              {activeTab === 'create' && (
                <div>
                  <CreatePost onPostCreated={handleTabChange} />
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <ProfileForm />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-2xl shadow-blue-500/25 mx-auto flex items-center justify-center mb-6">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-4">
                  Welcome to Future Social
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                  A modern social media platform where you can share your thoughts, 
                  connect with others, and express yourself through posts and likes.
                </p>
              </div>
              
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-modern-lg p-8 border border-slate-200/50 dark:border-slate-700/50">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Get Started</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  Join our community and start sharing your stories with the world.
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Create posts</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span>Connect with others</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Share your thoughts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Future University SDE Assignment - Social Media Platform
            </p>
            <p className="text-slate-500 dark:text-slate-500 text-xs mt-2">
              Built with Next.js and Supabase by Ishan Katoch
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
