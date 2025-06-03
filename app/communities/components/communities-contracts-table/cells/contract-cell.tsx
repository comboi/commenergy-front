import { CommunityContract } from '@/app/communities/model/communityContract';
import StatusWithTooltip from '@/components/status/status-with-tooltip';
import { memo } from 'react';

type ContractCellProps = {
  contract: CommunityContract['contract'];
};

export const ContractCell = memo<ContractCellProps>(
  ({ contract }: ContractCellProps) => {
    return (
      <div className="capitalize flex gap-1 items-center">
        <span>{contract.name}</span>
        <StatusWithTooltip status={contract.state} />
      </div>
    );
  }
);

ContractCell.displayName = 'ContractCell';
