'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import VatInput from '@/components/inputs/VatInput';
import { User } from '@/app/platform/users/model/user';
import Select from '@/components/inputs/Select';
import { ContractUserEnriched } from '../services/contractUsers/useContractUsers';
import {
  useCreateContractUser,
  useUpdateContractUser,
} from '../services/contractUsers/useContractUserMutations';
import { v4 as uuidv4 } from 'uuid';

interface ContractUserModalProps {
  onClose: () => void;
  contractId: string;
  userToEdit?: ContractUserEnriched;
  isOpen: boolean;
}

type FormData = {
  userVat: string;
  role: 'owner' | 'partner' | 'viewer';
};

export default function ContractUserModal({
  onClose,
  contractId,
  userToEdit,
  isOpen,
}: ContractUserModalProps) {
  const [formData, setFormData] = useState<FormData>({
    userVat: userToEdit?.user.vat || '',
    role: userToEdit?.role || 'viewer',
  });

  const [foundUser, setFoundUser] = useState<User | null>(
    userToEdit?.user || null
  );
  const [isVatValid, setIsVatValid] = useState<boolean>(!!userToEdit);

  const { createContractUser, isPending: isCreating } = useCreateContractUser({
    callback: onClose,
    contractId,
  });

  const { updateContractUser, isPending: isUpdating } = useUpdateContractUser({
    callback: onClose,
    contractId,
  });

  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (isOpen) {
      setFormData({
        userVat: userToEdit?.user.vat || '',
        role: userToEdit?.role || 'viewer',
      });
      setFoundUser(userToEdit?.user || null);
      setIsVatValid(!!userToEdit);
    }
  }, [isOpen, userToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!foundUser) {
      return;
    }

    if (userToEdit) {
      updateContractUser({
        id: userToEdit.id,
        contractUser: {
          role: formData.role,
        },
      });
    } else {
      createContractUser({
        id: uuidv4(),
        userId: foundUser.id,
        contractId: contractId,
        role: formData.role,
      });
    }
  };

  const handleUserFound = (user: User) => {
    setFoundUser(user);
  };

  const handleValidationChange = (isValid: boolean, user?: User) => {
    setIsVatValid(isValid);
    if (user) {
      setFoundUser(user);
    } else {
      setFoundUser(null);
    }
  };

  const roleOptions = [
    { label: 'Owner', value: 'owner' },
    { label: 'Partner', value: 'partner' },
    { label: 'Viewer', value: 'viewer' },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="userVat">User VAT</Label>
          <VatInput
            value={formData.userVat}
            onChange={(value) => setFormData({ ...formData, userVat: value })}
            onUserFound={handleUserFound}
            onValidationChange={handleValidationChange}
            placeholder="Enter VAT number"
            validateOnMount={!!userToEdit}
            disabled={!!userToEdit}
          />
          {foundUser && (
            <div className="text-sm text-muted-foreground">
              {foundUser.name} - {foundUser.email}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            options={roleOptions}
            value={formData.role}
            onChange={(value) =>
              setFormData({ ...formData, role: value as FormData['role'] })
            }
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            type="button"
            disabled={isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!isVatValid || !foundUser || isPending}>
            {isPending && <span className="mr-2 animate-spin">↻</span>}
            {userToEdit ? 'Update' : 'Add'} User
          </Button>
        </DialogFooter>
      </div>
    </form>
  );
}
