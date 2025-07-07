'use client';

import { useState } from 'react';
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
import { CompanyAutocomplete } from '@/components/ui/company-autocomplete';
import { ContactAutocomplete } from '@/components/ui/contact-autocomplete';
import { companyService } from '@/lib/services/company-service';
import { useToast } from '@/hooks/use-toast';
import { Building2, User, MapPin, CreditCard } from 'lucide-react';

const customerFormSchema = z.object({
  // Company Information
  company_id: z.string().min(1, 'Company is required'),
  company_name: z.string().min(1, 'Company name is required'),
  company_type: z.enum(['residential', 'commercial', 'industrial']),
  company_address: z.string().optional(),
  company_city: z.string().optional(),
  
  // Contact Information
  contact_id: z.string().optional(),
  contact_name: z.string().min(1, 'Contact person is required'),
  contact_position: z.string().optional(),
  contact_email: z.string().email('Invalid email').optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  
  // Business Information
  credit_limit: z.number().optional(),
  payment_terms: z.number().optional(),
  discount_percentage: z.number().optional(),
  lead_source: z.enum(['website', 'referral', 'social_media', 'cold_call', 'advertisement', 'canvassing', 'other']),
  status: z.enum(['active', 'prospect', 'inactive']),
  notes: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerFormSchema>;

interface CustomerFormV2Props {
  customerId?: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function CustomerFormV2({ customerId, onSubmit, onCancel }: CustomerFormV2Props) {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [selectedContactId, setSelectedContactId] = useState<string>('');
  const { toast } = useToast();

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      company_type: 'commercial',
      lead_source: 'website',
      status: 'prospect',
      payment_terms: 30,
      credit_limit: 0,
      discount_percentage: 0,
    },
  });

  const handleSubmit = async (data: CustomerFormData) => {
    try {
      // Update company information if needed
      if (data.company_id && (data.company_address || data.company_city)) {
        await companyService.updateCompany(data.company_id, {
          address: data.company_address,
          city: data.company_city,
          company_type: data.company_type,
          credit_limit: data.credit_limit,
          payment_terms: data.payment_terms,
          discount_percentage: data.discount_percentage,
          status: data.status === 'inactive' ? 'inactive' : 'active',
          notes: data.notes,
        });
      }

      // Update contact information if needed
      if (data.contact_id) {
        await companyService.updateContact(data.contact_id, {
          position: data.contact_position,
          email: data.contact_email,
          mobile_phone: data.contact_phone,
        });
      }

      onSubmit({
        company_id: data.company_id,
        contact_id: data.contact_id,
        lead_source: data.lead_source,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save customer information",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Company Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Building2 className="h-5 w-5" />
            Company Information
          </div>
          
          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name *</FormLabel>
                <FormControl>
                  <CompanyAutocomplete
                    value={selectedCompanyId}
                    onSelect={(company) => {
                      setSelectedCompanyId(company.id);
                      form.setValue('company_id', company.id);
                      form.setValue('company_name', company.name);
                      form.setValue('company_city', company.city || '');
                      // Reset contact when company changes
                      setSelectedContactId('');
                      form.setValue('contact_id', '');
                      form.setValue('contact_name', '');
                    }}
                    onCreate={async (name) => {
                      const companyId = await companyService.getOrCreateCompany(name);
                      if (companyId) {
                        setSelectedCompanyId(companyId);
                        form.setValue('company_id', companyId);
                        form.setValue('company_name', name);
                        toast({
                          title: 'Company created',
                          description: `${name} has been added to the database.`,
                        });
                      }
                    }}
                    placeholder="Select or add company..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="company_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lead_source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lead Source</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="social_media">Social Media</SelectItem>
                      <SelectItem value="cold_call">Cold Call</SelectItem>
                      <SelectItem value="advertisement">Advertisement</SelectItem>
                      <SelectItem value="canvassing">Canvassing</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="company_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Jl. Industri No. 123, Kawasan Industri"
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
            name="company_city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Jakarta" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <User className="h-5 w-5" />
            Contact Person
          </div>

          <FormField
            control={form.control}
            name="contact_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person *</FormLabel>
                <FormControl>
                  <ContactAutocomplete
                    companyId={selectedCompanyId}
                    value={selectedContactId}
                    onSelect={(contact) => {
                      setSelectedContactId(contact.id);
                      form.setValue('contact_id', contact.id);
                      form.setValue('contact_name', contact.name);
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
                        is_active: true,
                      });
                      if (contact) {
                        setSelectedContactId(contact.id);
                        form.setValue('contact_id', contact.id);
                        form.setValue('contact_name', contact.name);
                        toast({
                          title: 'Contact created',
                          description: `${name} has been added as a contact.`,
                        });
                      }
                    }}
                    placeholder="Select or add contact..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contact_position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Purchasing Manager" 
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
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="0812-3456-7890" 
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
              name="contact_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="contact@company.com" 
                      {...field} 
                      disabled={!!selectedContactId}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Business Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <CreditCard className="h-5 w-5" />
            Business Information
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="credit_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credit Limit (Rp)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payment_terms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Terms (days)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="30"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount_percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0"
                      min="0"
                      max="100"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="active">Active Customer</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Additional notes about this customer..."
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            {customerId ? 'Update Customer' : 'Create Customer'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}