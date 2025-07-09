'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Save, Send, FileText, TrendingUp, Users, Target } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface DailyActivity {
  customerVisits: number;
  callsMade: number;
  proposalsSent: number;
  dealsWon: number;
  dealsLost: number;
  followUps: number;
}

export default function DailyReportPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState<'daily' | 'weekly'>('daily');
  
  const [activities, setActivities] = useState<DailyActivity>({
    customerVisits: 0,
    callsMade: 0,
    proposalsSent: 0,
    dealsWon: 0,
    dealsLost: 0,
    followUps: 0,
  });
  
  const [summary, setSummary] = useState('');
  const [challenges, setChallenges] = useState('');
  const [tomorrowPlan, setTomorrowPlan] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement report submission to database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast.success('Daily report submitted successfully!');
      
      // Reset form
      setActivities({
        customerVisits: 0,
        callsMade: 0,
        proposalsSent: 0,
        dealsWon: 0,
        dealsLost: 0,
        followUps: 0,
      });
      setSummary('');
      setChallenges('');
      setTomorrowPlan('');
    } catch (error) {
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const today = format(new Date(), 'EEEE, dd MMMM yyyy');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Daily Sales Report
        </h1>
        <p className="text-muted-foreground mt-1">Submit your daily activities and progress</p>
      </div>

      {/* Date Info */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {today}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {format(new Date(), 'HH:mm')}
            </div>
          </div>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Activities Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Today's Activities
            </CardTitle>
            <CardDescription>Record your sales activities for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="customerVisits">Customer Visits</Label>
                <Input
                  id="customerVisits"
                  type="number"
                  min="0"
                  value={activities.customerVisits}
                  onChange={(e) => setActivities({...activities, customerVisits: parseInt(e.target.value) || 0})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="callsMade">Calls Made</Label>
                <Input
                  id="callsMade"
                  type="number"
                  min="0"
                  value={activities.callsMade}
                  onChange={(e) => setActivities({...activities, callsMade: parseInt(e.target.value) || 0})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="proposalsSent">Proposals Sent</Label>
                <Input
                  id="proposalsSent"
                  type="number"
                  min="0"
                  value={activities.proposalsSent}
                  onChange={(e) => setActivities({...activities, proposalsSent: parseInt(e.target.value) || 0})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dealsWon">Deals Won</Label>
                <Input
                  id="dealsWon"
                  type="number"
                  min="0"
                  value={activities.dealsWon}
                  onChange={(e) => setActivities({...activities, dealsWon: parseInt(e.target.value) || 0})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dealsLost">Deals Lost</Label>
                <Input
                  id="dealsLost"
                  type="number"
                  min="0"
                  value={activities.dealsLost}
                  onChange={(e) => setActivities({...activities, dealsLost: parseInt(e.target.value) || 0})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="followUps">Follow-ups</Label>
                <Input
                  id="followUps"
                  type="number"
                  min="0"
                  value={activities.followUps}
                  onChange={(e) => setActivities({...activities, followUps: parseInt(e.target.value) || 0})}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Summary</CardTitle>
            <CardDescription>What did you accomplish today?</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Describe your key achievements, customer interactions, and progress made today..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={4}
              required
            />
          </CardContent>
        </Card>

        {/* Challenges */}
        <Card>
          <CardHeader>
            <CardTitle>Challenges Faced</CardTitle>
            <CardDescription>What obstacles did you encounter?</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Describe any challenges, objections, or difficulties you faced today..."
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Tomorrow's Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Tomorrow's Plan</CardTitle>
            <CardDescription>What are your priorities for tomorrow?</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="List your planned activities, meetings, and goals for tomorrow..."
              value={tomorrowPlan}
              onChange={(e) => setTomorrowPlan(e.target.value)}
              rows={3}
              required
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button type="submit" disabled={loading}>
            <Send className="h-4 w-4 mr-2" />
            {loading ? 'Submitting...' : 'Submit Report'}
          </Button>
        </div>
      </form>
    </div>
  );
}