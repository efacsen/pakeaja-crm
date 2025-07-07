'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { devAuth } from '@/lib/auth/dev-auth';
import { User, UserRole, hasPermission, hasAllPermissions, hasAnyPermission } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Use development auth for now due to Supabase email validation issues
const USE_DEV_AUTH = true;
const DEMO_MODE = true; // Force demo user for development

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Check for existing session
    const checkUser = async () => {
      if (DEMO_MODE) {
        // Check localStorage for demo user role preference
        const storedUser = localStorage.getItem('demo_user');
        const demoRole = storedUser ? JSON.parse(storedUser).role : 'project_manager';
        
        // Always provide a demo user for development
        setUser({
          id: 'demo-user-123',
          email: 'demo@pakeaja.com',
          name: 'Demo User',
          role: demoRole as UserRole,
          company: 'PT Pake Aja Teknologi',
          department: 'Management',
        });
      } else if (USE_DEV_AUTH) {
        const devUser = devAuth.getCurrentUser();
        if (devUser) {
          setUser({
            id: devUser.id,
            email: devUser.email,
            name: devUser.fullName,
            role: 'sales_rep' as UserRole, // Default dev auth users as sales
            company: 'PT Pake Aja Teknologi',
          });
        }
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.full_name,
            role: (session.user.user_metadata?.role as UserRole) || 'customer',
            company: session.user.user_metadata?.company,
          });
        }
      }
      setLoading(false);
    };

    checkUser();
  }, [supabase]);

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      if (USE_DEV_AUTH) {
        const { user: newUser, error } = await devAuth.signUp(email, password, fullName || '');
        if (error) return { error: 'Sign up failed' };
        
        setUser({
          id: newUser!.id,
          email: newUser!.email,
          name: newUser!.fullName,
          role: 'customer' as UserRole,
          company: fullName?.split(' ')[0] + ' Company', // Default company name
        });
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
          setUser({
            id: data.user.id,
            email: data.user.email!,
            name: fullName,
            role: 'customer' as UserRole,
            company: fullName?.split(' ')[0] + ' Company',
          });
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
        const { user: authUser, error } = await devAuth.signIn(email, password);
        if (error) return { error: 'Invalid credentials' };
        
        setUser({
          id: authUser!.id,
          email: authUser!.email,
          name: authUser!.fullName,
          role: 'sales_rep' as UserRole,
          company: 'PT Pake Aja Teknologi',
        });
        return {};
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) return { error: error.message };
        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.full_name,
            role: (data.user.user_metadata?.role as UserRole) || 'customer',
            company: data.user.user_metadata?.company,
          });
        }
        return {};
      }
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
    router.push('/login');
  };

  // Permission helper functions
  const checkPermission = (permission: string) => hasPermission(user, permission);
  const checkAllPermissions = (permissions: string[]) => hasAllPermissions(user, permissions);
  const checkAnyPermission = (permissions: string[]) => hasAnyPermission(user, permissions);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signUp, 
      signIn, 
      signOut,
      hasPermission: checkPermission,
      hasAllPermissions: checkAllPermissions,
      hasAnyPermission: checkAnyPermission,
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