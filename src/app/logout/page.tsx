'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

export default function LogoutPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Clear any local storage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('supabase.auth.token');
          localStorage.clear();
        }
        
        // Sign out from Supabase
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          console.error('Logout error:', error);
        }
        
        // Force redirect to login page
        window.location.href = '/login';
      } catch (error) {
        console.error('Logout error:', error);
        // Force redirect even on error
        window.location.href = '/login';
      }
    };

    handleLogout();
  }, [supabase, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Logging out...</p>
      </div>
    </div>
  );
}