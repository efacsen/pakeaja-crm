'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OrganizationPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only admins can access organization settings
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Organization Settings</h1>
        <p className="text-muted-foreground">
          Manage your organization settings and team structure
        </p>
      </div>

      <div className="grid gap-6">
        {/* Organization Info */}
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Organization Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Organization Name</label>
              <p className="text-lg">PakeAja</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Organization ID</label>
              <p className="text-sm font-mono">{user.organization_id || 'Not set'}</p>
            </div>
          </div>
        </div>

        {/* Team Structure */}
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Team Structure</h2>
          <p className="text-muted-foreground">
            Team hierarchy and territory management features coming soon.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <a
            href="/dashboard/users"
            className="rounded-lg border p-6 hover:border-primary transition-colors"
          >
            <h3 className="font-semibold mb-2">User Management</h3>
            <p className="text-sm text-muted-foreground">
              Manage users, roles, and permissions
            </p>
          </a>
          <a
            href="/dashboard/settings"
            className="rounded-lg border p-6 hover:border-primary transition-colors"
          >
            <h3 className="font-semibold mb-2">Settings</h3>
            <p className="text-sm text-muted-foreground">
              Configure system settings
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}