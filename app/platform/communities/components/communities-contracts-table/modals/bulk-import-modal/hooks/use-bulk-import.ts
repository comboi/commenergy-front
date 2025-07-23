'use client';

/**
 * React hooks for bulk import operations
 */

import { useMutation } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import {
  downloadTemplate,
  downloadDocumentedTemplate,
  downloadMinimalTemplate,
  downloadTemplateWithDescriptions,
  processBulkImport,
  triggerFileDownload,
} from '../services/bulk-import.service';
import {
  BulkImportOptions,
  BulkImportResult,
} from '../types/bulk-import.types';

/**
 * Hook for downloading CSV templates
 */
export const useDownloadTemplate = () => {
  return useMutation({
    mutationFn: downloadTemplate,
    onSuccess: (blob) => {
      triggerFileDownload(blob, 'bulk-import-template.csv');
      toast({
        title: 'Template downloaded',
        description: 'CSV template has been downloaded successfully.',
      });
    },
    onError: (error) => {
      console.error('Error downloading template:', error);
      toast({
        variant: 'destructive',
        title: 'Download failed',
        description: 'Failed to download the CSV template. Please try again.',
      });
    },
  });
};

/**
 * Hook for downloading documented CSV templates
 */
export const useDownloadDocumentedTemplate = () => {
  return useMutation({
    mutationFn: downloadDocumentedTemplate,
    onSuccess: (blob) => {
      triggerFileDownload(blob, 'bulk-import-documented-template.csv');
      toast({
        title: 'Template downloaded',
        description:
          'Documented CSV template has been downloaded successfully.',
      });
    },
    onError: (error) => {
      console.error('Error downloading documented template:', error);
      toast({
        variant: 'destructive',
        title: 'Download failed',
        description:
          'Failed to download the documented CSV template. Please try again.',
      });
    },
  });
};

/**
 * Hook for downloading minimal CSV templates
 */
export const useDownloadMinimalTemplate = () => {
  return useMutation({
    mutationFn: downloadMinimalTemplate,
    onSuccess: (blob) => {
      triggerFileDownload(blob, 'bulk-import-minimal-template.csv');
      toast({
        title: 'Template downloaded',
        description: 'Minimal CSV template has been downloaded successfully.',
      });
    },
    onError: (error) => {
      console.error('Error downloading minimal template:', error);
      toast({
        variant: 'destructive',
        title: 'Download failed',
        description:
          'Failed to download the minimal CSV template. Please try again.',
      });
    },
  });
};

/**
 * Hook for downloading CSV templates with descriptions
 */
export const useDownloadTemplateWithDescriptions = () => {
  return useMutation({
    mutationFn: downloadTemplateWithDescriptions,
    onSuccess: (blob) => {
      triggerFileDownload(blob, 'bulk-import-template-with-descriptions.csv');
      toast({
        title: 'Template downloaded',
        description:
          'CSV template with descriptions has been downloaded successfully.',
      });
    },
    onError: (error) => {
      console.error('Error downloading template with descriptions:', error);
      toast({
        variant: 'destructive',
        title: 'Download failed',
        description:
          'Failed to download the CSV template with descriptions. Please try again.',
      });
    },
  });
};

/**
 * Hook for processing bulk import
 */
export const useProcessBulkImport = () => {
  return useMutation({
    mutationFn: ({
      communityId,
      file,
      options,
    }: {
      communityId: string;
      file: File;
      options?: BulkImportOptions;
    }) => processBulkImport(communityId, file, options),
    onError: (error) => {
      console.error('Error processing bulk import:', error);
      toast({
        variant: 'destructive',
        title: 'Import failed',
        description:
          'Failed to process the bulk import. Please check your file and try again.',
      });
    },
  });
};
