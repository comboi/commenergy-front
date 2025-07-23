import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

type AddDocumentButtonProps = {
  onClick: () => void;
};

const AddDocumentButton = ({ onClick }: AddDocumentButtonProps) => {
  return (
    <div className="mb-4">
      <Button
        variant="outline"
        size="sm"
        onClick={onClick}
        className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add New Document
      </Button>
    </div>
  );
};

export default memo(AddDocumentButton);
