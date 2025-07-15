import apiClient from '@/lib/api-client';
import { useMutation } from '@tanstack/react-query';
import { Document } from '../../model/document';
import { useEffect } from 'react';
import { toast } from 'sonner';

const createDocument = async ({
  name,
  longDescription,
  file,
}: {
  name: string;
  longDescription?: string;
  file: File;
}): Promise<Document> => {
  const formData = new FormData();
  formData.append('file', file);

  // Add metadata as form fields if supported, otherwise just rely on filename
  if (name && name !== file.name) {
    formData.append('name', name);
  }

  if (longDescription) {
    formData.append('longDescription', longDescription);
  }

  // Generate a unique document ID for creation
  const documentId = crypto.randomUUID();

  const { data } = await apiClient.post(
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

type CreateDocumentMutationProps = {
  callback?: () => void;
};

export function useCreateDocument({ callback }: CreateDocumentMutationProps) {
  const { data, error, isSuccess, isError, isPending, mutate, reset } =
    useMutation({
      mutationFn: createDocument,
      onError: (error) => {
        console.error('Error creating document:', error);
      },
    });

  useEffect(() => {
    if (isSuccess) {
      toast.success('Document created successfully');
      callback?.();
      // Auto-reset after success
      setTimeout(() => reset(), 100);
    } else if (isError) {
      toast.error('Error creating document');
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
