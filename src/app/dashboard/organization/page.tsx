'use client';

import { useAuth } from '@/contexts/auth-context';
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardDescription, GlassCardContent } from '@/components/ui/glass-card';
import { Building2, Users, Settings, Shield } from 'lucide-react';

export default function OrganizationPage() {
  const { user } = useAuth();

  // Show different content based on role
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';

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
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Organization Information
            </GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Organization Name</label>
                <p className="text-lg font-semibold">PT Pake Aja Teknologi</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Organization ID</label>
                <p className="text-sm font-mono opacity-70">{user?.organization_id || 'Not set'}</p>
              </div>
              {isManager && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Your Role</label>
                  <p className="text-sm capitalize">{user?.role}</p>
                </div>
              )}
            </div>
          </GlassCardContent>
        </GlassCard>

        {/* Team Structure */}
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Structure
            </GlassCardTitle>
            <GlassCardDescription>
              {isAdmin ? 'Manage team hierarchy and territories' : 'View your team structure'}
            </GlassCardDescription>
          </GlassCardHeader>
          <GlassCardContent>
            <p className="text-muted-foreground">
              Team hierarchy and territory management features coming soon.
            </p>
          </GlassCardContent>
        </GlassCard>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          {isAdmin && (
            <a href="/dashboard/users">
              <GlassCard className="h-full cursor-pointer hover:border-primary/50">
                <GlassCardHeader>
                  <GlassCardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5" />
                    User Management
                  </GlassCardTitle>
                  <GlassCardDescription>
                    Manage users, roles, and permissions
                  </GlassCardDescription>
                </GlassCardHeader>
              </GlassCard>
            </a>
          )}
          
          <a href="/dashboard/reports/team">
            <GlassCard className="h-full cursor-pointer hover:border-primary/50">
              <GlassCardHeader>
                <GlassCardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5" />
                  Team Reports
                </GlassCardTitle>
                <GlassCardDescription>
                  View team performance and daily reports
                </GlassCardDescription>
              </GlassCardHeader>
            </GlassCard>
          </a>

          {isAdmin && (
            <a href="/dashboard/settings">
              <GlassCard className="h-full cursor-pointer hover:border-primary/50">
                <GlassCardHeader>
                  <GlassCardTitle className="flex items-center gap-2 text-lg">
                    <Settings className="h-5 w-5" />
                    Settings
                  </GlassCardTitle>
                  <GlassCardDescription>
                    Configure system settings
                  </GlassCardDescription>
                </GlassCardHeader>
              </GlassCard>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}