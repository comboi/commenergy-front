'use client';

import React from 'react';
import { User, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useCommunityContracts,
  ContractTypeFilter,
} from '../contexts/community-contracts-context';

export const ContractTypeToggle: React.FC = () => {
  const { contractTypeFilter, setContractTypeFilter } = useCommunityContracts();

  const handleFilterChange = (type: ContractTypeFilter) => {
    setContractTypeFilter(type);
  };

  return (
    <div className="flex items-center border border-input rounded-md">
      <Button
        variant={contractTypeFilter === 'ALL' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleFilterChange('ALL')}
        className="rounded-none border-none first:rounded-l-md">
        All
      </Button>
      <Button
        variant={contractTypeFilter === 'CONSUMPTION' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleFilterChange('CONSUMPTION')}
        className="rounded-none border-none"
        title="Consumption Contracts">
        <User className="h-4 w-4" />
      </Button>
      <Button
        variant={contractTypeFilter === 'GENERATION' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleFilterChange('GENERATION')}
        className="rounded-none border-none last:rounded-r-md"
        title="Generation Contracts">
        <Zap className="h-4 w-4" />
      </Button>
    </div>
  );
};
