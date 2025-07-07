'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Material } from '@/types/materials';
import { materialsService } from '@/lib/services/materials-service';
import { useToast } from '@/hooks/use-toast';

const materialSchema = z.object({
  product_code: z.string().min(1, 'Product code is required'),
  product_name: z.string().min(1, 'Product name is required'),
  manufacturer: z.enum(['NIPPON', 'JOTUN', 'KANSAI', 'DULUX', 'SKK', 'PROPAN', 'OTHER']),
  category: z.enum(['primer', 'intermediate', 'finish', 'thinner', 'additive', 'specialty']),
  product_type: z.string().min(1, 'Product type is required'),
  volume_solids: z.number().min(0).max(100),
  dft_recommended: z.number().min(1),
  packaging_sizes: z.string(),
  loss_factor_brush: z.number().min(0).max(100),
  loss_factor_spray: z.number().min(0).max(100),
  notes: z.string().optional(),
});

type MaterialFormData = z.infer<typeof materialSchema>;

interface MaterialFormProps {
  material?: Material | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function MaterialForm({ material, onSuccess, onCancel }: MaterialFormProps) {
  const { toast } = useToast();
  
  const form = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      product_code: material?.product_code || '',
      product_name: material?.product_name || '',
      manufacturer: material?.manufacturer || 'NIPPON',
      category: material?.category || 'primer',
      product_type: material?.product_type || '',
      volume_solids: material?.volume_solids || 100,
      dft_recommended: material?.dft_recommended || 50,
      packaging_sizes: material?.packaging_sizes.map(p => `${p.size}${p.unit === 'liter' ? 'L' : 'kg'}`).join(',') || '20L',
      loss_factor_brush: material?.loss_factor_brush || 15,
      loss_factor_spray: material?.loss_factor_spray || 30,
      notes: material?.notes || '',
    },
  });

  const onSubmit = async (data: MaterialFormData) => {
    try {
      // Parse packaging sizes
      const packagingSizes = data.packaging_sizes.split(',').map(size => {
        const match = size.trim().match(/(\d+(?:\.\d+)?)\s*(L|l|kg|KG)?/);
        if (match) {
          return {
            size: parseFloat(match[1]),
            unit: match[2]?.toLowerCase().includes('kg') ? 'kg' as const : 'liter' as const
          };
        }
        return { size: 20, unit: 'liter' as const };
      });

      const materialData: Partial<Material> = {
        ...data,
        packaging_sizes: packagingSizes,
        id: material?.id,
      };

      const { error } = await materialsService.upsertMaterial(materialData);
      
      if (error) {
        throw new Error(error);
      }

      toast({
        title: material ? "Material Updated" : "Material Created",
        description: `${data.product_name} has been saved successfully`,
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save material",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="product_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Code *</FormLabel>
                <FormControl>
                  <Input placeholder="EA-9200" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="product_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Epoxy Primer EA-9200" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="manufacturer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manufacturer *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select manufacturer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="NIPPON">NIPPON</SelectItem>
                    <SelectItem value="JOTUN">JOTUN</SelectItem>
                    <SelectItem value="KANSAI">KANSAI</SelectItem>
                    <SelectItem value="DULUX">DULUX</SelectItem>
                    <SelectItem value="SKK">SKK</SelectItem>
                    <SelectItem value="PROPAN">PROPAN</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="primer">Primer</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="finish">Finish</SelectItem>
                    <SelectItem value="thinner">Thinner</SelectItem>
                    <SelectItem value="additive">Additive</SelectItem>
                    <SelectItem value="specialty">Specialty</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="product_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Type *</FormLabel>
                <FormControl>
                  <Input placeholder="Epoxy, Polyurethane, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="volume_solids"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Volume Solids (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="65"
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dft_recommended"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recommended DFT (μm)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="75"
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="packaging_sizes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Packaging Sizes</FormLabel>
                <FormControl>
                  <Input placeholder="4L,20L" {...field} />
                </FormControl>
                <FormDescription>
                  Comma-separated sizes (e.g., 1L,4L,20L)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="loss_factor_brush"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loss Factor - Brush (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="15"
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="loss_factor_spray"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loss Factor - Spray (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="30"
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Additional notes or specifications..."
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {material ? 'Update Material' : 'Create Material'}
          </Button>
        </div>
      </form>
    </Form>
  );
}