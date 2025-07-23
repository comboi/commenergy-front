'use client';

import React, { useState } from 'react';
import { Community } from '../../model/community';
import { Document, DocumentType } from '../../model/document';
import { useCommunityModelDocuments } from '../../services/communities/useCommunityDocuments';
import {
  useCommunityDocuments,
  useDeleteCommunityDocument,
} from '../../services/communities/useCommunityDocumentsUpload';
import { useCommunityAdmin } from '../../contexts/community-admin-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DocumentItemsList } from './document-items/document-items-list';
import { AddDocumentModal } from './add-new-document-modal/add-document-modal';
import { DeleteDocumentModal } from './delete-document-modal';

// Reusable tab styling constants
const TAB_LIST_CLASSES =
  'h-auto w-full justify-start rounded-none border-b bg-transparent p-0';
const TAB_TRIGGER_CLASSES =
  'relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none';

interface CommunityDocumentsProps {
  community: Community;
  refreshCommunityDetails: () => void;
}

export function CommunityDocuments({
  community,
  refreshCommunityDetails,
}: CommunityDocumentsProps) {
  const [activeTab, setActiveTab] = useState<'model' | 'community'>(
    'community'
  );
  const [isAddDocumentDialogOpen, setIsAddDocumentDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
    null
  );
  const { isLoggedUserAdmin } = useCommunityAdmin();

  const {
    data: modelDocuments = [],
    isLoading: isLoadingModel,
    error: errorModel,
    refetch: refetchModel,
  } = useCommunityModelDocuments(community.id, {
    enabled: activeTab === 'model',
  });

  const {
    data: communityDocuments = [],
    isLoading: isLoadingCommunity,
    error: errorCommunity,
    refetch: refetchCommunity,
  } = useCommunityDocuments(community.id, {
    enabled: activeTab === 'community',
  });

  const deleteMutation = useDeleteCommunityDocument({
    communityId: community.id,
    callback: () => {
      refetchModel();
      refetchCommunity();
      refreshCommunityDetails();
    },
  });

  const handleAddDocumentClose = () => {
    setIsAddDocumentDialogOpen(false);
  };

  const handleAddDocumentSuccess = () => {
    setIsAddDocumentDialogOpen(false);
    refetchModel();
    refetchCommunity();
    refreshCommunityDetails();
  };

  const isLoading = isLoadingModel || isLoadingCommunity;
  const error = errorModel || errorCommunity;
  const refetch = () => {
    refetchModel();
    refetchCommunity();
  };

  const getFilteredDocuments = (): Document[] => {
    if (activeTab === 'model') {
      return modelDocuments;
    }
    if (activeTab === 'community') {
      return communityDocuments;
    }
    return [];
  };

  const filteredDocuments = getFilteredDocuments();

  const handleDelete = (document: Document) => {
    setDocumentToDelete(document);
  };

  const handleConfirmDelete = () => {
    if (documentToDelete) {
      deleteMutation.mutate({
        communityId: community.id,
        documentId: documentToDelete.id,
      });
      setDocumentToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDocumentToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold">Community Documents</h3>
        </div>
        <div className="border rounded-lg p-6">
          <div className="text-center text-gray-500">
            <p>Loading documents...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold">Community Documents</h3>
        </div>
        <div className="border rounded-lg p-6">
          <div className="text-center text-red-500">
            <p>Error loading documents</p>
            <Button onClick={() => refetch()} className="mt-2">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Community Documents</h3>
        {isLoggedUserAdmin && (
          <Button
            className="px-4 py-2"
            onClick={() => setIsAddDocumentDialogOpen(true)}>
            Add Document
          </Button>
        )}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as 'model' | 'community')}>
        <TabsList className={TAB_LIST_CLASSES}>
          <TabsTrigger value="community" className={TAB_TRIGGER_CLASSES}>
            Community Documents
          </TabsTrigger>
          <TabsTrigger value="model" className={TAB_TRIGGER_CLASSES}>
            Model contract documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <DocumentItemsList
            documents={filteredDocuments}
            isLoggedUserAdmin={isLoggedUserAdmin}
            emptyMessage="No documents found for this category"
            onDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>

      <AddDocumentModal
        isOpen={isAddDocumentDialogOpen}
        onClose={handleAddDocumentClose}
        community={community}
        onSuccess={handleAddDocumentSuccess}
      />

      {/* Delete Confirmation Modal */}
      <DeleteDocumentModal
        document={documentToDelete}
        isOpen={!!documentToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
