'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, FileText, DollarSign, Calendar, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { QuotesTable } from './QuotesTable';
import { QuoteDetails } from './QuoteDetails';
import { QuoteStats } from './QuoteStats';
import { Quote, QuoteFilters } from '@/types/quotes';
import { quotesService } from '@/lib/services/quotes-service';
import { pdfService } from '@/lib/services/pdf-service';
import { emailService } from '@/lib/services/email-service';
import { projectsService } from '@/lib/services/projects-service';
import { ProjectConversionDialog } from '@/components/features/projects/ProjectConversionDialog';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { CreateProjectRequest } from '@/types/projects';

export function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<QuoteFilters>({});
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [quoteToConvert, setQuoteToConvert] = useState<Quote | null>(null);
  const [isConversionDialogOpen, setIsConversionDialogOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  
  const { toast } = useToast();
  const router = useRouter();

  // Load quotes
  const loadQuotes = async () => {
    setLoading(true);
    try {
      const searchFilters = searchQuery ? { ...filters, search: searchQuery } : filters;
      const { data, error } = await quotesService.listQuotes(
        searchFilters,
        pagination.page,
        pagination.limit
      );

      if (error) {
        throw new Error(error);
      }

      if (data) {
        setQuotes(data.quotes);
        setPagination(prev => ({ ...prev, total: data.total }));
      }
    } catch (error) {
      console.error('Error loading quotes:', error);
      toast({
        title: "Error",
        description: "Failed to load quotes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadQuotes();
  }, [pagination.page, pagination.limit]);

  // Search and filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }));
      loadQuotes();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters]);

  const handleViewQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsDetailsDialogOpen(true);
  };

  const handleGeneratePDF = async (quote: Quote) => {
    try {
      pdfService.generateQuotePDF(quote);
      toast({
        title: "PDF Generated",
        description: `Quote ${quote.quote_number} has been downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendQuote = async (quote: Quote) => {
    try {
      toast({
        title: "Sending Quote",
        description: "Preparing and sending your quote...",
      });

      const emailResult = await emailService.sendQuote(quote);
      
      if (!emailResult.success) {
        throw new Error(emailResult.error || 'Failed to send email');
      }

      // Update quote status to sent
      await quotesService.sendQuote(quote.id);
      
      toast({
        title: "Quote Sent Successfully!",
        description: `Quote ${quote.quote_number} has been sent to ${quote.client_email}`,
      });

      // Reload quotes to show updated status
      loadQuotes();
      
    } catch (error) {
      console.error('Send quote error:', error);
      toast({
        title: "Failed to Send Quote",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleDeleteQuote = async (quoteId: string) => {
    try {
      const { error } = await quotesService.deleteQuote(quoteId);
      
      if (error) {
        throw new Error(error);
      }

      toast({
        title: "Quote Deleted",
        description: "Quote has been removed successfully.",
      });

      loadQuotes();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete quote",
        variant: "destructive",
      });
    }
  };

  const handleConvertToProject = (quote: Quote) => {
    setQuoteToConvert(quote);
    setIsConversionDialogOpen(true);
  };

  const handleProjectConversion = async (projectData: CreateProjectRequest) => {
    try {
      const { data: project, error } = await projectsService.createProjectFromQuote(projectData);
      
      if (error) {
        throw new Error(error);
      }

      toast({
        title: "Project Created",
        description: `Project ${project?.project_number} has been created successfully.`,
      });

      // Reload quotes to show updated status
      loadQuotes();
      
      // Navigate to project dashboard
      router.push('/dashboard/projects');
      
    } catch (error) {
      console.error('Project conversion error:', error);
      toast({
        title: "Failed to Create Project",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleCreateNewQuote = () => {
    router.push('/dashboard/calculator');
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const getStatusColor = (status: Quote['status']) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      expired: 'bg-orange-100 text-orange-800',
    };
    return colors[status];
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Quote Management</h1>
          <p className="text-muted-foreground">
            Track and manage all your coating quotes
          </p>
        </div>
        
        <Button onClick={handleCreateNewQuote} className="gap-2">
          <Plus className="h-4 w-4" />
          New Quote
        </Button>
      </div>

      {/* Stats Cards */}
      <QuoteStats />

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search quotes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Select
                value={filters.status || 'all'}
                onValueChange={(value) => 
                  setFilters(prev => ({ 
                    ...prev, 
                    status: value === 'all' ? undefined : value as any 
                  }))
                }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>

              {(searchQuery || Object.keys(filters).length > 0) && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <QuotesTable
            quotes={quotes}
            loading={loading}
            pagination={pagination}
            onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
            onView={handleViewQuote}
            onGeneratePDF={handleGeneratePDF}
            onSend={handleSendQuote}
            onConvertToProject={handleConvertToProject}
            onDelete={handleDeleteQuote}
          />
        </CardContent>
      </Card>

      {/* Quote Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quote Details</DialogTitle>
            <DialogDescription>
              Complete quote information and project details
            </DialogDescription>
          </DialogHeader>
          {selectedQuote && (
            <QuoteDetails
              quote={selectedQuote}
              onGeneratePDF={() => handleGeneratePDF(selectedQuote)}
              onSend={() => handleSendQuote(selectedQuote)}
              onClose={() => setIsDetailsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Project Conversion Dialog */}
      <ProjectConversionDialog
        quote={quoteToConvert}
        open={isConversionDialogOpen}
        onOpenChange={setIsConversionDialogOpen}
        onConfirm={handleProjectConversion}
      />
    </div>
  );
}