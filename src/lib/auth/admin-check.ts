import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function checkAdminAccess() {
  const supabase = await createClient();
  
  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    };
  }

  // Check if user is admin
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || profile.role !== 'admin') {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    };
  }

  return {
    authorized: true,
    user,
    profile
  };
}

// Alias for backward compatibility
export const checkSuperadminAccess = checkAdminAccess;