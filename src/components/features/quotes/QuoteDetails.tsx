'use client';

import { FileDown, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Quote } from '@/types/quotes';
import { 
  formatCurrency, 
  formatArea,
  calculateSurfaceArea 
} from '@/lib/calculator-utils';
import { format } from 'date-fns';

interface QuoteDetailsProps {
  quote: Quote;
  onGeneratePDF: () => void;
  onSend: () => void;
  onClose: () => void;
}

export function QuoteDetails({ quote, onGeneratePDF, onSend, onClose }: QuoteDetailsProps) {
  const getStatusBadge = (status: Quote['status']) => {
    const variants = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      expired: 'bg-orange-100 text-orange-800',
    };

    return (
      <Badge variant="secondary" className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">Quote {quote.quote_number}</h3>
          <div className="flex items-center gap-2 mt-1">
            {getStatusBadge(quote.status)}
            <span className="text-sm text-muted-foreground">
              Created {format(new Date(quote.created_at), 'PPP')}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onGeneratePDF} size="sm">
            <FileDown className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          {quote.status !== 'sent' && (
            <Button onClick={onSend} size="sm">
              <Send className="h-4 w-4 mr-2" />
              Send Quote
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Project Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Project Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm text-muted-foreground">Project Name:</span>
              <p className="font-medium">{quote.project_name}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Project Date:</span>
              <p className="font-medium">{format(new Date(quote.project_date), 'PPP')}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Address:</span>
              <p className="font-medium">{quote.project_address}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Total Area:</span>
              <p className="font-medium">{formatArea(quote.total_area)}</p>
            </div>
            {quote.notes && (
              <div>
                <span className="text-sm text-muted-foreground">Notes:</span>
                <p className="font-medium">{quote.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm text-muted-foreground">Name:</span>
              <p className="font-medium">{quote.client_name}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Email:</span>
              <p className="font-medium">{quote.client_email}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Phone:</span>
              <p className="font-medium">{quote.client_phone}</p>
            </div>
            {quote.sent_at && (
              <div>
                <span className="text-sm text-muted-foreground">Sent:</span>
                <p className="font-medium">{format(new Date(quote.sent_at), 'PPP')}</p>
              </div>
            )}
            {quote.expires_at && (
              <div>
                <span className="text-sm text-muted-foreground">Expires:</span>
                <p className="font-medium">{format(new Date(quote.expires_at), 'PPP')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Surface Details */}
      {quote.calculator_data.surfaces && quote.calculator_data.surfaces.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Surface Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3">Surface</th>
                    <th className="text-left p-3">Type</th>
                    <th className="text-left p-3">Dimensions</th>
                    <th className="text-left p-3">Condition</th>
                    <th className="text-right p-3">Area</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.calculator_data.surfaces.map((surface, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-3">{surface.name}</td>
                      <td className="p-3 capitalize">{surface.surfaceType}</td>
                      <td className="p-3">
                        {surface.length} × {surface.width} ft
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
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coating System */}
      {quote.calculator_data.selectedSystem && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Coating System</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{quote.calculator_data.selectedSystem.name}</h4>
                <div className="flex gap-2">
                  <Badge>{quote.calculator_data.selectedSystem.totalThickness} mils</Badge>
                  <Badge variant="outline">{quote.calculator_data.selectedSystem.warranty} year warranty</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {quote.calculator_data.selectedSystem.description}
              </p>
              <div className="space-y-2">
                {quote.calculator_data.selectedSystem.products.map(({ product, coats, thickness }, idx) => (
                  <div key={idx} className="flex justify-between text-sm border-l-2 border-primary/20 pl-3">
                    <div>
                      <span className="font-medium">{product.name}</span>
                      <span className="text-muted-foreground ml-2">
                        ({coats} coat{coats > 1 ? 's' : ''}, {thickness} mils)
                      </span>
                    </div>
                    <span className="capitalize">{product.category}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cost Summary */}
      {quote.calculator_data.costBreakdown && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cost Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Materials</span>
                <span className="font-medium">
                  {formatCurrency(quote.calculator_data.costBreakdown.materials.totalMaterialCost)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Labor</span>
                <span className="font-medium">
                  {formatCurrency(quote.calculator_data.costBreakdown.labor.totalLaborCost)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Equipment</span>
                <span className="font-medium">
                  {formatCurrency(quote.calculator_data.costBreakdown.equipment.totalEquipmentCost)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Additional Costs</span>
                <span className="font-medium">
                  {formatCurrency(
                    quote.calculator_data.costBreakdown.additionalCosts.reduce((sum, c) => sum + c.cost, 0)
                  )}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">
                  {formatCurrency(quote.calculator_data.costBreakdown.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Overhead ({quote.calculator_data.costBreakdown.overhead}%)</span>
                <span>
                  {formatCurrency(
                    quote.calculator_data.costBreakdown.subtotal * 
                    (quote.calculator_data.costBreakdown.overhead / 100)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Profit ({quote.calculator_data.costBreakdown.profit}%)</span>
                <span>
                  {formatCurrency(
                    quote.calculator_data.costBreakdown.subtotal * 
                    (quote.calculator_data.costBreakdown.profit / 100)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Tax ({quote.calculator_data.costBreakdown.tax}%)</span>
                <span>
                  {formatCurrency(
                    (quote.calculator_data.costBreakdown.subtotal + 
                     quote.calculator_data.costBreakdown.subtotal * (quote.calculator_data.costBreakdown.overhead / 100) + 
                     quote.calculator_data.costBreakdown.subtotal * (quote.calculator_data.costBreakdown.profit / 100)) * 
                    (quote.calculator_data.costBreakdown.tax / 100)
                  )}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Project Cost</span>
                <span className="text-primary">{formatCurrency(quote.total_cost)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Cost per sq ft</span>
                <span>{formatCurrency(quote.cost_per_sqft)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}