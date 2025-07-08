'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { devAuth } from '@/lib/auth/dev-auth';
import { 
  UserProfile, 
  UserRole, 
  ResourceType, 
  PermissionAction,
  Permission,
  PermissionCheck,
  ROLE_HIERARCHY 
} from '@/types/rbac';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  checkPermission: (resource: ResourceType, action: PermissionAction, resourceId?: string) => Promise<PermissionCheck>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  canAccessResource: (resource: ResourceType, resourceId?: string) => Promise<boolean>;
  refreshPermissions: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Use development auth for now due to Supabase email validation issues
const USE_DEV_AUTH = false;
const DEMO_MODE = false; // Disable demo mode - use real Supabase auth

// Cache for permissions to reduce database calls
const permissionCache = new Map<string, { result: PermissionCheck; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const router = useRouter();
  const supabase = createClient();

  // Load user permissions
  const loadPermissions = useCallback(async (userId: string, organizationId: string, role: UserRole) => {
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('role', role);

    if (!error && data) {
      setPermissions(data);
    }
  }, [supabase]);

  // Check if user has specific role(s)
  const hasRole = useCallback((role: UserRole | UserRole[]) => {
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  }, [user]);

  // Check if user has permission for an action on a resource
  const checkPermission = useCallback(async (
    resource: ResourceType, 
    action: PermissionAction, 
    resourceId?: string
  ): Promise<PermissionCheck> => {
    if (!user) return { hasPermission: false, reason: 'Not authenticated' };

    // Check cache first
    const cacheKey = `${user.id}-${resource}-${action}-${resourceId || 'any'}`;
    const cached = permissionCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.result;
    }

    try {
      // Admin has all permissions
      if (user.role === 'admin') {
        const result = { hasPermission: true, reason: 'Admin role' };
        permissionCache.set(cacheKey, { result, timestamp: Date.now() });
        return result;
      }

      // Check direct permissions
      const permission = permissions.find(
        p => p.resource === resource && p.action === action
      );

      if (permission) {
        // Check conditions if resource ID is provided
        if (resourceId && permission.conditions) {
          // Check own_only condition
          if (permission.conditions.own_only) {
            // This would need to be implemented based on resource type
            // For now, we'll use a placeholder check
            const result = { 
              hasPermission: true, 
              conditions: permission.conditions,
              reason: 'Direct permission with conditions'
            };
            permissionCache.set(cacheKey, { result, timestamp: Date.now() });
            return result;
          }
        }

        const result = { hasPermission: true, reason: 'Direct permission' };
        permissionCache.set(cacheKey, { result, timestamp: Date.now() });
        return result;
      }

      // Check role hierarchy
      const parentRoles = Object.entries(ROLE_HIERARCHY)
        .filter(([_, children]) => children.includes(user.role))
        .map(([parent]) => parent as UserRole);

      for (const parentRole of parentRoles) {
        const parentPermission = permissions.find(
          p => p.role === parentRole && p.resource === resource && p.action === action
        );
        
        if (parentPermission) {
          const result = { 
            hasPermission: true, 
            reason: `Inherited from ${parentRole} role` 
          };
          permissionCache.set(cacheKey, { result, timestamp: Date.now() });
          return result;
        }
      }

      const result = { 
        hasPermission: false, 
        reason: `No ${action} permission for ${resource}` 
      };
      permissionCache.set(cacheKey, { result, timestamp: Date.now() });
      return result;
    } catch (error) {
      console.error('Permission check error:', error);
      return { hasPermission: false, reason: 'Permission check failed' };
    }
  }, [user, permissions]);

  // Check if user can access a specific resource
  const canAccessResource = useCallback(async (
    resource: ResourceType, 
    resourceId?: string
  ): Promise<boolean> => {
    const check = await checkPermission(resource, 'read', resourceId);
    return check.hasPermission;
  }, [checkPermission]);

  // Refresh permissions (clear cache)
  const refreshPermissions = useCallback(async () => {
    permissionCache.clear();
    if (user?.organization_id) {
      await loadPermissions(user.id, user.organization_id, user.role);
    }
  }, [user, loadPermissions]);

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Get user data from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        // If profile doesn't exist, create it with default organization
        if (!profileData || profileError) {
          // Get default organization
          const { data: orgData } = await supabase
            .from('organizations')
            .select('id')
            .eq('slug', 'pakeaja')
            .single();

          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: session.user.id,
              email: session.user.email!,
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Unknown User',
              role: 'sales' as UserRole, // Default role for new users
              organization_id: orgData?.id || null,
              is_active: true,
              joined_at: new Date().toISOString().split('T')[0],
            });
          
          if (insertError) {
            console.error('Error creating profile:', insertError);
          }
        }
        
        const userData: UserProfile = {
          id: session.user.id,
          email: session.user.email!,
          full_name: profileData?.full_name || session.user.user_metadata?.full_name || 'Unknown User',
          role: (profileData?.role as UserRole) || 'sales',
          organization_id: profileData?.organization_id,
          is_active: profileData?.is_active ?? true,
          avatar_url: profileData?.avatar_url,
          phone: profileData?.phone,
          department: profileData?.department,
          position: profileData?.position,
          employee_id: profileData?.employee_id,
          joined_at: profileData?.joined_at || new Date().toISOString().split('T')[0],
          reports_to: profileData?.reports_to,
          permissions: profileData?.permissions,
          settings: profileData?.settings,
          created_at: profileData?.created_at || new Date().toISOString(),
          updated_at: profileData?.updated_at || new Date().toISOString(),
        };
        
        setUser(userData);
        
        // Load permissions if organization is set
        if (userData.organization_id) {
          await loadPermissions(userData.id, userData.organization_id, userData.role);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setPermissions([]);
        permissionCache.clear();
      }
    });

    // Check for existing session
    const checkUser = async () => {
      if (DEMO_MODE) {
        // Demo mode implementation...
        setLoading(false);
      } else if (USE_DEV_AUTH) {
        // Dev auth implementation...
        setLoading(false);
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Get user data from profiles table
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          // Handle error or missing profile
          if (!profileData || profileError) {
            console.error('Profile fetch error:', profileError);
            // Try to create profile if it doesn't exist
            const { data: orgData } = await supabase
              .from('organizations')
              .select('id')
              .eq('slug', 'pakeaja')
              .single();

            const { data: newProfile, error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                email: session.user.email!,
                full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Unknown User',
                role: 'sales' as UserRole,
                organization_id: orgData?.id || null,
                is_active: true,
                joined_at: new Date().toISOString().split('T')[0],
              })
              .select()
              .single();
            
            if (!insertError && newProfile) {
              const userData: UserProfile = {
                id: session.user.id,
                email: session.user.email!,
                full_name: newProfile.full_name || 'Unknown User',
                role: (newProfile.role as UserRole) || 'sales',
                organization_id: newProfile.organization_id,
                is_active: newProfile.is_active,
                joined_at: newProfile.joined_at,
                created_at: newProfile.created_at,
                updated_at: newProfile.updated_at,
              };
              setUser(userData);
              
              if (userData.organization_id) {
                await loadPermissions(userData.id, userData.organization_id, userData.role);
              }
            }
          } else {
            const userData: UserProfile = {
              id: session.user.id,
              email: session.user.email!,
              full_name: profileData.full_name || 'Unknown User',
              role: profileData.role || 'sales',
              organization_id: profileData.organization_id,
              is_active: profileData.is_active,
              avatar_url: profileData.avatar_url,
              phone: profileData.phone,
              department: profileData.department,
              position: profileData.position,
              employee_id: profileData.employee_id,
              joined_at: profileData.joined_at,
              reports_to: profileData.reports_to,
              permissions: profileData.permissions,
              settings: profileData.settings,
              created_at: profileData.created_at,
              updated_at: profileData.updated_at,
            };
            setUser(userData);
            
            if (userData.organization_id) {
              await loadPermissions(userData.id, userData.organization_id, userData.role);
            }
          }
        }
      }
      setLoading(false);
    };

    checkUser();
    
    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, loadPermissions]);

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      if (USE_DEV_AUTH) {
        // Dev auth implementation...
        return {};
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        
        if (error) return { error: error.message };
        if (data.user) {
          // Get default organization
          const { data: orgData } = await supabase
            .from('organizations')
            .select('id')
            .eq('slug', 'pakeaja')
            .single();

          // Create profile record
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: data.user.email!,
              full_name: fullName || 'Unknown User',
              role: 'sales' as UserRole, // Default role
              organization_id: orgData?.id || null,
              is_active: true,
              joined_at: new Date().toISOString().split('T')[0],
            });
          
          if (insertError) {
            console.error('Error creating profile:', insertError);
          }
        }
        return {};
      }
    } catch {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      if (USE_DEV_AUTH) {
        // Dev auth implementation...
        return {};
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) return { error: error.message };
        return {};
      }
    } catch {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) return { error: error.message };
      return {};
    } catch {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    if (USE_DEV_AUTH) {
      await devAuth.signOut();
    } else {
      await supabase.auth.signOut();
    }
    setUser(null);
    setPermissions([]);
    permissionCache.clear();
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signUp, 
      signIn,
      signInWithGoogle, 
      signOut,
      checkPermission,
      hasRole,
      canAccessResource,
      refreshPermissions,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};