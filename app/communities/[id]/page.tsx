'use client';

import { CommunityDetails } from '@/app/communities/components/community-details';
import { CommunityContractsTable } from '@/app/communities/components/communities-contracts-table/community-contracts-table';
import { CommunityDocuments } from '@/app/communities/components/community-documents/community-documents';
import { CommunityUsersTable } from '@/app/communities/components/community-users/community-users-table';
import { useCommunityById } from '../services/communities/useCommunities';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  CommunityAdminProvider,
  useCommunityAdmin,
} from '../contexts/community-admin-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function CommunityDetailsContent({ params }: { params: { id: string } }) {
  const {
    data: communityData,
    isLoading,
    error,
    refetch,
  } = useCommunityById(params.id);
  const { isLoggedUserAdmin } = useCommunityAdmin();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading community</div>;
  if (!communityData) return <div>Community not found</div>;

  return (
    <div className="space-y-6 relative pt-8 min-h-[100vh]">
      <Link href="/communities" className="flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to communities
      </Link>
      <CommunityDetails
        community={communityData}
        onUpdate={refetch}
        isEditable={isLoggedUserAdmin}
      />

      <Tabs defaultValue="contracts" className="w-full">
        <TabsList className="grid max-w-[450px] grid-cols-3">
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="contracts" className="mt-6">
          <CommunityContractsTable
            isLoggedUserAdmin={isLoggedUserAdmin}
            refreshCommunityDetails={refetch}
            community={communityData}
          />
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <CommunityUsersTable
            isLoggedUserAdmin={isLoggedUserAdmin}
            refreshCommunityDetails={refetch}
            community={communityData}
          />
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <CommunityDocuments
            community={communityData}
            refreshCommunityDetails={refetch}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function CommunityDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: communityData } = useCommunityById(params.id);

  return (
    <CommunityAdminProvider community={communityData || null}>
      <CommunityDetailsContent params={params} />
    </CommunityAdminProvider>
  );
}
