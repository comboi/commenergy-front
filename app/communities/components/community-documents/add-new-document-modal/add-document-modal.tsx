'use client';

import React, { useState, useCallback } from 'react';
import { Community } from '../../../model/community';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCreateNewCommunityDocument } from '../../../services/communities/useCommunityDocumentsUpload';
import NewDocumentForm from './new-document-form';
import { NewDocumentData } from '../community-documents-form/components/types';

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  community: Community;
  onSuccess?: () => void;
}

export function AddDocumentModal({
  isOpen,
  onClose,
  community,
  onSuccess,
}: AddDocumentModalProps) {
  const [newDocumentData, setNewDocumentData] = useState<NewDocumentData>({
    name: '',
    description: '',
    documentType: '',
  });

  const { mutate: createNewDocument, isPending: isCreatingNewDocument } =
    useCreateNewCommunityDocument({
      communityId: community.id,
      // Remove callback from here to prevent loops
    });

  const handleNewDocumentSubmit = useCallback(
    (file: File) => {
      createNewDocument(
        {
          file,
          name: newDocumentData.name,
          longDescription: newDocumentData.description,
          documentType: newDocumentData.documentType,
          communityId: community.id,
        },
        {
          onSuccess: () => {
            setNewDocumentData({
              name: '',
              description: '',
              documentType: '',
            });
            onSuccess?.();
          },
        }
      );
    },
    [newDocumentData, createNewDocument, community.id, onSuccess]
  );

  const handleCancel = useCallback(() => {
    setNewDocumentData({
      name: '',
      description: '',
      documentType: '',
    });
    onClose();
  }, [onClose]);

  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="max-w-2xl"
        onPointerDownOutside={handleCancel}
        onEscapeKeyDown={handleCancel}>
        <DialogHeader>
          <DialogTitle>Add New Document</DialogTitle>
        </DialogHeader>
        <NewDocumentForm
          newDocumentData={newDocumentData}
          onDataChange={setNewDocumentData}
          onSubmit={handleNewDocumentSubmit}
          onCancel={handleCancel}
          isCreating={isCreatingNewDocument}
        />
      </DialogContent>
    </Dialog>
  );
}
