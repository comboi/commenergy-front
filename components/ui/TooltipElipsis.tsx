import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';

type Props = {
  children: React.ReactNode;
  className?: string;
};

const TooltipEllipsisText = ({ children, className = '' }: Props) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipPortal>
        <TooltipContent className="p-4 bg-black text-xs border rounded-md">
          {children}
        </TooltipContent>
      </TooltipPortal>
      <TooltipTrigger asChild>
        <div className={`truncate ${className}`}>{children}</div>
      </TooltipTrigger>
    </Tooltip>
  </TooltipProvider>
);
export default TooltipEllipsisText;
