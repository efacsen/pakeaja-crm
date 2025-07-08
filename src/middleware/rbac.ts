import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { UserRole, ResourceType, PermissionAction } from '@/types/rbac';

// Define route-to-resource mappings
const routeResourceMap: Record<string, { resource: ResourceType; action: PermissionAction }> = {
  // User management
  '/dashboard/users': { resource: 'users', action: 'read' },
  '/dashboard/users/new': { resource: 'users', action: 'create' },
  '/dashboard/users/[id]': { resource: 'users', action: 'read' },
  '/dashboard/users/[id]/edit': { resource: 'users', action: 'update' },
  
  // Contacts
  '/dashboard/contacts': { resource: 'contacts', action: 'read' },
  '/dashboard/contacts/new': { resource: 'contacts', action: 'create' },
  '/dashboard/contacts/[id]': { resource: 'contacts', action: 'read' },
  '/dashboard/contacts/[id]/edit': { resource: 'contacts', action: 'update' },
  
  // Leads
  '/dashboard/leads': { resource: 'leads', action: 'read' },
  '/dashboard/leads/new': { resource: 'leads', action: 'create' },
  '/dashboard/leads/[id]': { resource: 'leads', action: 'read' },
  '/dashboard/leads/[id]/edit': { resource: 'leads', action: 'update' },
  
  // Opportunities
  '/dashboard/opportunities': { resource: 'opportunities', action: 'read' },
  '/dashboard/opportunities/new': { resource: 'opportunities', action: 'create' },
  '/dashboard/opportunities/[id]': { resource: 'opportunities', action: 'read' },
  '/dashboard/opportunities/[id]/edit': { resource: 'opportunities', action: 'update' },
  
  // Quotes
  '/dashboard/quotes': { resource: 'quotes', action: 'read' },
  '/dashboard/quotes/new': { resource: 'quotes', action: 'create' },
  '/dashboard/quotes/[id]': { resource: 'quotes', action: 'read' },
  '/dashboard/quotes/[id]/edit': { resource: 'quotes', action: 'update' },
  '/dashboard/quotes/[id]/approve': { resource: 'quotes', action: 'approve' },
  
  // Projects
  '/dashboard/projects': { resource: 'projects', action: 'read' },
  '/dashboard/projects/new': { resource: 'projects', action: 'create' },
  '/dashboard/projects/[id]': { resource: 'projects', action: 'read' },
  '/dashboard/projects/[id]/edit': { resource: 'projects', action: 'update' },
  
  // Materials & Calculations
  '/dashboard/materials': { resource: 'materials', action: 'read' },
  '/dashboard/calculator': { resource: 'calculations', action: 'create' },
  
  // Reports
  '/dashboard/reports': { resource: 'reports', action: 'read' },
  '/dashboard/reports/new': { resource: 'reports', action: 'create' },
  
  // Settings
  '/dashboard/settings': { resource: 'settings', action: 'read' },
  '/dashboard/settings/[section]': { resource: 'settings', action: 'update' },
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

  // Get user profile with role
  let { data: profile, error: profileError } = await supabase
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
      // Use the database function to create profile
      const { error: createError } = await supabase.rpc('create_profile_if_missing', {
        user_id: user.id,
        user_email: user.email,
        user_name: user.user_metadata?.full_name || user.email,
        user_role: 'sales'
      });
      
      if (!createError) {
        // Try fetching the profile again
        const { data: newProfile } = await supabase
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

  // Admin can access everything
  if (profile.role === 'admin') {
    return NextResponse.next();
  }

  // Find matching route pattern
  let routePermission = null;
  for (const [pattern, permission] of Object.entries(routeResourceMap)) {
    // Convert Next.js dynamic route pattern to regex
    const regex = new RegExp(
      '^' + pattern.replace(/\[([^\]]+)\]/g, '([^/]+)') + '$'
    );
    
    if (regex.test(pathname)) {
      routePermission = permission;
      break;
    }
  }

  // If no specific route permission found, allow access
  if (!routePermission) {
    return NextResponse.next();
  }

  // Check if user has permission using the database function
  const { data: hasPermission } = await supabase
    .rpc('check_permission', {
      p_user_id: user.id,
      p_resource: routePermission.resource,
      p_action: routePermission.action,
    });

  if (!hasPermission) {
    // Redirect to their default route if they don't have permission
    const defaultRoute = roleDefaultRoutes[profile.role as UserRole] || '/dashboard';
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
  const supabase = await createClient();
  
  const { data: hasPermission } = await supabase
    .rpc('check_permission', {
      p_user_id: userId,
      p_resource: resource,
      p_action: action,
      p_resource_id: resourceId || null,
    });

  return hasPermission || false;
}