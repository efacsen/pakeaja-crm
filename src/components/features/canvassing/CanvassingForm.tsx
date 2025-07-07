'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Camera, 
  MapPin, 
  Calendar,
  Phone,
  Mail,
  Building,
  User,
  Briefcase,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  Wifi,
  WifiOff,
  Upload,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CompanyAutocomplete } from '@/components/ui/company-autocomplete';
import { ContactAutocomplete } from '@/components/ui/contact-autocomplete';
import { companyService } from '@/lib/services/company-service';
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
import { useToast } from '@/hooks/use-toast';
import { CreateCanvassingReportRequest } from '@/types/canvassing';
import { canvassingService } from '@/lib/services/service-factory';
import { formatCurrency } from '@/lib/calculator-utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const canvassingSchema = z.object({
  company_id: z.string().min(1, 'Perusahaan wajib dipilih'),
  company_name: z.string().min(1, 'Nama perusahaan wajib diisi'),
  contact_id: z.string().optional(),
  contact_person: z.string().min(1, 'Nama kontak wajib diisi'),
  contact_position: z.string().optional(),
  contact_phone: z.string().optional(),
  contact_email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  company_address: z.string().optional(),
  visit_date: z.string().min(1, 'Tanggal kunjungan wajib diisi'),
  visit_outcome: z.enum(['interested', 'not_interested', 'follow_up_needed', 'already_customer', 'competitor_locked']),
  potential_type: z.enum(['area', 'materials', 'value']),
  potential_area: z.number().optional(),
  potential_materials: z.string().optional(),
  potential_value: z.number().optional(),
  project_segment: z.enum(['decorative', 'floor', 'marine', 'protective', 'steel', 'waterproofing', 'others']),
  last_communication_date: z.string().optional(),
  next_action: z.enum(['call', 'visit', 'send_proposal', 'send_sample', 'technical_presentation', 'negotiation', 'other']).optional(),
  next_action_date: z.string().optional(),
  next_action_notes: z.string().optional(),
  general_notes: z.string().optional(),
});

type CanvassingFormData = z.infer<typeof canvassingSchema>;

