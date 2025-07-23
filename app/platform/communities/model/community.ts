import { components } from '../../../../lib/api-schema';

export type CommunitySchema = components['schemas']['CommunityEnriched'];

export type CommunityStatus = CommunitySchema['status'];

export type Community = CommunitySchema & {
  contracts: number;
  address: string;
};

export const mapCommunitySchemaToCommunity = (
  community: CommunitySchema
): Community => ({
  ...community,
  contracts: community.communityContracts.length,
  address: community.address ?? '',
});

export type NewCommunityDto = Partial<CommunitySchema>;

export const mapCommunityToDto = (community: Community): NewCommunityDto => ({
  id: community.id,
  name: community.name,
  status: community.status,
  communityContracts: [],
  address: community.address,
  capacity: community.capacity,
});
