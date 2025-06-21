import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    })
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return new Response(JSON.stringify({ error: 'Profile not found' }), {
      status: 404,
    })
  }

  return new Response(JSON.stringify({ profile: data }), {
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function PUT(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    })
  }

  const { username, bio, avatar_url } = await request.json()

  const { data, error } = await supabase
    .from('profiles')
    .update({
      username,
      bio,
      avatar_url,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    return new Response(JSON.stringify({ error: 'Failed to update profile' }), {
      status: 500,
    })
  }

  return new Response(JSON.stringify({ profile: data }), {
    headers: { 'Content-Type': 'application/json' },
  })
} 