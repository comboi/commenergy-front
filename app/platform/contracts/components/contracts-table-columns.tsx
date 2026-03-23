import * as React from 'react';
import { useRouter } from 'next/navigation';
import { type ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import UserTooltip from '@/app/platform/users/components/user-tooltip';
import TooltipEllipsisText from '@/components/ui/TooltipElipsis';
import { Contract } from '../types/contract';

type UseContractsTableColumnsProps = {
  onEdit: (contract: Contract) => void;
  onDelete: (contract: Contract) => void;
};

export function useContractsTableColumns({
  onEdit,
  onDelete,
}: UseContractsTableColumnsProps): ColumnDef<Contract>[] {
  const router = useRouter();

  const handleViewDetails = React.useCallback(
    (contract: Contract) => {
      router.push(`/platform/contracts/${contract.id}`);
    },
    [router]
  );

  return React.useMemo(
    () => [
      {
        accessorKey: 'contractCode',
        header: 'Code (CUPS/CAU)',
        cell: ({ row }) => (
          <button
            onClick={() => handleViewDetails(row.original)}
            className="text-left hover:underline">
            {row.getValue('contractCode')}
          </button>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <button
            onClick={() => handleViewDetails(row.original)}
            className="text-left hover:underline">
            <TooltipEllipsisText className="max-w-[150px]">
              {row.getValue('name')}
            </TooltipEllipsisText>
          </button>
        ),
      },
      {
        accessorKey: 'contractPower',
        header: 'Power',
        cell: ({ row }) => <div>{row.getValue('contractPower')}</div>,
      },
      {
        accessorKey: 'provider',
        header: 'Provider',
        cell: ({ row }) => (
          <TooltipEllipsisText className="max-w-[150px]">
            {row.original.provider.name}
          </TooltipEllipsisText>
        ),
      },
      {
        accessorFn: (row) => row.user.vat,
        header: 'User',
        cell: ({ row }) => (
          <UserTooltip user={row.original.user}>
            <div>{row.original.user.vat}</div>
          </UserTooltip>
        ),
      },
      {
        accessorKey: 'fullAddress',
        header: 'Address',
        cell: ({ row }) => (
          <TooltipEllipsisText className="max-w-[150px]">
            {row.getValue('fullAddress')}
          </TooltipEllipsisText>
        ),
      },
      {
        accessorKey: 'state',
        header: 'Status',
        cell: ({ row }) => (
          <div
            className={
              row.original.state.toLowerCase() === 'active'
                ? 'text-green-600'
                : 'text-red-600'
            }>
            {row.getValue('state')}
          </div>
        ),
      },
      {
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleViewDetails(row.original)}
              aria-label={`View details for contract ${row.original.name}`}>
              <Eye />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(row.original)}
              aria-label={`Edit contract ${row.original.name}`}>
              <Edit />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(row.original)}
              aria-label={`Delete contract ${row.original.name}`}>
              <Trash />
            </Button>
          </div>
        ),
      },
    ],
    [handleViewDetails, onDelete, onEdit]
  );
}
