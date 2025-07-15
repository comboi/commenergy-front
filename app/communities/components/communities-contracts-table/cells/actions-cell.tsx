import { EditIcon, FileCheck, FileX, Paperclip, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommunityContract } from '@/app/communities/model/communityContract';
import { memo, useCallback } from 'react';

type ActionsCellProps = {
  areDocumentsReady: boolean;
  communityContract: CommunityContract;
  isDisabled: boolean;
  onEdit: (communityContract: CommunityContract) => void;
  onDelete: (communityContract: CommunityContract) => void;
  handleOpenDocuments: (communityContract: CommunityContract) => void;
};

export const ActionsCell = memo<ActionsCellProps>(
  ({
    areDocumentsReady,
    communityContract,
    onEdit,
    onDelete,
    isDisabled,
    handleOpenDocuments,
  }: ActionsCellProps) => {
    const handleEdit = useCallback(() => {
      onEdit(communityContract);
    }, [onEdit, communityContract]);

    const handleDelete = useCallback(() => {
      onDelete(communityContract);
    }, [onDelete, communityContract]);

    const handleDocuments = useCallback(() => {
      handleOpenDocuments(communityContract);
    }, [handleOpenDocuments, communityContract]);

    return (
      <div className="flex justify-end">
        {isDisabled ? (
          <span>{'-'}</span>
        ) : (
          <>
            <Button size="icon" variant="ghost" onClick={handleDocuments}>
              {areDocumentsReady ? <FileCheck /> : <FileX />}
            </Button>
            <Button size="icon" variant="ghost" onClick={handleEdit}>
              <EditIcon />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleDelete}>
              <TrashIcon />
            </Button>
          </>
        )}
      </div>
    );
  }
);

ActionsCell.displayName = 'ActionsCell';
