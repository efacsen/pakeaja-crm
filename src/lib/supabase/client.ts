import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase.types'

export const createClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// For use in client components
export const supabase = createClient()