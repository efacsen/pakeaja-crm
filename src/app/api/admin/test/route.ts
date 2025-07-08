import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient, isAdminClientAvailable } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    // Check if we're in build time (no environment variables available)
    if (!isAdminClientAvailable()) {
      return NextResponse.json({ 
        error: 'Admin client not available - missing environment variables' 
      }, { status: 503 });
    }

    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ 
        authenticated: false,
        message: 'Not authenticated' 
      }, { status: 401 });
    }

    // Get user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ 
        authenticated: true,
        user: { id: user.id, email: user.email },
        profile: null,
        message: 'Profile not found' 
      }, { status: 200 });
    }

    // Test admin capabilities if superadmin
    let adminTest = null;
    if (profile.role === 'admin') {
      try {
        const adminClient = getAdminClient();
        const { data: authUsers, error } = await adminClient.auth.admin.listUsers({
          page: 1,
          perPage: 5
        });
        
        adminTest = {
          success: !error,
          userCount: authUsers?.users?.length || 0,
          error: error?.message || null
        };
      } catch (e) {
        adminTest = {
          success: false,
          error: e instanceof Error ? e.message : 'Admin test failed'
        };
      }
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
      },
      profile: {
        id: profile.id,
        role: profile.role,
        full_name: profile.full_name,
        organization_id: profile.organization_id
      },
      isSuperadmin: profile.role === 'admin',
      adminTest,
      message: 'Test successful'
    }, { status: 200 });

  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}