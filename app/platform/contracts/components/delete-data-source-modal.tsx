import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { components } from '@/lib/api-schema';

type DataSource = components['schemas']['DataSourceResponseDto'];

interface DeleteDataSourceModalProps {
  dataSource: DataSource;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export function DeleteDataSourceModal({
  dataSource,
  isOpen,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteDataSourceModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Data Source
          </DialogTitle>
          <DialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete the data source "{dataSource.name}
              "?
            </p>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. All data and configurations
              associated with this data source will be permanently removed.
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
