'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Quote } from '@/types/quotes';
import { CreateProjectRequest } from '@/types/projects';
import { formatCurrency, formatArea } from '@/lib/calculator-utils';

const projectConversionSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  start_date: z.date({
    required_error: 'Start date is required',
  }),
  end_date: z.date({
    required_error: 'End date is required',
  }),
  project_manager: z.string().optional(),
  assigned_crew: z.string().optional(),
  site_contact: z.string().optional(),
  site_phone: z.string().optional(),
  notes: z.string().optional(),
});

type ProjectConversionFormData = z.infer<typeof projectConversionSchema>;

interface ProjectConversionDialogProps {
  quote: Quote | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: CreateProjectRequest) => void;
}

export function ProjectConversionDialog({
  quote,
  open,
  onOpenChange,
  onConfirm,
}: ProjectConversionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProjectConversionFormData>({
    resolver: zodResolver(projectConversionSchema),
    defaultValues: {
      name: quote?.project_name || '',
      description: '',
      start_date: new Date(),
      end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Default to 2 weeks from now
      project_manager: '',
      assigned_crew: '',
      site_contact: quote?.client_name || '',
      site_phone: quote?.client_phone || '',
      notes: '',
    },
  });

  const handleSubmit = async (data: ProjectConversionFormData) => {
    if (!quote) return;

    setIsSubmitting(true);
    try {
      const projectData: CreateProjectRequest = {
        quote_id: quote.id,
        name: data.name || quote.project_name,
        description: data.description,
        start_date: data.start_date.toISOString(),
        end_date: data.end_date.toISOString(),
        project_manager: data.project_manager || undefined,
        assigned_crew: data.assigned_crew ? data.assigned_crew.split(',').map(s => s.trim()) : undefined,
        site_contact: data.site_contact || undefined,
        site_phone: data.site_phone || undefined,
        notes: data.notes || undefined,
      };

      await onConfirm(projectData);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error converting quote to project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!quote) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Convert Quote to Project</DialogTitle>
          <DialogDescription>
            Convert quote {quote.quote_number} into an active project with timeline and team assignments.
          </DialogDescription>
        </DialogHeader>

        {/* Quote Summary */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Quote Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Project:</span>
                <p className="font-medium">{quote.project_name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Client:</span>
                <p className="font-medium">{quote.client_name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Total Cost:</span>
                <p className="font-medium">{formatCurrency(quote.total_cost)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Total Area:</span>
                <p className="font-medium">{formatArea(quote.total_area)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Leave blank to use quote project name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="project_manager"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Manager</FormLabel>
                    <FormControl>
                      <Input placeholder="Assigned project manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick start date</span>
                            )}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick end date</span>
                            )}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < form.getValues('start_date') ||
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assigned_crew"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned Crew</FormLabel>
                    <FormControl>
                      <Input placeholder="Team A, Team B" {...field} />
                    </FormControl>
                    <FormDescription>
                      Comma-separated list of teams/crew members
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="site_contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Contact</FormLabel>
                    <FormControl>
                      <Input placeholder="On-site contact person" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="site_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Phone</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="(555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed project description and scope..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Special requirements, client preferences, etc..."
                      className="min-h-[60px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Converting...' : 'Create Project'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}