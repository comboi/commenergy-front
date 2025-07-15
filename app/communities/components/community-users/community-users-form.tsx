'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SaveIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Community } from '@/app/communities/model/community';
import {
  useCreateCommunityUser,
  useUserCommunities,
} from '@/app/communities/services/communities/useCommunityUsers';
import { CommunityUser } from '@/app/communities/model/communityUser';
import { User } from '@/app/users/model/user';
import VatInput from '@/components/inputs/VatInput';
import { v4 } from 'uuid';

type Props = {
  onClose: () => void;
  community: Community;
  isOpen: boolean;
};

interface NewUserDraft {
  tempId: string;
  vat: string;
  role: 'admin' | 'user' | 'partner';
  name?: string;
  email?: string;
  mobile?: string;
  isVatValid: boolean;
  foundUser?: User;
}

export function CommunityUsersForm({ community, onClose, isOpen }: Props) {
  const { data: communityUsers, refetch } = useUserCommunities(community.id);
  const { mutate: createUser, isPending } = useCreateCommunityUser(
    community.id
  );

  const [newUser, setNewUser] = useState<NewUserDraft | null>(null);

  useEffect(() => {
    if (isOpen) {
      const tempId = `temp-${Date.now()}`;
      const defaultUser: NewUserDraft = {
        tempId,
        vat: '',
        role: 'user',
        name: '',
        email: '',
        mobile: '',
        isVatValid: false,
      };
      setNewUser(defaultUser);
    }
  }, [isOpen]);

  const updateUserField = (field: keyof NewUserDraft, value: string) => {
    if (newUser) {
      setNewUser({ ...newUser, [field]: value });
    }
  };

  const handleVatValidation = useCallback(
    (isValid: boolean, foundUser?: User) => {
      if (newUser) {
        const updatedUser = { ...newUser, isVatValid: isValid };

        if (isValid && foundUser) {
          updatedUser.foundUser = foundUser;
          updatedUser.name = String(foundUser.name || '');
          updatedUser.email = String(foundUser.email || '');
          updatedUser.mobile = String(foundUser.mobile || '');
        } else {
          updatedUser.foundUser = undefined;
          updatedUser.name = '';
          updatedUser.email = '';
          updatedUser.mobile = '';
        }

        setNewUser(updatedUser);
      }
    },
    [newUser]
  );

  const handleSave = () => {
    if (!newUser || !newUser.vat || !newUser.role) {
      return;
    }

    const newCommunityUser = {
      userId: newUser.foundUser?.id || v4(),
      role: newUser.role,
      vat: newUser.vat,
      ...(newUser.name && { name: newUser.name }),
      ...(newUser.email && { email: newUser.email }),
      ...(newUser.mobile && { mobile: newUser.mobile }),
    } as Omit<CommunityUser, 'communityId'>;

    createUser(newCommunityUser, {
      onSuccess: () => {
        onClose();
        refetch();
      },
    });
  };

  const hasValidUser = newUser && newUser.vat && newUser.role;

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-2">VAT Number</label>
          <VatInput
            value={newUser?.vat || ''}
            onChange={(value) => updateUserField('vat', value)}
            onValidationChange={(isValid, foundUser) =>
              handleVatValidation(isValid, foundUser)
            }
            placeholder="Enter VAT number"
          />
          {newUser?.vat && (
            <div className="mt-2">
              {newUser?.isVatValid && newUser?.foundUser ? (
                <div className="space-y-1 p-3 border rounded-md">
                  <span className="text-sm font-medium ">User found</span>
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-medium">
                      {String(newUser?.name || 'Unnamed User')}
                    </div>
                    <div className="text-xs ">
                      {String(newUser?.email || newUser?.vat)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 p-3 border rounded-md">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium ">
                      No user found with this VAT
                    </span>
                  </div>
                  <div className="text-xs ">
                    A new user account will be created with VAT: {newUser?.vat}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">Role</label>
          <Select
            value={newUser?.role || 'user'}
            onValueChange={(value: 'admin' | 'user' | 'partner') =>
              updateUserField('role', value)
            }>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select role..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="partner">Partner</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={!hasValidUser || isPending}
          className="flex items-center gap-2">
          <SaveIcon className="h-4 w-4" />
          {isPending
            ? 'Adding...'
            : newUser?.isVatValid && newUser?.foundUser
            ? 'Add Existing User'
            : 'Create & Add User'}
        </Button>
      </DialogFooter>
    </div>
  );
}
