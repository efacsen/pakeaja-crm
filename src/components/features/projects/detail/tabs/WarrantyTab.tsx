'use client';

import { Project } from '@/types/projects';
import { ViewMode } from '@/types/project-detail';

interface WarrantyTabProps {
  project: Project;
  viewMode: ViewMode;
}

export function WarrantyTab({ project, viewMode }: WarrantyTabProps) {
  return (
    <div className="text-center py-12 text-muted-foreground">
      WarrantyTab coming soon...
    </div>
  );
}
