'use client';

import { useState } from 'react';
import { Lead } from '@/types/sales';
import { mockPipelineService } from '@/lib/services/sales/mock-pipeline.service';
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
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

interface LogActivityDialogProps {
  lead: Lead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const ACTIVITY_TYPES = [
  { value: 'phone_call', label: 'Phone Call', impact: 5 },
  { value: 'email_sent', label: 'Email Sent', impact: 3 },
  { value: 'email_received', label: 'Email Received', impact: 4 },
  { value: 'meeting_scheduled', label: 'Meeting Scheduled', impact: 10 },
  { value: 'meeting_completed', label: 'Meeting Completed', impact: 15 },
  { value: 'site_visit', label: 'Site Visit', impact: 20 },
  { value: 'quote_sent', label: 'Quote Sent', impact: 15 },
  { value: 'quote_revised', label: 'Quote Revised', impact: 10 },
  { value: 'negotiation', label: 'Negotiation', impact: 8 },
  { value: 'po_requested', label: 'PO Requested', impact: 25 },
  { value: 'follow_up', label: 'Follow Up', impact: 5 },
  { value: 'competitor_info', label: 'Competitor Info', impact: -5 },
  { value: 'objection_raised', label: 'Objection Raised', impact: -10 },
  { value: 'budget_issue', label: 'Budget Issue', impact: -15 },
  { value: 'delay_requested', label: 'Delay Requested', impact: -8 },
  { value: 'no_response', label: 'No Response', impact: -12 },
  { value: 'other', label: 'Other', impact: 0 },
];

export function LogActivityDialog({ lead, open, onOpenChange, onSuccess }: LogActivityDialogProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [activityType, setActivityType] = useState('phone_call');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [customImpact, setCustomImpact] = useState<number | null>(null);

  const selectedActivity = ACTIVITY_TYPES.find(a => a.value === activityType);
  const temperatureImpact = customImpact !== null ? customImpact : (selectedActivity?.impact || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an activity title',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      // Log the activity
      await mockPipelineService.logActivity(
        lead.id,
        activityType,
        title,
        temperatureImpact,
        description || undefined
      );

      // Update temperature based on activity
      await mockPipelineService.updateLeadTemperature(lead.id, activityType);

      toast({
        title: 'Success',
        description: `Activity logged. Temperature ${temperatureImpact > 0 ? 'increased' : temperatureImpact < 0 ? 'decreased' : 'unchanged'}.`,
      });

      // Reset form
      setActivityType('phone_call');
      setTitle('');
      setDescription('');
      setCustomImpact(null);

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log activity',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const getImpactColor = (impact: number) => {
    if (impact > 0) return 'text-green-600';
    if (impact < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getImpactLabel = (impact: number) => {
    if (impact > 0) return `+${impact}°C`;
    if (impact < 0) return `${impact}°C`;
    return 'No change';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Log Activity</DialogTitle>
            <DialogDescription>
              Record an activity for {lead.customer?.company_name || lead.project_name}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="activity_type">Activity Type</Label>
              <Select value={activityType} onValueChange={setActivityType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{type.label}</span>
                        <span className={`ml-4 text-sm ${getImpactColor(type.impact)}`}>
                          {getImpactLabel(type.impact)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Activity Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Discussed budget requirements"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details about this activity..."
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="impact">Temperature Impact</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="impact"
                  type="number"
                  min="-50"
                  max="50"
                  value={customImpact !== null ? customImpact : temperatureImpact}
                  onChange={(e) => setCustomImpact(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">°C</span>
                <span className={`ml-2 text-sm font-medium ${getImpactColor(temperatureImpact)}`}>
                  Current: {lead.temperature}°C → {Math.max(0, Math.min(100, lead.temperature + temperatureImpact))}°C
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Adjust the temperature impact if needed (default based on activity type)
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Log Activity'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}