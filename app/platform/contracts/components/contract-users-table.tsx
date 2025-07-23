'use client';

import * as React from 'react';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ContractUserEnriched } from '@/app/platform/contracts/services/contractUsers/useContractUsers';
import TooltipEllipsisText from '@/components/ui/TooltipElipsis';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '@/components/modal/modal';
import { useState } from 'react';
import ContractUserModal from './contract-user-modal';
import { useDeleteContractUser } from '../services/contractUsers/useContractUserMutations';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/app/platform/auth/contexts/auth-context';

interface ContractUsersTableProps {
  data: ContractUserEnriched[];
  isLoading: boolean;
  contractId: string;
}

export default function ContractUsersTable({
  data,
  isLoading,
  contractId,
}: ContractUsersTableProps) {
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<
    ContractUserEnriched | undefined
  >(undefined);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<
    ContractUserEnriched | undefined
  >(undefined);

  const { user: currentUser } = useAuth();
  const isCurrentUserOwner = data.some(
    (user) => user.user.id === currentUser?.id && user.role === 'owner'
  );

  const { deleteContractUser } = useDeleteContractUser({ contractId });

  const handleAddUser = () => {
    setUserToEdit(undefined);
    setIsAddUserModalOpen(true);
  };

  const handleEditUser = (user: ContractUserEnriched) => {
    setUserToEdit(user);
    setIsAddUserModalOpen(true);
  };

  const handleDeleteUser = (user: ContractUserEnriched) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteContractUser(userToDelete.id);
      setDeleteConfirmOpen(false);
      setUserToDelete(undefined);
    }
  };

  const columns: ColumnDef<ContractUserEnriched>[] = React.useMemo(
    () => [
      {
        header: 'User',
        cell: ({ row }) => (
          <TooltipEllipsisText className="max-w-[150px] font-mono text-xs">
            {row.original.user.name}
          </TooltipEllipsisText>
        ),
      },
      {
        header: 'User Email',
        cell: ({ row }) => (
          <TooltipEllipsisText className="max-w-[250px] font-mono text-xs">
            {row.original.user.email}
          </TooltipEllipsisText>
        ),
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => {
          const role = row.getValue('role') as string;
          return (
            <Badge
              variant={
                role === 'owner'
                  ? 'default'
                  : role === 'partner'
                  ? 'secondary'
                  : 'outline'
              }
              className={
                role === 'owner'
                  ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  : role === 'partner'
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }>
              {role}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'sharedAt',
        header: 'Shared At',
        cell: ({ row }) => {
          const date = row.getValue('sharedAt') as string;
          return date ? new Date(date).toLocaleDateString() : 'N/A';
        },
      },
      {
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          // Don't show edit/delete options for current user if they're the owner
          const isRowCurrentUser = row.original.user.id === currentUser?.id;
          const canEdit = isCurrentUserOwner && !isRowCurrentUser;

          return (
            <div className="flex justify-end space-x-2">
              {canEdit && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditUser(row.original)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteUser(row.original)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </>
              )}
            </div>
          );
        },
      },
    ],
    [currentUser?.id, isCurrentUserOwner]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Contract Users</h3>
        {isCurrentUserOwner && (
          <Button onClick={handleAddUser} size="sm">
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        )}
      </div>

      {!data || data.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border rounded-md">
          No users found for this contract.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit User Modal */}
      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        title={userToEdit ? 'Edit User Permissions' : 'Add New Contract User'}
        description={
          userToEdit
            ? 'Update the role and permissions for this user.'
            : 'Add a new user to this contract by entering their VAT number.'
        }>
        <ContractUserModal
          onClose={() => setIsAddUserModalOpen(false)}
          contractId={contractId}
          userToEdit={userToEdit}
          isOpen={isAddUserModalOpen}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the
              user
              {userToDelete && (
                <span className="font-medium"> {userToDelete.user.name} </span>
              )}
              from this contract.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
