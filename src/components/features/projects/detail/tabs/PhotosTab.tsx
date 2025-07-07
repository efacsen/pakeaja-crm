'use client';

import { Project } from '@/types/projects';
import { ViewMode } from '@/types/project-detail';

interface PhotosTabProps {
  project: Project;
  viewMode: ViewMode;
}

export function PhotosTab({ project, viewMode }: PhotosTabProps) {
  return (
    <div className="text-center py-12 text-muted-foreground">
      PhotosTab coming soon...
    </div>
  );
}
