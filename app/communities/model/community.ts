import { components } from '../../../lib/api-schema.d';

export type CommunitySchema = components['schemas']['CommunityEnriched'];

export type CommunityStatus = CommunitySchema['status'];

export type Community = {
  id: string;
  name: string;
  status: CommunityStatus;
  contracts: number;
  address: string;
  capacity: CommunitySchema['capacity'];
};

export const mapCommunitySchemaToCommunity = (
  community: CommunitySchema
): Community => ({
  id: community.id,
  name: community.name,
  status: community.status,
  contracts: community.communityContracts.length,
  address: community.address ?? '',
  capacity: community.capacity,
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
