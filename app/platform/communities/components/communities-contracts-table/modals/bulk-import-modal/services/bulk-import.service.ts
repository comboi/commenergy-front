/**
 * Service for bulk import operations
 */

import apiClient from '@/lib/api-client';
import {
  BulkImportResult,
  BulkImportOptions,
} from '../types/bulk-import.types';

/**
 * Download CSV template for bulk import
 */
export const downloadTemplate = async (): Promise<Blob> => {
  const response = await apiClient.get('/bulk-imports/template', {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Download documented CSV template for bulk import
 */
export const downloadDocumentedTemplate = async (): Promise<Blob> => {
  const response = await apiClient.get('/bulk-imports/template/documented', {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Download minimal CSV template for bulk import
 */
export const downloadMinimalTemplate = async (): Promise<Blob> => {
  const response = await apiClient.get('/bulk-imports/template/minimal', {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Download CSV template with descriptions for bulk import
 */
export const downloadTemplateWithDescriptions = async (): Promise<Blob> => {
  const response = await apiClient.get(
    '/bulk-imports/template/with-descriptions',
    {
      responseType: 'blob',
    }
  );
  return response.data;
};

/**
 * Process bulk import CSV file
 */
export const processBulkImport = async (
  communityId: string,
  file: File,
  options?: BulkImportOptions
): Promise<BulkImportResult> => {
  const formData = new FormData();
  formData.append('file', file);

  if (options) {
    formData.append('options', JSON.stringify(options));
  }

  const response = await apiClient.post(
    `/bulk-imports/${communityId}/process`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};
/**
 * Get import history for a community
 */
export const getImportHistory = async (communityId: string) => {
  const response = await apiClient.get(`/bulk-imports/history/${communityId}`);
  return response.data;
};

/**
 * Helper function to trigger file download
 */
export const triggerFileDownload = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
