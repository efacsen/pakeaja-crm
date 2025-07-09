import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient, createServiceRoleClient } from '@/lib/supabase/server';
import { UserRole, ResourceType, PermissionAction } from '@/types/rbac';

// Import the menu-based access control
import { getAccessibleRoutesForRole } from '@/lib/navigation/menu-items';

// Define simple role-based route access for MVP
// This replaces the complex resource-permission system with a simpler approach
const roleRouteAccess: Record<UserRole, string[]> = {
  admin: [
    '/dashboard',
    '/dashboard/leads',
    '/dashboard/customers',
    '/dashboard/daily-report',
    '/dashboard/calculator',
    '/dashboard/reports',
    '/dashboard/users',
    '/dashboard/organization',
    '/dashboard/settings',
    '/dashboard/profile',
    '/dashboard/materials',
    '/dashboard/projects',
    '/dashboard/quotes',
  ],
  manager: [
    '/dashboard',
    '/dashboard/leads',
    '/dashboard/customers', 
    '/dashboard/daily-report',
    '/dashboard/calculator',
    '/dashboard/reports',
    '/dashboard/reports/team',
    '/dashboard/organization',
    '/dashboard/profile',
    '/dashboard/materials',
    '/dashboard/projects',
    '/dashboard/quotes',
  ],
  sales: [
    '/dashboard',
    '/dashboard/leads',
    '/dashboard/customers',
    '/dashboard/daily-report',
    '/dashboard/calculator',
    '/dashboard/profile',
    '/dashboard/materials',
    '/dashboard/quotes',
  ],
  estimator: [
    '/dashboard',
    '/dashboard/customers',
    '/dashboard/calculator',
    '/dashboard/quotes',
    '/dashboard/materials',
    '/dashboard/profile',
  ],
  project_manager: [
    '/dashboard',
    '/dashboard/projects',
    '/dashboard/daily-report',
    '/dashboard/reports',
    '/dashboard/profile',
  ],
  foreman: [
    '/dashboard',
    '/dashboard/projects',
    '/dashboard/daily-report',
    '/dashboard/profile',
  ],
  inspector: [
    '/dashboard',
    '/dashboard/projects',
    '/dashboard/reports',
    '/dashboard/profile',
  ],
  client: [
    '/dashboard',
    '/dashboard/projects',
    '/dashboard/profile',
  ],
};

// Define role-based dashboard redirects
const roleDefaultRoutes: Record<UserRole, string> = {
  admin: '/dashboard',
  manager: '/dashboard',
  sales: '/dashboard/leads',
  estimator: '/dashboard/quotes',
  project_manager: '/dashboard/projects',
  foreman: '/dashboard/projects',
  inspector: '/dashboard/reports',
  client: '/dashboard/projects',
};

export async function checkRoutePermission(request: NextRequest) {
  const supabase = await createClient();
  const pathname = request.nextUrl.pathname;

  // Get user session
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Use service role client to bypass RLS when reading profiles
  const serviceRoleSupabase = await createServiceRoleClient();
  
  // Get user profile with role using service role client
  let { data: profile, error: profileError } = await serviceRoleSupabase
    .from('profiles')
    .select('role, is_active, organization_id')
    .eq('id', user.id)
    .single();

  // Add debugging headers
  const headers = new Headers();
  headers.set('X-Debug-User-Id', user.id);
  headers.set('X-Debug-Profile-Found', profile ? 'true' : 'false');
  headers.set('X-Debug-Profile-Active', profile?.is_active ? 'true' : 'false');
  headers.set('X-Debug-Profile-Role', profile?.role || 'none');
  
  if (profileError) {
    console.error('Profile fetch error:', profileError);
    headers.set('X-Debug-Error', profileError.message);
  }

  // If profile not found, try to create it as fallback
  if (!profile && user.email) {
    console.log('Profile not found in middleware, attempting to create...');
    headers.set('X-Debug-Fallback', 'attempting-creation');
    
    try {
      // Use the database function to create profile with service role client
      const { error: createError } = await serviceRoleSupabase.rpc('create_profile_if_missing', {
        user_id: user.id,
        user_email: user.email,
        user_name: user.user_metadata?.full_name || user.email,
        user_role: 'sales'
      });
      
      if (!createError) {
        // Try fetching the profile again with service role client
        const { data: newProfile } = await serviceRoleSupabase
          .from('profiles')
          .select('role, is_active, organization_id')
          .eq('id', user.id)
          .single();
        
        if (newProfile) {
          profile = newProfile;
          headers.set('X-Debug-Fallback', 'success');
          console.log('Profile created successfully in middleware fallback');
        }
      } else {
        console.error('Failed to create profile in middleware:', createError);
        headers.set('X-Debug-Fallback', 'failed');
      }
    } catch (error) {
      console.error('Middleware profile creation error:', error);
      headers.set('X-Debug-Fallback', 'error');
    }
  }

  if (!profile || !profile.is_active) {
    // Redirect to unauthorized if profile still not found or inactive
    const redirectUrl = new URL('/unauthorized', request.url);
    redirectUrl.searchParams.set('reason', !profile ? 'no-profile' : 'inactive');
    return NextResponse.redirect(redirectUrl, { headers });
  }

  const userRole = profile.role as UserRole;

  // Admin can access everything
  if (userRole === 'admin') {
    return NextResponse.next();
  }

  // Get allowed routes for this role
  const allowedRoutes = roleRouteAccess[userRole] || [];
  
  // Check if the current path or any parent path is allowed
  const isAllowed = allowedRoutes.some(route => {
    // Exact match
    if (pathname === route) return true;
    
    // Check if it's a sub-route of an allowed route
    // e.g., /dashboard/leads/new is allowed if /dashboard/leads is allowed
    if (pathname.startsWith(route + '/')) return true;
    
    return false;
  });

  if (!isAllowed) {
    // Redirect to their default route if they don't have permission
    const defaultRoute = roleDefaultRoutes[userRole] || '/dashboard';
    console.log(`Access denied for ${userRole} to ${pathname}, redirecting to ${defaultRoute}`);
    return NextResponse.redirect(new URL(defaultRoute, request.url));
  }

  return NextResponse.next();
}

// Helper function to check API route permissions
export async function checkApiPermission(
  userId: string,
  resource: ResourceType,
  action: PermissionAction,
  resourceId?: string
): Promise<boolean> {
  // Use service role client for permission checks to bypass RLS
  const supabase = await createServiceRoleClient();
  
  const { data: hasPermission } = await supabase
    .rpc('check_permission', {
      p_user_id: userId,
      p_resource: resource,
      p_action: action,
      p_resource_id: resourceId || null,
    });

  return hasPermission || false;
}