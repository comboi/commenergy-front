import React, { memo, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import DocumentRow from './row/DocumentRow';
import UploadedDocumentRow from './row/UploadedDocumentRow';
import { Document } from '../../../../model/document';

type DocumentsTableProps = {
  communityModelDocuments: Document[];
  communityDocuments: Document[];
  onTemplateFileUpload: (file: File, documentId: string) => void;
  onDownload: (url: string) => void;
  onRemoveDocument: (documentId: string) => void;
  isUploading: boolean;
  isDeleting: boolean;
};

const DocumentsTable = ({
  communityModelDocuments,
  communityDocuments,
  onTemplateFileUpload,
  onDownload,
  onRemoveDocument,
  isUploading,
  isDeleting,
}: DocumentsTableProps) => {
  const documentsWithoutTemplates = useMemo(
    () =>
      communityDocuments.filter(
        (doc) =>
          !communityModelDocuments.some(
            (model) => model.id === doc.relatedDocumentId
          )
      ),
    [communityDocuments, communityModelDocuments]
  );

  return (
    <Table className="mb-8">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Document Type</TableHead>
          <TableHead className="text-right">File</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {communityModelDocuments.map((document) => {
          const uploadedDocument = communityDocuments.find(
            (doc) => doc.relatedDocumentId === document.id
          );
          return (
            <DocumentRow
              key={document.id}
              document={document}
              uploadedDocument={uploadedDocument}
              onFileUpload={onTemplateFileUpload}
              onDownload={onDownload}
              onRemove={onRemoveDocument}
              isUploading={isUploading}
              isDeleting={isDeleting}
            />
          );
        })}
        {documentsWithoutTemplates.map((document) => (
          <UploadedDocumentRow
            key={document.id}
            document={document}
            onDownload={onDownload}
            onRemove={onRemoveDocument}
            isDeleting={isDeleting}
          />
        ))}
      </TableBody>
      <TableFooter
        className="bg-transparent !py-2"
        hidden={
          communityModelDocuments.length === 0 &&
          communityDocuments.length === 0
        }>
        <TableRow className="!py-0">
          <TableCell colSpan={4} className="text-left !py-4">
            {`Total files: ${communityDocuments.length}`}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default memo(DocumentsTable);
