import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: posts } = await supabase
      .from('posts')
      .select(`
        *,
        profiles!author_id (
          id,
          username,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })

    return NextResponse.json({ posts: posts || [] })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { content, imageUrl } = await request.json()

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Create the post
    const { data: post } = await supabase
      .from('posts')
      .insert([
        {
          content: content.trim(),
          image_url: imageUrl || null,
          author_id: user.id,
        }
      ])
      .select(`
        *,
        profiles!author_id (
          id,
          username,
          avatar_url
        )
      `)
      .single()

    return NextResponse.json({ post })
  } catch {
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
} 