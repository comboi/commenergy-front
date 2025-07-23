import React, { useState, useCallback } from 'react';
import { Community } from '@/app/platform/communities/model/community';
import { useCommunityModelDocuments } from '@/app/platform/communities/services/communities/useCommunityDocuments';
import {
  useCommunityDocuments,
  useDeleteCommunityDocument,
  useCreateNewCommunityDocument,
} from '@/app/platform/communities/services/communities/useCommunityDocumentsUpload';
import { useUpdateDocument } from '@/app/platform/communities/services/documents/useUpdateDocument';
import NewDocumentForm from '../add-new-document-modal/new-document-form';
import DocumentsTable from './components/DocumentsTable';
import DocumentsFormFooter from './components/DocumentsFormFooter';
import AddDocumentButton from './components/AddDocumentButton';
import { UploadAction, NewDocumentData } from './components/types';

type Props = {
  onClose: () => void;
  community: Community;
};

const CommunityDocumentsForm = ({ community, onClose }: Props) => {
  const [showNewDocumentForm, setShowNewDocumentForm] = useState(false);
  const [newDocumentData, setNewDocumentData] = useState<NewDocumentData>({
    name: '',
    description: '',
    documentType: '',
  });

  const { data: communityModelDocuments = [] } = useCommunityModelDocuments(
    community.id
  );

  const { data: communityDocuments = [], refetch } = useCommunityDocuments(
    community.id
  );

  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  const { mutate: uploadDocument, isPending: isUploading } = useUpdateDocument({
    callback: handleRefetch,
    communityId: community.id,
  });

  const { mutate: deleteDocument, isPending: isDeleting } =
    useDeleteCommunityDocument({
      callback: handleRefetch,
      communityId: community.id,
    });

  const { mutate: createNewDocument, isPending: isCreatingNewDocument } =
    useCreateNewCommunityDocument({
      callback: useCallback(() => {
        handleRefetch();
        setShowNewDocumentForm(false);
        setNewDocumentData({ name: '', description: '', documentType: '' });
      }, [handleRefetch]),
      communityId: community.id,
    });

  const handleDownload = useCallback((fileUrl: string) => {
    window.open(fileUrl, '_blank');
  }, []);

  const handleFileUpload = useCallback(
    (file: File, action: UploadAction) => {
      if (action.type === 'template' && action.documentId) {
        uploadDocument({
          documentId: action.documentId,
          file: file,
          name: action.name,
          longDescription: action.description,
        });
      } else if (action.type === 'new') {
        createNewDocument({
          communityId: community.id,
          name: action.name || file.name,
          longDescription: action.description,
          file: file,
          documentType: action.documentType,
        });
      }
    },
    [uploadDocument, createNewDocument, community.id]
  );

  const handleTemplateFileUpload = useCallback(
    (file: File, documentId: string) => {
      handleFileUpload(file, {
        type: 'template',
        documentId: documentId,
      });
    },
    [handleFileUpload]
  );

  const handleRemoveDocument = useCallback(
    (documentId: string) => {
      deleteDocument({
        communityId: community.id,
        documentId,
      });
    },
    [deleteDocument, community.id]
  );

  const handleNewDocumentSubmit = useCallback(
    (file: File) => {
      if (newDocumentData.name.trim()) {
        handleFileUpload(file, {
          type: 'new',
          name: newDocumentData.name,
          description: newDocumentData.description || undefined,
          documentType: newDocumentData.documentType || 'COMMUNITY_DOCUMENT',
        });
      }
    },
    [newDocumentData, handleFileUpload]
  );

  const handleNewDocumentCancel = useCallback(() => {
    setShowNewDocumentForm(false);
    setNewDocumentData({
      name: '',
      description: '',
      documentType: '',
    });
  }, []);

  const handleShowNewDocumentForm = useCallback(() => {
    setShowNewDocumentForm(true);
  }, []);

  return (
    <div className="relative">
      {showNewDocumentForm && (
        <NewDocumentForm
          newDocumentData={newDocumentData}
          onDataChange={setNewDocumentData}
          onSubmit={handleNewDocumentSubmit}
          onCancel={handleNewDocumentCancel}
          isCreating={isCreatingNewDocument}
        />
      )}
      {!showNewDocumentForm && (
        <AddDocumentButton onClick={handleShowNewDocumentForm} />
      )}
      <DocumentsTable
        communityModelDocuments={communityModelDocuments}
        communityDocuments={communityDocuments}
        onTemplateFileUpload={handleTemplateFileUpload}
        onDownload={handleDownload}
        onRemoveDocument={handleRemoveDocument}
        isUploading={isUploading}
        isDeleting={isDeleting}
      />
      <DocumentsFormFooter onClose={onClose} />
    </div>
  );
};

export default CommunityDocumentsForm;
