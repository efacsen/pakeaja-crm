'use client';

import { useMemo } from 'react';
import { Project } from '@/types/projects';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Calendar, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResourceAllocationProps {
  projects: Project[];
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  allocation: number; // percentage
  projects: {
    projectId: string;
    projectName: string;
    allocation: number;
    role: string;
  }[];
}

// Mock team members data
const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Ahmad Wijaya',
    role: 'Project Manager',
    allocation: 85,
    projects: [
      { projectId: '1', projectName: 'PT Sinar Jaya Coating', allocation: 50, role: 'PM' },
      { projectId: '2', projectName: 'Mall Central Waterproofing', allocation: 35, role: 'PM' },
    ],
  },
  {
    id: '2',
    name: 'Siti Nurhasanah',
    role: 'Site Supervisor',
    allocation: 100,
    projects: [
      { projectId: '1', projectName: 'PT Sinar Jaya Coating', allocation: 100, role: 'Supervisor' },
    ],
  },
  {
    id: '3',
    name: 'Budi Santoso',
    role: 'Technical Lead',
    allocation: 75,
    projects: [
      { projectId: '2', projectName: 'Mall Central Waterproofing', allocation: 50, role: 'Tech Lead' },
      { projectId: '3', projectName: 'Office Tower Protective', allocation: 25, role: 'Consultant' },
    ],
  },
  {
    id: '4',
    name: 'Dewi Lestari',
    role: 'Quality Inspector',
    allocation: 60,
    projects: [
      { projectId: '1', projectName: 'PT Sinar Jaya Coating', allocation: 30, role: 'QC' },
      { projectId: '2', projectName: 'Mall Central Waterproofing', allocation: 30, role: 'QC' },
    ],
  },
  {
    id: '5',
    name: 'Rudi Hermawan',
    role: 'Coating Specialist',
    allocation: 90,
    projects: [
      { projectId: '1', projectName: 'PT Sinar Jaya Coating', allocation: 60, role: 'Lead Applicator' },
      { projectId: '3', projectName: 'Office Tower Protective', allocation: 30, role: 'Specialist' },
    ],
  },
];

export function ResourceAllocation({ projects }: ResourceAllocationProps) {
  // Calculate resource statistics
  const stats = useMemo(() => {
    const overAllocated = mockTeamMembers.filter(m => m.allocation > 100).length;
    const underUtilized = mockTeamMembers.filter(m => m.allocation < 50).length;
    const optimal = mockTeamMembers.filter(m => m.allocation >= 50 && m.allocation <= 100).length;
    const totalAllocation = mockTeamMembers.reduce((sum, m) => sum + m.allocation, 0);
    const averageAllocation = Math.round(totalAllocation / mockTeamMembers.length);

    return {
      overAllocated,
      underUtilized,
      optimal,
      averageAllocation,
      totalMembers: mockTeamMembers.length,
    };
  }, []);

  const getAllocationColor = (allocation: number) => {
    if (allocation > 100) return 'text-red-600 bg-red-100';
    if (allocation >= 80) return 'text-yellow-600 bg-yellow-100';
    if (allocation >= 50) return 'text-green-600 bg-green-100';
    return 'text-blue-600 bg-blue-100';
  };

  const getProgressColor = (allocation: number) => {
    if (allocation > 100) return 'bg-red-500';
    if (allocation >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              Active on projects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Allocation</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageAllocation}%</div>
            <Progress value={stats.averageAllocation} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimal Allocation</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.optimal}</div>
            <p className="text-xs text-muted-foreground">
              50-100% allocated
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Over Allocated</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overAllocated}</div>
            <p className="text-xs text-muted-foreground">
              Need rebalancing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Team Members Allocation */}
      <Card>
        <CardHeader>
          <CardTitle>Team Resource Allocation</CardTitle>
          <CardDescription>
            Current allocation of team members across active projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockTeamMembers.map((member) => (
              <div key={member.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline"
                    className={cn(getAllocationColor(member.allocation))}
                  >
                    {member.allocation}% allocated
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Allocation</span>
                    <span className="font-medium">{member.allocation}%</span>
                  </div>
                  <Progress 
                    value={Math.min(member.allocation, 100)} 
                    className={cn("h-2", member.allocation > 100 && "overflow-visible")}
                  >
                    {member.allocation > 100 && (
                      <div 
                        className="h-full bg-red-500 absolute top-0"
                        style={{ 
                          left: '100%',
                          width: `${member.allocation - 100}%`
                        }}
                      />
                    )}
                  </Progress>
                </div>

                <div className="grid gap-2">
                  {member.projects.map((project) => (
                    <div 
                      key={project.projectId}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{project.projectName}</p>
                        <p className="text-xs text-muted-foreground">{project.role}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={project.allocation} 
                          className="w-[100px] h-2"
                        />
                        <span className="text-sm font-medium w-[45px] text-right">
                          {project.allocation}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}