'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useContractById } from '@/app/platform/contracts/services/useContractById';
import { useContractUsers } from '@/app/platform/contracts/services/contractUsers/useContractUsers';
import { useCommunityContractsByContractId } from '@/app/platform/communities/services/communityContracts/useCommunityContractsByContractId';
import { useDeleteContract } from '@/app/platform/contracts/services/useDeleteContract';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertCircle,
  Users,
  Building2,
  MapPin,
  Zap,
  Calendar,
  ArrowLeft,
  Edit,
  Trash2,
  Database,
  FileText,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ContractCommunityContractsTable from '@/app/platform/contracts/components/contract-community-contracts-table';
import ContractUsersTable from '@/app/platform/contracts/components/contract-users-table';
import EditContractModal from '@/app/platform/contracts/components/edit-contract-modal';
import { DeleteContractModal } from '@/app/platform/contracts/components/delete-contract-modal';
import DataSourcesTable from '@/app/platform/contracts/components/data-sources-table';
import Link from 'next/link';

// Reusable tab styling constants
const TAB_LIST_CLASSES =
  'h-auto w-full justify-start rounded-none border-b bg-transparent p-0 mb-4';
const TAB_TRIGGER_CLASSES =
  'gap-2 relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none';

export default function ContractDetailPage() {
  const params = useParams();
  const router = useRouter();
  const contractId = params.id as string;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    data: contract,
    isLoading: contractLoading,
    error: contractError,
    refetch: refetchContract,
  } = useContractById(contractId);

  const { mutate: deleteContract, isPending: isDeleting } = useDeleteContract({
    callback: () => {
      router.push('/contracts');
    },
  });

  const {
    data: contractUsers,
    isLoading: usersLoading,
    error: usersError,
  } = useContractUsers(contractId);

  const {
    data: communityContracts,
    isLoading: communityContractsLoading,
    error: communityContractsError,
  } = useCommunityContractsByContractId(contractId);

  if (contractLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (contractError || !contract) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {contractError instanceof Error
              ? contractError.message
              : 'Error loading contract details'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Link href="/platform/contracts" className="flex items-center gap-2 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to contracts
      </Link>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">
              {contract.name}
            </h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground">
            Contract details and associated information
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="general" className="w-full">
          <TabsList className={TAB_LIST_CLASSES}>
            <TabsTrigger value="general" className={TAB_TRIGGER_CLASSES}>
              <FileText className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="data-sources" className={TAB_TRIGGER_CLASSES}>
              <Database className="h-4 w-4" />
              Data Sources
            </TabsTrigger>
            <TabsTrigger value="users" className={TAB_TRIGGER_CLASSES}>
              <Users className="h-4 w-4" />
              Users & Communities
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            {/* Contract Overview Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Basic Info Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Basic Information
                  </CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Contract Code
                      </p>
                      <p className="text-sm font-medium">
                        {contract.contractCode}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Type</p>
                      <Badge
                        variant={
                          contract.contractType === 'CONSUMPTION'
                            ? 'default'
                            : 'secondary'
                        }>
                        {contract.contractType}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <Badge
                        variant={
                          contract.state === 'Active'
                            ? 'default'
                            : 'destructive'
                        }
                        className={
                          contract.state === 'Active'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : ''
                        }>
                        {contract.state}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Power & Energy Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Power & Energy
                  </CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Contract Power
                      </p>
                      <p className="text-sm font-medium">
                        {contract.contractPower
                          ? `${contract.contractPower} kW`
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Energy Source
                      </p>
                      <p className="text-sm font-medium">
                        {contract.energySourceType || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Provider</p>
                      <p className="text-sm font-medium">
                        {contract.provider.name}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location & User Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Location & Owner
                  </CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Address</p>
                      <p className="text-sm font-medium line-clamp-2">
                        {contract.fullAddress}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Owner</p>
                      <p className="text-sm font-medium">{contract.user.vat}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Created</p>
                      <p className="text-sm font-medium">
                        {new Date(contract.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="data-sources" className="space-y-6">
            <DataSourcesTable contractId={contractId} />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {/* Community Contracts Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Community Contracts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {communityContractsError ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Error loading community contracts:{' '}
                      {communityContractsError instanceof Error
                        ? communityContractsError.message
                        : 'Unknown error'}
                    </AlertDescription>
                  </Alert>
                ) : communityContracts && communityContracts.length > 0 ? (
                  <ContractCommunityContractsTable
                    data={communityContracts}
                    isLoading={communityContractsLoading}
                  />
                ) : communityContractsLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading community contracts...
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    This contract is not associated with any communities.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contract Users Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Contract Users & Roles
                </CardTitle>
              </CardHeader>
              <CardContent>
                {usersError ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Error loading contract users:{' '}
                      {usersError instanceof Error
                        ? usersError.message
                        : 'Unknown error'}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <ContractUsersTable
                    data={contractUsers || []}
                    isLoading={usersLoading}
                    contractId={contractId}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Contract Modal */}
      {contract && (
        <EditContractModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          contract={contract}
          onContractUpdated={refetchContract}
        />
      )}

      {/* Delete Contract Modal */}
      <DeleteContractModal
        contract={contract}
        isOpen={isDeleteModalOpen}
        onConfirm={() => {
          if (contract) {
            deleteContract(contract.id);
          }
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
        isDeleting={isDeleting}
      />
    </div>
  );
}
