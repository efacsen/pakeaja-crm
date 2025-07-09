import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

interface Diagnostics {
  timestamp: string;
  environment: {
    nodeEnv: string | undefined;
    hasServiceRoleKey: boolean;
    hasAnonKey: boolean;
    hasSupabaseUrl: boolean;
  };
  auth: {
    user: { id: string; email?: string } | null;
    session: { expires_at?: number } | null;
    error: string | null;
  };
  profile: {
    viaAnon: Record<string, unknown> | null;
    viaServiceRole: Record<string, unknown> | null;
    error?: string | null;
    anonError?: string;
    serviceRoleError?: string;
  };
  database: {
    canConnectAnon: boolean;
    canConnectServiceRole: boolean;
    anonError?: string;
    serviceRoleError?: string;
    serviceRoleCanBypassRLS?: boolean;
    profileCount?: number;
  };
  serviceRoleClient?: {
    error: string;
    hint: string;
  };
  diagnosis?: {
    issues: string[];
    recommendations: string[];
    summary: string;
  };
  criticalError?: string;
}

export async function GET() {
  const diagnostics: Diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    },
    auth: {
      user: null,
      session: null,
      error: null,
    },
    profile: {
      viaAnon: null,
      viaServiceRole: null,
      error: null,
    },
    database: {
      canConnectAnon: false,
      canConnectServiceRole: false,
    },
  };

  try {
    // Test regular client (anon key)
    const supabase = await createClient();
    
    // Get current user
    const { data: { user, session }, error: authError } = await supabase.auth.getUser();
    diagnostics.auth.user = user ? { id: user.id, email: user.email } : null;
    diagnostics.auth.session = session ? { expires_at: session.expires_at } : null;
    diagnostics.auth.error = authError?.message || null;

    // Test database connection with anon client
    try {
      const { error: anonError } = await supabase
        .from('organizations')
        .select('count')
        .limit(1);
      
      diagnostics.database.canConnectAnon = !anonError;
      if (anonError) {
        diagnostics.database.anonError = anonError.message;
      }
    } catch (e) {
      diagnostics.database.anonError = e instanceof Error ? e.message : 'Unknown error';
    }

    // Try to get profile with anon client
    if (user) {
      const { data: anonProfile, error: anonProfileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      diagnostics.profile.viaAnon = anonProfile || null;
      if (anonProfileError) {
        diagnostics.profile.anonError = anonProfileError.message;
      }
    }

    // Test service role client
    try {
      const serviceRoleSupabase = await createServiceRoleClient();
      
      // Test database connection
      const { error: serviceError } = await serviceRoleSupabase
        .from('organizations')
        .select('count')
        .limit(1);
      
      diagnostics.database.canConnectServiceRole = !serviceError;
      if (serviceError) {
        diagnostics.database.serviceRoleError = serviceError.message;
      }

      // Try to get profile with service role
      if (user) {
        const { data: serviceProfile, error: serviceProfileError } = await serviceRoleSupabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        diagnostics.profile.viaServiceRole = serviceProfile || null;
        if (serviceProfileError) {
          diagnostics.profile.serviceRoleError = serviceProfileError.message;
        }
      }

      // Check if service role can bypass RLS
      const { data: allProfiles, error: allProfilesError } = await serviceRoleSupabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      diagnostics.database.serviceRoleCanBypassRLS = !allProfilesError;
      diagnostics.database.profileCount = allProfiles?.[0]?.count || 0;

    } catch (e) {
      diagnostics.serviceRoleClient = {
        error: e instanceof Error ? e.message : 'Failed to create service role client',
        hint: 'SUPABASE_SERVICE_ROLE_KEY might be missing or invalid'
      };
    }

    // Add diagnosis summary
    diagnostics.diagnosis = analyzeDiagnostics(diagnostics);

  } catch (error) {
    diagnostics.criticalError = error instanceof Error ? error.message : 'Unknown error';
  }

  return NextResponse.json(diagnostics, { status: 200 });
}

function analyzeDiagnostics(diag: Diagnostics): {
  issues: string[];
  recommendations: string[];
  summary: string;
} {
  const issues = [];
  const recommendations = [];

  // Check environment variables
  if (!diag.environment.hasServiceRoleKey) {
    issues.push('CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing');
    recommendations.push('Add SUPABASE_SERVICE_ROLE_KEY to Vercel environment variables');
  }

  // Check authentication
  if (!diag.auth.user) {
    issues.push('No authenticated user found');
    recommendations.push('Login first before accessing protected routes');
  }

  // Check profile access
  if (diag.auth.user && !diag.profile.viaAnon && diag.profile.anonError?.includes('row-level')) {
    issues.push('RLS policies blocking profile access with anon key');
    if (!diag.profile.viaServiceRole) {
      issues.push('Service role also cannot access profile - profile might not exist');
      recommendations.push('Profile needs to be created for this user');
    }
  }

  // Check service role functionality
  if (diag.serviceRoleClient?.error) {
    issues.push('Service role client creation failed');
    recommendations.push('Verify SUPABASE_SERVICE_ROLE_KEY is correct (not anon key)');
  }

  // Success scenario
  if (diag.auth.user && diag.profile.viaServiceRole) {
    issues.push('SUCCESS: Profile exists and service role can access it');
    if (!diag.profile.viaAnon) {
      recommendations.push('RLS policies might need adjustment for user self-access');
    }
  }

  return {
    issues,
    recommendations,
    summary: issues.length === 0 ? 'All systems operational' : `Found ${issues.length} issues`,
  };
}