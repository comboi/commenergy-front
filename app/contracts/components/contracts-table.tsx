'use client';

import * as React from 'react';
import {
  type ColumnDef,
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
import { ChevronDown, Edit, PlusCircle, Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Contract } from '@/app/contracts/model/contract';
import { useContracts } from '@/app/contracts/services/useContracts';
import UserTooltip from '@/app/users/components/user-tooltip';
import AddNewContractForm from './add-new-contract/add-new-contract-form';
import Modal from '@/components/modal/modal';
import DeleteContractForm from './add-new-contract/delete-contract-form';
import TooltipEllipsisText from '@/components/ui/TooltipElipsis';

export function ContractsTable() {
  const { data, refetch } = useContracts();
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

  const handleEditClick = (contract: Contract) => {
    setActiveContract(contract);
    setIsModalDetailOpen(true);
  };

  const handleDeleteClick = (contract: Contract) => {
    setActiveContract(contract);
    setIsDeleteModalOpen(true);
  };

  const columns: ColumnDef<Contract>[] = React.useMemo(
    () => [
      {
        accessorKey: 'cups',
        header: 'CUPS',
        cell: ({ row }) => <div>{row.getValue('cups')}</div>,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <TooltipEllipsisText className="max-w-[150px]">
            {row.getValue('name')}
          </TooltipEllipsisText>
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
        cell: ({ row }) => {
          return (
            <TooltipEllipsisText className="max-w-[150px]">
              {row.getValue('fullAddress')}
            </TooltipEllipsisText>
          );
        },
      },
      {
        accessorKey: 'state',
        header: 'Status',
        cell: ({ row }) => (
          <div
            className={
              row.original.state === 'Active'
                ? 'text-green-600'
                : 'text-red-600'
            }>
            {row.getValue('state')}
          </div>
        ),
      },
      {
        accessorKey: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditClick(row.original)}
              aria-label={`Edit contract ${row.original.name}`}>
              <Edit />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteClick(row.original)}
              aria-label={`Delete contract ${row.original.name}`}>
              <Trash />
            </Button>
          </div>
        ),
      },
    ],
    [handleEditClick, handleDeleteClick]
  );

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

  const handleAddNewClick = () => {
    setActiveContract(undefined);
    setIsModalDetailOpen(true);
  };

  const handleOnCloseModal = () => {
    setIsDeleteModalOpen(false);
    setIsModalDetailOpen(false);
    refetch();
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter contracts..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex gap-4  justify-end w-full">
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }>
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div>
            <Button
              variant="default"
              className="ml-auto"
              onClick={handleAddNewClick}>
              Add New <PlusCircle className="ml-2 h-4 w-4" />
            </Button>
            <Modal
              isOpen={isModalDetailOpen}
              onClose={handleOnCloseModal}
              title="Add New Contract"
              description="Fill out the form below to add a new contract">
              <AddNewContractForm
                onClose={handleOnCloseModal}
                contractToEdit={activeContract}
              />
            </Modal>
            <Modal
              isOpen={isDeleteModalOpen}
              onClose={handleOnCloseModal}
              title="Delete Contract"
              description="Are you sure you want to delete this contract?">
              {activeContract && (
                <DeleteContractForm
                  onClose={handleOnCloseModal}
                  contract={activeContract}
                />
              )}
            </Modal>
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
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
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {/* {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected. */}
        </div>
        <div className="space-x-2">
          {/* <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            Next
          </Button> */}
        </div>
      </div>
    </div>
  );
}
