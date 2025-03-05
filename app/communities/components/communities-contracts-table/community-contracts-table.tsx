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
import { ChevronDown, Pencil, PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CommunityContract } from '@/app/communities/model/communityContract';
import { useCommunityContracts } from '@/app/communities/services/communityContracts/useCommunityContracts';
import UserTooltip from '@/app/users/components/user-tooltip';
import AddNewContractModal from './add-new-contract-modal';
import AddNewContract from './add-new-contract-modal';
import Modal from '@/components/modal/modal';

export const columns: ColumnDef<CommunityContract>[] = [
  {
    accessorFn: (row) => row.contract.cups,
    header: 'Cups',
    cell: ({ row }) => (
      <div className="capitalize">{row.original.contract.cups}</div>
    ),
  },
  {
    accessorFn: (row) => row.contract.state,
    header: 'Status',
    cell: ({ row }) => (
      <div
        className={
          row.original.contract.state === 'Active'
            ? 'text-green-600'
            : 'text-red-600'
        }>
        {row.original.contract.state}
      </div>
    ),
  },
  {
    accessorFn: (row) => row.contract.user,
    header: 'User VAT',
    cell: ({ row }) => (
      <UserTooltip user={row.original.contract.user}>
        {row.original.contract.user.vat}
      </UserTooltip>
    ),
  },
  {
    accessorFn: (row) => row.contract.contractPower,
    header: 'Contract Power',
    cell: ({ row }) => <div>{row.original.contract.contractPower} Kw</div>,
  },
  {
    accessorKey: 'communityFee',
    header: 'Community Fee',
    cell: ({ row }) => <div>{`${row.getValue('communityFee')} `}</div>,
  },
  {
    accessorKey: 'communityShare',
    header: 'Community Share',
    cell: ({ row }) => {
      const communityShare = row.getValue('communityShare') as number;
      const [isEditing, setIsEditing] = React.useState(false);
      const [isHovered, setIsHovered] = React.useState(false);

      const onBlur = (value: number) => {
        setIsEditing(false);
        // table.options.meta?.updateData(row.index, 'communityShare', value);
      };

      return (
        <div
          className="relative flex items-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}>
          {isEditing ? (
            <Input
              type="number"
              defaultValue={communityShare}
              onBlur={(e) => onBlur(Number.parseFloat(e.target.value))}
              autoFocus
              className="w-20"
              min={0}
              max={1}
              step={0.01}
            />
          ) : (
            <div
              className="cursor-pointer flex items-center space-x-2"
              onClick={() => setIsEditing(true)}>
              <span>{communityShare.toFixed(2)}</span>
            </div>
          )}
          {isHovered && !isEditing && (
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 absolute right-0"
              onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit community share</span>
            </Button>
          )}
        </div>
      );
    },
  },
];

interface CommunityContractsTableProps {
  communityId: string;
}

export function CommunityContractsTable({
  communityId,
}: CommunityContractsTableProps) {
  const [isAddNewOpen, setIsAddNewOpen] = React.useState(false);
  const [isSharingOpen, setIsSharingOpen] = React.useState(false);
  const [data, setData] = React.useState<CommunityContract[]>([]);
  const { data: originalData } = useCommunityContracts(communityId);
  React.useEffect(() => {
    setData(originalData ?? []);
  }, [originalData]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

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
    meta: {
      updateData: (rowIndex: number, columnId: string, value: unknown) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
  });

  const isDirty = React.useMemo(() => {
    return JSON.stringify(data) !== JSON.stringify(originalData);
  }, [data, originalData]);

  const handleUpdate = () => {
    // Here you would typically send the updated data to your backend
    console.log('Updating data:', data);
    // setOriginalData(data);
  };

  const handleExport = (format: 'txt' | 'csv') => {
    // Here you would implement the export logic
    console.log(`Exporting data as ${format}`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Community Contracts</CardTitle>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Actions <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleExport('txt')}>
                  Export as TXT
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  Export as CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
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
            <Button onClick={() => setIsAddNewOpen(true)}>
              Add contract
              <PlusCircle />
            </Button>
            <Button onClick={() => setIsSharingOpen(true)}>
              Sharings
              <PlusCircle />
            </Button>
            {/* <Modal
              isOpen={isAddNewOpen}
              onClose={() => setIsAddNewOpen(false)}
              title="Add new contract"
              description="">
              <AddNewContract />
            </Modal> */}
            <Modal
              isOpen={isSharingOpen}
              onClose={() => setIsSharingOpen(false)}
              title="Export sharings"
              description="">
              <AddNewContract />
            </Modal>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{' '}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2 flex items-center">
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
              </Button>
              <Button onClick={handleUpdate} disabled={!isDirty}>
                Update
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
