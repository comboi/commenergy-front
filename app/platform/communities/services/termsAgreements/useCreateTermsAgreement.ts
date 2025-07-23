import { useMutation } from '@tanstack/react-query';

import {
  CreateTermsAgreementDto,
  TermsAgreement,
} from '@/app/platform/communities/model/termsAgreement';
import apiClient from '@/lib/api-client';

type Props = {
  callback?: (data: TermsAgreement) => void;
};

export const useCreateTermsAgreement = ({ callback }: Props) => {
  return useMutation({
    mutationFn: async (
      data: CreateTermsAgreementDto
    ): Promise<TermsAgreement> => {
      const response = await apiClient.post<TermsAgreement>(
        '/terms-agreements',
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      callback?.(data);
    },
  });
};
