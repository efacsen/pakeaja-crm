'use client';

import { FileDown, Send, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard as Card, GlassCardContent as CardContent, GlassCardDescription as CardDescription, GlassCardHeader as CardHeader, GlassCardTitle as CardTitle } from '@/components/ui/glass-card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  ProjectDetails,
  SurfaceMeasurement, 
  CoatingSystem, 
  CostBreakdown 
} from '@/types/calculator';
import { 
  formatCurrency, 
  formatArea,
  calculateTotalArea,
  calculateSurfaceArea 
} from '@/lib/calculator-utils';
import { format } from 'date-fns';
import { pdfService } from '@/lib/services/pdf-service';
import { quotesService } from '@/lib/services/quotes-service';
import { emailService } from '@/lib/services/email-service';
import { Quote } from '@/types/quotes';
import { useToast } from '@/hooks/use-toast';

interface ReviewProps {
  projectDetails: ProjectDetails;
  surfaces: SurfaceMeasurement[];
  system: CoatingSystem;
  costBreakdown: CostBreakdown;
  onBack: () => void;
  onSaveDraft: () => void;
  onGeneratePDF: () => void;
  onSendQuote: () => void;
}

export function Review({ 
  projectDetails, 
  surfaces, 
  system, 
  costBreakdown, 
  onBack,
  onSaveDraft,
  onGeneratePDF,
  onSendQuote
}: ReviewProps) {
  const totalArea = calculateTotalArea(surfaces);
  const { toast } = useToast();

  const handleGeneratePDF = async () => {
    try {
      // First save as quote to get quote number
      const { data: quote, error } = await quotesService.createQuote({
        project_name: projectDetails.projectName,
        client_name: projectDetails.clientName,
        client_email: projectDetails.clientEmail,
        client_phone: projectDetails.clientPhone,
        project_address: projectDetails.projectAddress,
        project_date: projectDetails.projectDate.toISOString(),
        calculator_data: {
          projectDetails,
          surfaces,
          selectedSystem: system,
          customProducts: [],
          laborRates: [],
          costBreakdown,
          status: 'draft',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        notes: projectDetails.notes,
      });

      if (error || !quote) {
        throw new Error(error || 'Failed to create quote');
      }

      // Generate PDF
      pdfService.generateQuotePDF(quote);
      
    } catch (error) {
      console.error('PDF generation error:', error);
      onGeneratePDF(); // Fallback to original handler
    }
  };

  const handleSendQuote = async () => {
    try {
      toast({
        title: "Sending Quote",
        description: "Preparing and sending your quote...",
      });

      // First save as quote
      const { data: quote, error } = await quotesService.createQuote({
        project_name: projectDetails.projectName,
        client_name: projectDetails.clientName,
        client_email: projectDetails.clientEmail,
        client_phone: projectDetails.clientPhone,
        project_address: projectDetails.projectAddress,
        project_date: projectDetails.projectDate.toISOString(),
        calculator_data: {
          projectDetails,
          surfaces,
          selectedSystem: system,
          customProducts: [],
          laborRates: [],
          costBreakdown,
          status: 'draft',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        notes: projectDetails.notes,
      });

      if (error || !quote) {
        throw new Error(error || 'Failed to create quote');
      }

      // Send email
      const emailResult = await emailService.sendQuote(quote);
      
      if (!emailResult.success) {
        throw new Error(emailResult.error || 'Failed to send email');
      }

      // Mark as sent
      await quotesService.sendQuote(quote.id);
      
      toast({
        title: "Quote Sent Successfully!",
        description: `Quote ${quote.quote_number} has been sent to ${quote.client_email}`,
      });
      
    } catch (error) {
      console.error('Send quote error:', error);
      toast({
        title: "Failed to Send Quote",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tinjau Penawaran / Review Quote</CardTitle>
          <CardDescription>
            Tinjau semua detail sebelum membuat atau mengirim penawaran
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Project Information */}
          <div>
            <h4 className="font-semibold mb-3">Informasi Proyek</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Nama Proyek:</span>
                <p className="font-medium">{projectDetails.projectName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Tanggal Proyek:</span>
                <p className="font-medium">{format(projectDetails.projectDate, 'PPP')}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Klien:</span>
                <p className="font-medium">{projectDetails.clientName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <p className="font-medium">{projectDetails.clientEmail}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Phone:</span>
                <p className="font-medium">{projectDetails.clientPhone}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Alamat:</span>
                <p className="font-medium">{projectDetails.projectAddress}</p>
              </div>
            </div>
            {projectDetails.notes && (
              <div className="mt-3">
                <span className="text-sm text-muted-foreground">Catatan:</span>
                <p className="text-sm mt-1">{projectDetails.notes}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Surface Details */}
          <div>
            <h4 className="font-semibold mb-3">Detail Permukaan</h4>
            <div className="rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-white/10 dark:bg-gray-900/30 backdrop-blur-sm">
                    <th className="text-left p-3">Permukaan</th>
                    <th className="text-left p-3">Tipe</th>
                    <th className="text-left p-3">Dimensi</th>
                    <th className="text-left p-3">Kondisi</th>
                    <th className="text-right p-3">Luas</th>
                  </tr>
                </thead>
                <tbody>
                  {surfaces.map((surface, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-3">{surface.name}</td>
                      <td className="p-3 capitalize">{surface.surfaceType}</td>
                      <td className="p-3">
                        {surface.length} × {surface.width} m
                        {surface.quantity > 1 && ` × ${surface.quantity}`}
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="capitalize">
                          {surface.condition}
                        </Badge>
                      </td>
                      <td className="p-3 text-right font-medium">
                        {formatArea(calculateSurfaceArea(surface))}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={4} className="p-3 font-semibold">Total Luas</td>
                    <td className="p-3 text-right font-bold">{formatArea(totalArea)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <Separator />

          {/* Coating System */}
          <div>
            <h4 className="font-semibold mb-3">Sistem Coating</h4>
            <div className="rounded-lg border border-white/20 dark:border-white/10 bg-white/5 dark:bg-gray-900/20 backdrop-blur-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium">{system.nameId || system.name}</h5>
                <div className="flex gap-2">
                  <Badge>{system.totalThickness} μm</Badge>
                  <Badge variant="outline">Garansi {system.warranty} tahun</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{system.descriptionId || system.description}</p>
              <div className="space-y-2">
                {system.products.map(({ product, coats, thickness }, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <div>
                      <span className="font-medium">{product.name}</span>
                      <span className="text-muted-foreground ml-2">
                        ({coats} lapisan, {thickness} μm)
                      </span>
                    </div>
                    <span>{product.category}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Cost Summary */}
          <div>
            <h4 className="font-semibold mb-3">Ringkasan Biaya</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Material</span>
                <span className="font-medium">{formatCurrency(costBreakdown.materials.totalMaterialCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tenaga Kerja</span>
                <span className="font-medium">{formatCurrency(costBreakdown.labor.totalLaborCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Peralatan</span>
                <span className="font-medium">{formatCurrency(costBreakdown.equipment.totalEquipmentCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Tambahan</span>
                <span className="font-medium">
                  {formatCurrency(costBreakdown.additionalCosts.reduce((sum, c) => sum + c.cost, 0))}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Mobilisasi</span>
                <span className="font-medium">{formatCurrency(costBreakdown.mobilizationCost)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">{formatCurrency(costBreakdown.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Overhead ({costBreakdown.overhead}%)</span>
                <span>{formatCurrency(costBreakdown.subtotal * (costBreakdown.overhead / 100))}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Keuntungan ({costBreakdown.profit}%)</span>
                <span>{formatCurrency(costBreakdown.subtotal * (costBreakdown.profit / 100))}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>PPN ({costBreakdown.ppn}%)</span>
                <span>
                  {formatCurrency(
                    (costBreakdown.subtotal + 
                     costBreakdown.subtotal * (costBreakdown.overhead / 100) + 
                     costBreakdown.subtotal * (costBreakdown.profit / 100)) * 
                    (costBreakdown.ppn / 100)
                  )}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Biaya Proyek</span>
                <span className="text-primary">{formatCurrency(costBreakdown.totalCost)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Biaya per m²</span>
                <span>{formatCurrency(costBreakdown.totalCost / totalArea)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Kembali
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onSaveDraft}>
            <Save className="h-4 w-4 mr-2" />
            Simpan Draft
          </Button>
          <Button variant="outline" onClick={handleGeneratePDF}>
            <FileDown className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button onClick={handleSendQuote}>
            <Send className="h-4 w-4 mr-2" />
            Send Quote
          </Button>
        </div>
      </div>
    </div>
  );
}