'use client';

import { PlusCircle, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
  isLoggedUserAdmin: boolean;
  onAddContract: () => void;
  onBulkImport: () => void;
}

export const EmptyState = ({
  isLoggedUserAdmin,
  onAddContract,
  onBulkImport,
}: EmptyStateProps) => {
  if (!isLoggedUserAdmin) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <PlusCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No contracts yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            This community doesn't have any contracts yet. Contact your
            community administrator to add contracts.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <PlusCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No contracts yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Get started by adding contracts to this community. You can add them
          individually or import multiple contracts at once.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={onAddContract} className="min-w-[140px]">
            <PlusCircle className="h-4 w-4" />
            Add contract
          </Button>
          <Button
            onClick={onBulkImport}
            className="min-w-[140px]"
            variant="secondary">
            <Upload className="h-4 w-4" />
            Bulk import
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
