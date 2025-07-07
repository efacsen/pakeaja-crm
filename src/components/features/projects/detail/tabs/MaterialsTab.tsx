'use client';

import { Project } from '@/types/projects';
import { ViewMode } from '@/types/project-detail';

interface MaterialsTabProps {
  project: Project;
  viewMode: ViewMode;
}

export function MaterialsTab({ project, viewMode }: MaterialsTabProps) {
  return (
    <div className="text-center py-12 text-muted-foreground">
      MaterialsTab coming soon...
    </div>
  );
}
