'use client'

import { useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { LogIn, LogOut, User, Mail, Lock } from 'lucide-react'

export default function LoginForm() {
  const { data: session } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Check your email for the confirmation link!')
      }
    } catch {
      toast.error('An error occurred during sign up')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      
      if (result && !result.ok) {
        toast.error('Invalid email or password.')
      } else if (result?.ok) {
        toast.success('Signed in successfully!')
        router.refresh()
      }
    } catch {
      toast.error('An error occurred during sign in')
    } finally {
      setIsLoading(false)
    }
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl px-4 py-2 border border-slate-200/50 dark:border-slate-700/50">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {session.user?.email}
          </span>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-lg shadow-red-500/25"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <form className="space-y-4">
        <div className="relative">
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>
        
        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            type="submit"
            onClick={handleSignIn}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/25"
          >
            <LogIn className="w-4 h-4" />
            <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
          </button>
          
          <button
            type="button"
            onClick={handleSignUp}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-100/60 dark:hover:bg-slate-700/60 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <span>{isLoading ? 'Signing up...' : 'Sign Up'}</span>
          </button>
        </div>
      </form>
    </div>
  )
} 