import { Document, DocumentType } from '../../../../model/document';

export type UploadAction = {
  type: 'template' | 'new';
  documentId?: string;
  name?: string;
  description?: string;
  documentType?: DocumentType;
};

export type NewDocumentData = {
  name: string;
  description: string;
  documentType: DocumentType | '';
};

export type { Document, DocumentType };
