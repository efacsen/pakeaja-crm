'use client';

import { Project } from '@/types/projects';
import { ProjectTab, ViewMode } from '@/types/project-detail';
import { OverviewTab } from './tabs/OverviewTab';
import { TimelineTab } from './tabs/TimelineTab';
import { TasksTab } from './tabs/TasksTab';
import { TeamTab } from './tabs/TeamTab';
import { DocumentsTab } from './tabs/DocumentsTab';
import { ReportsTab } from './tabs/ReportsTab';
import { QualityTab } from './tabs/QualityTab';
import { BudgetTab } from './tabs/BudgetTab';
import { MaterialsTab } from './tabs/MaterialsTab';
import { SafetyTab } from './tabs/SafetyTab';
import { PermitsTab } from './tabs/PermitsTab';
import { NotesTab } from './tabs/NotesTab';
import { PhotosTab } from './tabs/PhotosTab';
import { WarrantyTab } from './tabs/WarrantyTab';

interface ProjectContentProps {
  project: Project;
  activeTab: ProjectTab;
  viewMode: ViewMode;
  onProjectUpdate: () => void;
}

export function ProjectContent({ 
  project, 
  activeTab, 
  viewMode, 
  onProjectUpdate 
}: ProjectContentProps) {
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab project={project} viewMode={viewMode} />;
      case 'timeline':
        return <TimelineTab project={project} viewMode={viewMode} />;
      case 'tasks':
        return <TasksTab project={project} viewMode={viewMode} onUpdate={onProjectUpdate} />;
      case 'team':
        return <TeamTab project={project} viewMode={viewMode} />;
      case 'documents':
        return <DocumentsTab project={project} viewMode={viewMode} />;
      case 'reports':
        return <ReportsTab project={project} viewMode={viewMode} />;
      case 'quality':
        return <QualityTab project={project} viewMode={viewMode} />;
      case 'budget':
        return <BudgetTab project={project} viewMode={viewMode} />;
      case 'materials':
        return <MaterialsTab project={project} viewMode={viewMode} />;
      case 'safety':
        return <SafetyTab project={project} viewMode={viewMode} />;
      case 'permits':
        return <PermitsTab project={project} viewMode={viewMode} />;
      case 'notes':
        return <NotesTab project={project} viewMode={viewMode} />;
      case 'photos':
        return <PhotosTab project={project} viewMode={viewMode} />;
      case 'warranty':
        return <WarrantyTab project={project} viewMode={viewMode} />;
      default:
        return <div>Tab not implemented yet</div>;
    }
  };

  return (
    <div className="px-6 py-4">
      {renderContent()}
    </div>
  );
}