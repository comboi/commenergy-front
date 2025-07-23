import { CommunityContract } from '@/app/platform/communities/model/communityContract';
import { formatPrice } from '@/utils/currency-formatters';

type CommunityFeeCellProps = {
  communityFee: CommunityContract['communityFee'];
  communityFeePeriodType: CommunityContract['communityFeePeriodType'];
};

export const CommunityFeeCell = ({
  communityFee,
  communityFeePeriodType,
}: CommunityFeeCellProps) => {
  return Number(communityFee) ?? 0 > 0 ? (
    <div>{`${formatPrice(
      communityFee as any
    )} / ${communityFeePeriodType}`}</div>
  ) : (
    <div>{`-`}</div>
  );
};
