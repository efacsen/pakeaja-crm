'use client';

import { Project } from '@/types/projects';
import { ViewMode } from '@/types/project-detail';

interface TeamTabProps {
  project: Project;
  viewMode: ViewMode;
}

export function TeamTab({ project, viewMode }: TeamTabProps) {
  return (
    <div className="text-center py-12 text-muted-foreground">
      TeamTab coming soon...
    </div>
  );
}
