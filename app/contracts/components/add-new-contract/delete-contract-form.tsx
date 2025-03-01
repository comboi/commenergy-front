import { Button } from '@/components/ui/button';

import React from 'react';

import { Contract } from '../../model/contract';

import { DialogFooter } from '@/components/ui/dialog';
import { useDeleteContract } from '../../services/useDeleteContract';
type Props = {
  onClose: () => void;
  contract: Contract;
};

const DeleteContractForm = ({ contract, onClose }: Props) => {
  const { mutate } = useDeleteContract({ callback: onClose });

  const handleDeleteClick = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(contract.id);
    onClose();
  };

  return (
    <DialogFooter>
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="destructive" onClick={handleDeleteClick}>
        Delete
      </Button>
    </DialogFooter>
  );
};

export default DeleteContractForm;
