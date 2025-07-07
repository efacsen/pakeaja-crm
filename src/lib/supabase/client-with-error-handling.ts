import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database.types'

export const createClientWithErrorHandling = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
    throw new Error('Supabase configuration is missing')
  }

  try {
    const client = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
    
    // Test the connection
    client.auth.getSession().catch((err) => {
      console.error('Supabase connection error:', err)
    })
    
    return client
  } catch (error) {
    console.error('Error creating Supabase client:', error)
    throw error
  }
}