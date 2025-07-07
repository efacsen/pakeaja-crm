'use client';

import { PipelineKanban } from '@/components/features/sales/PipelineKanban';
import { useAuth } from '@/contexts/auth-context';

export default function SalesPage() {
  const { user } = useAuth();
  
  // Determine user role
  const userRole = user?.role === 'sales_manager' ? 'sales_manager' : 'sales_rep';

  return (
    <div className="h-full">
      <PipelineKanban userRole={userRole} userId={user?.id} />
    </div>
  );
}