import apiClient from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';
import { Document, DocumentType } from '../../model/document';

const fetchCommunityDocuments = async (id: string): Promise<Document[]> => {
  const { data } = await apiClient.get(`/communities/${id}/documents`);
  return data;
};

export function useCommunityDocuments(id: string) {
  return useQuery({
    queryKey: ['communityDocumentsToUpload', id],
    queryFn: () => fetchCommunityDocuments(id),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 2,
  });
}

const TypeModel: DocumentType = 'COMMUNITY_MODEL';

const fetchCommunityDocumentsToUpload = async (
  id: string
): Promise<Document[]> => {
  const { data } = await apiClient.get(
    `/communities/${id}/documents?documentType=${TypeModel}`
  );
  return data;
};

export function useCommunityModelDocuments(
  id: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ['communityDocumentsToUpload', id],
    queryFn: () => fetchCommunityDocumentsToUpload(id),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 2,
    enabled: options?.enabled !== false,
  });
}
