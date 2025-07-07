'use client';

import { useState, useEffect } from 'react';
import { ProjectTask } from '@/types/projects';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskQuickEditProps {
  task: ProjectTask;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (taskId: string, updates: Partial<ProjectTask>) => Promise<void>;
  children: React.ReactNode;
}

export function TaskQuickEdit({
  task,
  open,
  onOpenChange,
  onSave,
  children,
}: TaskQuickEditProps) {
  const [formData, setFormData] = useState({
    name: task.name,
    status: task.status,
    progress_percentage: task.progress_percentage,
    priority: task.priority,
    assigned_to: task.assigned_to || task.assigned_team || '',
    start_date: new Date(task.start_date),
    end_date: new Date(task.end_date),
  });
  const [saving, setSaving] = useState(false);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  useEffect(() => {
    setFormData({
      name: task.name,
      status: task.status,
      progress_percentage: task.progress_percentage,
      priority: task.priority,
      assigned_to: task.assigned_to || task.assigned_team || '',
      start_date: new Date(task.start_date),
      end_date: new Date(task.end_date),
    });
  }, [task]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(task.id, {
        name: formData.name,
        status: formData.status,
        progress_percentage: formData.progress_percentage,
        priority: formData.priority,
        assigned_to: formData.assigned_to,
        start_date: formData.start_date.toISOString(),
        end_date: formData.end_date.toISOString(),
      });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: task.name,
      status: task.status,
      progress_percentage: task.progress_percentage,
      priority: task.priority,
      assigned_to: task.assigned_to || task.assigned_team || '',
      start_date: new Date(task.start_date),
      end_date: new Date(task.end_date),
    });
    onOpenChange(false);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-96" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Quick Edit Task</h3>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancel}
                disabled={saving}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={handleSave}
                disabled={saving}
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Task Name */}
          <div className="space-y-2">
            <Label htmlFor="task-name">Task Name</Label>
            <Input
              id="task-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter task name"
            />
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as ProjectTask['status'] })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value as ProjectTask['priority'] })}
              >
                <SelectTrigger id="priority">
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

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="progress">Progress</Label>
              <span className="text-sm text-muted-foreground">{formData.progress_percentage}%</span>
            </div>
            <Slider
              id="progress"
              value={[formData.progress_percentage]}
              onValueChange={([value]) => setFormData({ ...formData, progress_percentage: value })}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Popover open={showStartCalendar} onOpenChange={setShowStartCalendar}>
                <PopoverTrigger asChild>
                  <Button
                    id="start-date"
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !formData.start_date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.start_date ? format(formData.start_date, 'PP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.start_date}
                    onSelect={(date) => {
                      if (date) {
                        setFormData({ ...formData, start_date: date });
                        setShowStartCalendar(false);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Popover open={showEndCalendar} onOpenChange={setShowEndCalendar}>
                <PopoverTrigger asChild>
                  <Button
                    id="end-date"
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !formData.end_date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.end_date ? format(formData.end_date, 'PP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.end_date}
                    onSelect={(date) => {
                      if (date) {
                        setFormData({ ...formData, end_date: date });
                        setShowEndCalendar(false);
                      }
                    }}
                    disabled={(date) => date < formData.start_date}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Assignee */}
          <div className="space-y-2">
            <Label htmlFor="assignee">Assigned To</Label>
            <Input
              id="assignee"
              value={formData.assigned_to}
              onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
              placeholder="Enter assignee name or team"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}