import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipPortal,
  TooltipContent,
} from '@radix-ui/react-tooltip';
import { User } from '../model/user';
import { Info } from 'lucide-react';

type Props = {
  user: User;
  children: React.ReactNode;
};

const UserTooltip = ({ user, children }: Props) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex gap-2 items-center">
            {children}
            <Info size={16} />
          </div>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent className="TooltipContent" sideOffset={5}>
            <ul className="list-none p-4 m-0 bg-black text-xs border rounded-md flex flex-col gap-1">
              <li>Id: {user.id}</li>
              <li>User: {user.name}</li>
              <li>Phone: {user.mobile}</li>
              <li>Name: {user.name}</li>
              <li>VAT: {user.vat}</li>
            </ul>
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UserTooltip;
