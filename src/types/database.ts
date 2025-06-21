export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          author_id: string
          content: string
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          author_id: string
          content: string
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          author_id?: string
          content?: string
          image_url?: string | null
          created_at?: string
        }
      }
      post_likes: {
        Row: {
          post_id: string
          user_id: string
        }
        Insert: {
          post_id: string
          user_id: string
        }
        Update: {
          post_id?: string
          user_id?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      posts_with_details: {
        Row: {
          id: string
          author_id: string
          content: string
          image_url: string | null
          created_at: string
          username: string | null
          avatar_url: string | null
          like_count: number
          user_has_liked: boolean
        }
      }
    }
  }
}

export type PostWithDetails =
  Database["public"]["Views"]["posts_with_details"]["Row"];

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Post = Database['public']['Tables']['posts']['Row'] 