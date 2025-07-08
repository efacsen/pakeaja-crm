import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function checkSuperadminAccess() {
  const supabase = await createClient();
  
  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    };
  }

  // Check if user is superadmin
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || profile.role !== 'superadmin') {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Forbidden: Superadmin access required' }, { status: 403 })
    };
  }

  return {
    authorized: true,
    user,
    profile
  };
}