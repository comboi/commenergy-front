'use client';

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { CommunityContract } from '@/app/communities/model/communityContract';
import { v7 } from 'uuid';

export type ContractTypeFilter = 'ALL' | 'CONSUMPTION' | 'GENERATION';

interface CommunityContractsContextType {
  // Original data (source of truth)
  originalData: CommunityContract[];

  // Draft data (with modifications)
  draftData: CommunityContract[];

  // Filtered data (after applying search and filters to draft data)
  filteredData: CommunityContract[];

  // Search and filter controls
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  contractTypeFilter: ContractTypeFilter;
  setContractTypeFilter: (type: ContractTypeFilter) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;

  // Data modification methods
  updateSharing: (
    contractId: string,
    newSharingValue: number,
    sharingActiveVersion: any
  ) => void;
  resetDraftData: () => void;

  // Stats
  searchStats: {
    total: number;
    filtered: number;
    isFiltered: boolean;
  };

  // Dirty state
  isDirty: boolean;
}

const CommunityContractsContext = createContext<
  CommunityContractsContextType | undefined
>(undefined);

// Custom filter function that searches and filters by contract type
const applyFilters = (
  data: CommunityContract[],
  searchTerm: string,
  contractTypeFilter: ContractTypeFilter
): CommunityContract[] => {
  let filteredData = data;

  // Filter by contract type first
  if (contractTypeFilter !== 'ALL') {
    filteredData = filteredData.filter((contract) => {
      return contract?.contract?.contractType === contractTypeFilter;
    });
  }

  // Then apply search filter if there's a search term
  if (searchTerm && searchTerm.trim()) {
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();

    filteredData = filteredData.filter((contract) => {
      // Safety checks
      if (!contract?.contract) return false;

      const contractData = contract.contract;

      // Search in multiple fields
      const contractCode = contractData.contractCode?.toLowerCase() || '';
      const contractName = contractData.name?.toLowerCase() || '';
      const userVat = contractData.user?.vat?.toLowerCase() || '';

      return (
        contractCode.includes(normalizedSearchTerm) ||
        contractName.includes(normalizedSearchTerm) ||
        userVat.includes(normalizedSearchTerm)
      );
    });
  }

  return filteredData;
};

interface CommunityContractsProviderProps {
  children: React.ReactNode;
  data: CommunityContract[];
}

export const CommunityContractsProvider: React.FC<
  CommunityContractsProviderProps
> = ({ children, data }) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [contractTypeFilter, setContractTypeFilter] =
    useState<ContractTypeFilter>('ALL');
  const [draftData, setDraftData] = useState<CommunityContract[]>([]);

  // Update draft data when original data changes
  React.useEffect(() => {
    setDraftData(data);
  }, [data]);

  // Memoize filtered data to prevent unnecessary recalculations
  const filteredData = useMemo(() => {
    try {
      return applyFilters(draftData, globalFilter, contractTypeFilter);
    } catch (error) {
      console.error('Error filtering data:', error);
      return draftData; // Return draft data if filtering fails
    }
  }, [draftData, globalFilter, contractTypeFilter]);

  const hasActiveFilters = useMemo(
    () => !!globalFilter.trim() || contractTypeFilter !== 'ALL',
    [globalFilter, contractTypeFilter]
  );

  const searchStats = useMemo(
    () => ({
      total: draftData.length,
      filtered: filteredData.length,
      isFiltered: hasActiveFilters,
    }),
    [draftData.length, filteredData.length, hasActiveFilters]
  );

  const isDirty = useMemo(() => {
    if (data.length !== draftData.length) return true;

    return draftData.some((draft, index) => {
      const original = data[index];
      if (!original) return true;

      // Compare only the fields that matter for "dirty" state
      return (
        draft.id !== original.id ||
        draft.sharing?.share !== original.sharing?.share ||
        draft.communityFee !== original.communityFee
      );
    });
  }, [data, draftData]);

  const updateSharing = useCallback(
    (
      contractId: string,
      newSharingValue: number,
      sharingActiveVersion: any
    ) => {
      setDraftData(
        (prevDraftData) =>
          prevDraftData.map((contract) =>
            contract.id === contractId
              ? {
                  ...contract,
                  sharing: {
                    ...((contract.sharing ??
                      {}) as CommunityContract['sharing']),
                    communityContractId: contractId,
                    createdDate:
                      contract.sharing?.createdDate ?? new Date().toISOString(),
                    id: contract.sharing?.id ?? v7(),
                    updatedDate: new Date().toISOString(),
                    version: sharingActiveVersion ?? null,
                    versionId: sharingActiveVersion?.id ?? null,
                    share: newSharingValue,
                  },
                }
              : contract
          ) as CommunityContract[]
      );
    },
    []
  );

  const resetDraftData = useCallback(() => {
    setDraftData(data);
  }, [data]);

  const clearFilters = useCallback(() => {
    setGlobalFilter('');
    setContractTypeFilter('ALL');
  }, []);

  const value = useMemo(
    () => ({
      originalData: data,
      draftData,
      filteredData,
      globalFilter,
      setGlobalFilter,
      contractTypeFilter,
      setContractTypeFilter,
      clearFilters,
      hasActiveFilters,
      searchStats,
      updateSharing,
      resetDraftData,
      isDirty,
    }),
    [
      data,
      draftData,
      filteredData,
      globalFilter,
      setGlobalFilter,
      contractTypeFilter,
      setContractTypeFilter,
      clearFilters,
      hasActiveFilters,
      searchStats,
      updateSharing,
      resetDraftData,
      isDirty,
    ]
  );

  return (
    <CommunityContractsContext.Provider value={value}>
      {children}
    </CommunityContractsContext.Provider>
  );
};

export const useCommunityContracts = (): CommunityContractsContextType => {
  const context = useContext(CommunityContractsContext);
  if (context === undefined) {
    throw new Error(
      'useCommunityContracts must be used within a CommunityContractsProvider'
    );
  }
  return context;
};
