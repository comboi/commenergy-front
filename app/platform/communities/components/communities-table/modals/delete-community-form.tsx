import { Button } from '@/components/ui/button';

import React from 'react';

import { DialogFooter } from '@/components/ui/dialog';
import { useDeleteCommunity } from '@/app/platform/communities/services/communities/useDeleteCommunity';
import { Community } from '@/app/platform/communities/model/community';

type Props = {
  onClose: () => void;
  community: Community;
};

const DeleteCommunityForm = ({ community, onClose }: Props) => {
  const { mutate } = useDeleteCommunity({ callback: onClose });

  const handleDeleteClick = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(community.id);
    onClose();
  };

  const contractsCount = community.contracts || 0;
  const usersCount = community.users?.length || 0;

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {(contractsCount > 0 || usersCount > 0) && (
          <div className="mt-2">
            <p className="font-medium mb-1">Warning:</p>
            <ul className="text-sm space-y-1">
              {contractsCount > 0 && (
                <li>
                  • {contractsCount} contract{contractsCount !== 1 ? 's' : ''}{' '}
                  will be removed from this community.
                </li>
              )}
              {usersCount > 0 && (
                <li>
                  • {usersCount} user{usersCount !== 1 ? 's' : ''} will be
                  affected
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={handleDeleteClick}>
          Delete
        </Button>
      </DialogFooter>
    </div>
  );
};

export default DeleteCommunityForm;
