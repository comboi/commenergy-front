import { CommunityContract } from '@/app/communities/model/communityContract';
import { NewSharingDto } from '@/app/sharings/model/sharing';

import { useState } from 'react';
import { toast } from 'sonner';
import { getSharingDifference } from '../utils/get-sharing-difference';
import { updateSharingVersion } from '@/app/sharings/services/useSharingVersions';

const useCommunityContractsSharings = (
  data: CommunityContract[],
  originalData: CommunityContract[],
  callback: () => void
) => {
  const [isUpdatingSharings, setIsUpdatingSharings] = useState(false);

  const { mutate: updateSharing } = updateSharingVersion({});

  const handleUpdateSharings = async () => {
    const sharingsToUpdate: NewSharingDto[] = data
      .filter((contract) => {
        const sharingDifference = getSharingDifference(originalData, contract);
        return sharingDifference !== 0;
      })
      .map((contract) => ({
        id: contract.sharing!.id,
        share: contract.sharing!.share,
        communityContractId: contract.id,
        versionId: contract.sharing!.versionId,
      }));

    setIsUpdatingSharings(true);
    try {
      await updateSharing({
        versionId: sharingsToUpdate[0]!.versionId,
        sharings: sharingsToUpdate,
      });

      toast.success('Sharings updated successfully');
      callback();
    } catch (error) {
      toast.error('Error updating sharings');
    } finally {
      setIsUpdatingSharings(false);
    }
  };

  return {
    isUpdatingSharings,
    updateSharings: handleUpdateSharings,
  };
};

export default useCommunityContractsSharings;
