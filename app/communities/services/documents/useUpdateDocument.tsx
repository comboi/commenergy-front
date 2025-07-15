import apiClient from '@/lib/api-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Document } from '../../model/document';
import { useEffect } from 'react';
import { toast } from 'sonner';

const updateDocument = async ({
  documentId,
  name,
  longDescription,
  file,
}: {
  documentId: string;
  name?: string;
  longDescription?: string;
  file?: File;
}): Promise<Document> => {
  const formData = new FormData();

  // Add file if provided (for replacing the document file)
  if (file) {
    formData.append('file', file);
  }

  // Add metadata as form fields if provided
  if (name) {
    formData.append('name', name);
  }

  if (longDescription) {
    formData.append('longDescription', longDescription);
  }

  const { data } = await apiClient.put(
    `/documents/${documentId}?timestamp=${Date.now()}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    }
  );
  return data;
};

type UpdateDocumentMutationProps = {
  callback?: () => void;
  communityId?: string;
};

export function useUpdateDocument({
  callback,
  communityId,
}: UpdateDocumentMutationProps) {
  const queryClient = useQueryClient();

  const { data, error, isSuccess, isError, isPending, mutate, reset } =
    useMutation({
      mutationFn: updateDocument,
      onSuccess: (updatedDocument, variables) => {
        // Optimistically update the document in the list
        if (communityId) {
          queryClient.setQueryData<Document[]>(
            ['communityDocuments', communityId],
            (old) =>
              old?.map((doc) =>
                doc.id === variables.documentId ? updatedDocument : doc
              ) || []
          );
        }
      },
      onError: (error) => {
        console.error('Error updating document:', error);
      },
      onSettled: (data, error, variables) => {
        // Always refetch after error or success to ensure we have the latest data
        if (communityId) {
          queryClient.invalidateQueries({
            queryKey: ['communityDocuments', communityId],
          });
        }
      },
    });

  useEffect(() => {
    if (isSuccess) {
      toast.success('Document updated successfully');
      callback?.();
      // Auto-reset after success
      setTimeout(() => reset(), 100);
    } else if (isError) {
      toast.error('Error updating document');
    }
  }, [isSuccess, isError, callback, reset]);

  return {
    data,
    error,
    isSuccess,
    isError,
    isPending,
    mutate,
    reset,
  };
}
