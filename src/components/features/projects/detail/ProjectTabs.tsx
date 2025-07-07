'use client';

import { ProjectTab, ViewMode, TAB_VISIBILITY, PROJECT_TABS } from '@/types/project-detail';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  CalendarDays, 
  CheckSquare, 
  Users, 
  FileText, 
  ClipboardCheck, 
  Shield, 
  DollarSign, 
  Package, 
  HardHat, 
  FileCheck, 
  StickyNote,
  Camera,
  ShieldCheck
} from 'lucide-react';

interface ProjectTabsProps {
  activeTab: ProjectTab;
  onTabChange: (tab: ProjectTab) => void;
  viewMode: ViewMode;
}

const TAB_ICONS: Record<ProjectTab, React.ReactNode> = {
  overview: <LayoutDashboard className="h-4 w-4" />,
  timeline: <CalendarDays className="h-4 w-4" />,
  tasks: <CheckSquare className="h-4 w-4" />,
  team: <Users className="h-4 w-4" />,
  documents: <FileText className="h-4 w-4" />,
  reports: <FileText className="h-4 w-4" />,
  quality: <ClipboardCheck className="h-4 w-4" />,
  budget: <DollarSign className="h-4 w-4" />,
  materials: <Package className="h-4 w-4" />,
  safety: <HardHat className="h-4 w-4" />,
  permits: <FileCheck className="h-4 w-4" />,
  notes: <StickyNote className="h-4 w-4" />,
  photos: <Camera className="h-4 w-4" />,
  warranty: <ShieldCheck className="h-4 w-4" />
};

export function ProjectTabs({ activeTab, onTabChange, viewMode }: ProjectTabsProps) {
  // Filter tabs based on view mode
  const visibleTabs = PROJECT_TABS.filter(tab => 
    TAB_VISIBILITY[tab.id].includes(viewMode)
  ).sort((a, b) => a.order - b.order);

  return (
    <div className="border-b border-gray-200 mb-6">
      <div className="flex space-x-1 overflow-x-auto">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
            )}
          >
            {TAB_ICONS[tab.id]}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}