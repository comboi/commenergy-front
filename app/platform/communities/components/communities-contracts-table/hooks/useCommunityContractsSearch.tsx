import { useState, useMemo, useCallback, startTransition } from 'react';
import { CommunityContract } from '@/app/platform/communities/model/communityContract';
import { useDebounce } from './useDebounce';

export interface UseSearchCommunityContractsOptions {
  data: CommunityContract[];
  searchFields?: ('contractCode' | 'contractName' | 'userVat')[];
}

export const useCommunityContractsSearch = ({
  data,
  searchFields = ['contractCode', 'contractName', 'userVat'],
}: UseSearchCommunityContractsOptions) => {
  // Ensure data is always an array to prevent issues
  const safeData = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const [globalSearch, setGlobalSearchState] = useState('');

  const setGlobalSearch = useCallback((value: string) => {
    startTransition(() => {
      setGlobalSearchState(value);
    });
  }, []);

  // Debounce global search to prevent UI freezing
  const debouncedGlobalSearch = useDebounce(globalSearch, 300);

  // Función para limpiar todos los filtros
  const clearFilters = useCallback(() => {
    startTransition(() => {
      setGlobalSearchState('');
    });
  }, []);

  // Función para comprobar si algún filtro está activo (usando valores inmediatos para UI)
  const hasActiveFilters = useMemo(() => {
    return globalSearch?.trim() !== '';
  }, [globalSearch]);

  // Función para comprobar si algún filtro debounced está activo (para filtrado real)
  const hasDebouncedActiveFilters = useMemo(() => {
    return debouncedGlobalSearch?.trim() !== '';
  }, [debouncedGlobalSearch]);

  // Función de filtrado optimizada
  const filteredData = useMemo(() => {
    // Early return if no data
    if (!safeData || safeData.length === 0) {
      return [];
    }

    if (!hasDebouncedActiveFilters) {
      return safeData;
    }

    const globalSearchTerm = debouncedGlobalSearch.toLowerCase().trim();

    // If search term is empty after trimming, return all data
    if (!globalSearchTerm) {
      return safeData;
    }

    try {
      return safeData.filter((contract) => {
        // Enhanced safety checks
        if (!contract?.contract) {
          return false;
        }

        const contractData = contract.contract;

        // Safely extract values with proper fallbacks
        const contractCode = contractData.contractCode?.toLowerCase() || '';
        const contractName = contractData.name?.toLowerCase() || '';
        const userVat = contractData.user?.vat?.toLowerCase() || '';

        // Search in all enabled fields
        return (
          (searchFields.includes('contractCode') &&
            contractCode.includes(globalSearchTerm)) ||
          (searchFields.includes('contractName') &&
            contractName.includes(globalSearchTerm)) ||
          (searchFields.includes('userVat') &&
            userVat.includes(globalSearchTerm))
        );
      });
    } catch (error) {
      console.error('Error filtering data:', error);
      return safeData; // Return original data if filtering fails
    }
  }, [
    safeData,
    debouncedGlobalSearch,
    searchFields,
    hasDebouncedActiveFilters,
  ]);

  // Estadísticas de búsqueda
  const searchStats = useMemo(
    () => ({
      total: safeData?.length ?? 0,
      filtered: filteredData?.length ?? 0,
      isFiltered: hasDebouncedActiveFilters,
    }),
    [safeData?.length, filteredData?.length, hasDebouncedActiveFilters]
  );

  return {
    // Estados
    globalSearch,
    filteredData,
    searchStats,
    hasActiveFilters,

    // Acciones
    setGlobalSearch,
    clearFilters,
  };
};

export default useCommunityContractsSearch;
