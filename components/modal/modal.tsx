import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';

type Props = {
  title: string;
  isOpen: boolean;
  onClose: (x?: any) => void;
  children?: React.ReactNode;
  description: string;
  primaryButton?: React.ReactNode;
  secondaryButton?: React.ReactNode;
  className?: string;
  enableScroll?: boolean;
  maxHeight?: string;
};

const Modal = ({
  title = '',
  description = '',
  isOpen,
  onClose,
  children,
  primaryButton = null,
  secondaryButton,
  className = '',
  enableScroll = true,
  maxHeight = '70vh',
}: Props) => {
  const contentClasses = enableScroll
    ? `overflow-y-auto px-2 ${
        maxHeight.startsWith('max-h-') ? maxHeight : `max-h-[${maxHeight}]`
      }`
    : '';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className={`flex flex-col ${className}`}>
          <DialogTitle className="px-2">{title}</DialogTitle>
          <DialogDescription className="px-2">{description}</DialogDescription>
          <div className={contentClasses}>{children}</div>
          {primaryButton ||
            (secondaryButton && (
              <DialogFooter
                className={
                  enableScroll ? 'pt-4 border-t bg-white sticky bottom-0' : ''
                }>
                {primaryButton}
                {secondaryButton}
              </DialogFooter>
            ))}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default Modal;
