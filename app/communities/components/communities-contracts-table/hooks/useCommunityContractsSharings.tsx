import { CommunityContract } from '@/app/communities/model/communityContract';
import { NewSharingDto } from '@/app/sharings/model/sharing';
import { useUpdateSharing } from '@/app/sharings/services/useSharings';
import { useState } from 'react';
import { toast } from 'sonner';
import { getSharingDifference } from '../utils/get-sharing-difference';

const useCommunityContractsSharings = (
  data: CommunityContract[],
  originalData: CommunityContract[],
  callback: () => void
) => {
  const [isUpdatingSharings, setIsUpdatingSharings] = useState(false);

  const { mutate: updateSharing } = useUpdateSharing({});

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
      await Promise.all([
        ...sharingsToUpdate.map(async (sharing) => {
          return updateSharing(sharing);
        }),
      ]);

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
