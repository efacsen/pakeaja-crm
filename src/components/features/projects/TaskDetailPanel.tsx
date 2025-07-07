'use client';

import { useState, useEffect } from 'react';
import { ProjectTask } from '@/types/projects';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format, differenceInDays } from 'date-fns';
import {
  CalendarIcon,
  Clock,
  Users,
  Link2,
  AlertTriangle,
  FileText,
  MessageSquare,
  X,
  Save,
  Trash2,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface TaskDetailPanelProps {
  task: ProjectTask | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (taskId: string, updates: Partial<ProjectTask>) => Promise<void>;
  onDelete?: (taskId: string) => Promise<void>;
  allTasks?: ProjectTask[]; // For dependency selection
}

interface TaskActivity {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  details?: string;
}

export function TaskDetailPanel({
  task,
  open,
  onOpenChange,
  onSave,
  onDelete,
  allTasks = [],
}: TaskDetailPanelProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('details');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<ProjectTask>>({});
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [activities] = useState<TaskActivity[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      user: 'John Doe',
      action: 'Updated progress',
      details: 'Changed from 25% to 50%',
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
      user: 'Jane Smith',
      action: 'Changed status',
      details: 'From pending to in_progress',
    },
  ]);

  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        start_date: task.start_date,
        end_date: task.end_date,
      });
    }
  }, [task]);

  if (!task) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(task.id, formData);
      toast({
        title: 'Success',
        description: 'Task updated successfully',
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (onDelete && window.confirm('Are you sure you want to delete this task?')) {
      try {
        await onDelete(task.id);
        toast({
          title: 'Success',
          description: 'Task deleted successfully',
        });
        onOpenChange(false);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete task',
          variant: 'destructive',
        });
      }
    }
  };

  const startDate = formData.start_date ? new Date(formData.start_date) : new Date();
  const endDate = formData.end_date ? new Date(formData.end_date) : new Date();
  const duration = differenceInDays(endDate, startDate) + 1;

  const availableDependencies = allTasks.filter(
    (t) => t.id !== task.id && t.phase_id === task.phase_id
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Task Details</SheetTitle>
            <div className="flex gap-2">
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6 mt-6">
              {/* Task Name and Description */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Task Name</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    placeholder="Add task description..."
                  />
                </div>
              </div>

              {/* Status and Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as ProjectTask['status'] })}
                  >
                    <SelectTrigger>
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

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Progress</Label>
                  <span className="text-sm text-muted-foreground">
                    {formData.progress_percentage || 0}%
                  </span>
                </div>
                <Slider
                  value={[formData.progress_percentage || 0]}
                  onValueChange={([value]) => setFormData({ ...formData, progress_percentage: value })}
                  max={100}
                  step={5}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Dependencies */}
              <div className="space-y-2">
                <Label>Dependencies</Label>
                <div className="space-y-2">
                  {formData.dependencies?.map((depId) => {
                    const depTask = allTasks.find((t) => t.id === depId);
                    return depTask ? (
                      <div key={depId} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <Link2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{depTask.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              dependencies: formData.dependencies?.filter((id) => id !== depId),
                            });
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : null;
                  })}
                  {availableDependencies.length > 0 && (
                    <Select
                      onValueChange={(value) => {
                        setFormData({
                          ...formData,
                          dependencies: [...(formData.dependencies || []), value],
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Add dependency..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDependencies
                          .filter((t) => !formData.dependencies?.includes(t.id))
                          .map((t) => (
                            <SelectItem key={t.id} value={t.id}>
                              {t.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6 mt-6">
              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover open={showStartCalendar} onOpenChange={setShowStartCalendar}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !formData.start_date && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.start_date ? format(startDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => {
                          if (date) {
                            setFormData({ ...formData, start_date: date.toISOString() });
                            setShowStartCalendar(false);
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover open={showEndCalendar} onOpenChange={setShowEndCalendar}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !formData.end_date && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.end_date ? format(endDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => {
                          if (date) {
                            setFormData({ ...formData, end_date: date.toISOString() });
                            setShowEndCalendar(false);
                          }
                        }}
                        disabled={(date) => date < startDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Duration and Hours */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Duration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-2xl font-bold">{duration}</span>
                      <span className="text-muted-foreground">days</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Estimated Hours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      type="number"
                      value={formData.estimated_hours || ''}
                      onChange={(e) => setFormData({ ...formData, estimated_hours: parseInt(e.target.value) || 0 })}
                      className="text-2xl font-bold h-auto py-0 px-0 border-0 focus-visible:ring-0"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Actual vs Estimated */}
              {formData.actual_hours && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Time Tracking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Estimated</span>
                        <span className="font-medium">{formData.estimated_hours} hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Actual</span>
                        <span className="font-medium">{formData.actual_hours} hours</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Variance</span>
                        <span className={cn(
                          "font-medium",
                          (formData.actual_hours || 0) > (formData.estimated_hours || 0)
                            ? "text-red-600"
                            : "text-green-600"
                        )}>
                          {(formData.actual_hours || 0) - (formData.estimated_hours || 0)} hours
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="resources" className="space-y-6 mt-6">
              {/* Assignee */}
              <div className="space-y-2">
                <Label>Assigned To</Label>
                <Input
                  value={formData.assigned_to || formData.assigned_team || ''}
                  onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                  placeholder="Enter assignee name or team"
                />
              </div>

              {/* Materials */}
              <div className="space-y-2">
                <Label>Required Materials</Label>
                <div className="space-y-2">
                  {formData.materials_required?.map((material, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={material}
                        onChange={(e) => {
                          const newMaterials = [...(formData.materials_required || [])];
                          newMaterials[index] = e.target.value;
                          setFormData({ ...formData, materials_required: newMaterials });
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newMaterials = formData.materials_required?.filter((_, i) => i !== index);
                          setFormData({ ...formData, materials_required: newMaterials });
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        materials_required: [...(formData.materials_required || []), ''],
                      });
                    }}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Material
                  </Button>
                </div>
              </div>

              {/* Equipment */}
              <div className="space-y-2">
                <Label>Required Equipment</Label>
                <div className="space-y-2">
                  {formData.equipment_required?.map((equipment, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={equipment}
                        onChange={(e) => {
                          const newEquipment = [...(formData.equipment_required || [])];
                          newEquipment[index] = e.target.value;
                          setFormData({ ...formData, equipment_required: newEquipment });
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newEquipment = formData.equipment_required?.filter((_, i) => i !== index);
                          setFormData({ ...formData, equipment_required: newEquipment });
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        equipment_required: [...(formData.equipment_required || []), ''],
                      });
                    }}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Equipment
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4 mt-6">
              {activities.map((activity) => (
                <div key={activity.id} className="flex gap-4 pb-4 border-b last:border-0">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{activity.user}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(activity.timestamp, 'PPp')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                    {activity.details && (
                      <p className="text-sm mt-1">{activity.details}</p>
                    )}
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-6 pt-6 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}