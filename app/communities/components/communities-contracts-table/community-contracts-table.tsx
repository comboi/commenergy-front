'use client';

import { useState, useMemo, useCallback } from 'react';
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
import { ArrowDown, ArrowUp } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CommunityContract } from '@/app/communities/model/communityContract';
import { useCommunityContracts } from '@/app/communities/services/communityContracts/useCommunityContracts';

import useCommunityContractsSharings from './hooks/useCommunityContractsSharings';
import { ContractTypeCell } from './cells/contract-type-cell';
import { ContractCell } from './cells/contract-cell';
import { UserCell } from './cells/user-cell';
import { ContractPowerCell } from './cells/contract-power-cell';
import { CommunityFeeCell } from './cells/community-fee-cell';
import { CommunityShareCell } from './cells/community-share-cell';
import { ActionsCell } from './cells/actions-cell';
import { SharingsVersionUpdateBar } from './sharings-versions/sharing-version-update-bar';
import { CommunityContractsTableHeader } from './header/table-header';
import { exportCommunityContracts } from './file-utils/export-file-utils';
import { ContractCodeCell } from './cells/contract-code-cell';
import {
  CommunityContractsProvider,
  useCommunityContracts as useCommunityContractsContext,
} from './contexts/community-contracts-context';
import { Community } from '../../model/community';

interface CommunityContractsTableProps {
  community: Community;
  refreshCommunityDetails: () => void;
  isLoggedUserAdmin: boolean;
}

const TABLE_PAGINATION = {
  pageSize: 300,
  pageIndex: 0,
};

