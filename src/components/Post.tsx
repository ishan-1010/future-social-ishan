'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react'
import toast from 'react-hot-toast'
import { PostWithDetails } from '@/types/database'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'

interface PostProps {
  post: PostWithDetails
  onLikeUpdate: () => void
}

export default function Post({ post, onLikeUpdate }: PostProps) {
  const [likeCount, setLikeCount] = useState(post.like_count)
  const [isLiked, setIsLiked] = useState(post.user_has_liked)

  const handleLike = async () => {
    // Optimistic UI update
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)

    const res = await fetch(`/api/posts/${post.id}/like`, {
      method: 'POST',
    })

    if (res.ok) {
      const data = await res.json()
      // Re-sync with server response
      setLikeCount(data.like_count)
      setIsLiked(data.user_has_liked)
      onLikeUpdate()
      // Show appropriate toast message
      toast.success(isLiked ? 'Post unliked!' : 'Post liked!')
    } else {
      // Revert on error
      setIsLiked(!isLiked)
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
      toast.error('Failed to like post')
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
              {post.avatar_url ? (
                <Image
                  src={post.avatar_url}
                  alt={`${post.username}'s avatar`}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold text-lg">
                  {post.username?.[0]?.toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {post.username || 'Anonymous User'}
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                })}
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
            className={`flex items-center space-x-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-200 ${
              isLiked ? 'text-red-500' : ''
            }`}
          >
            <Heart className={`w-5 h-5 transition-all duration-200 group-hover:scale-110 ${isLiked ? 'fill-red-500' : ''}`} />
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