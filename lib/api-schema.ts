export type CommunityContractDto = {
  id: string;
  contractId: string;
  communityId: string;
  communityJoinDate?: string | null;
  communityFee?: number | null;
  communityFeePeriodType?:
    | 'Monthly'
    | 'Quarterly'
    | 'Semiannually'
    | 'Yearly'
    | null;
  termsAgreement: string | null;
  sharingIds: unknown[];
};
