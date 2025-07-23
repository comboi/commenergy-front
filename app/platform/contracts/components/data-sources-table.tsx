import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit, Trash2, Plus } from 'lucide-react';
import { components } from '@/lib/api-schema';
import { useDataSourcesByContract } from '../services/dataSources/useDataSourcesByContract';
import { useDeleteDataSource } from '../services/dataSources/useDeleteDataSource';
import DataSourceModal from './data-source-modal';
import { DeleteDataSourceModal } from './delete-data-source-modal';

type DataSource = components['schemas']['DataSourceResponseDto'];

interface DataSourcesTableProps {
  contractId: string;
}

export default function DataSourcesTable({
  contractId,
}: DataSourcesTableProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDataSource, setSelectedDataSource] =
    useState<DataSource | null>(null);

  const {
    data: dataSources,
    isLoading,
    error,
    refetch,
  } = useDataSourcesByContract(contractId);

  const { mutate: deleteDataSource, isPending: isDeleting } =
    useDeleteDataSource({
      callback: () => {
        refetch();
        setIsDeleteModalOpen(false);
        setSelectedDataSource(null);
      },
    });

  const handleEdit = (dataSource: DataSource) => {
    setSelectedDataSource(dataSource);
    setIsEditModalOpen(true);
  };

  const handleDelete = (dataSource: DataSource) => {
    setSelectedDataSource(dataSource);
    setIsDeleteModalOpen(true);
  };

  const handleCreateSuccess = () => {
    refetch();
    setIsCreateModalOpen(false);
  };

  const handleEditSuccess = () => {
    refetch();
    setIsEditModalOpen(false);
    setSelectedDataSource(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedDataSource) {
      deleteDataSource(selectedDataSource.id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error loading data sources: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Data Sources</h3>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Data Source
        </Button>
      </div>

      {dataSources && dataSources.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataSources.map((dataSource) => (
              <TableRow key={dataSource.id}>
                <TableCell className="font-medium">{dataSource.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{dataSource.type}</Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {dataSource.description || 'No description'}
                </TableCell>
                <TableCell>
                  {new Date(dataSource.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(dataSource.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(dataSource)}
                      className="flex items-center gap-1">
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(dataSource)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700">
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No data sources found for this contract.
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <DataSourceModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          contractId={contractId}
          onSuccess={handleCreateSuccess}
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedDataSource && (
        <DataSourceModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedDataSource(null);
          }}
          contractId={contractId}
          dataSource={selectedDataSource}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedDataSource && (
        <DeleteDataSourceModal
          dataSource={selectedDataSource}
          isOpen={isDeleteModalOpen}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setSelectedDataSource(null);
          }}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
