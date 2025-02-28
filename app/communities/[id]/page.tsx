'use client';

import { CommunityDetails } from '@/app/communities/components/community-details';
import { CommunityContractsTable } from '@/app/communities/components/communities-contracts-table/community-contracts-table';
import { useCommunityById } from '../services/useCommunities';

export default function CommunityDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: communityData, isLoading, error } = useCommunityById(params.id);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading community</div>;
  if (!communityData) return <div>Community not found</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{communityData.name}</h1>
      <CommunityDetails community={communityData} />
      <div className="mt-6">
        <CommunityContractsTable communityId={params.id} />
      </div>
    </div>
  );
}
