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
import { EllipsisVertical, LoaderCircle } from 'lucide-react';
import { formatDate } from '../../../../communities-contracts-table/file-utils/export-file-utils';
import { Document } from '../../../../../model/document';
import { translateDocumentType } from '../../utils';

type UploadedDocumentRowProps = {
  document: Document;
  onDownload: (url: string) => void;
  onRemove: (documentId: string) => void;
  isDeleting: boolean;
};

const UploadedDocumentRow = ({
  document,
  onDownload,
  onRemove,
  isDeleting,
}: UploadedDocumentRowProps) => {
  return (
    <TableRow>
      <TableCell className="truncate">{document.name}</TableCell>
      <TableCell>{formatDate(document.createdAt)}</TableCell>
      <TableCell>{translateDocumentType(document.documentType)}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <DropdownMenu>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => onRemove(document.id)}
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
            onClick={() => onDownload(document.url)}>
            View file
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default memo(UploadedDocumentRow);
