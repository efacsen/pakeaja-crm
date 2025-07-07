'use client';

import { useState } from 'react';
import { ProjectTask, ProjectPhase } from '@/types/projects';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Save } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: Partial<ProjectTask>) => Promise<void>;
  projectId: string;
  phases: ProjectPhase[];
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  onSave,
  projectId,
  phases,
}: CreateTaskDialogProps) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<ProjectTask>>({
    name: '',
    description: '',
    phase_id: phases[0]?.id || '',
    status: 'pending',
    priority: 'medium',
    start_date: new Date().toISOString(),
    end_date: addDays(new Date(), 7).toISOString(),
    progress_percentage: 0,
    estimated_hours: 8,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phase_id) {
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
      onOpenChange(false);
      // Reset form
      setFormData({
        name: '',
        description: '',
        phase_id: phases[0]?.id || '',
        status: 'pending',
        priority: 'medium',
        start_date: new Date().toISOString(),
        end_date: addDays(new Date(), 7).toISOString(),
        progress_percentage: 0,
        estimated_hours: 8,
      });
    } finally {
      setSaving(false);
    }
  };

  const startDate = formData.start_date ? new Date(formData.start_date) : new Date();
  const endDate = formData.end_date ? new Date(formData.end_date) : addDays(new Date(), 7);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Add a new task to the project timeline
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Task Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Task Name *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter task name"
                required
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add task description"
                rows={3}
              />
            </div>

            {/* Phase and Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Phase *</Label>
                <Select
                  value={formData.phase_id}
                  onValueChange={(value) => setFormData({ ...formData, phase_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {phases.map((phase) => (
                      <SelectItem key={phase.id} value={phase.id}>
                        {phase.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value as ProjectTask['priority'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !formData.start_date && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(startDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        if (date) {
                          setFormData({ ...formData, start_date: date.toISOString() });
                          // If end date is before start date, adjust it
                          if (endDate < date) {
                            setFormData({
                              ...formData,
                              start_date: date.toISOString(),
                              end_date: addDays(date, 7).toISOString(),
                            });
                          }
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !formData.end_date && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(endDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        if (date) {
                          setFormData({ ...formData, end_date: date.toISOString() });
                        }
                      }}
                      disabled={(date) => date < startDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Assignee and Hours */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="assigned">Assigned To</Label>
                <Input
                  id="assigned"
                  value={formData.assigned_to || ''}
                  onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                  placeholder="Assign to team member"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="hours">Estimated Hours</Label>
                <Input
                  id="hours"
                  type="number"
                  value={formData.estimated_hours || ''}
                  onChange={(e) => setFormData({ ...formData, estimated_hours: parseInt(e.target.value) || 0 })}
                  min="1"
                  placeholder="8"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !formData.name || !formData.phase_id}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Creating...' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}