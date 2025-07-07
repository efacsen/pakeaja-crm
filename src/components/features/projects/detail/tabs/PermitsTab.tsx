'use client';

import { Project } from '@/types/projects';
import { ViewMode } from '@/types/project-detail';

interface PermitsTabProps {
  project: Project;
  viewMode: ViewMode;
}

export function PermitsTab({ project, viewMode }: PermitsTabProps) {
  return (
    <div className="text-center py-12 text-muted-foreground">
      PermitsTab coming soon...
    </div>
  );
}
