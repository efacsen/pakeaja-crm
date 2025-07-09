'use client';

// Force dynamic rendering to avoid static generation issues with auth
export const dynamic = 'force-dynamic';

import { PipelineKanban } from '@/components/features/sales/PipelineKanban';
import { useAuth } from '@/contexts/auth-context';

export default function LeadsPage() {
  const { user } = useAuth();
  
  // Determine user role
  const userRole = user?.role === 'manager' ? 'manager' : 'sales';

  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Sales Pipeline</h1>
        <p className="text-muted-foreground">Manage your leads and opportunities</p>
      </div>
      <PipelineKanban userRole={userRole} userId={user?.id} />
    </div>
  );
}