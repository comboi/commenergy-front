import { CommunityContract } from '@/app/communities/model/communityContract';
import UserTooltip from '@/app/users/components/user-tooltip';

type UserCellProps = {
  user: CommunityContract['contract']['user'];
};

export const UserCell = ({ user }: UserCellProps) => {
  return <UserTooltip user={user}>{user.vat}</UserTooltip>;
};
