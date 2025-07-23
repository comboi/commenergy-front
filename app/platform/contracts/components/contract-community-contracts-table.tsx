'use client';

import * as React from 'react';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { CommunityContractEnriched } from '@/app/platform/communities/services/communityContracts/useCommunityContractsByContractId';
import TooltipEllipsisText from '@/components/ui/TooltipElipsis';
import Link from 'next/link';

interface ContractCommunityContractsTableProps {
  data: CommunityContractEnriched[];
  isLoading: boolean;
}

export default function ContractCommunityContractsTable({
  data,
  isLoading,
}: ContractCommunityContractsTableProps) {
  const columns: ColumnDef<CommunityContractEnriched>[] = React.useMemo(
    () => [
      {
        accessorKey: 'community.name',
        header: 'Community',
        cell: ({ row }) => (
          <TooltipEllipsisText className="max-w-[200px] font-mono text-xs">
            <Link
              href={`/platform/communities/${row.original.community?.id}`}
              className="hover:underline">
              {row.original.community?.name || 'N/A'}
            </Link>
          </TooltipEllipsisText>
        ),
      },
      {
        accessorKey: 'communityJoinDate',
        header: 'Join Date',
        cell: ({ row }) => {
          const date = row.getValue('communityJoinDate') as string;
          return date ? new Date(date).toLocaleDateString() : 'N/A';
        },
      },
      {
        accessorKey: 'communityFee',
        header: 'Community Fee',
        cell: ({ row }) => {
          const fee = row.getValue('communityFee') as number;
          const period = row.original.communityFeePeriodType;
          return fee ? `€${fee}${period ? ` / ${period}` : ''}` : 'N/A';
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No community contracts found for this contract.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
