'use client';

import { Project } from '@/types/projects';
import { ViewMode } from '@/types/project-detail';

interface NotesTabProps {
  project: Project;
  viewMode: ViewMode;
}

export function NotesTab({ project, viewMode }: NotesTabProps) {
  return (
    <div className="text-center py-12 text-muted-foreground">
      NotesTab coming soon...
    </div>
  );
}
