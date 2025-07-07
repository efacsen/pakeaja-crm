'use client';

import { Project } from '@/types/projects';
import { ViewMode } from '@/types/project-detail';

interface QualityTabProps {
  project: Project;
  viewMode: ViewMode;
}

export function QualityTab({ project, viewMode }: QualityTabProps) {
  return (
    <div className="text-center py-12 text-muted-foreground">
      QualityTab coming soon...
    </div>
  );
}
