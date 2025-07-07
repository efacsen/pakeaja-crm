'use client';

import { useState, useEffect, useCallback } from 'react';
import { Check, ChevronsUpDown, User, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { companyService, type Contact } from '@/lib/services/company-service';

interface ContactAutocompleteProps {
  companyId?: string;
  value?: string;
  onSelect: (contact: Contact) => void;
  onCreate?: (name: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function ContactAutocomplete({
  companyId,
  value,
  onSelect,
  onCreate,
  placeholder = "Pilih atau tambah contact person...",
  disabled = false,
  className,
}: ContactAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Load contacts when company changes
  useEffect(() => {
    if (companyId) {
      setLoading(true);
      companyService.getCompanyContacts(companyId)
        .then(setContacts)
        .finally(() => setLoading(false));
    } else {
      setContacts([]);
    }
  }, [companyId]);

  // Filter contacts based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  }, [searchTerm, contacts]);

  // Load initial contact if value is provided
  useEffect(() => {
    if (value && contacts.length > 0) {
      const contact = contacts.find(c => c.id === value);
      if (contact) {
        setSelectedContact(contact);
      }
    }
  }, [value, contacts]);

  const handleSelect = useCallback((contact: Contact) => {
    setSelectedContact(contact);
    onSelect(contact);
    setOpen(false);
    setSearchTerm('');
  }, [onSelect]);

  const handleCreate = useCallback(() => {
    if (onCreate && searchTerm.trim() && companyId) {
      onCreate(searchTerm.trim());
      setOpen(false);
      setSearchTerm('');
    }
  }, [onCreate, searchTerm, companyId]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled || !companyId}
        >
          <span className="flex items-center gap-2 truncate">
            <User className="h-4 w-4 shrink-0" />
            {selectedContact ? (
              <span className="truncate">
                {selectedContact.name}
                {selectedContact.position && (
                  <span className="text-muted-foreground ml-1">- {selectedContact.position}</span>
                )}
              </span>
            ) : (
              <span className="text-muted-foreground">
                {!companyId ? "Pilih perusahaan terlebih dahulu" : placeholder}
              </span>
            )}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Cari contact person..." 
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            {loading ? (
              <CommandEmpty>Memuat kontak...</CommandEmpty>
            ) : filteredContacts.length === 0 && !searchTerm ? (
              <CommandEmpty>
                <div className="py-2 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Belum ada kontak untuk perusahaan ini
                  </p>
                  {onCreate && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSearchTerm('Kontak Baru');
                      }}
                      type="button"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Kontak Baru
                    </Button>
                  )}
                </div>
              </CommandEmpty>
            ) : filteredContacts.length === 0 ? (
              <CommandEmpty>
                <div className="py-2 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Kontak tidak ditemukan
                  </p>
                  {onCreate && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCreate();
                      }}
                      type="button"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah "{searchTerm}"
                    </Button>
                  )}
                </div>
              </CommandEmpty>
            ) : (
              <CommandGroup heading="Contact Person">
                {filteredContacts.map((contact) => (
                  <CommandItem
                    key={contact.id}
                    value={`${contact.name}-${contact.id}`}
                    onSelect={() => {
                      handleSelect(contact);
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedContact?.id === contact.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {contact.name}
                        {contact.is_primary && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                            Primary
                          </span>
                        )}
                      </span>
                      <div className="text-xs text-muted-foreground space-x-2">
                        {contact.position && <span>{contact.position}</span>}
                        {contact.mobile_phone && <span>• {contact.mobile_phone}</span>}
                      </div>
                    </div>
                  </CommandItem>
                ))}
                {onCreate && searchTerm.trim() && !filteredContacts.some(c => 
                  c.name.toLowerCase() === searchTerm.trim().toLowerCase()
                ) && (
                  <CommandItem 
                    value={`create-new-${searchTerm}`}
                    onSelect={() => {
                      handleCreate();
                    }}
                    className="cursor-pointer"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Tambah kontak baru "{searchTerm}"</span>
                  </CommandItem>
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}