'use client';

import React from 'react';
import { User, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContractUserRole } from '../model/contract';

type Props = {
  roleActive: ContractUserRole | null;
  setActiveRoles: (role: ContractUserRole | null) => void;
};

export const ContractRoleSwitch = ({ roleActive, setActiveRoles }: Props) => {
  return (
    <div className="flex items-center border border-input rounded-md">
      <Button
        variant={roleActive === null ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setActiveRoles(null)}
        className="rounded-none border-none first:rounded-l-md">
        All
      </Button>
      <Button
        variant={roleActive === 'owner' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setActiveRoles('owner')}
        className="rounded-none border-none"
        title="Consumption Contracts">
        My Contracts
      </Button>
      <Button
        variant={roleActive === 'partner' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setActiveRoles('partner')}
        className="rounded-none border-none"
        title="Consumption Contracts">
        Others
      </Button>
    </div>
  );
};
