import React, { useRef, useState } from 'react';
import { CommunityContract } from '@/app/communities/model/communityContract';
import { useCommunityModelDocuments } from '@/app/communities/services/communities/useCommunityDocuments';
import {
  useCommunityContractDocuments,
  useUploadCommunityContractDocument,
} from '@/app/communities/services/communityContracts/useCommunityContractDocuments';
import { useDeleteDocument } from '@/app/communities/services/documents/useDeleteDocuments';
import { v4 } from 'uuid';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonWithTooltip } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '../file-utils/export-file-utils';
import { EllipsisVertical, LoaderCircle, Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';

type Props = {
  onClose: () => void;
  communityContract: CommunityContract;
};

const CommunityContractDocumentsForm = ({
  communityContract,
  onClose,
}: Props) => {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: communityModelDocuments = [] } = useCommunityModelDocuments(
    communityContract.communityId
  );

  const { data: communityContractDocuments = [], refetch } =
    useCommunityContractDocuments(communityContract.id);

  const { mutate: uploadDocument, isPending: isUploading } =
    useUploadCommunityContractDocument({
      callback: () => {
        refetch();
        setSelectedDocumentId(null);
      },
    });

  const { mutate: deleteDocument, isPending: isDeleting } = useDeleteDocument({
    callback: () => {
      refetch();
    },
  });

  const handleDownload = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  const handleUploadDocument = (documentId: string) => {
    setSelectedDocumentId(documentId);
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedDocumentId) {
      uploadDocument({
        communityContractId: communityContract.id,
        documentId: v4(),
        relatedDocumentId: selectedDocumentId,
        file,
      });
    }
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReplaceDocument = (documentId: string) => {
    setSelectedDocumentId(documentId);
    fileInputRef.current?.click();
  };

  const handleRemoveDocument = (documentId: string) => {
    deleteDocument(documentId);
  };

  return (
    <div className="relative">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        accept=".pdf,.doc,.docx,.txt"
      />

      <Table className="mb-8">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Updated date</TableHead>
            <TableHead>Template</TableHead>
            <TableHead className="text-right">File</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {communityModelDocuments.map((document) => {
            const uploadedDocument = communityContractDocuments.find(
              (doc) => doc.relatedDocumentId === document.id
            );
            return (
              <TableRow key={document.id}>
                <TableCell className="truncate">{document.name}</TableCell>
                <TableCell>{formatDate(document.createdAt)}</TableCell>
                <TableCell>
                  <Button
                    className="w-9 h-9"
                    variant="secondary"
                    size="icon"
                    onClick={() => handleDownload(document.url)}>
                    <Download />
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  {uploadedDocument ? (
                    <div className="flex justify-end gap-2">
                      <DropdownMenu>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleReplaceDocument(document.id)}>
                            Replace
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleRemoveDocument(uploadedDocument.id)
                            }
                            disabled={isDeleting}>
                            {isDeleting ? 'Removing' : 'Remove'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-9 w-9">
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
                        onClick={() => handleDownload(uploadedDocument.url)}>
                        View file
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      disabled={
                        isUploading && selectedDocumentId === document.id
                      }
                      onClick={() => handleUploadDocument(document.id)}>
                      {isUploading && selectedDocumentId === document.id ? (
                        <>
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                          Uploading
                        </>
                      ) : (
                        'Upload file'
                      )}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter
          className="bg-transparent !py-2"
          hidden={
            communityModelDocuments.length === 0 &&
            communityContractDocuments.length === 0
          }>
          <TableRow className="!py-0">
            <TableCell colSpan={4} className="text-left !py-4">
              Total files:{' '}
              {`${communityContractDocuments.length}/${
                communityModelDocuments.length || 'N/A'
              }`}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <DialogFooter>
        <div className="flex justify-end gap-4">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <ButtonWithTooltip
            variant="default"
            onClick={onClose}
            disabled
            tooltip="Missing documents">
            Submit docs
          </ButtonWithTooltip>
        </div>
      </DialogFooter>
    </div>
  );
};

export default CommunityContractDocumentsForm;
