import { CommunityContract } from '@/app/platform/communities/model/communityContract';
import Link from 'next/link';

type CupseCellProps = {
  contract: CommunityContract['contract'];
};

export const ContractCodeCell = ({ contract }: CupseCellProps) => {
  return (
    <div className="capitalize">
      <Link
        href={`/platform/contracts/${contract.id}`}
        className="hover:underline">
        {contract.contractCode}
      </Link>
    </div>
  );
};
