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
import {
  ChevronDown,
  Edit,
  EditIcon,
  EyeIcon,
  Trash,
  TrashIcon,
} from 'lucide-react';
import Link from 'next/link';

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
import { useCommunities } from '@/app/communities/services/useCommunities';
import { Community } from '@/app/communities/model/community';
import useTableModals from '@/hooks/use-table-modals';
import Modal from '@/components/modal/modal';
import AddNewCommunityForm from './modals/add-new-community-form';
import DeleteCommunityForm from './modals/delete-community-form';

export function CommunitiesTable() {
  const {
    isDeleteModalOpen,
    isEditModalOpen,
    setIsDeleteModalOpen,
    setIsEditModalOpen,
    activeElement,
    setActiveElement,
  } = useTableModals<Community>();
  const { data = [], refetch } = useCommunities();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const handleClickOpenEditModal = (community: Community | null) => {
    setIsEditModalOpen(true);
    setActiveElement(community);
  };
  const handleOpenDeleteEditModal = (community: Community) => {
    setIsDeleteModalOpen(true);
    setActiveElement(community);
  };

  const handleOnCloseModal = () => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setActiveElement(null);
    refetch();
  };

  const columns: ColumnDef<Community>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div
          className={
            row.original.status.toLowerCase() === 'active'
              ? 'text-green-600'
              : 'text-red-600'
          }>
          {row.getValue('status')}
        </div>
      ),
    },

    {
      accessorKey: 'power',
      header: 'Power',
      cell: ({ row }) => <div>{row.getValue('power')}</div>,
    },
    {
      accessorKey: 'address',
      header: 'Address',
      cell: ({ row }) => <div>{row.getValue('address')}</div>,
    },
    {
      accessorKey: 'contracts',
      header: 'Contracts',
      cell: ({ row }) => (
        <div className="text-left">{row.getValue('contracts')}</div>
      ),
    },
    {
      header: 'Used Capacity',
      cell: ({ row }) => (
        <div className="text-left">{`${row.original.capacity.totalUsed} / 100%`}</div>
      ),
    },
    {
      header: () => <div className="text-right">Actions</div>,
      id: 'actions',
      cell: ({ row }) => {
        const community = row.original;
        return (
          <div className="flex justify-end">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleClickOpenEditModal(community)}>
              <EditIcon />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleOpenDeleteEditModal(community)}>
              <TrashIcon />
            </Button>
            <Button asChild size="icon" variant="ghost">
              <Link href={`/communities/${community.id}`}>
                <EyeIcon />
              </Link>
            </Button>
          </div>
        );
      },
    },
  ];

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

  return (
    <div className="w-full">
      <div className="flex items-center justify-between w-full py-4">
        <Input
          placeholder="Filter communities..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex gap-4 w-fit">
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
                      onCheckedChange={(value: any) =>
                        column.toggleVisibility(!!value)
                      }>
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => handleClickOpenEditModal(null)}>
            Create new
          </Button>
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
        {/* {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected. */}
      </div>
      <div className="space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {/* 
          <Button
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
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleOnCloseModal}
        title={!activeElement ? 'Add New community' : 'Edit Community'}
        description={
          !activeElement
            ? 'Fill out the form below to add a new community'
            : 'Edit the form below to edit the community'
        }>
        <AddNewCommunityForm
          onClose={handleOnCloseModal}
          communityToEdit={activeElement ?? undefined}
        />
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Community"
        description="Are you sure you want to delete this community?">
        {activeElement && (
          <DeleteCommunityForm
            onClose={handleOnCloseModal}
            community={activeElement}
          />
        )}
      </Modal>
    </div>
  );
}
