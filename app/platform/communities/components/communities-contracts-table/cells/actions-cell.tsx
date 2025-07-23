import { EditIcon, FileCheck, FileX, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommunityContract } from '@/app/platform/communities/model/communityContract';
import { memo, useCallback } from 'react';
import { useCommunityAdmin } from '@/app/platform/communities/contexts/community-admin-context';
import { useAuth } from '@/app/platform/auth/contexts/auth-context';

type ActionsCellProps = {
  hasTermsAgreement: boolean;
  communityContract: CommunityContract;
  onEdit: (communityContract: CommunityContract) => void;
  onDelete: (communityContract: CommunityContract) => void;
  handleOpenDocuments: (communityContract: CommunityContract) => void;
};

export const ActionsCell = memo<ActionsCellProps>(
  ({
    hasTermsAgreement,
    communityContract,
    onEdit,
    onDelete,
    handleOpenDocuments,
  }: ActionsCellProps) => {
    const { isLoggedUserAdmin } = useCommunityAdmin();
    const { user } = useAuth();
    const isUserOwnerContract = communityContract.contract.userId === user?.id;

    const handleEdit = useCallback(() => {
      onEdit(communityContract);
    }, [onEdit, communityContract]);

    const handleDelete = useCallback(() => {
      onDelete(communityContract);
    }, [onDelete, communityContract]);

    const handleDocuments = useCallback(() => {
      handleOpenDocuments(communityContract);
    }, [handleOpenDocuments, communityContract]);

    const getDocumentIcon = () => {
      return hasTermsAgreement ? (
        <FileCheck />
      ) : (
        <FileX className="opacity-40" />
      );
    };

    return (
      <div className="flex justify-end">
        {!isLoggedUserAdmin ? (
          isUserOwnerContract ? (
            <>
              <Button size="icon" variant="ghost" onClick={handleDocuments}>
                {getDocumentIcon()}
              </Button>
            </>
          ) : (
            <span></span>
          )
        ) : (
          <>
            <Button size="icon" variant="ghost" onClick={handleDocuments}>
              {getDocumentIcon()}
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
