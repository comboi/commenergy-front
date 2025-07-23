import { CommunityContract } from '@/app/platform/communities/model/communityContract';
import StatusWithTooltip from '@/components/status/status-with-tooltip';
import Link from 'next/link';
import { memo } from 'react';

type ContractCellProps = {
  contract: CommunityContract['contract'];
};

export const ContractCell = memo<ContractCellProps>(
  ({ contract }: ContractCellProps) => {
    return (
      <div className="capitalize flex gap-1 items-center">
        <Link
          href={`/platform/contracts/${contract.id}`}
          className="hover:underline">
          <span>{contract.name}</span>
        </Link>
        <StatusWithTooltip status={contract.state} />
      </div>
    );
  }
);

ContractCell.displayName = 'ContractCell';
