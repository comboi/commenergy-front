import { CommunityContract } from '@/app/platform/communities/model/communityContract';

type ContractPowerCellProps = {
  contractPower: CommunityContract['contract']['contractPower'];
};

export const ContractPowerCell = ({
  contractPower,
}: ContractPowerCellProps) => {
  return <div>{contractPower} kWh</div>;
};
