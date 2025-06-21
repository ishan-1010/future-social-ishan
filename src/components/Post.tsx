'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react'
import toast from 'react-hot-toast'

interface PostProps {
  post: {
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
  onLikeUpdate: () => void
}

export default function Post({ post, onLikeUpdate }: PostProps) {
  const [likeCount, setLikeCount] = useState(post.like_count)
  const [isLiking, setIsLiking] = useState(false)

  const handleLike = async () => {
    if (isLiking) return
    
    setIsLiking(true)
    
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to like post')
      }

      const { post: updatedPost } = await response.json()
      setLikeCount(updatedPost.like_count)
      onLikeUpdate()
      toast.success('Post liked!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to like post')
    } finally {
      setIsLiking(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    }
  }

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-modern border border-slate-200/50 dark:border-slate-700/50 p-6 mb-6 hover:shadow-modern-lg transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              {post.profiles.avatar_url ? (
                <img
                  src={post.profiles.avatar_url}
                  alt={post.profiles.username || 'User'}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold text-lg">
                  {post.profiles.username?.[0]?.toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {post.profiles.username || 'Anonymous User'}
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                {formatDate(post.created_at)}
              </span>
            </div>
          </div>
        </div>
        <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      
      {/* Content */}
      <div className="mb-6">
        <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed text-base">
          {post.content}
        </p>
        {post.image_url && (
          <div className="mt-4">
            <img
              src={post.image_url}
              alt="Post image"
              className="w-full max-h-96 object-cover rounded-xl shadow-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className="flex items-center space-x-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-200 disabled:opacity-50 group"
          >
            <Heart className={`w-5 h-5 transition-all duration-200 group-hover:scale-110 ${likeCount > 0 ? 'text-red-500 fill-red-500' : ''}`} />
            <span className="font-medium">{likeCount}</span>
          </button>
          
          <button className="flex items-center space-x-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all duration-200 group">
            <MessageCircle className="w-5 h-5 transition-all duration-200 group-hover:scale-110" />
            <span className="font-medium">Comment</span>
          </button>
          
          <button className="flex items-center space-x-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-xl transition-all duration-200 group">
            <Share2 className="w-5 h-5 transition-all duration-200 group-hover:scale-110" />
            <span className="font-medium">Share</span>
          </button>
        </div>
      </div>
    </div>
  )
} 