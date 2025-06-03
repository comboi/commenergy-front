import { ChevronDown, History, PlusCircle, Search } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import React, { memo } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CardTitle } from '@/components/ui/card';
import Modal from '@/components/modal/modal';
import { CommunityContract } from '@/app/communities/model/communityContract';
import AddNewCommunityContractModal from '../modals/add-new-community-contract-modal';
import DeleteCommunityContractForm from '../modals/delete-community-contract-form';
import { SharingsModal } from '../sharings-versions/sharings-modal';
import { AddNewSharingsVersionModal } from '../sharings-versions/add-new-sharings-version-modal';
import { ActionsDropdown } from './actions-dropdown';
import { CommunityContractsSearch } from '../components/community-contracts-search';
import { ContractTypeToggle } from '../components/contract-type-toggle';

type CommunityContractsTableHeaderProps = {
  table: Table<CommunityContract>;
  communityId: string;
  communityName: string;
  data: CommunityContract[];
  selectedCommunityContract: CommunityContract | null;
  isAddNewOpen: boolean;
  isSharingOpen: boolean;
  isDeleteModalOpen: boolean;
  isCreateNewSharingsVersionOpen: boolean;
  onAddNewOpen: () => void;
  onSharingOpen: () => void;
  onCloseAndUpdate: () => void;
  onExport: (format: 'txt' | 'csv') => void;
};

export const CommunityContractsTableHeader =
  memo<CommunityContractsTableHeaderProps>(
    ({
      table,
      communityId,
      communityName,
      data,
      selectedCommunityContract,
      isAddNewOpen,
      isSharingOpen,
      isDeleteModalOpen,
      isCreateNewSharingsVersionOpen,
      onAddNewOpen,
      onSharingOpen,
      onCloseAndUpdate,
      onExport,
    }: CommunityContractsTableHeaderProps) => {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle>Community Contracts</CardTitle>
            <div className="flex items-center space-x-2">
              <CommunityContractsSearch />
              <ContractTypeToggle />
              <ActionsDropdown onExport={onExport} />
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
              <Button onClick={onSharingOpen} variant="outline">
                Sharings
                <History />
              </Button>
              <Button onClick={onAddNewOpen}>
                Add contract
                <PlusCircle />
              </Button>
            </div>
          </div>

          {/* Modals */}
          <Modal
            isOpen={isAddNewOpen}
            onClose={onCloseAndUpdate}
            title="Add new contract"
            description="">
            <AddNewCommunityContractModal
              onClose={onCloseAndUpdate}
              communityId={communityId}
              communityContractsOfTheCommunity={data}
              communityContractToEdit={selectedCommunityContract}
            />
          </Modal>
          <Modal
            className="max-w-[800px]"
            isOpen={isSharingOpen}
            onClose={onCloseAndUpdate}
            title="Sharing versions"
            description="">
            <SharingsModal
              communityId={communityId}
              onClose={onCloseAndUpdate}
            />
          </Modal>
          <Modal
            className="max-w-[800px]"
            isOpen={isDeleteModalOpen}
            onClose={onCloseAndUpdate}
            title="Delete community contract"
            description={`Are you sure you want to delete this contract from the "${communityName}" community?`}>
            {selectedCommunityContract && (
              <DeleteCommunityContractForm
                onClose={onCloseAndUpdate}
                communityContract={selectedCommunityContract}
              />
            )}
          </Modal>
          <Modal
            isOpen={isCreateNewSharingsVersionOpen}
            onClose={onCloseAndUpdate}
            title="Create new sharings version"
            description={`specify the details of this new version of the community sharings sharings`}>
            <AddNewSharingsVersionModal
              sharings={data.map((contract) => contract.sharing)}
              communityId={communityId}
              onClose={async () => {
                onCloseAndUpdate();
              }}
            />
          </Modal>
        </div>
      );
    }
  );

CommunityContractsTableHeader.displayName = 'CommunityContractsTableHeader';
