import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

// Admin client with service role key - use with caution!
// This bypasses Row Level Security (RLS) policies
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase environment variables for admin client')
  }

  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Singleton admin client instance
export const supabaseAdmin = createAdminClient() 