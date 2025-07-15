'use client';

import React, { useState } from 'react';
import { Document } from '../../../model/document';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Download,
  Calendar,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface DocumentItemProps {
  document: Document;
  onDownload: (document: Document) => void;
  onDelete?: (document: Document) => void;
  isLoggedUserAdmin: boolean;
}

export function DocumentItem({
  document,
  onDownload,
  onDelete,
  isLoggedUserAdmin,
}: DocumentItemProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const hasLongDescription =
    document.longDescription && document.longDescription.length > 300;

  return (
    <div className="p-4 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-medium">
                {document.name || 'Untitled Document'}
              </h4>
              <span className="text-sm text-gray-400 ml-4">
                {document.createdAt
                  ? formatDate(document.createdAt)
                  : 'Unknown date'}
              </span>
            </div>
            {document.longDescription && (
              <div className="mt-2">
                <div
                  className={`text-sm text-gray-400 ${
                    isDescriptionExpanded || !hasLongDescription
                      ? ''
                      : 'truncate'
                  }`}>
                  {document.longDescription}
                </div>
                {hasLongDescription && (
                  <button
                    onClick={() =>
                      setIsDescriptionExpanded(!isDescriptionExpanded)
                    }
                    className="mt-1 text-xs text-gray-400 flex items-center gap-1 underline">
                    {isDescriptionExpanded ? (
                      <>
                        Show less <ChevronUp className="w-3 h-3" />
                      </>
                    ) : (
                      <>
                        Show more <ChevronDown className="w-3 h-3" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload(document)}
            className="flex items-center space-x-1">
            <Download className="w-4 h-4" />
            <span>Download</span>
          </Button>
          {isLoggedUserAdmin && onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(document)}
              className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50">
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
