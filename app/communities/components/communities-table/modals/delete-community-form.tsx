import { Button } from '@/components/ui/button';

import React from 'react';

import { DialogFooter } from '@/components/ui/dialog';
import { useDeleteCommunity } from '@/app/communities/services/useDeleteCommunity';
import { Community } from '@/app/communities/model/community';

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

  return (
    <DialogFooter>
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="destructive" onClick={handleDeleteClick}>
        Delete
      </Button>
    </DialogFooter>
  );
};

export default DeleteCommunityForm;
