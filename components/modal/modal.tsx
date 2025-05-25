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
}: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className={className}>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          {children}
          {primaryButton ||
            (secondaryButton && (
              <DialogFooter>
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
