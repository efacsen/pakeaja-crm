'use client';

import { useState, useEffect } from 'react';
import { Check, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProjectDetails } from './ProjectDetails';
import { SurfaceMeasurements } from './SurfaceMeasurements';
import { CoatingSelectionWithDatabase } from './CoatingSelectionWithDatabase';
import { CostCalculation } from './CostCalculation';
import { Review } from './Review';
import {
  ProjectDetails as ProjectDetailsType,
  SurfaceMeasurement,
  CoatingSystem,
  CostBreakdown,
  CalculatorFormData,
  CALCULATOR_STEPS,
} from '@/types/calculator';
import { useToast } from '@/hooks/use-toast';
import { quotesService } from '@/lib/services/quotes-service';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { calculationDb } from '@/lib/db/mock-db';

export function CoatingCalculator() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const calculationId = searchParams.get('id');
  const customerId = searchParams.get('customerId');
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CalculatorFormData>>({
    projectDetails: undefined,
    surfaces: [],
    selectedSystem: null,
    costBreakdown: null,
  });
  const [loading, setLoading] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(calculationId);

  // Load existing calculation if ID is provided
  useEffect(() => {
    if (calculationId) {
      loadCalculation(calculationId);
    }
  }, [calculationId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadCalculation = async (id: string) => {
    try {
      setLoading(true);
      const calculation = await calculationDb.getById(id);
      if (calculation && calculation.calculation_data) {
        const data = calculation.calculation_data as Partial<CalculatorFormData>;
        setFormData(data);
        // Navigate to the last step that has data
        if (data.costBreakdown) {
          setCurrentStep(5);
        } else if (data.selectedSystem) {
          setCurrentStep(4);
        } else if (data.surfaces && data.surfaces.length > 0) {
          setCurrentStep(3);
        } else if (data.projectDetails) {
          setCurrentStep(2);
        }
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to load calculation',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const steps = CALCULATOR_STEPS.map((step) => ({
    ...step,
    isComplete: step.id < currentStep,
    isCurrent: step.id === currentStep,
  }));

  const handleProjectDetailsNext = (data: ProjectDetailsType) => {
    setFormData({ ...formData, projectDetails: data });
    setCurrentStep(2);
  };

  const handleSurfaceMeasurementsNext = (data: SurfaceMeasurement[]) => {
    setFormData({ ...formData, surfaces: data });
    setCurrentStep(3);
  };

  const handleCoatingSelectionNext = (data: CoatingSystem) => {
    setFormData({ ...formData, selectedSystem: data });
    setCurrentStep(4);
  };

  const handleCostCalculationNext = (data: CostBreakdown) => {
    setFormData({ ...formData, costBreakdown: data });
    setCurrentStep(5);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSaveDraft = async () => {
    if (!formData.projectDetails) {
      toast({
        title: "Cannot Save",
        description: "Please fill in project details first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const calculatorData: CalculatorFormData = {
        projectDetails: formData.projectDetails,
        surfaces: formData.surfaces || [],
        selectedSystem: formData.selectedSystem || null,
        customProducts: [],
        laborRates: [],
        costBreakdown: formData.costBreakdown || null,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const { data, error } = await quotesService.createQuote({
        project_name: formData.projectDetails.projectName,
        client_name: formData.projectDetails.clientName,
        client_email: formData.projectDetails.clientEmail,
        client_phone: formData.projectDetails.clientPhone,
        project_address: formData.projectDetails.projectAddress,
        project_date: formData.projectDetails.projectDate.toISOString(),
        calculator_data: calculatorData,
        notes: formData.projectDetails.notes,
      });

      if (error) {
        throw new Error(error);
      }

      toast({
        title: "Draft Saved",
        description: `Quote ${data?.quote_number} has been saved as a draft.`,
      });

    } catch (error) {
      console.error('Save draft error:', error);
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGeneratePDF = async () => {
    toast({
      title: "Generating PDF",
      description: "Your quote PDF is being generated...",
    });
  };

  const handleSendQuote = async () => {
    toast({
      title: "Quote Sent",
      description: "The quote has been sent to the client.",
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with Save Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kalkulator Coating</h1>
        {formData.projectDetails && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveDraft}
          >
            <Save className="h-4 w-4 mr-2" />
            Simpan Draft
          </Button>
        )}
      </div>

      {/* Header with Save Draft Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Coating Calculator</h1>
          <p className="text-muted-foreground">Step {currentStep} of {steps.length}</p>
        </div>
        {formData.projectDetails && (
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
        )}
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-between">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className="relative flex-1">
                {stepIdx !== steps.length - 1 && (
                  <div
                    className={cn(
                      'absolute top-4 w-full h-0.5 -translate-y-1/2',
                      step.isComplete ? 'bg-primary' : 'bg-muted'
                    )}
                    style={{ left: '50%' }}
                  />
                )}
                <div className="relative flex flex-col items-center">
                  <span
                    className={cn(
                      'h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                      step.isComplete
                        ? 'bg-primary text-primary-foreground'
                        : step.isCurrent
                        ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {step.isComplete ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      step.id
                    )}
                  </span>
                  <span className="mt-2 text-xs font-medium text-center">
                    {step.title}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Step Content */}
      <div className="bg-background">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        {!loading && (
          <>
        {currentStep === 1 && (
          <ProjectDetails
            data={formData.projectDetails || null}
            onNext={handleProjectDetailsNext}
          />
        )}
        
        {currentStep === 2 && (
          <SurfaceMeasurements
            data={formData.surfaces || []}
            onNext={handleSurfaceMeasurementsNext}
            onBack={handleBack}
          />
        )}
        
        {currentStep === 3 && (
          <CoatingSelectionWithDatabase
            data={formData.selectedSystem || null}
            onNext={handleCoatingSelectionNext}
            onBack={handleBack}
          />
        )}
        
        {currentStep === 4 && formData.surfaces && formData.selectedSystem && (
          <CostCalculation
            surfaces={formData.surfaces}
            system={formData.selectedSystem}
            data={formData.costBreakdown || null}
            onNext={handleCostCalculationNext}
            onBack={handleBack}
          />
        )}
        
        {currentStep === 5 && 
          formData.projectDetails && 
          formData.surfaces && 
          formData.selectedSystem && 
          formData.costBreakdown && (
          <Review
            projectDetails={formData.projectDetails}
            surfaces={formData.surfaces}
            system={formData.selectedSystem}
            costBreakdown={formData.costBreakdown}
            onBack={handleBack}
            onSaveDraft={handleSaveDraft}
            onGeneratePDF={handleGeneratePDF}
            onSendQuote={handleSendQuote}
          />
        )}
        </>
        )}
      </div>
    </div>
  );
}