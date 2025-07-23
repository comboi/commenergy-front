import React, { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical, LoaderCircle, Upload } from 'lucide-react';
import { formatDate } from '../../../../communities-contracts-table/file-utils/export-file-utils';
import { Document } from '../../../../../model/document';
import { translateDocumentType } from '../../utils';

type DocumentRowProps = {
  document: Document;
  uploadedDocument?: Document;
  onFileUpload: (file: File, documentId: string) => void;
  onDownload: (url: string) => void;
  onRemove: (documentId: string) => void;
  isUploading: boolean;
  isDeleting: boolean;
};

const DocumentRow = ({
  document,
  uploadedDocument,
  onFileUpload,
  onDownload,
  onRemove,
  isUploading,
  isDeleting,
}: DocumentRowProps) => {
  return (
    <TableRow>
      <TableCell className="truncate">{document.name}</TableCell>
      <TableCell>{formatDate(document.createdAt)}</TableCell>
      <TableCell>{translateDocumentType(document.documentType)}</TableCell>
      <TableCell className="text-right">
        {uploadedDocument ? (
          <div className="flex justify-end gap-2">
            <DropdownMenu>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <label className="cursor-pointer w-full">
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onFileUpload(file, document.id);
                        }
                      }}
                      style={{ display: 'none' }}
                      accept=".pdf,.doc,.docx,.txt"
                    />
                    Replace
                  </label>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onRemove(uploadedDocument.id)}
                  disabled={isDeleting}>
                  {isDeleting ? 'Removing' : 'Remove'}
                </DropdownMenuItem>
              </DropdownMenuContent>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="h-9 w-9">
                  {isDeleting ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <EllipsisVertical />
                  )}
                </Button>
              </DropdownMenuTrigger>
            </DropdownMenu>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onDownload(uploadedDocument.url)}>
              View file
            </Button>
          </div>
        ) : (
          <label className="cursor-pointer">
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onFileUpload(file, document.id);
                }
              }}
              style={{ display: 'none' }}
              accept=".pdf,.doc,.docx,.txt"
            />
            <Button variant="default" size="sm" disabled={isUploading} asChild>
              <span>
                {isUploading ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Uploading
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-1" />
                    Upload file
                  </>
                )}
              </span>
            </Button>
          </label>
        )}
      </TableCell>
    </TableRow>
  );
};

export default memo(DocumentRow);
