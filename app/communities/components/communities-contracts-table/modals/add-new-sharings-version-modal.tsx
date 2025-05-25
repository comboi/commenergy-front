import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { v4 } from 'uuid';
import InputField from '@/components/inputs/InputField';

import { DialogFooter } from '@/components/ui/dialog';

import { Checkbox } from '@/components/ui/checkbox';
import { useCreateSharingVersionBulk } from '@/app/sharings/services/useSharingVersions';
import { CommunityContract } from '@/app/communities/model/communityContract';

type Props = {
  onClose: (newVersionId?: string) => void;
  communityId: string;
  sharings: CommunityContract['sharing'][];
};

const AddNewSharingsVersionModal = ({
  onClose,
  communityId,
  sharings,
}: Props) => {
  const { mutate: createSharingVersion } = useCreateSharingVersionBulk({
    callback: (id) => onClose(id),
  });

  const [name, setName] = useState('');
  const [isProductionVersion, setIsProductionVersion] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const versionId = v4();
    const filteredSharings = sharings.filter(
      (sharing) => sharing?.communityContractId
    );
    await createSharingVersion({
      id: versionId,
      name,
      isProductionVersion: isProductionVersion,
      communityId,
      sharings: filteredSharings.map((sharing) => ({
        id: v4(),
        versionId,
        share: sharing?.share ?? 0,
        communityContractId: sharing!.communityContractId,
      })),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 flex flex-col gap-2 py-4">
        <InputField
          label="Version name"
          name="name"
          value={name}
          onChange={(name) => {
            setName(String(name));
          }}
        />
        <div className="flex flex-row items-center gap-2">
          <Checkbox
            checked={isProductionVersion}
            onCheckedChange={() => setIsProductionVersion((prev) => !prev)}
          />
          <label>Is production</label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button type="submit">Create</Button>
        </DialogFooter>
      </div>
    </form>
  );
};

export default AddNewSharingsVersionModal;
