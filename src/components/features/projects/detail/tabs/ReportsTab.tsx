'use client';

import { Project } from '@/types/projects';
import { ViewMode } from '@/types/project-detail';

interface ReportsTabProps {
  project: Project;
  viewMode: ViewMode;
}

export function ReportsTab({ project, viewMode }: ReportsTabProps) {
  return (
    <div className="text-center py-12 text-muted-foreground">
      ReportsTab coming soon...
    </div>
  );
}
