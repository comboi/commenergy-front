'use client';

import { v7 } from 'uuid';
import { useState, useMemo, useEffect } from 'react';
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
  ChevronUp,
  EditIcon,
  History,
  Pencil,
  PlusCircle,
  TrashIcon,
  User,
  Zap,
} from 'lucide-react';

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
import { CardTitle } from '@/components/ui/card';
import { CommunityContract } from '@/app/communities/model/communityContract';
import { useCommunityContracts } from '@/app/communities/services/communityContracts/useCommunityContracts';
import UserTooltip from '@/app/users/components/user-tooltip';

import Modal from '@/components/modal/modal';
import SharingsModal from './modals/sharings-modal';
import AddNewCommunityContractModal from './modals/add-new-community-contract-modal';
import DeleteCommunityContractForm from './modals/delete-community-contract-form';
import { formatPrice } from '@/utils/currency-formatters';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import useCommunityContractsSharings from './hooks/useCommunityContractsSharings';
import AddNewSharingsVersionModal from './modals/add-new-sharings-version-modal';
import { getSharingDifference } from './utils/get-sharing-difference';

interface CommunityContractsTableProps {
  communityId: string;
  communityName: string;
  refreshCommunityDetails: () => void;
}

export function CommunityContractsTable({
  communityId,
  communityName,
  refreshCommunityDetails,
}: CommunityContractsTableProps) {
  const [isCreateNewSharingsVersionOpen, setIsCreateNewSharingsVersionOpen] =
    useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddNewOpen, setIsAddNewOpen] = useState(false);
  const [selectedCommunityContract, setSelectedCommunityContract] =
    useState<CommunityContract | null>(null);
  const [isSharingOpen, setIsSharingOpen] = useState(false);
  const [data, setData] = useState<CommunityContract[]>([]);

  const { data: originalData = [], refetch } =
    useCommunityContracts(communityId);

  useEffect(() => {
    setData(originalData ?? []);
  }, [originalData]);

  const handleCloseAndUpdate = () => {
    setIsSharingOpen(false);
    setIsAddNewOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedCommunityContract(null);
    setIsCreateNewSharingsVersionOpen(false);
    refetch();
    refreshCommunityDetails();
  };

  const { updateSharings } = useCommunityContractsSharings(
    data,
    originalData,
    handleCloseAndUpdate
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const handleClickOpenEditModal =
    (communityContract: CommunityContract) => () => {
      setSelectedCommunityContract(communityContract);
      setIsAddNewOpen(true);
    };
  const handleClickOpenDeleteModal = (communityContract: CommunityContract) => {
    setSelectedCommunityContract(communityContract);
    setIsDeleteModalOpen(true);
  };

  const sharingActiveVersion = data.find(
    (contract) => contract.sharing?.version
  )?.sharing?.version;

  const handleEditSharing = (
    communityContract: CommunityContract,
    newSharingValue: number
  ) => {
    setData(
      (prevData) =>
        prevData.map((contract) =>
          contract.id === communityContract.id
            ? {
                ...contract,
                sharing: {
                  ...((contract.sharing ?? {}) as CommunityContract['sharing']),
                  communityContractId: communityContract.id,
                  createdDate:
                    communityContract.sharing?.createdDate ??
                    new Date().toISOString(),
                  id: communityContract.sharing?.id ?? v7(),
                  updatedDate: new Date().toISOString(),
                  version: sharingActiveVersion ?? null,
                  versionId: sharingActiveVersion?.id ?? null,
                  share: newSharingValue,
                },
              }
            : contract
        ) as CommunityContract[]
    );
  };

  const columns: ColumnDef<CommunityContract>[] = [
    {
      header: 'Type',
      cell: ({ row }) => (
        <div className="capitalize">
          {row.original.contract.contractType === 'CONSUMPTION' ? (
            <Tooltip>
              <TooltipContent>Consumption</TooltipContent>
              <TooltipTrigger>
                <User className="w-5 h-5" />
              </TooltipTrigger>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipContent>Generation</TooltipContent>
              <TooltipTrigger>
                <Zap className="w-5 h-5" />
              </TooltipTrigger>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      header: 'Cups',
      cell: ({ row }) => (
        <div className="capitalize">{row.original.contract.cups}</div>
      ),
    },
    {
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
      header: 'User VAT',
      cell: ({ row }) => (
        <UserTooltip user={row.original.contract.user}>
          {row.original.contract.user.vat}
        </UserTooltip>
      ),
    },
    {
      header: 'Contract Power',
      cell: ({ row }) => <div>{row.original.contract.contractPower} Kw</div>,
    },
    {
      accessorKey: 'communityFee',
      header: 'Community Fee',
      cell: ({ row }) =>
        Number(row.original.communityFee) ?? 0 > 0 ? (
          <div>{`${formatPrice(row.getValue('communityFee'))} / ${
            row.original.communityFeePeriodType
          }`}</div>
        ) : (
          <div>{`-`}</div>
        ),
    },
    {
      header: 'Community Share',
      cell: ({ row }) => {
        const hasShare = row.original.sharing;
        const communityShare = (
          (row.original.sharing?.share ?? 0) * 100
        ).toFixed(2);

        const [isEditing, setIsEditing] = useState(false);
        const [isHovered, setIsHovered] = useState(false);

        const dirtyDifference = getSharingDifference(
          originalData,
          row.original
        );
        const isShareEdited = dirtyDifference !== 0;

        return row.original.contract.contractType === 'GENERATION' ? (
          <div className="text-gray-400">{'-'}</div>
        ) : (
          <div
            className="relative flex items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            {isEditing ? (
              <Input
                type="number"
                defaultValue={communityShare}
                onBlur={(e) => {
                  setIsEditing(false);
                  handleEditSharing(
                    row.original,
                    Number((Number(e.target.value) / 100).toFixed(4))
                  );
                }}
                autoFocus
                className="w-20"
                min={0}
                max={100}
                step={1}
              />
            ) : (
              <div
                className="cursor-pointer flex items-center space-x-2"
                onClick={() => setIsEditing(true)}>
                <span>{hasShare ? `${communityShare}%` : '-'}</span>
                {isShareEdited && !isHovered && (
                  <span className="flex items-center">
                    {dirtyDifference > 0 ? (
                      <ChevronUp className="w-3 h-3 text-green-600 mr-1" />
                    ) : (
                      <ChevronDown className="w-3 h-3 text-red-600 mr-1" />
                    )}
                    {`${Math.abs(dirtyDifference)}%`}
                  </span>
                )}
              </div>
            )}
            {isHovered && !isEditing && (
              <Button
                variant="ghost"
                className="h-8 w-8 ml-4"
                onClick={() => setIsEditing(true)}>
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      },
    },
    {
      header: () => <div className="text-right">Actions</div>,
      id: 'actions',
      cell: ({ row }) => {
        const communityContract = row.original;
        return (
          <div className="flex justify-end">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleClickOpenEditModal(communityContract)}>
              <EditIcon />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                handleClickOpenDeleteModal(communityContract);
              }}>
              <TrashIcon />
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

  const isDirty = useMemo(() => {
    return JSON.stringify(data) !== JSON.stringify(originalData);
  }, [data, originalData]);

  const handleExport = (format: 'txt' | 'csv') => {
    // Here you would implement the export logic
    console.log(`Exporting data as ${format}`);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
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
          <Button onClick={() => setIsSharingOpen(true)} variant="outline">
            Sharings
            <History />
          </Button>
          <Button onClick={() => setIsAddNewOpen(true)}>
            Add contract
            <PlusCircle />
          </Button>
          <Modal
            isOpen={isAddNewOpen}
            onClose={handleCloseAndUpdate}
            title="Add new contract"
            description="">
            <AddNewCommunityContractModal
              onClose={handleCloseAndUpdate}
              communityId={communityId}
              communityContractsOfTheCommunity={data}
              communityContractToEdit={selectedCommunityContract}
            />
          </Modal>
          <Modal
            className="max-w-[800px]"
            isOpen={isSharingOpen}
            onClose={handleCloseAndUpdate}
            title="Sharing versions"
            description="">
            <SharingsModal
              communityId={communityId}
              onClose={handleCloseAndUpdate}
            />
          </Modal>
          <Modal
            className="max-w-[800px]"
            isOpen={isDeleteModalOpen}
            onClose={handleCloseAndUpdate}
            title="Delete community contract"
            description={`Are you sure you want to delete this contract from the "${communityName}" community?`}>
            {selectedCommunityContract && (
              <DeleteCommunityContractForm
                onClose={handleCloseAndUpdate}
                communityContract={selectedCommunityContract}
              />
            )}
          </Modal>
          <Modal
            isOpen={isCreateNewSharingsVersionOpen}
            onClose={handleCloseAndUpdate}
            title="Create new sharings version"
            description={`specify the details of this new version of the community sharings sharings`}>
            <AddNewSharingsVersionModal
              sharings={data.map((contract) => contract.sharing)}
              communityId={communityId}
              onClose={async () => {
                await updateSharings();
                handleCloseAndUpdate;
              }}
            />
          </Modal>
        </div>
      </div>

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
          {/* <div className="flex-1 text-sm text-muted-foreground">
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
          </div> */}
        </div>
      </div>

      <div
        className={`transition-all absolute flex justify-between items-center gap-2 ${
          isDirty ? 'block' : 'hidden'
        } w-[calc(100%-64px)] mx-8 left-0 p-4 bg-slate-200 rounded-t-sm text-black bottom-0`}>
        {sharingActiveVersion
          ? `Editing: ${sharingActiveVersion.name}`
          : 'Create your first version'}
        <div className="flex gap-4">
          <Button
            size="sm"
            variant="link"
            className="text-black"
            onClick={() => setData(originalData)}>
            Undo
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsCreateNewSharingsVersionOpen(true)}>
            Create new version
          </Button>
          {sharingActiveVersion && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => updateSharings()}>
              Update version
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
