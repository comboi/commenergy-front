import Modal from '@/components/modal/modal';

import { Contract } from '../types/contract';
import AddNewContractForm from './add-new-contract/add-new-contract-form';
import DeleteContractForm from './add-new-contract/delete-contract-form';

type Props = {
  activeContract?: Contract;
  isModalDetailOpen: boolean;
  isDeleteModalOpen: boolean;
  onClose: (contractId: string) => void;
};

export function ContractsTableModals({
  activeContract,
  isModalDetailOpen,
  isDeleteModalOpen,
  onClose,
}: Props) {
  return (
    <>
      <Modal
        isOpen={isModalDetailOpen}
        onClose={onClose}
        title={activeContract ? 'Edit contract' : 'Add new contract'}
        description="Fill out the form below to add a new contract"
        enableScroll={true}>
        <AddNewContractForm onClose={onClose} contractToEdit={activeContract} />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={onClose}
        title="Delete Contract"
        description="Are you sure you want to delete this contract?">
        {activeContract && (
          <DeleteContractForm onClose={onClose} contract={activeContract} />
        )}
      </Modal>
    </>
  );
}
