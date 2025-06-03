import { Button } from '@/components/ui/button';

import React from 'react';

import { DialogFooter } from '@/components/ui/dialog';

import { CommunityContract } from '@/app/communities/model/communityContract';
import { useDeleteCommunityContract } from '@/app/communities/services/communityContracts/useDeleteCommunityContract';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
type Props = {
  onClose: () => void;
  communityContract: CommunityContract;
};

const DeleteCommunityContractForm = ({ communityContract, onClose }: Props) => {
  const { mutate } = useDeleteCommunityContract({ callback: onClose });

  const handleDeleteClick = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      communityContractId: communityContract.id,
      communityId: communityContract.communityId,
    });
    onClose();
  };

  return (
    <div>
      <Table className="mb-8">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contract Code</TableHead>
            <TableHead>Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableCell>{communityContract.contract.name}</TableCell>
          <TableCell>{communityContract.contract.contractCode}</TableCell>
          <TableCell>{communityContract.contract.fullAddress}</TableCell>
        </TableBody>
      </Table>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={handleDeleteClick}>
          Delete
        </Button>
      </DialogFooter>
    </div>
  );
};

export default DeleteCommunityContractForm;
