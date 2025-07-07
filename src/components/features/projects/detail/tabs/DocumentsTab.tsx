'use client';

import { Project } from '@/types/projects';
import { ViewMode } from '@/types/project-detail';

interface DocumentsTabProps {
  project: Project;
  viewMode: ViewMode;
}

export function DocumentsTab({ project, viewMode }: DocumentsTabProps) {
  return (
    <div className="text-center py-12 text-muted-foreground">
      DocumentsTab coming soon...
    </div>
  );
}
