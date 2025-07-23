import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Select from '@/components/inputs/Select';
import { components } from '@/lib/api-schema';
import { useCreateDataSource } from '../services/dataSources/useCreateDataSource';
import { useUpdateDataSource } from '../services/dataSources/useUpdateDataSource';
import { useDataSourceTypes } from '../services/dataSources/useDataSourceTypes';
import {
  useDataSourceConfiguration,
  ConfigField,
} from '../services/dataSources/useDataSourceConfiguration';

type DataSource = components['schemas']['DataSourceResponseDto'];
type CreateDataSourceDto = components['schemas']['CreateDataSourceDto'];
type UpdateDataSourceDto = components['schemas']['UpdateDataSourceDto'];

interface DataSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: string;
  dataSource?: DataSource;
  onSuccess: () => void;
}

export default function DataSourceModal({
  isOpen,
  onClose,
  contractId,
  dataSource,
  onSuccess,
}: DataSourceModalProps) {
  const isEditing = !!dataSource;
  const { data: dataSourceTypes } = useDataSourceTypes();

  const [formData, setFormData] = useState({
    name: '',
    type: 'DATA_DIS' as 'DATA_DIS' | 'SHELLY_CLOUD',
    description: '',
    configuration: {} as any,
  });

  // Fetch configuration fields for the selected type
  const { data: configurationSchema, isLoading: isLoadingConfig } =
    useDataSourceConfiguration(formData.type);

  const { mutate: createDataSource, isPending: isCreating } =
    useCreateDataSource({
      callback: onSuccess,
    });

  const { mutate: updateDataSource, isPending: isUpdating } =
    useUpdateDataSource({
      callback: onSuccess,
    });

  useEffect(() => {
    if (dataSource) {
      setFormData({
        name: dataSource.name,
        type: dataSource.type as 'DATA_DIS' | 'SHELLY_CLOUD',
        description: dataSource.description || '',
        configuration: dataSource.configuration || {},
      });
    }
  }, [dataSource]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && dataSource) {
      const updateData: UpdateDataSourceDto = {
        name: formData.name,
        type: formData.type,
        description: formData.description,
        configuration: formData.configuration as any,
      };
      updateDataSource({ id: dataSource.id, data: updateData });
    } else {
      const createData: CreateDataSourceDto = {
        contractId,
        name: formData.name,
        type: formData.type,
        description: formData.description,
        configuration: formData.configuration as any,
      };
      createDataSource(createData);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleConfigurationChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      configuration: {
        ...prev.configuration,
        [key]: value,
      },
    }));
  };

  const getConfigurationFields = () => {
    if (isLoadingConfig) {
      return (
        <div className="text-sm text-gray-500">Loading configuration...</div>
      );
    }

    if (!configurationSchema?.requiredFields) {
      return (
        <div className="text-sm text-gray-500">
          No configuration fields available
        </div>
      );
    }

    return Object.entries(configurationSchema.requiredFields).map(
      ([fieldKey, fieldConfig]) => {
        const getInputType = (fieldType: ConfigField['type']) => {
          switch (fieldType) {
            case 'url':
            case 'string':
              return 'text';
            case 'number':
              return 'number';
            case 'boolean':
              return 'checkbox';
            default:
              return 'text';
          }
        };

        const renderField = () => {
          if (fieldConfig.type === 'boolean') {
            return (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={fieldKey}
                  checked={formData.configuration[fieldKey] || false}
                  onChange={(e) =>
                    handleConfigurationChange(
                      fieldKey,
                      e.target.checked.toString()
                    )
                  }
                  className="rounded border-gray-300"
                />
                <Label htmlFor={fieldKey} className="text-sm font-normal">
                  {fieldConfig.description}
                </Label>
              </div>
            );
          }

          return (
            <Input
              id={fieldKey}
              type={getInputType(fieldConfig.type)}
              value={formData.configuration[fieldKey] || ''}
              onChange={(e) =>
                handleConfigurationChange(fieldKey, e.target.value)
              }
              placeholder={fieldConfig.example}
              required={fieldConfig.required}
            />
          );
        };

        return (
          <div key={fieldKey} className="space-y-2">
            <Label htmlFor={fieldKey}>
              {fieldConfig.description}
              {fieldConfig.required && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </Label>
            {renderField()}
            {fieldConfig.example && fieldConfig.type !== 'boolean' && (
              <p className="text-xs text-gray-500">
                Example: {fieldConfig.example}
              </p>
            )}
          </div>
        );
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Data Source' : 'Create Data Source'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Smart Meter #001"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <Select
              value={formData.type}
              onChange={(value) => handleChange('type', value)}
              options={[
                { value: 'DATA_DIS', label: 'Data DIS' },
                { value: 'SHELLY_CLOUD', label: 'Shelly Cloud' },
              ]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Main electricity meter for building A"
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <Label className="text-base font-semibold">Configuration</Label>
            {getConfigurationFields()}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isCreating || isUpdating}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating
                ? isEditing
                  ? 'Updating...'
                  : 'Creating...'
                : isEditing
                ? 'Update'
                : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
