import { CommunityContract } from '@/app/communities/model/communityContract';

type CupseCellProps = {
  contract: CommunityContract['contract'];
};

export const ContractCodeCell = ({ contract }: CupseCellProps) => {
  return <div className="capitalize">{contract.contractCode}</div>;
};
