import { EditIcon, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommunityContract } from '@/app/communities/model/communityContract';
import { memo, useCallback } from 'react';

type ActionsCellProps = {
  communityContract: CommunityContract;
  onEdit: (communityContract: CommunityContract) => void;
  onDelete: (communityContract: CommunityContract) => void;
};

export const ActionsCell = memo<ActionsCellProps>(
  ({ communityContract, onEdit, onDelete }: ActionsCellProps) => {
    const handleEdit = useCallback(() => {
      onEdit(communityContract);
    }, [onEdit, communityContract]);

    const handleDelete = useCallback(() => {
      onDelete(communityContract);
    }, [onDelete, communityContract]);

    return (
      <div className="flex justify-end">
        <Button size="icon" variant="ghost" onClick={handleEdit}>
          <EditIcon />
        </Button>
        <Button size="icon" variant="ghost" onClick={handleDelete}>
          <TrashIcon />
        </Button>
      </div>
    );
  }
);

ActionsCell.displayName = 'ActionsCell';
