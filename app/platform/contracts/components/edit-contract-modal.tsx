'use client';

import React, { useState } from 'react';
import Modal from '@/components/modal/modal';
import { Contract } from '../model/contract';
import AddNewContractForm from './add-new-contract/add-new-contract-form';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  contract: Contract;
  onContractUpdated?: () => void;
};

const EditContractModal = ({
  isOpen,
  onClose,
  contract,
  onContractUpdated,
}: Props) => {
  const handleContractUpdate = (contractId: string) => {
    onClose();
    onContractUpdated?.();
  };

  return (
    <Modal
      title="Edit Contract"
      description="Update the contract information below."
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-2xl">
      <AddNewContractForm
        contractToEdit={contract}
        onClose={handleContractUpdate}
      />
    </Modal>
  );
};

export default EditContractModal;
