import apiClient from '@/lib/api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Document } from '../../model/document';
import { useEffect } from 'react';
import { toast } from 'sonner';

const fetchCommunityDocuments = async (id: string): Promise<Document[]> => {
  const { data } = await apiClient.get(`/communities/${id}/documents`);
  return data;
};

export function useCommunityDocuments(
  id: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ['communityDocuments', id],
    queryFn: () => fetchCommunityDocuments(id),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 2,
    enabled: options?.enabled !== false,
  });
}

const deleteCommunityDocument = async ({
  communityId,
  documentId,
}: {
  communityId: string;
  documentId: string;
}): Promise<void> => {
  await apiClient.delete(`/communities/${communityId}/documents/${documentId}`);
};

type DeleteDocumentMutationProps = {
  callback?: () => void;
  communityId?: string;
};

export function useDeleteCommunityDocument({
  callback,
  communityId,
}: DeleteDocumentMutationProps = {}) {
  const queryClient = useQueryClient();

  const { data, error, isSuccess, isError, reset, ...rest } = useMutation({
    mutationFn: deleteCommunityDocument,
    onMutate: async ({ communityId, documentId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['communityDocuments', communityId],
      });

      // Snapshot the previous value
      const previousDocuments = queryClient.getQueryData<Document[]>([
        'communityDocuments',
        communityId,
      ]);

      // Optimistically update by removing the document
      queryClient.setQueryData<Document[]>(
        ['communityDocuments', communityId],
        (old) => old?.filter((doc) => doc.id !== documentId) || []
      );

      // Return a context object with the snapshotted value
      return { previousDocuments, communityId, documentId };
    },
    onError: (error, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousDocuments) {
        queryClient.setQueryData(
          ['communityDocuments', context.communityId],
          context.previousDocuments
        );
      }
      console.error('Error deleting community document:', error);
    },
    onSuccess: () => {
      // Reset mutation state after success
      setTimeout(() => reset(), 100);
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({
        queryKey: ['communityDocuments', variables.communityId],
      });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success('Document deleted successfully');
      callback?.();
    } else if (isError) {
      toast.error('Error deleting document');
    }
  }, [error, isSuccess, isError, callback]);

  return {
    data: data ?? null,
    error,
    reset,
    ...rest,
  };
}

const createNewCommunityDocument = async ({
  communityId,
  name,
  longDescription,
  file,
  documentType = 'COMMUNITY_DOCUMENT',
}: {
  communityId: string;
  name: string;
  longDescription?: string;
  file: File;
  documentType?: string;
}): Promise<Document> => {
  const formData = new FormData();
  formData.append('file', file);

  // Add metadata
  if (name) {
    formData.append('name', name);
  }

  if (longDescription) {
    formData.append('longDescription', longDescription);
  }

  const validDocumentType = documentType || 'COMMUNITY_DOCUMENT';
  formData.append('documentType', validDocumentType);

  const documentId = crypto.randomUUID();

  const { data } = await apiClient.post(
    `/communities/${communityId}/documents/${documentId}&timestamp=${Date.now()}`,
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

type CreateNewDocumentMutationProps = {
  callback?: () => void;
  communityId?: string;
};

export function useCreateNewCommunityDocument({
  callback,
  communityId,
}: CreateNewDocumentMutationProps = {}) {
  const queryClient = useQueryClient();

  const { data, error, isSuccess, isError, reset, ...rest } = useMutation({
    mutationFn: createNewCommunityDocument,
    onError: (error) => {
      console.error('Error creating new community document:', error);
    },
    onSuccess: (newDocument, variables) => {
      // Optimistically add the new document to the list
      queryClient.setQueryData<Document[]>(
        ['communityDocuments', variables.communityId],
        (old) => [...(old || []), newDocument]
      );

      // Reset mutation state after success
      setTimeout(() => reset(), 100);
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({
        queryKey: ['communityDocuments', variables.communityId],
      });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success('Document created successfully');
      callback?.();
    } else if (isError) {
      toast.error('Error creating document');
    }
  }, [error, isSuccess, isError, callback]);

  return {
    data: data ?? null,
    error,
    reset,
    ...rest,
  };
}
