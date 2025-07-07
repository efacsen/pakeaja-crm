'use client';

import { Project } from '@/types/projects';
import { ViewMode } from '@/types/project-detail';

interface BudgetTabProps {
  project: Project;
  viewMode: ViewMode;
}

export function BudgetTab({ project, viewMode }: BudgetTabProps) {
  return (
    <div className="text-center py-12 text-muted-foreground">
      BudgetTab coming soon...
    </div>
  );
}
