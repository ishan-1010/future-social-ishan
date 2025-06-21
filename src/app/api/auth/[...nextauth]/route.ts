import NextAuth from 'next-auth/next'
import { JWT } from 'next-auth/jwt'
import { Session, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { createClient } from '@supabase/supabase-js'

const authOptions: any = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        
        const { data: { user }, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        })

        if (error || !user) {
          return null
        }

        // Get or create profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (!profile) {
          // Create profile if it doesn't exist
          await supabase
            .from('profiles')
            .insert([
              {
                id: user.id,
                email: user.email,
                username: user.email?.split('@')[0] || 'User',
              }
            ])
        }

        return {
          id: user.id,
          email: user.email || '',
          name: profile?.username || user.email?.split('@')[0] || 'User',
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT; }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: '/'
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 