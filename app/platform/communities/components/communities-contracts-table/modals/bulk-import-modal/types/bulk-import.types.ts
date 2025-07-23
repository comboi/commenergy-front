/**
 * Types for bulk import operations
 */

export interface BulkImportResult {
  totalProcessed: number;
  successful: number;
  failed: number;
  skipped: number;
  errors?: BulkImportError[];
  warnings?: BulkImportWarning[];
  summary: {
    usersCreated: number;
    contractsCreated: number;
    relationshipsCreated: number; // This refers to community contracts created
  };
}

export interface BulkImportError {
  row: number;
  field?: string;
  message: string;
  data?: any;
}

export interface BulkImportWarning {
  row: number;
  field?: string;
  message: string;
  data?: any;
}

export interface BulkImportOptions {
  skipValidation?: boolean;
  updateExisting?: boolean;
}
