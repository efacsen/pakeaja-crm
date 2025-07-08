import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createClient();
    
    try {
      // Exchange code for session
      await supabase.auth.exchangeCodeForSession(code);
      
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Check if profile exists, create if missing (fallback safety net)
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();
        
        if (!profile) {
          console.log('Profile not found for user, creating via function...');
          
          // Use the database function to create profile
          const { error: profileError } = await supabase.rpc('create_profile_if_missing', {
            user_id: user.id,
            user_email: user.email,
            user_name: user.user_metadata?.full_name || user.email,
            user_role: 'sales'
          });
          
          if (profileError) {
            console.error('Failed to create profile:', profileError);
            // Don't fail the auth flow, let middleware handle it
          } else {
            console.log('Profile created successfully in auth callback');
          }
        }
      }
    } catch (error) {
      console.error('Auth callback error:', error);
      // Don't fail the redirect, let the app handle auth state
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
}