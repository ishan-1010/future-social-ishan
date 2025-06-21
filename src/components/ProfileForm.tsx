'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { User, Camera, Save, Edit3 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Profile {
  id: string
  username: string | null
  bio: string | null
  avatar_url: string | null
}

export default function ProfileForm() {
  const { data: session } = useSession()
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (session?.user) {
      fetchProfile()
    }
  }, [session])

  const fetchProfile = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const { profile } = await response.json()
        setUsername(profile.username || '')
        setBio(profile.bio || '')
        setAvatarUrl(profile.avatar_url || '')
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user) {
      toast.error('Please sign in to update your profile')
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim() || null,
          bio: bio.trim() || null,
          avatarUrl: avatarUrl.trim() || null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update profile')
      }

      const { profile: updatedProfile } = await response.json()
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  if (!session?.user) {
    return (
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-modern border border-slate-200/50 dark:border-slate-700/50 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-lg">Please sign in to edit your profile</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-modern border border-slate-200/50 dark:border-slate-700/50 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <User className="w-8 h-8 text-white" />
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-lg">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-modern border border-slate-200/50 dark:border-slate-700/50 p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
          <Edit3 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Profile</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Customize your profile information</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar preview"
                  className="w-20 h-20 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
              <Camera className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <label htmlFor="avatarUrl" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Avatar URL
            </label>
            <div className="relative">
              <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="url"
                id="avatarUrl"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Paste a direct link to your profile picture
            </p>
          </div>
        </div>
        
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
            placeholder="Enter your username"
          />
        </div>
        
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 resize-none"
            placeholder="Tell us about yourself..."
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {bio.length}/200 characters
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Custom avatar</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Personal bio</span>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center space-x-2 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/25"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  )
} 