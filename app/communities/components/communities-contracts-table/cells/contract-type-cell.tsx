import { User, Zap } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CommunityContract } from '@/app/communities/model/communityContract';

type ContractTypeCellProps = {
  contract: CommunityContract['contract'];
};

export const ContractTypeCell = ({ contract }: ContractTypeCellProps) => {
  return (
    <div className="capitalize">
      {contract.contractType === 'CONSUMPTION' ? (
        <Tooltip>
          <TooltipContent>Consumption</TooltipContent>
          <TooltipTrigger>
            <User className="w-5 h-5" />
          </TooltipTrigger>
        </Tooltip>
      ) : (
        <Tooltip>
          <TooltipContent>Generation</TooltipContent>
          <TooltipTrigger>
            <Zap className="w-5 h-5" />
          </TooltipTrigger>
        </Tooltip>
      )}
    </div>
  );
};
