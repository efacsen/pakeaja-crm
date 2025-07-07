'use client';

import { Project } from '@/types/projects';
import { ViewMode } from '@/types/project-detail';

interface SafetyTabProps {
  project: Project;
  viewMode: ViewMode;
}

export function SafetyTab({ project, viewMode }: SafetyTabProps) {
  return (
    <div className="text-center py-12 text-muted-foreground">
      SafetyTab coming soon...
    </div>
  );
}
