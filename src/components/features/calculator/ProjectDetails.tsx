'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CompanyAutocomplete } from '@/components/ui/company-autocomplete';
import { ContactAutocomplete } from '@/components/ui/contact-autocomplete';
import { companyService } from '@/lib/services/company-service';
import { useToast } from '@/hooks/use-toast';
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
import { cn } from '@/lib/utils';
import { ProjectDetails as ProjectDetailsType } from '@/types/calculator';

const projectDetailsSchema = z.object({
  projectName: z.string().min(1, 'Nama proyek wajib diisi'),
  companyId: z.string().min(1, 'Perusahaan wajib dipilih'),
  companyName: z.string().min(1, 'Nama perusahaan wajib diisi'),
  contactId: z.string().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().optional().refine(
    (val) => !val || z.string().email().safeParse(val).success,
    'Format email tidak valid'
  ),
  contactPhone: z.string().optional(),
  projectAddress: z.string().optional(),
  projectDate: z.date().optional(),
  notes: z.string().optional(),
});

interface ProjectDetailsProps {
  data: ProjectDetailsType | null;
  onNext: (data: ProjectDetailsType) => void;
}

export function ProjectDetails({ data, onNext }: ProjectDetailsProps) {
  const { toast } = useToast();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [selectedContactId, setSelectedContactId] = useState<string>('');

  const form = useForm<z.infer<typeof projectDetailsSchema>>({
    resolver: zodResolver(projectDetailsSchema),
    defaultValues: {
      projectName: data?.projectName || '',
      companyId: '',
      companyName: data?.clientName || '',
      contactId: '',
      contactName: '',
      contactEmail: data?.clientEmail || '',
      contactPhone: data?.clientPhone || '',
      projectAddress: data?.projectAddress || '',
      projectDate: data?.projectDate || undefined,
      notes: data?.notes || '',
    },
  });

  const onSubmit = (values: z.infer<typeof projectDetailsSchema>) => {
    // Map the new fields to the expected format
    const mappedData = {
      projectName: values.projectName,
      clientName: values.companyName,
      clientEmail: values.contactEmail,
      clientPhone: values.contactPhone,
      projectAddress: values.projectAddress,
      projectDate: values.projectDate,
      notes: values.notes,
    };
    onNext(mappedData);
  };

  const handleCompanySelect = async (company: { id: string; name: string; city?: string }) => {
    setSelectedCompanyId(company.id);
    form.setValue('companyId', company.id);
    form.setValue('companyName', company.name);
    // Reset contact when company changes
    setSelectedContactId('');
    form.setValue('contactId', '');
    form.setValue('contactName', '');
    form.setValue('contactEmail', '');
    form.setValue('contactPhone', '');
  };

  const handleContactSelect = (contact: any) => {
    setSelectedContactId(contact.id);
    form.setValue('contactId', contact.id);
    form.setValue('contactName', contact.name);
    form.setValue('contactEmail', contact.email || '');
    form.setValue('contactPhone', contact.mobile_phone || '');
  };

  const handleCreateCompany = async (name: string) => {
    const companyId = await companyService.getOrCreateCompany(name);
    if (companyId) {
      setSelectedCompanyId(companyId);
      form.setValue('companyId', companyId);
      form.setValue('companyName', name);
      toast({
        title: 'Perusahaan berhasil ditambahkan',
        description: `${name} telah ditambahkan ke database.`,
      });
    }
  };

  const handleCreateContact = async (name: string) => {
    if (!selectedCompanyId) return;
    
    const contact = await companyService.createContact({
      company_id: selectedCompanyId,
      name,
      is_primary: false,
    });
    
    if (contact) {
      handleContactSelect(contact);
      toast({
        title: 'Kontak berhasil ditambahkan',
        description: `${name} telah ditambahkan sebagai kontak.`,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detail Proyek / Project Details</CardTitle>
        <CardDescription>
          Masukkan informasi dasar tentang proyek coating dan detail klien. 
          <span className="text-red-500">*</span> menandakan field wajib diisi.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Proyek / Project Name <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Coating Lantai Gudang" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Proyek / Project Date</FormLabel>
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
                              <span>Pilih tanggal (opsional)</span>
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
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Perusahaan / Company Name <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <CompanyAutocomplete
                        value={selectedCompanyId}
                        onSelect={handleCompanySelect}
                        onCreate={handleCreateCompany}
                        placeholder="Ketik atau pilih perusahaan..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person</FormLabel>
                    <FormControl>
                      <ContactAutocomplete
                        companyId={selectedCompanyId}
                        value={selectedContactId}
                        onSelect={handleContactSelect}
                        onCreate={handleCreateContact}
                        placeholder="Pilih atau tambah contact person..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="email@example.com" 
                        {...field} 
                        disabled={!!selectedContactId}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telepon / Phone</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel" 
                        placeholder="08123456789" 
                        {...field} 
                        disabled={!!selectedContactId}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat Proyek / Project Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Jl. Industri No. 123, Jakarta" {...field} />
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
                  <FormLabel>Catatan Tambahan / Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Persyaratan khusus atau catatan tentang proyek..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Sertakan informasi yang relevan tentang lingkup proyek atau persyaratan klien
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" size="lg">
                Langkah Berikutnya
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}