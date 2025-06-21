import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: postId } = await params

    // Get current post to check like count
    const { data: currentPost } = await supabase
      .from('posts')
      .select('like_count')
      .eq('id', postId)
      .single()

    if (!currentPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Increment like count with null safety
    const currentLikeCount = currentPost.like_count || 0
    const { data: updatedPost } = await supabase
      .from('posts')
      .update({ like_count: currentLikeCount + 1 })
      .eq('id', postId)
      .select(`
        *,
        profiles!author_id (
          id,
          username,
          avatar_url
        )
      `)
      .single()

    return NextResponse.json({ post: updatedPost })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 