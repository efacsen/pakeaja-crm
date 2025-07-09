'use client';

import { useState, useEffect } from 'react';
import { ContactAutocomplete } from '@/components/ui/contact-autocomplete';
import { GlassCard } from '@/components/ui/glass-card';
import { createClient } from '@/lib/supabase/client';
import { companyService } from '@/lib/services/company-service';

export default function TestContactPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const data = await companyService.getAllCompanies();
      setCompanies(data);
      if (data.length > 0) {
        setSelectedCompany(data[0].id);
      }
    } catch (error) {
      console.error('Error loading companies:', error);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Test Contact Autocomplete</h1>

      {/* Test 1: Contact Autocomplete outside of modal */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold mb-4">Test 1: Outside Modal</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Company</label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select a company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contact Person</label>
            <ContactAutocomplete
              companyId={selectedCompany}
              onSelect={(contact) => {
                console.log('Selected contact:', contact);
                setSelectedContact(contact);
              }}
              onCreate={(name) => {
                console.log('Create new contact:', name);
              }}
            />
          </div>

          {selectedContact && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <p>Selected: {selectedContact.name}</p>
              {selectedContact.position && <p>Position: {selectedContact.position}</p>}
              {selectedContact.email && <p>Email: {selectedContact.email}</p>}
            </div>
          )}
        </div>
      </GlassCard>

      {/* Test 2: Contact Autocomplete inside modal */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold mb-4">Test 2: Inside Modal</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Open Modal
        </button>
      </GlassCard>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsModalOpen(false)} />
          <div className="relative z-50 w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Modal with Contact Autocomplete</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Company</label>
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select a company</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Contact Person</label>
                <ContactAutocomplete
                  companyId={selectedCompany}
                  onSelect={(contact) => {
                    console.log('Selected contact in modal:', contact);
                    setSelectedContact(contact);
                  }}
                  onCreate={(name) => {
                    console.log('Create new contact in modal:', name);
                  }}
                />
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}