import { components } from '../../../../lib/api-schema';

export type TermsAgreementSchema = components['schemas']['TermsAgreementDto'];
export type CreateTermsAgreementDto = TermsAgreementSchema;

export type TermsAgreement = TermsAgreementSchema;

export const mapTermsAgreementToCreateDto = (
  termsAgreement: Partial<TermsAgreement>
): CreateTermsAgreementDto => ({
  id: termsAgreement.id || '',
  documents: termsAgreement.documents || [],
  acceptanceDate: termsAgreement.acceptanceDate || new Date().toISOString(),
  userId: termsAgreement.userId || '',
  communityContractId: termsAgreement.communityContractId || '',
  userVat: termsAgreement.userVat || '',
});
