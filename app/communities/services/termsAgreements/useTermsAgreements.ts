import { useQuery } from '@tanstack/react-query';

import { TermsAgreement } from '@/app/communities/model/termsAgreement';
import apiClient from '@/lib/api-client';

export const useTermsAgreements = () => {
  return useQuery({
    queryKey: ['terms-agreements'],
    queryFn: async (): Promise<TermsAgreement[]> => {
      const response = await apiClient.get<TermsAgreement[]>(
        '/terms-agreements'
      );
      return response.data;
    },
  });
};

export const useTermsAgreementById = (id: string) => {
  return useQuery({
    queryKey: ['terms-agreements', id],
    queryFn: async (): Promise<TermsAgreement> => {
      const response = await apiClient.get<TermsAgreement>(
        `/terms-agreements/${id}`
      );
      return response.data;
    },
    enabled: !!id,
  });
};

export const useTermsAgreementsByCommunityContract = (
  communityContractId: string
) => {
  return useQuery({
    queryKey: ['terms-agreements', 'community-contract', communityContractId],
    queryFn: async (): Promise<TermsAgreement | null> => {
      try {
        const response = await apiClient.get<TermsAgreement>(
          `/terms-agreements/community-contract/${communityContractId}`
        );
        return response.data;
      } catch (error: any) {
        // If no terms agreement exists (404), return null instead of throwing
        if (error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!communityContractId,
  });
};