interface CanvassingFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CanvassingForm({ onSuccess, onCancel }: CanvassingFormProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [selectedContactId, setSelectedContactId] = useState<string>('');

  const { toast } = useToast();

  const form = useForm<CanvassingFormData>({
    resolver: zodResolver(canvassingSchema),
    defaultValues: {
      visit_date: format(new Date(), 'yyyy-MM-dd'),
      visit_outcome: 'interested',
      potential_type: 'value',
      project_segment: 'protective',
    },
  });

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Get current location
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsGettingLocation(false);
          toast({
            title: "Lokasi Berhasil Didapat",
            description: "GPS koordinat telah tersimpan",
          });
        },
        (error) => {
          setIsGettingLocation(false);
          toast({
            title: "Gagal Mendapat Lokasi",
            description: "Pastikan GPS aktif dan berikan izin lokasi",
            variant: "destructive",
          });
        }
      );
    }
  };

  // Handle photo capture/selection
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + photos.length > 5) {
      toast({
        title: "Terlalu Banyak Foto",
        description: "Maksimal 5 foto per laporan",
        variant: "destructive",
      });
      return;
    }

    setPhotos([...photos, ...files]);

    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPhotoPreview([...photoPreview, ...newPreviews]);
  };

  // Remove photo
  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    const newPreviews = photoPreview.filter((_, i) => i !== index);
    
    // Revoke the URL to free memory
    URL.revokeObjectURL(photoPreview[index]);
    
    setPhotos(newPhotos);
    setPhotoPreview(newPreviews);
  };

  // Handle form submission
  const onSubmit = async (data: CanvassingFormData) => {
    setIsSubmitting(true);

    try {
      const requestData: CreateCanvassingReportRequest = {
        ...data,
        photos,
        gps_latitude: location?.lat,
        gps_longitude: location?.lng,
        priority: 'medium' as const, // Default priority
      };

      const { data: report, error } = await canvassingService.createReport(
        requestData,
        'demo-user-123',
        'Demo Sales Rep',
        !isOnline
      );

      if (error) {
        throw new Error(error);
      }

      toast({
        title: isOnline ? "Laporan Berhasil Dikirim" : "Laporan Tersimpan Offline",
        description: isOnline 
          ? "Laporan canvassing telah berhasil dikirim" 
          : "Laporan akan dikirim saat koneksi tersedia",
      });

      // Reset form
      form.reset();
      setPhotos([]);
      setPhotoPreview([]);
      setLocation(null);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Gagal Menyimpan Laporan",
        description: error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const visitOutcomeOptions = [
    { value: 'interested', label: 'Tertarik' },
    { value: 'not_interested', label: 'Tidak Tertarik' },
    { value: 'follow_up_needed', label: 'Perlu Follow Up' },
    { value: 'already_customer', label: 'Sudah Customer' },
    { value: 'competitor_locked', label: 'Terikat Kompetitor' },
  ];

  const projectSegmentOptions = [
    { value: 'decorative', label: 'Decorative' },
    { value: 'floor', label: 'Floor Coatings' },
    { value: 'marine', label: 'Marine Coatings' },
    { value: 'protective', label: 'Protective Coatings' },
    { value: 'steel', label: 'Steel Plate/Profile' },
    { value: 'waterproofing', label: 'Waterproofing' },
    { value: 'others', label: 'Lainnya' },
  ];

  const nextActionOptions = [
    { value: 'call', label: 'Telepon' },
    { value: 'visit', label: 'Kunjungan' },
    { value: 'send_proposal', label: 'Kirim Proposal' },
    { value: 'send_sample', label: 'Kirim Sample' },
    { value: 'technical_presentation', label: 'Presentasi Teknis' },
    { value: 'negotiation', label: 'Negosiasi' },
    { value: 'other', label: 'Lainnya' },
  ];

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted rounded-lg">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <>
              <Wifi className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Online</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Offline Mode</span>
            </>
          )}
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
        >
          <MapPin className="h-4 w-4 mr-2" />
          {location ? 'GPS OK' : 'Get GPS'}
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Informasi Perusahaan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Perusahaan <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <CompanyAutocomplete
                        value={selectedCompanyId}
                        onSelect={(company) => {
                          setSelectedCompanyId(company.id);
                          form.setValue('company_id', company.id);
                          form.setValue('company_name', company.name);
                          form.setValue('company_address', company.city || '');
                          // Reset contact when company changes
                          setSelectedContactId('');
                          form.setValue('contact_id', '');
                          form.setValue('contact_person', '');
                          form.setValue('contact_position', '');
                          form.setValue('contact_email', '');
                          form.setValue('contact_phone', '');
                        }}
                        onCreate={async (name) => {
                          const companyId = await companyService.getOrCreateCompany(name);
                          if (companyId) {
                            setSelectedCompanyId(companyId);
                            form.setValue('company_id', companyId);
                            form.setValue('company_name', name);
                            toast({
                              title: 'Perusahaan berhasil ditambahkan',
                              description: `${name} telah ditambahkan ke database.`,
                            });
                          }
                        }}
                        placeholder="Ketik atau pilih perusahaan..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Jl. Industri No. 123, Jakarta"
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informasi Kontak
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contact_person"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <ContactAutocomplete
                          companyId={selectedCompanyId}
                          value={selectedContactId}
                          onSelect={(contact) => {
                            setSelectedContactId(contact.id);
                            form.setValue('contact_id', contact.id);
                            form.setValue('contact_person', contact.name);
                            form.setValue('contact_position', contact.position || '');
                            form.setValue('contact_email', contact.email || '');
                            form.setValue('contact_phone', contact.mobile_phone || '');
                          }}
                          onCreate={async (name) => {
                            if (!selectedCompanyId) return;
                            const contact = await companyService.createContact({
                              company_id: selectedCompanyId,
                              name,
                              is_primary: false,
                            });
                            if (contact) {
                              setSelectedContactId(contact.id);
                              form.setValue('contact_id', contact.id);
                              form.setValue('contact_person', contact.name);
                              toast({
                                title: 'Kontak berhasil ditambahkan',
                                description: `${name} telah ditambahkan sebagai kontak.`,
                              });
                            }
                          }}
                          placeholder="Pilih atau tambah contact person..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact_position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jabatan</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Manager Purchasing" 
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
                  name="contact_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No. Telepon</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="0812-3456-7890" 
                            className="pl-10"
                            {...field} 
                            disabled={!!selectedContactId}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type="email"
                            placeholder="budi@example.co.id" 
                            className="pl-10"
                            {...field} 
                            disabled={!!selectedContactId}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Visit Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Detail Kunjungan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="visit_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Kunjungan *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="visit_outcome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hasil Kunjungan *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih hasil" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {visitOutcomeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Project Potential */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Potensi Proyek
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="project_segment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Segmen Proyek *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih segmen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projectSegmentOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="potential_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipe Potensi *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tipe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="area">Luas Area (m²)</SelectItem>
                        <SelectItem value="materials">Material</SelectItem>
                        <SelectItem value="value">Nilai Proyek (Rp)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch('potential_type') === 'area' && (
                <FormField
                  control={form.control}
                  name="potential_area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Luas Area (m²)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="1000"
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {form.watch('potential_type') === 'materials' && (
                <FormField
                  control={form.control}
                  name="potential_materials"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi Material</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Contoh: 200 liter primer epoxy, 150 liter topcoat PU"
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {form.watch('potential_type') === 'value' && (
                <FormField
                  control={form.control}
                  name="potential_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nilai Proyek (Rp)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="500000000"
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        />
                      </FormControl>
                      {field.value && (
                        <FormDescription>
                          {formatCurrency(field.value)}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          {/* Follow Up */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Follow Up
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="next_action"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aksi Selanjutnya</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih aksi" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {nextActionOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="next_action_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Follow Up</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="next_action_notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catatan Follow Up</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Contoh: Siapkan proposal untuk coating lantai gudang"
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Photos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Foto Dokumentasi
              </CardTitle>
              <CardDescription>
                Maksimal 5 foto. Foto akan diberi GPS tag otomatis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photoPreview.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => removePhoto(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {photos.length < 5 && (
                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-muted-foreground/50 transition-colors">
                    <Camera className="h-8 w-8 text-muted-foreground/50" />
                    <span className="mt-2 text-sm text-muted-foreground">Add Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>

          {/* General Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Catatan Umum</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="general_notes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea 
                        placeholder="Tambahkan catatan penting lainnya..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              type="submit" 
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-pulse" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  {isOnline ? 'Kirim Laporan' : 'Simpan Offline'}
                </>
              )}
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Batal
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}