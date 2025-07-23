'use client';

import React from 'react';
import { Document } from '../../../model/document';
import { DocumentItem } from './document-items';
import { FileText } from 'lucide-react';

interface DocumentItemsListProps {
  documents: Document[];
  isLoggedUserAdmin: boolean;
  emptyMessage?: string;
  onDelete?: (document: Document) => void;
}

export function DocumentItemsList({
  documents,
  isLoggedUserAdmin,
  emptyMessage = 'No documents found for this category',
  onDelete,
}: DocumentItemsListProps) {
  const handleDownload = (document: Document) => {
    if (document.url) {
      // Create a temporary link element and trigger download
      const link = window.document.createElement('a');
      link.href = document.url;
      link.download = document.name || 'document';
      link.target = '_blank';
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    } else {
      console.error('Document URL not available');
    }
  };
  if (documents.length === 0) {
    return (
      <div className="border rounded-lg p-6">
        <div className="text-center text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>{emptyMessage}</p>
          {isLoggedUserAdmin && (
            <p className="text-sm mt-2">Upload documents to get started</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <div className="divide-y">
        {documents.map((document) => (
          <DocumentItem
            key={document.id}
            document={document}
            onDownload={handleDownload}
            onDelete={onDelete}
            isLoggedUserAdmin={isLoggedUserAdmin}
          />
        ))}
      </div>
    </div>
  );
}
