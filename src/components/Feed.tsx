'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, AlertCircle, MessageSquare } from 'lucide-react'
import Post from './Post'

interface Post {
  id: string
  content: string
  image_url: string | null
  like_count: number
  created_at: string
  profiles: {
    id: string
    username: string | null
    avatar_url: string | null
  }
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/posts')
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }
      
      const { posts } = await response.json()
      setPosts(posts)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch posts')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handlePostCreated = () => {
    fetchPosts()
  }

  const handleLikeUpdate = () => {
    fetchPosts()
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg animate-pulse">
          <RefreshCw className="w-8 h-8 text-white animate-spin" />
        </div>
        <p className="text-slate-600 dark:text-slate-300 text-lg">Loading posts...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm border border-red-200/50 dark:border-red-800/50 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <AlertCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Error Loading Posts</h3>
        <p className="text-red-600 dark:text-red-300 mb-6">{error}</p>
        <button
          onClick={fetchPosts}
          className="flex items-center space-x-2 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-lg shadow-red-500/25"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <MessageSquare className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No Posts Yet</h3>
        <p className="text-slate-600 dark:text-slate-300 text-lg mb-4">
          Be the first to share something with the community!
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Share thoughts</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
            <span>Connect with others</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Post
          key={post.id}
          post={post}
          onLikeUpdate={handleLikeUpdate}
        />
      ))}
    </div>
  )
} 