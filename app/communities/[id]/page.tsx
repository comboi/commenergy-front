'use client';

import { CommunityDetails } from '@/app/communities/components/community-details';
import { CommunityContractsTable } from '@/app/communities/components/communities-contracts-table/community-contracts-table';
import { useCommunityById } from '../services/useCommunities';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CommunityDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const {
    data: communityData,
    isLoading,
    error,
    refetch,
  } = useCommunityById(params.id);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading community</div>;
  if (!communityData) return <div>Community not found</div>;

  return (
    <div className="space-y-6 relative pt-8 min-h-[100vh]">
      <Link href="/communities" className="flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to communities
      </Link>
      <CommunityDetails community={communityData} onUpdate={refetch} />
      <CommunityContractsTable
        communityId={communityData.id}
        refreshCommunityDetails={refetch}
        communityName={communityData.name}
      />
    </div>
  );
}
