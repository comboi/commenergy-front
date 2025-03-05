import { components } from '../../../lib/api-schema.d';

export type CommunitySchema = components['schemas']['CommunityEnriched'];

export type CommunityStatus = CommunitySchema['status'];

export type Community = {
  id: string;
  name: string;
  status: CommunityStatus;
  contracts: number;
  power: string;
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
  power: String(community.power),
  address: community.address ?? '',
  capacity: community.capacity,
});

export type NewCommunityDto = Partial<CommunitySchema>;

export const mapCommunityToDto = (community: Community): NewCommunityDto => ({
  id: community.id,
  name: community.name,
  status: community.status,
  communityContracts: [],
  power: Number(community.power),
  address: community.address,
  capacity: community.capacity,
});
