# Supabase Client Configuration

This directory contains the Supabase client configurations for different use cases in your Next.js 14 App Router application.

## Files Overview

### `client.ts`
Browser client for use in Client Components.
- Uses `@supabase/ssr` for modern Next.js integration
- Handles authentication state in the browser
- Used in components with `"use client"` directive

### `server.ts`
Server clients for use in Server Components, Route Handlers, and Server Actions.
- `createServerSupabaseClient()` - For Server Components
- `createRouteHandlerSupabaseClient()` - For API routes
- `createServerActionClient()` - For Server Actions
- Properly handles cookies and SSR

### `admin.ts`
Admin client with service role key for administrative operations.
- Bypasses Row Level Security (RLS)
- Use with extreme caution
- Only for server-side administrative tasks

## Environment Variables

Create a `.env.local` file in your project root with:

```env
# Your Supabase project URL
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co

# Your Supabase anon/public key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Your Supabase service role key (keep this secret!)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Usage Examples

### Client Component
```tsx
"use client"
import { supabase } from '@/lib/supabase/client'

export default function ClientComponent() {
  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'user@example.com',
      password: 'password'
    })
  }
  
  return <button onClick={handleSignIn}>Sign In</button>
}
```

### Server Component
```tsx
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function ServerComponent() {
  const supabase = createServerSupabaseClient()
  const { data: user } = await supabase.auth.getUser()
  
  return <div>Welcome {user?.email}</div>
}
```

### API Route
```tsx
import { createRouteHandlerSupabaseClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createRouteHandlerSupabaseClient()
  const { data, error } = await supabase.from('users').select('*')
  
  return Response.json({ data, error })
}
```

### Server Action
```tsx
import { createServerActionClient } from '@/lib/supabase/server'

export async function updateProfile(formData: FormData) {
  'use server'
  
  const supabase = createServerActionClient()
  const { data, error } = await supabase
    .from('profiles')
    .update({ name: formData.get('name') })
    .eq('id', 'user-id')
}
```

## Database Types

Generate TypeScript types for your database:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID --schema public > src/types/database.types.ts
```

## Security Notes

1. Never expose the service role key in client-side code
2. Always use RLS policies for data security
3. The admin client bypasses RLS - use only when necessary
4. Environment variables with `NEXT_PUBLIC_` prefix are exposed to the browser 