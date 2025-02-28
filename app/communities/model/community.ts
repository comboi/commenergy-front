import { components } from '../../../lib/api-schema.d';

export type CommunitySchema = components['schemas']['Community'];

export type CommunityStatus = CommunitySchema['status'];
export type EnergySourceType = CommunitySchema['energySourceType'];

export type Community = {
  id: string;
  name: string;
  status: CommunityStatus;
  contracts: number;
  power: string;
  type: EnergySourceType;
  address: string;
};

export const mapCommunitySchemaToCommunity = (
  community: CommunitySchema
): Community => ({
  id: community.id,
  name: community.name,
  status: community.status,
  contracts: community.communityContracts.length,
  power: String(community.power),
  type: community.energySourceType,
  address: '',
});
