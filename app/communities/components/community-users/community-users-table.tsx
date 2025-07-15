'use client';

import React, { useState, useCallback } from 'react';
import { TrashIcon, PlusIcon, EditIcon, SaveIcon, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Community } from '@/app/communities/model/community';
import {
  useUserCommunities,
  useUpdateUsersToCommunities,
} from '@/app/communities/services/communities/useCommunityUsers';
import { CommunityUser } from '@/app/communities/model/communityUser';
import { useCommunityAdmin } from '@/app/communities/contexts/community-admin-context';
import Modal from '@/components/modal/modal';
import { CommunityUsersForm } from './community-users-form';
import { DeleteUserModal } from './delete-user-modal';

type Props = {
  community: Community;
  isLoggedUserAdmin: boolean;
  refreshCommunityDetails?: () => void;
};

export function CommunityUsersTable({
  community,
  isLoggedUserAdmin,
  refreshCommunityDetails,
}: Props) {
  const { isUserAdmin } = useCommunityAdmin();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<'admin' | 'user' | 'partner'>(
    'user'
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<CommunityUser | null>(null);

  const {
    data: communityUsers,
    isLoading,
    refetch,
  } = useUserCommunities(community.id);

  const { mutate: updateUsers, isPending } = useUpdateUsersToCommunities(
    community.id
  );

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    refetch();
    refreshCommunityDetails?.();
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'partner':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const handleStartEdit = (user: CommunityUser) => {
    setEditingUserId(user.userId);
    setEditingRole(user.role);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditingRole('user');
  };

  const handleSaveEdit = (user: CommunityUser) => {
    if (!editingRole) return;

    const updatedUser: CommunityUser = {
      ...user,
      role: editingRole,
    };

    updateUsers(
      { users: [updatedUser] },
      {
        onSuccess: () => {
          setEditingUserId(null);
          setEditingRole('user');
          refetch();
          refreshCommunityDetails?.();
        },
      }
    );
  };

  const handleRemoveUser = (userToRemove: CommunityUser) => {
    setUserToDelete(userToRemove);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete || !communityUsers) return;

    const remainingUsers = communityUsers.filter(
      (user) => user.userId !== userToDelete.userId
    );

    updateUsers(
      { users: remainingUsers },
      {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
          refetch();
          refreshCommunityDetails?.();
        },
      }
    );
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Community Users</h3>
          <p className="text-sm text-muted-foreground">
            Manage users and their roles in this community
          </p>
        </div>
        {isLoggedUserAdmin && (
          <Button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Add User
          </Button>
        )}
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>VAT</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Mobile</TableHead>
              {isLoggedUserAdmin && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody
            isLoading={isLoading}
            noItems={!communityUsers || communityUsers.length === 0}
            columnsNumber={isLoggedUserAdmin ? 6 : 5}>
            {communityUsers?.map((user) => (
              <TableRow key={user.userId}>
                <TableCell>
                  <div className="font-medium">
                    {String(user.name || 'Unnamed User')}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {String(user.email || '-')}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{user.vat || '-'}</div>
                </TableCell>
                <TableCell>
                  {editingUserId === user.userId ? (
                    <div className="flex items-center gap-2">
                      <Select
                        value={editingRole}
                        onValueChange={(value: 'admin' | 'user' | 'partner') =>
                          setEditingRole(value)
                        }>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="partner">Partner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {String(user.mobile || '-')}
                  </div>
                </TableCell>
                {isLoggedUserAdmin && (
                  <TableCell className="text-right">
                    {editingUserId === user.userId ? (
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSaveEdit(user)}
                          disabled={isPending}
                          className="h-8 w-8 p-0">
                          <SaveIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCancelEdit}
                          className="h-8 w-8 p-0">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStartEdit(user)}
                          disabled={isUserAdmin(user.userId) || isPending}
                          className="h-8 w-8 p-0">
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveUser(user)}
                          disabled={isUserAdmin(user.userId) || isPending}
                          className="h-8 w-8 p-0">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        title="Add New User"
        description="Add a new user to this community">
        <CommunityUsersForm
          community={community}
          onClose={handleCloseModal}
          isOpen={isEditModalOpen}
        />
      </Modal>

      <DeleteUserModal
        user={userToDelete}
        isOpen={isDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isDeleting={isPending}
      />
    </div>
  );
}
