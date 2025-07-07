'use client';

import { useState } from 'react';
import { 
  Upload, 
  FileSpreadsheet, 
  Download, 
  AlertCircle, 
  CheckCircle,
  X,
  FileText,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { materialsService } from '@/lib/services/materials-service';
import { MaterialImportData, ImportError } from '@/types/materials';
import * as XLSX from 'xlsx';

interface MaterialImportProps {
  onSuccess?: () => void;
}

export function MaterialImport({ onSuccess }: MaterialImportProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [previewData, setPreviewData] = useState<MaterialImportData[]>([]);
  const [importErrors, setImportErrors] = useState<ImportError[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [importResult, setImportResult] = useState<{
    imported: number;
    updated: number;
    errors: number;
  } | null>(null);

  const { toast } = useToast();

  // Download template
  const downloadTemplate = () => {
    const template = [
      {
        product_code: 'EA-9200',
        product_name: 'Epoxy Primer EA-9200',
        manufacturer: 'NIPPON',
        category: 'primer',
        product_type: 'Epoxy',
        volume_solids: 65,
        spreading_rate_theoretical: 8.67,
        dft_recommended: 75,
        packaging_sizes: '4L,20L',
        loss_factor_brush: 15,
        loss_factor_spray: 30,
        pot_life: '8 hours at 25°C',
        touch_dry: 120,
        hard_dry: 8,
        recoat_min: 8,
        recoat_max: 7,
        mix_ratio: '4:1 by volume',
        thinner_type: 'Thinner 1260',
        price_per_liter: 125000
      },
      {
        product_code: 'PU-5500',
        product_name: 'Polyurethane Topcoat PU-5500',
        manufacturer: 'JOTUN',
        category: 'finish',
        product_type: 'Polyurethane',
        volume_solids: 55,
        spreading_rate_theoretical: 11,
        dft_recommended: 50,
        packaging_sizes: '5L,20L',
        loss_factor_brush: 15,
        loss_factor_spray: 30,
        pot_life: '6 hours at 25°C',
        touch_dry: 60,
        hard_dry: 6,
        recoat_min: 6,
        recoat_max: 30,
        mix_ratio: '3:1 by volume',
        thinner_type: 'Thinner 17',
        price_per_liter: 185000
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Materials');
    
    // Add column widths
    ws['!cols'] = [
      { wch: 15 }, // product_code
      { wch: 30 }, // product_name
      { wch: 15 }, // manufacturer
      { wch: 15 }, // category
      { wch: 15 }, // product_type
      { wch: 15 }, // volume_solids
      { wch: 20 }, // spreading_rate
      { wch: 15 }, // dft_recommended
      { wch: 15 }, // packaging_sizes
      { wch: 15 }, // loss_factor_brush
      { wch: 15 }, // loss_factor_spray
      { wch: 20 }, // pot_life
      { wch: 10 }, // touch_dry
      { wch: 10 }, // hard_dry
      { wch: 10 }, // recoat_min
      { wch: 10 }, // recoat_max
      { wch: 20 }, // mix_ratio
      { wch: 15 }, // thinner_type
      { wch: 15 }, // price_per_liter
    ];

    XLSX.writeFile(wb, 'material_import_template.xlsx');
    
    toast({
      title: "Template Downloaded",
      description: "Use this template to prepare your material data for import",
    });
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportErrors([]);
    setPreviewData([]);
    
    try {
      const data = await readFile(file);
      if (data.length === 0) {
        toast({
          title: "No Data Found",
          description: "The file appears to be empty or incorrectly formatted",
          variant: "destructive",
        });
        return;
      }

      setPreviewData(data);
      setShowPreview(true);
    } catch (error) {
      toast({
        title: "Error Reading File",
        description: error instanceof Error ? error.message : "Failed to read file",
        variant: "destructive",
      });
    }
  };

  // Read Excel/CSV file
  const readFile = async (file: File): Promise<MaterialImportData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          let jsonData: any[] = [];

          if (file.name.endsWith('.csv')) {
            // Parse CSV
            const text = data as string;
            const lines = text.split('\n').filter(line => line.trim());
            if (lines.length < 2) {
              throw new Error('CSV file must have headers and at least one data row');
            }

            const headers = lines[0].split(',').map(h => h.trim());
            jsonData = lines.slice(1).map(line => {
              const values = line.split(',').map(v => v.trim());
              const obj: any = {};
              headers.forEach((header, index) => {
                obj[header] = values[index] || '';
              });
              return obj;
            });
          } else {
            // Parse Excel
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            jsonData = XLSX.utils.sheet_to_json(worksheet);
          }

          // Convert and validate data
          const materials: MaterialImportData[] = jsonData.map(row => ({
            product_code: String(row.product_code || ''),
            product_name: String(row.product_name || ''),
            manufacturer: String(row.manufacturer || ''),
            category: String(row.category || ''),
            product_type: String(row.product_type || ''),
            volume_solids: Number(row.volume_solids) || 100,
            spreading_rate_theoretical: Number(row.spreading_rate_theoretical) || 0,
            dft_recommended: Number(row.dft_recommended) || 50,
            packaging_sizes: String(row.packaging_sizes || '20L'),
            loss_factor_brush: Number(row.loss_factor_brush) || 15,
            loss_factor_spray: Number(row.loss_factor_spray) || 30,
            pot_life: String(row.pot_life || ''),
            touch_dry: Number(row.touch_dry) || undefined,
            hard_dry: Number(row.hard_dry) || undefined,
            recoat_min: Number(row.recoat_min) || undefined,
            recoat_max: Number(row.recoat_max) || undefined,
            mix_ratio: String(row.mix_ratio || ''),
            thinner_type: String(row.thinner_type || ''),
            price_per_liter: Number(row.price_per_liter) || undefined,
          }));

          resolve(materials);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));

      if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
      } else {
        reader.readAsBinaryString(file);
      }
    });
  };

  // Import materials
  const handleImport = async () => {
    setIsImporting(true);
    setImportErrors([]);
    
    try {
      const result = await materialsService.importMaterials(previewData);
      
      setImportResult({
        imported: result.imported,
        updated: result.updated,
        errors: result.errors.length
      });
      
      setImportErrors(result.errors);
      setShowPreview(false);
      setShowResults(true);
      
      if (result.success) {
        toast({
          title: "Import Successful",
          description: `Imported ${result.imported} new materials and updated ${result.updated} existing materials`,
        });
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast({
          title: "Import Completed with Errors",
          description: `${result.imported + result.updated} materials processed, ${result.errors.length} errors`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Import Materials Database</CardTitle>
          <CardDescription>
            Upload Excel (.xlsx) or CSV file with material data. Download template for correct format.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
            
            <div className="flex-1">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button variant="default" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </span>
                </Button>
              </label>
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>File Format Requirements</AlertTitle>
            <AlertDescription className="space-y-2 mt-2">
              <div>• First row must contain column headers</div>
              <div>• Required fields: product_code, product_name, manufacturer</div>
              <div>• Numeric fields: volume_solids, dft_recommended, spreading_rate_theoretical</div>
              <div>• Time in minutes for touch_dry, hours for hard_dry/recoat_min, days for recoat_max</div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Preview Import Data</DialogTitle>
            <DialogDescription>
              Review the data before importing. {previewData.length} materials found.
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-auto max-h-[60vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Code</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>VS%</TableHead>
                  <TableHead>DFT</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.slice(0, 20).map((material, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-sm">
                      {material.product_code}
                    </TableCell>
                    <TableCell>{material.product_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{material.manufacturer}</Badge>
                    </TableCell>
                    <TableCell>{material.category}</TableCell>
                    <TableCell>{material.product_type}</TableCell>
                    <TableCell>{material.volume_solids}%</TableCell>
                    <TableCell>{material.dft_recommended}μm</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {previewData.length > 20 && (
              <div className="text-center py-4 text-muted-foreground">
                ... and {previewData.length - 20} more materials
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={isImporting}>
              {isImporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Materials
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Results Dialog */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Results</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {importResult && (
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-green-600">
                      {importResult.imported}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Materials Imported
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-blue-600">
                      {importResult.updated}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Materials Updated
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-red-600">
                      {importResult.errors}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Errors
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {importErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Import Errors</AlertTitle>
                <AlertDescription>
                  <div className="mt-2 space-y-1 max-h-48 overflow-auto">
                    {importErrors.map((error, index) => (
                      <div key={index} className="text-sm">
                        Row {error.row}: {error.message}
                      </div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="flex justify-end mt-4">
            <Button onClick={() => {
              setShowResults(false);
              setPreviewData([]);
              setImportErrors([]);
              setImportResult(null);
            }}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}