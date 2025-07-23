'use client';

import { CommunityDetails } from '@/app/platform/communities/components/community-details';
import { CommunityContractsTable } from '@/app/platform/communities/components/communities-contracts-table/community-contracts-table';
import { CommunityDocuments } from '@/app/platform/communities/components/community-documents/community-documents';
import { CommunityUsersTable } from '@/app/platform/communities/components/community-users/community-users-table';
import { useCommunityById } from '../services/communities/useCommunities';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  CommunityAdminProvider,
  useCommunityAdmin,
} from '../contexts/community-admin-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQueryClient } from '@tanstack/react-query';

function CommunityDetailsContent({ params }: { params: { id: string } }) {
  const queryClient = useQueryClient();
  const {
    data: communityData,
    isLoading,
    error,
    refetch,
  } = useCommunityById(params.id);
  const { isLoggedUserAdmin } = useCommunityAdmin();

  // Function to handle tab changes and refetch data
  const handleTabChange = (value: string) => {
    switch (value) {
      case 'contracts':
        queryClient.invalidateQueries({
          queryKey: ['communityContracts', params.id],
        });
        break;
      case 'users':
        queryClient.invalidateQueries({
          queryKey: ['communityUsers', params.id],
        });
        break;
      case 'documents':
        queryClient.invalidateQueries({
          queryKey: ['communityDocuments', params.id],
        });
        queryClient.invalidateQueries({
          queryKey: ['communityDocumentsToUpload', params.id],
        });
        break;
      default:
        break;
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading community</div>;
  if (!communityData) return <div>Community not found</div>;

  return (
    <div className="space-y-6 relative pt-8 min-h-[100vh]">
      <Link href="/platform/communities" className="flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to communities
      </Link>
      <CommunityDetails
        community={communityData}
        onUpdate={refetch}
        isEditable={isLoggedUserAdmin}
      />

      <Tabs
        defaultValue="contracts"
        className="w-full"
        onValueChange={handleTabChange}>
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
