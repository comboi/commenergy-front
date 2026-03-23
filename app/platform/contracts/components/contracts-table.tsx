'use client';

import * as React from 'react';
import {
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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
import { Contract } from '@/app/platform/contracts/types/contract';
import { useContracts } from '@/app/platform/contracts/services/useContracts';
import { useContractsTableColumns } from './contracts-table-columns';
import { ContractsTableToolbar } from './contracts-table-toolbar';
import { ContractsTableModals } from './contracts-table-modals';

export function ContractsTable() {
  const [contractsOwnerType, setContractsOwnerType] =
    React.useState<Contract['contractUsers'][number]['role'] | null>(null);
  const { data, refetch, isLoading } = useContracts({
    ownerType: contractsOwnerType,
  });
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isModalDetailOpen, setIsModalDetailOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [activeContract, setActiveContract] = React.useState<
    Contract | undefined
  >(undefined);

  const handleEditClick = React.useCallback((contract: Contract) => {
    setActiveContract(contract);
    setIsModalDetailOpen(true);
  }, []);

  const handleDeleteClick = React.useCallback((contract: Contract) => {
    setActiveContract(contract);
    setIsDeleteModalOpen(true);
  }, []);

  const columns = useContractsTableColumns({
    onEdit: handleEditClick,
    onDelete: handleDeleteClick,
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleAddNewClick = React.useCallback(() => {
    setActiveContract(undefined);
    setIsModalDetailOpen(true);
  }, []);

  const handleOnCloseModal = React.useCallback(() => {
    setIsDeleteModalOpen(false);
    setIsModalDetailOpen(false);
    refetch();
  }, [refetch]);

  return (
    <div className="w-full">
      <ContractsTableToolbar
        table={table}
        contractsOwnerType={contractsOwnerType}
        setContractsOwnerType={setContractsOwnerType}
        onAddNewClick={handleAddNewClick}
      />

      <ContractsTableModals
        activeContract={activeContract}
        isModalDetailOpen={isModalDetailOpen}
        isDeleteModalOpen={isDeleteModalOpen}
        onClose={handleOnCloseModal}
      />

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
          <TableBody
            columnsNumber={columns.length}
            isLoading={isLoading}
            noItems={!isLoading && table.getRowModel().rows?.length === 0}>
            {table.getRowModel().rows?.length > 0 &&
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground" />
        <div className="space-x-2" />
      </div>
    </div>
  );
}
