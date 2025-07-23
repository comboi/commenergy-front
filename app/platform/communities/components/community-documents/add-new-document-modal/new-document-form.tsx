import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Select from '@/components/inputs/Select';
import { DocumentType } from '../../../model/document';
import { NewDocumentData } from '../community-documents-form/components/types';
import { LoaderCircle, Upload } from 'lucide-react';
import { translateDocumentType } from '../community-documents-form/utils';

type NewDocumentFormProps = {
  newDocumentData: NewDocumentData;
  onDataChange: (data: NewDocumentData) => void;
  onSubmit: (file: File) => void;
  onCancel: () => void;
  isCreating: boolean;
};

const documentTypeOptions: { label: string; value: string }[] = [
  ...(['COMMUNITY_DOCUMENT', 'COMMUNITY_MODEL'] as DocumentType[]).map(
    (type) => ({
      label: translateDocumentType(type),
      value: type,
    })
  ),
];

const NewDocumentForm = ({
  newDocumentData,
  onDataChange,
  onSubmit,
  onCancel,
  isCreating,
}: NewDocumentFormProps) => {
  const handleInputChange = (field: keyof NewDocumentData, value: string) => {
    onDataChange({
      ...newDocumentData,
      [field]: value,
    });
  };

  return (
    <div className="flex flex-col my-4">
      <div className="space-y-3">
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="documentName" className="text-xs">
              Document Name *
            </Label>
            <Input
              id="documentName"
              value={newDocumentData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter document name"
            />
          </div>
          <Select
            className="!gap-2 w-full"
            label="Document Type"
            labelSize="xs"
            options={documentTypeOptions}
            value={newDocumentData.documentType || undefined}
            onChange={(value) => handleInputChange('documentType', value)}
            placeholder="Select document type"
          />
        </div>
        <div>
          <Label htmlFor="longDescription" className="text-xs">
            Description
          </Label>
          <Textarea
            id="longDescription"
            value={newDocumentData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter document description"
            className="mt-1"
            rows={3}
          />
        </div>
        <div className="flex gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onSubmit(file);
              }}
              style={{ display: 'none' }}
              accept=".pdf,.doc,.docx,.txt"
            />
            <Button
              size="sm"
              disabled={!newDocumentData.name.trim() || isCreating}
              asChild>
              <span>
                {isCreating ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin mr-1" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-1" />
                    Choose File
                  </>
                )}
              </span>
            </Button>
          </label>
          <Button size="sm" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(NewDocumentForm);
