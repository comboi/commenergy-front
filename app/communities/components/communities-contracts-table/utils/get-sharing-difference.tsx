import { CommunityContract } from '@/app/communities/model/communityContract';

export const getSharingDifference = (
  originalContracts: CommunityContract[],
  newContract: CommunityContract
) => {
  const hasShare = newContract.sharing?.share !== undefined;
  const originalContractShare = originalContracts.find(
    (contract) => contract.id === newContract.id
  )?.sharing?.share;

  const actualShare = newContract.sharing?.share;

  const dirtyDifference = hasShare
    ? parseFloat(
        (
          (Number(actualShare ?? 0) - Number(originalContractShare ?? 0)) *
          100
        ).toFixed(2)
      )
    : 0;

  return dirtyDifference;
};
