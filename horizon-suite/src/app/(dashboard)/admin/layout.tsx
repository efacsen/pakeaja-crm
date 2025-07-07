'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Shield } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if user has admin or superadmin role
    if (!user || (user.role !== 'superadmin' && user.role !== 'admin' && user.role !== 'manager')) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (!user || (user.role !== 'superadmin' && user.role !== 'admin' && user.role !== 'manager')) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}