import { Button } from '@/components/ui/button';
import React, { useState } from 'react';

import { v4 } from 'uuid';

import {
  Community,
  mapCommunityToDto,
  NewCommunityDto,
} from '@/app/platform/communities/model/community';

import { useUpdateCommunity } from '@/app/platform/communities/services/communities/useUpdateCommunity';
import { useCreateCommunity } from '@/app/platform/communities/services/communities/useCreateCommunity';
import InputField from '@/components/inputs/InputField';
import Select from '@/components/inputs/Select';

type Props = {
  onClose: () => void;
  communityToEdit?: Community;
};

const AddNewCommunityForm = ({ communityToEdit, onClose }: Props) => {
  const { mutate: createCommunity } = useCreateCommunity({
    callback: onClose,
  });
  const { mutate: updateCommunity } = useUpdateCommunity({ callback: onClose });

  const initialData = communityToEdit
    ? mapCommunityToDto(communityToEdit)
    : ({
        id: v4(),
        name: '',
        address: '',
        description: '',
        power: 0,
        createdAt: new Date().toISOString(),
        energySourceType: 'SOLAR',
        status: 'INACTIVE',
        communityContracts: [],
      } as NewCommunityDto);

  const [formData, setFormData] = useState<NewCommunityDto>(initialData);

  const handleChange = (value: string | number, name: string) => {
    console.log('name', name);
    console.log('value', value);
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!communityToEdit) {
      createCommunity(formData);
    } else {
      updateCommunity(formData);
    }
  };

  const statusOptions = [
    'PENDING_TO_BE_CONSTITUTED',
    'CONSTITUTED',
    'ACTIVE',
    'INACTIVE',
  ].map((status) => ({
    value: status,
    label: status,
  }));

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 flex flex-col gap-2 py-4">
        <InputField
          label="Name"
          name="name"
          value={formData.name ?? ''}
          onChange={handleChange}
        />
        <InputField
          label="Address"
          name="address"
          value={formData.address ?? ''}
          onChange={handleChange}
        />
        <InputField
          label="Description"
          name="description"
          value={formData.description ?? ''}
          onChange={handleChange}
        />

        <Select
          label="Status"
          onChange={(value) =>
            setFormData({
              ...formData,
              status: value as Community['status'],
            })
          }
          options={statusOptions}
          value={formData.status ?? ''}
        />

        {!communityToEdit && <Button type="submit">Add Community</Button>}
        {communityToEdit && (
          <div className="flex gap-4 justify-end w-full">
            <Button variant="outline">Cancel</Button>
            <Button type="submit">Update</Button>
          </div>
        )}
      </div>
    </form>
  );
};

export default AddNewCommunityForm;
