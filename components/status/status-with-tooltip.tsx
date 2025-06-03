import { TooltipPortal } from '@radix-ui/react-tooltip';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

type Props = {
  status: string;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-600';
    case 'Inactive':
      return 'text-red-600';
    default:
      return 'text-red-600';
  }
};

const StatusBadge = ({ status }: Props) => {
  return (
    <div className={`${getStatusColor(status)} w-2 h-2 rounded-full`}></div>
  );
};

const StatusWithTooltip = ({ status }: Props) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipPortal>
          <TooltipContent className="TooltipContent" sideOffset={5}>
            <div className="p-2 text-sm text-white bg-black rounded-md flex gap-4 items-center">
              <span>{`Status: ${status}`}</span>
              <StatusBadge status={status} />
            </div>
          </TooltipContent>
        </TooltipPortal>
        <TooltipTrigger asChild>
          <div className="p-2  cursor-pointer">
            <StatusBadge status={status} />
          </div>
        </TooltipTrigger>
      </Tooltip>
    </TooltipProvider>
  );
};

export default StatusWithTooltip;
