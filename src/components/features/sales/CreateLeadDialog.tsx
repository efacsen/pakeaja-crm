'use client';

import { useState } from 'react';
import { Lead, DealType, TERRITORIES } from '@/types/sales';
import { mockPipelineService } from '@/lib/services/sales/mock-pipeline.service';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CompanyAutocomplete } from '@/components/ui/company-autocomplete';
import { ContactAutocomplete } from '@/components/ui/contact-autocomplete';
import { companyService } from '@/lib/services/company-service';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Save, Building2, MapPin, Package } from 'lucide-react';

interface CreateLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateLeadDialog({ open, onOpenChange, onSuccess }: CreateLeadDialogProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [selectedContactId, setSelectedContactId] = useState<string>('');
  const [formData, setFormData] = useState<Partial<Lead>>({
    project_name: '',
    project_description: '',
    project_address: '',
    deal_type: 'supply',
    estimated_value: 0,
    source: 'canvassing',
    expected_close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });
  const [customerData, setCustomerData] = useState({
    company_id: '',
    company_name: '',
    contact_id: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    territory: '',
    npwp: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.project_name || !customerData.company_name) {
      toast({
        title: 'Error',
        description: 'Please fill in required fields',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      // Create customer first if new
      const { data: customer, error: customerError } = await mockPipelineService.createCustomer(customerData);
      
      if (customerError) {
        throw new Error('Failed to create customer');
      }

      // Create lead
      const leadData: Partial<Lead> = {
        ...formData,
        customer_id: customer?.id,
        assigned_to: 'demo-user', // In real app, get from auth context
      };

      const { data: lead, error: leadError } = await mockPipelineService.createLead(leadData);
      
      if (leadError) {
        throw new Error('Failed to create lead');
      }

      toast({
        title: 'Success',
        description: 'Lead created successfully',
      });

      // Reset form
      setFormData({
        project_name: '',
        project_description: '',
        project_address: '',
        deal_type: 'supply',
        estimated_value: 0,
        source: 'canvassing',
        expected_close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      setCustomerData({
        company_name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        territory: '',
        npwp: '',
      });

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create lead',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Lead</DialogTitle>
            <DialogDescription>
              Add a new lead to the sales pipeline
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Customer Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-semibold">
                <Building2 className="h-4 w-4" />
                Customer Information
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="company_name">Company Name <span className="text-red-500">*</span></Label>
                  <CompanyAutocomplete
                    value={selectedCompanyId}
                    onSelect={(company) => {
                      setSelectedCompanyId(company.id);
                      setCustomerData({ 
                        ...customerData, 
                        company_id: company.id,
                        company_name: company.name,
                        city: company.city || customerData.city,
                      });
                      // Reset contact when company changes
                      setSelectedContactId('');
                      setCustomerData(prev => ({ 
                        ...prev, 
                        contact_id: '',
                        contact_person: '',
                        email: '',
                        phone: '',
                      }));
                    }}
                    onCreate={async (name) => {
                      const companyId = await companyService.getOrCreateCompany(name);
                      if (companyId) {
                        setSelectedCompanyId(companyId);
                        setCustomerData({ ...customerData, company_id: companyId, company_name: name });
                        toast({
                          title: 'Company created',
                          description: `${name} has been added to the database.`,
                        });
                      }
                    }}
                    placeholder="Type or select company..."
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="contact_person">Contact Person</Label>
                  <ContactAutocomplete
                    companyId={selectedCompanyId}
                    value={selectedContactId}
                    onSelect={(contact) => {
                      setSelectedContactId(contact.id);
                      setCustomerData({ 
                        ...customerData, 
                        contact_id: contact.id,
                        contact_person: contact.name,
                        email: contact.email || customerData.email,
                        phone: contact.mobile_phone || customerData.phone,
                      });
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
                        setCustomerData({ 
                          ...customerData, 
                          contact_id: contact.id,
                          contact_person: contact.name,
                        });
                        toast({
                          title: 'Contact added',
                          description: `${name} has been added as a contact.`,
                        });
                      }
                    }}
                    placeholder="Select or add contact person..."
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerData.email}
                    onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                    placeholder="contact@example.co.id"
                    disabled={!!selectedContactId}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={customerData.phone}
                    onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                    placeholder="0812-3456-7890"
                    disabled={!!selectedContactId}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="territory">Territory</Label>
                  <Select
                    value={customerData.territory}
                    onValueChange={(value) => setCustomerData({ ...customerData, territory: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select territory" />
                    </SelectTrigger>
                    <SelectContent>
                      {TERRITORIES.map((territory) => (
                        <SelectItem key={territory} value={territory}>
                          {territory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="npwp">NPWP</Label>
                  <Input
                    id="npwp"
                    value={customerData.npwp}
                    onChange={(e) => setCustomerData({ ...customerData, npwp: e.target.value })}
                    placeholder="12.345.678.9-012.000"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={customerData.address}
                  onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                  placeholder="Jl. Example No. 123"
                  rows={2}
                />
              </div>
            </div>

            {/* Project Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-semibold">
                <Package className="h-4 w-4" />
                Project Information
              </div>
              
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="project_name">Project Name *</Label>
                  <Input
                    id="project_name"
                    value={formData.project_name}
                    onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                    placeholder="Floor Coating Warehouse"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="project_description">Project Description</Label>
                  <Textarea
                    id="project_description"
                    value={formData.project_description}
                    onChange={(e) => setFormData({ ...formData, project_description: e.target.value })}
                    placeholder="Epoxy coating for 5000m² warehouse floor"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="deal_type">Deal Type</Label>
                    <Select
                      value={formData.deal_type}
                      onValueChange={(value) => setFormData({ ...formData, deal_type: value as DealType })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="supply">Supply Only [S]</SelectItem>
                        <SelectItem value="apply">Apply Only [A]</SelectItem>
                        <SelectItem value="supply_apply">Supply + Apply [S+A]</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="estimated_value">Estimated Value (Rp)</Label>
                    <Input
                      id="estimated_value"
                      type="number"
                      value={formData.estimated_value}
                      onChange={(e) => setFormData({ ...formData, estimated_value: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="source">Lead Source</Label>
                    <Select
                      value={formData.source}
                      onValueChange={(value) => setFormData({ ...formData, source: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="canvassing">Canvassing</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="cold_call">Cold Call</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="expected_close_date">Expected Close Date</Label>
                    <Input
                      id="expected_close_date"
                      type="date"
                      value={formData.expected_close_date?.split('T')[0]}
                      onChange={(e) => setFormData({ ...formData, expected_close_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="project_address">Project Address</Label>
                  <Input
                    id="project_address"
                    value={formData.project_address}
                    onChange={(e) => setFormData({ ...formData, project_address: e.target.value })}
                    placeholder="Project location"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Creating...' : 'Create Lead'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}