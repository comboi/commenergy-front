import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import { v4 } from 'uuid';
import InputField from '@/components/inputs/InputField';
import Select from '@/components/inputs/Select';
import { CommunityContract } from '@/app/communities/model/communityContract';

import { DialogFooter } from '@/components/ui/dialog';
import { useUpdateCommunityContract } from '@/app/communities/services/communityContracts/useUpdateCommunityContract';
import { useCreateCommunityContract } from '@/app/communities/services/communityContracts/useCreateCommunityContract';
import { useContracts } from '@/app/contracts/services/useContracts';
import AddNewContractForm from '@/app/contracts/components/add-new-contract/add-new-contract-form';
import Modal from '@/components/modal/modal';

type Props = {
  onClose: () => void;
  communityId: string;
  communityContractToEdit: CommunityContract | null;
  communityContractsOfTheCommunity: CommunityContract[];
};

type FormData = {
  id: string;
  contractId: string;
  communityId: string;
  communityJoinDate: string;
  communityFee: number;
  communityFeePeriodType: 'Monthly' | 'Quarterly' | 'Semiannually' | 'Yearly';
  termsAgreement: string | null;
  sharingIds: unknown[];
};

const AddNewCommunityContractModal = ({
  onClose,
  communityId,
  communityContractToEdit,
  communityContractsOfTheCommunity,
}: Props) => {
  const [createNewContractModalOpen, setCreateNewContractModalOpen] =
    useState(false);
  const [pendingContractId, setPendingContractId] = useState<string | null>(
    null
  );
  const { data: contracts, refetch: refetchContractOptions } = useContracts({
    ownerType: null,
  });
  const { mutate: createCommunityContract } = useCreateCommunityContract({
    callback: onClose,
  });
  const { mutate: updateCommunityContract } = useUpdateCommunityContract({
    callback: onClose,
  });

  const initialData: FormData = communityContractToEdit
    ? {
        id: communityContractToEdit.id,
        contractId: communityContractToEdit.contract.id,
        communityId: communityContractToEdit.communityId,
        communityJoinDate:
          communityContractToEdit.communityJoinDate ?? new Date().toISOString(),
        communityFee: communityContractToEdit.communityFee ?? 0,
        communityFeePeriodType:
          communityContractToEdit.communityFeePeriodType ?? 'Monthly',
        termsAgreement: communityContractToEdit.termsAgreement ?? null,
        sharingIds: communityContractToEdit.sharingIds ?? [],
      }
    : {
        id: v4(),
        contractId: '',
        communityId,
        communityJoinDate: new Date().toISOString(),
        communityFee: 0,
        communityFeePeriodType: 'Monthly',
        termsAgreement: null,
        sharingIds: [],
      };

  const [formData, setFormData] = useState<FormData>(initialData);

  // Effect to set the contract ID after refetch is complete
  useEffect(() => {
    if (
      pendingContractId &&
      contracts &&
      contracts.some((contract) => contract.id === pendingContractId)
    ) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        contractId: pendingContractId,
      }));
      setPendingContractId(null);
    }
  }, [contracts, pendingContractId]);

  const handleChange = (value: string | number, name: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!communityContractToEdit) {
      createCommunityContract(formData);
    } else {
      updateCommunityContract({
        ...formData,
        communityContractId: formData.id,
      });
    }
  };

  const feePeriodOptions = [
    'Monthly',
    'Quarterly',
    'Semiannually',
    'Yearly',
  ].map((period) => ({
    value: period,
    label: period,
  }));

  const mapOptionsToCommunitySelect = (contracts || []).map((contract) => {
    const isContractAlreadyAdded = Boolean(
      communityContractsOfTheCommunity.find(
        (comContract) => comContract.contract.id === contract.id
      )
    );

    return {
      label: `${contract.name}${isContractAlreadyAdded ? ' - (Added)' : ''}`,
      value: contract.id,
      disabled: isContractAlreadyAdded,
    };
  });

  const handleCreateNewContract = () => {
    setCreateNewContractModalOpen(true);
  };

  const handleOnCloseCreateNewContractModal = (contractId: string) => {
    setCreateNewContractModalOpen(false);
    if (contractId) {
      // Set the pending contract ID and trigger refetch
      setPendingContractId(contractId);
      refetchContractOptions();
    }
  };

  const isSelectedContractGeneration =
    contracts?.find((contract) => contract.id === formData.contractId)
      ?.contractType === 'GENERATION';

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 flex flex-col gap-2 py-4">
          <Select
            label="Contract"
            disabled={!!communityContractToEdit}
            id="contractId"
            onAddNewOption={handleCreateNewContract}
            addNewOptionLabel="Add new contract"
            onChange={(value) =>
              setFormData({
                ...formData,
                contractId: value,
              })
            }
            options={mapOptionsToCommunitySelect}
            value={formData.contractId}
          />
          {!isSelectedContractGeneration && (
            <>
              <InputField
                label="Community Fee (€)"
                name="communityFee"
                type="number"
                value={formData.communityFee}
                onChange={handleChange}
              />
              <Select
                label="Fee Period Type"
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    communityFeePeriodType:
                      value as FormData['communityFeePeriodType'],
                  })
                }
                options={feePeriodOptions}
                value={formData.communityFeePeriodType}
              />
            </>
          )}

          <InputField
            label="Terms Agreement"
            name="termsAgreement"
            value={''}
            onChange={handleChange}
          />
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {communityContractToEdit ? 'Update' : 'Create'} Contract
            </Button>
          </DialogFooter>
        </div>
      </form>
      {createNewContractModalOpen && (
        <Modal
          isOpen={createNewContractModalOpen}
          onClose={handleOnCloseCreateNewContractModal}
          title={'Create a new contract'}
          description="Fill out the form below to add a new contract">
          <AddNewContractForm onClose={handleOnCloseCreateNewContractModal} />
        </Modal>
      )}
    </>
  );
};

export default AddNewCommunityContractModal;
