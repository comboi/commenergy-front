import React, { memo } from 'react';
import { Button, ButtonWithTooltip } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

type DocumentsFormFooterProps = {
  onClose: () => void;
};

const DocumentsFormFooter = ({ onClose }: DocumentsFormFooterProps) => {
  return (
    <DialogFooter>
      <div className="flex justify-end gap-4">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <ButtonWithTooltip
          variant="default"
          onClick={onClose}
          disabled
          tooltip="Missing community documents">
          Submit documents
        </ButtonWithTooltip>
      </div>
    </DialogFooter>
  );
};

export default memo(DocumentsFormFooter);