// Table content component that uses the community contracts context
const CommunityContractsTableContent = ({
  community,
  refreshCommunityDetails,
  isLoggedUserAdmin,
}: CommunityContractsTableProps) => {
  const communityId = community.id;
  const communityName = community.name;

  const {
    filteredData,
    draftData,
    originalData,
    isDirty,
    updateSharing,
    resetDraftData,
  } = useCommunityContractsContext();

  const [isCreateNewSharingsVersionOpen, setIsCreateNewSharingsVersionOpen] =
    useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddNewOpen, setIsAddNewOpen] = useState(false);
  const [selectedCommunityContract, setSelectedCommunityContract] =
    useState<CommunityContract | null>(null);
  const [selectedContractDocuments, setSelectedContractDocuments] =
    useState<CommunityContract | null>(null);
  const [isSharingOpen, setIsSharingOpen] = useState(false);

  const {
    data: fetchedData = [],
    refetch,
    isLoading,
  } = useCommunityContracts(communityId);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const handleCloseAndUpdate = () => {
    setIsSharingOpen(false);
    setIsAddNewOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedCommunityContract(null);
    setSelectedContractDocuments(null);
    setIsCreateNewSharingsVersionOpen(false);
    setIsSharingOpen(false);
    refetch();
    refreshCommunityDetails();
  };

  const { updateSharings } = useCommunityContractsSharings(
    draftData,
    originalData,
    handleCloseAndUpdate
  );

  const handleClickOpenEditModal = useCallback(
    (communityContract: CommunityContract) => {
      setSelectedCommunityContract(communityContract);
      setIsAddNewOpen(true);
    },
    []
  );

  const handleClickOpenDocuments = useCallback(
    (communityContract: CommunityContract) => {
      setSelectedContractDocuments(communityContract);
    },
    []
  );

  const handleClickOpenDeleteModal = useCallback(
    (communityContract: CommunityContract) => {
      setSelectedCommunityContract(communityContract);
      setIsDeleteModalOpen(true);
    },
    []
  );

  const sharingActiveVersion = useMemo(
    () =>
      draftData.find((contract) => contract.sharing?.version)?.sharing?.version,
    [draftData]
  );

  const handleEditSharing = useCallback(
    (communityContract: CommunityContract, newSharingValue: number) => {
      updateSharing(
        communityContract.id,
        newSharingValue,
        sharingActiveVersion
      );
    },
    [updateSharing, sharingActiveVersion]
  );

  const columns: ColumnDef<CommunityContract>[] = useMemo(
    () => [
      {
        header: 'Type',
        cell: ({ row }) => (
          <ContractTypeCell contract={row.original.contract} />
        ),
      },
      {
        accessorFn: (row) => row.contract.contractCode,
        header: 'Code (CUPS/CAU)',
        enableSorting: true,
        cell: ({ row }) => (
          <ContractCodeCell contract={row.original.contract} />
        ),
      },
      {
        accessorFn: (row) => row.contract.name,
        header: 'Contract',
        enableSorting: true,
        cell: ({ row }) => <ContractCell contract={row.original.contract} />,
      },
      {
        accessorFn: (row) => row.contract.user.vat,
        header: 'User',
        enableSorting: true,
        cell: ({ row }) => <UserCell user={row.original.contract.user} />,
      },
      {
        accessorFn: (row) => row.contract.contractPower,
        header: 'Contract Power',
        enableSorting: true,
        cell: ({ row }) => (
          <ContractPowerCell
            contractPower={row.original.contract.contractPower}
          />
        ),
      },
      {
        accessorKey: 'communityFee',
        header: 'Community Fee',
        enableSorting: true,
        cell: ({ row }) => (
          <CommunityFeeCell
            communityFee={row.original.communityFee}
            communityFeePeriodType={row.original.communityFeePeriodType}
          />
        ),
      },
      {
        accessorFn: (row) => row.sharing?.share ?? 0,
        header: 'Community Share',
        enableSorting: true,
        cell: ({ row }) => (
          <CommunityShareCell
            isEditable={isLoggedUserAdmin}
            communityContract={row.original}
            originalData={originalData}
            onEditSharing={handleEditSharing}
          />
        ),
      },
      {
        header: () => <div className="text-right w-full">Actions</div>,
        id: 'actions',
        cell: ({ row }) => {
          const contract = row.original;
          return (
            <ActionsCell
              handleOpenDocuments={handleClickOpenDocuments}
              hasTermsAgreement={!!contract.termsAgreement}
              isDisabled={!isLoggedUserAdmin}
              communityContract={contract}
              onEdit={handleClickOpenEditModal}
              onDelete={handleClickOpenDeleteModal}
            />
          );
        },
      },
    ],
    [
      handleEditSharing,
      handleClickOpenEditModal,
      handleClickOpenDeleteModal,
      originalData,
    ]
  );

  const handleExport = useCallback(
    (format: 'txt' | 'csv') => {
      exportCommunityContracts(fetchedData, format, communityName);
    },
    [fetchedData, communityName]
  );

  // Memoize table configuration to prevent unnecessary re-renders
  const tableConfig = useMemo(
    () => ({
      data: filteredData, // Use filtered data from context instead of raw fetched data
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
        pagination: TABLE_PAGINATION,
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
      },
    }),
    [
      filteredData, // Use filtered data from context
      columns,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    ]
  );

  const table = useReactTable(tableConfig);

  const headerProps = useMemo(
    () => ({
      isLoggedUserAdmin,
      draftData,
      table,
      communityId,
      communityName,
      data: originalData,
      selectedCommunityContract,
      isAddNewOpen,
      isSharingOpen,
      isDeleteModalOpen,
      selectedContractDocuments,
      isCreateNewSharingsVersionOpen,
      onAddNewOpen: () => setIsAddNewOpen(true),
      onSharingOpen: () => setIsSharingOpen(true),
      onCloseAndUpdate: handleCloseAndUpdate,
      onExport: handleExport,
    }),
    [
      isLoggedUserAdmin,
      draftData,
      table,
      communityId,
      communityName,
      originalData,
      selectedCommunityContract,
      isAddNewOpen,
      isSharingOpen,
      selectedContractDocuments,
      isDeleteModalOpen,
      isCreateNewSharingsVersionOpen,
      handleCloseAndUpdate,
      handleExport,
    ]
  );

  return (
    <div className="flex flex-col gap-4 h-full">
      <CommunityContractsTableHeader {...headerProps} />
      <div className="space-y-4 w-ful mb-8">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : (
                          <div
                            className={
                              header.column.getCanSort()
                                ? 'cursor-pointer select-none flex items-center gap-2'
                                : 'flex items-center gap-2'
                            }
                            onClick={header.column.getToggleSortingHandler()}>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() && (
                              <div className="flex flex-col items-center">
                                <ArrowUp
                                  className={`h-4 w-4 ${
                                    header.column.getIsSorted() === 'desc'
                                      ? 'block'
                                      : 'hidden'
                                  }`}
                                />
                                <ArrowDown
                                  className={`h-4 w-4 -mt-1 ${
                                    header.column.getIsSorted() === 'asc'
                                      ? 'block'
                                      : 'hidden'
                                  }`}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody
              columnsNumber={columns.length}
              isLoading={isLoading}
              noItems={!isLoading && table.getRowModel().rows?.length === 0}>
              {table.getRowModel().rows.map((row) => (
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
      </div>
      <SharingsVersionUpdateBar
        isDirty={isDirty}
        sharingActiveVersion={sharingActiveVersion}
        onUndo={resetDraftData}
        onCreateNewVersion={() => setIsCreateNewSharingsVersionOpen(true)}
        onUpdateVersion={updateSharings}
        sharings={draftData.map((contract) => contract.sharing) ?? []}
      />
    </div>
  );
};

// Main component that wraps the table content with CommunityContractsProvider
export const CommunityContractsTable = (
  props: CommunityContractsTableProps
) => {
  const { data: fetchedData = [] } = useCommunityContracts(props.community.id);

  return (
    <CommunityContractsProvider data={fetchedData}>
      <CommunityContractsTableContent {...props} />
    </CommunityContractsProvider>
  );
};
