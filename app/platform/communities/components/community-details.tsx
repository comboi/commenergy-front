import { useState } from 'react';

import { Community } from '@/app/platform/communities/model/community';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AddNewCommunityForm from './communities-table/modals/add-new-community-form';
import Modal from '@/components/modal/modal';
import { EditIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  community: Community;
  onUpdate: () => void;
  isEditable?: boolean;
};

export function CommunityDetails({
  community,
  onUpdate,
  isEditable = false,
}: Props) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { status, contracts, capacity } = community;

  const handleUpdateEditModal = () => {
    setIsEditModalOpen(false);
    onUpdate();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-3xl font-bold">{community.name}</h1>
        {isEditable && (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsEditModalOpen(true)}>
            <EditIcon />
          </Button>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={
                status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'
              }>
              {status}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contracts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Power</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {capacity.totalGenerationPower} kWh
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacity Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                {`${capacity.totalUsedPercentage}/100%`}
              </span>
            </div>
          </CardContent>
        </Card>
        {/* <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div>{address}</div>
          </CardContent>
        </Card> */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={handleUpdateEditModal}
          title="Edit Community"
          description="Edit the form below to edit the community">
          <AddNewCommunityForm
            onClose={handleUpdateEditModal}
            communityToEdit={community}
          />
        </Modal>
      </div>
    </div>
  );
}
