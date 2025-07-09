'use client';

export const dynamic = 'force-dynamic';

import { MVPDashboardSidebar } from '@/components/layouts/MVPDashboardSidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function MVPDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <div className="flex h-screen bg-background">
          {/* MVP Sidebar */}
          <MVPDashboardSidebar />
          
          {/* Main content area with left margin for sidebar */}
          <div className="flex-1 lg:ml-[240px]">
            {/* Page Content */}
            <main className="h-full overflow-auto">
              <div className="p-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      </ErrorBoundary>
    </ProtectedRoute>
  );
}