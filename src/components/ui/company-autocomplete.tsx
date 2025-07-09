'use client';

import { useState, useEffect, useCallback } from 'react';
import { Check, ChevronsUpDown, Building2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command-custom';
import {
  GlassPopover as Popover,
  GlassPopoverContent as PopoverContent,
  GlassPopoverTrigger as PopoverTrigger,
} from '@/components/ui/glass-popover';
import { companyService, type Company, type SearchResult } from '@/lib/services/company-service';
import { useDebounce } from '@/hooks/use-debounce';

interface CompanyAutocompleteProps {
  value?: string;
  onSelect: (company: { id: string; name: string; city?: string }) => void;
  onCreate?: (name: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function CompanyAutocomplete({
  value,
  onSelect,
  onCreate,
  placeholder = "Pilih atau ketik nama perusahaan...",
  disabled = false,
  className,
}: CompanyAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<{ id: string; name: string; city?: string } | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Search companies when search term changes
  useEffect(() => {
    if (debouncedSearchTerm.length >= 2) {
      setLoading(true);
      companyService.searchCompaniesWithContacts(debouncedSearchTerm, 10)
        .then(results => {
          // Filter to only show unique companies
          const uniqueCompanies = results.reduce((acc, curr) => {
            if (!acc.some(item => item.company_id === curr.company_id)) {
              acc.push(curr);
            }
            return acc;
          }, [] as SearchResult[]);
          setSearchResults(uniqueCompanies);
        })
        .finally(() => setLoading(false));
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm]);

  // Load initial company if value is provided
  useEffect(() => {
    if (value && !selectedCompany) {
      companyService.getCompanyWithContacts(value).then(company => {
        if (company) {
          setSelectedCompany({
            id: company.id,
            name: company.name,
            city: company.city,
          });
        }
      });
    }
  }, [value, selectedCompany]);

  const handleSelect = useCallback((result: SearchResult) => {
    const company = {
      id: result.company_id,
      name: result.company_name,
      city: result.company_city,
    };
    setSelectedCompany(company);
    onSelect(company);
    setOpen(false);
    setSearchTerm('');
  }, [onSelect]);

  const handleCreate = useCallback(() => {
    if (onCreate && searchTerm.trim()) {
      onCreate(searchTerm.trim());
      setOpen(false);
      setSearchTerm('');
    }
  }, [onCreate, searchTerm]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          <span className="flex items-center gap-2 truncate">
            <Building2 className="h-4 w-4 shrink-0" />
            {selectedCompany ? (
              <span className="truncate">
                {selectedCompany.name}
                {selectedCompany.city && (
                  <span className="text-muted-foreground ml-1">- {selectedCompany.city}</span>
                )}
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start" style={{ zIndex: 9999 }}>
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Cari perusahaan..." 
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            {loading ? (
              <CommandEmpty>Mencari...</CommandEmpty>
            ) : searchResults.length === 0 && searchTerm.length >= 2 ? (
              <CommandEmpty>
                <div className="py-2 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Perusahaan tidak ditemukan
                  </p>
                  {onCreate && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
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
            ) : searchTerm.length < 2 ? (
              <CommandEmpty>Ketik minimal 2 karakter untuk mencari</CommandEmpty>
            ) : (
              <CommandGroup heading="Perusahaan">
                {searchResults.map((result) => (
                  <CommandItem
                    key={result.company_id}
                    value={`${result.company_name}-${result.company_id}`}
                    onSelect={() => handleSelect(result)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCompany?.id === result.company_id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{result.company_name}</span>
                      {result.company_city && (
                        <span className="text-xs text-muted-foreground">{result.company_city}</span>
                      )}
                    </div>
                  </CommandItem>
                ))}
                {onCreate && searchTerm.trim() && !searchResults.some(r => 
                  r.company_name.toLowerCase() === searchTerm.trim().toLowerCase()
                ) && (
                  <CommandItem 
                    value={`create-new-${searchTerm}`}
                    onSelect={() => handleCreate()}
                    className="cursor-pointer"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Tambah perusahaan baru "{searchTerm}"</span>
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