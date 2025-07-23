'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCommunityContracts } from '../contexts/community-contracts-context';
import { useDebounce } from '../hooks/useDebounce';

export const CommunityContractsSearch: React.FC = () => {
  const {
    globalFilter,
    setGlobalFilter,
    clearFilters,
    hasActiveFilters,
    searchStats,
  } = useCommunityContracts();

  // Local state for immediate UI responsiveness
  const [localSearchTerm, setLocalSearchTerm] = useState(globalFilter);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce the search term to avoid excessive filtering
  const debouncedSearchTerm = useDebounce(localSearchTerm, 300);

  // Update global filter when debounced term changes
  useEffect(() => {
    setGlobalFilter(debouncedSearchTerm);
  }, [debouncedSearchTerm, setGlobalFilter]);

  // Sync local state when global filter changes externally
  useEffect(() => {
    setLocalSearchTerm(globalFilter);
  }, [globalFilter]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalSearchTerm(e.target.value);
    },
    []
  );

  const handleClearSearch = useCallback(() => {
    setLocalSearchTerm('');
    clearFilters();
    // Keep focus on input after clearing
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [clearFilters]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        handleClearSearch();
      }
    },
    [handleClearSearch]
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search contracts"
          value={localSearchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10"
        />
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
            aria-label="Clear search">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
