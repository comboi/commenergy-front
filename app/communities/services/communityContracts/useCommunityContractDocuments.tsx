import apiClient from '@/lib/api-client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Document } from '../../model/document';
import { useEffect } from 'react';
import { toast } from 'sonner';

const fetchCommunityContractDocuments = async (
  id: string
): Promise<Document[]> => {
  const { data } = await apiClient.get(`/community-contracts/${id}/documents`);
  return data;
};

export function useCommunityContractDocuments(id: string) {
  return useQuery({
    queryKey: ['communityContractDocuments', id],
    queryFn: () => fetchCommunityContractDocuments(id),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 2,
  });
}

const uploadCommunityContractDocument = async ({
  communityContractId,
  documentId,
  relatedDocumentId,
  file,
}: {
  communityContractId: string;
  documentId: string;
  relatedDocumentId: string;
  file: File;
}): Promise<Document> => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await apiClient.post(
    `/community-contracts/${communityContractId}/documents/${documentId}?relatedDocumentId=${relatedDocumentId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return data;
};

type UploadDocumentMutationProps = {
  callback?: () => void;
};

export function useUploadCommunityContractDocument({
  callback,
}: UploadDocumentMutationProps = {}) {
  const { data, error, isSuccess, isError, reset, ...rest } = useMutation({
    mutationFn: uploadCommunityContractDocument,
    onError: (error) => {
      console.error('Error uploading document:', error);
    },
    onSuccess: () => {
      setTimeout(() => reset(), 100);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success('Document uploaded successfully');
      callback?.();
    } else if (isError) {
      toast.error('Error uploading document');
    }
  }, [error, isSuccess, isError, callback]);

  return {
    data: data ?? null,
    error,
    reset,
    ...rest,
  };
}
