import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';
import apiClient from '@/lib/api-client';

const deleteDocument = async (documentId: string): Promise<void> => {
  await apiClient.delete(`/documents/${documentId}`);
};

type Props = {
  callback?: () => void;
};

export function useDeleteDocument({ callback }: Props = {}) {
  const { data, error, isSuccess, isError, ...rest } = useMutation({
    mutationKey: ['deleteDocument'],
    mutationFn: (documentId: string) => deleteDocument(documentId),
    onError: (error) => {
      console.error('Error deleting document:', error);
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
    ...rest,
  };
}