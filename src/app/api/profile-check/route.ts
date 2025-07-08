import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({
        authenticated: false,
        error: authError?.message || 'Not authenticated',
        debug: {
          timestamp: new Date().toISOString(),
          authError: authError?.message
        }
      }, { status: 401 });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Get auth user details from auth.users table
    const { data: authUser } = await supabase
      .from('auth.users')
      .select('email, created_at, last_sign_in_at')
      .eq('id', user.id)
      .single();

    // Check if user has organization
    let organization = null;
    if (profile?.organization_id) {
      const { data: org } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', profile.organization_id)
        .single();
      organization = org;
    }

    // Check permissions
    let permissions = [];
    if (profile?.role && profile?.organization_id) {
      const { data: perms } = await supabase
        .from('permissions')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .eq('role', profile.role);
      permissions = perms || [];
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        ...authUser
      },
      profile: profile || null,
      organization: organization,
      permissions: permissions,
      debug: {
        profileFound: !!profile,
        profileActive: profile?.is_active || false,
        role: profile?.role || 'none',
        hasOrganization: !!profile?.organization_id,
        permissionCount: permissions.length,
        profileError: profileError?.message,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Profile check error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}