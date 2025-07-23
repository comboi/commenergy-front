'use client';

import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Download,
  Upload,
  FileSpreadsheet,
  AlertCircle,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  useDownloadTemplate,
  useProcessBulkImport,
} from './hooks/use-bulk-import';
import { BulkImportResult } from './types/bulk-import.types';
import { ImportSummary } from './components/import-summary';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  communityId: string;
  onSuccess?: () => void;
}

type ModalStep = 'upload' | 'summary';

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  communityId,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<ModalStep>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [importResult, setImportResult] = useState<BulkImportResult | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hooks for API operations
  const downloadTemplateMutation = useDownloadTemplate();
  const processBulkImportMutation = useProcessBulkImport();

  const handleFileSelect = (file: File) => {
    if (file && file.name.endsWith('.csv')) {
      setSelectedFile(file);
    } else {
      alert('Please select a valid CSV file (.csv)');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDownloadTemplate = () => {
    downloadTemplateMutation.mutate();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    try {
      const result = await processBulkImportMutation.mutateAsync({
        communityId,
        file: selectedFile,
      });

      // Set the result and move to summary step
      setImportResult(result);
      setCurrentStep('summary');

      // Call success callback to refresh data
      onSuccess?.();
    } catch (error) {
      // Error handling is done in the hook
      console.error('Upload failed:', error);
    }
  };

  const resetModal = () => {
    setSelectedFile(null);
    setIsDragOver(false);
    setCurrentStep('upload');
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const renderUploadStep = () => (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-6">
        {/* Template Download Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Step 1: Download Template</h4>
          <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
            <FileSpreadsheet className="h-8 w-8 text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-medium">CSV Template</p>
              <p className="text-xs text-muted-foreground">
                Download the template with the required format and sample data
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="ghost" size="sm">
                <a
                  href="/docs/csv-import-guide"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1">
                  📖 Import Guide
                </a>
              </Button>
              <Button
                onClick={handleDownloadTemplate}
                variant="outline"
                size="sm"
                disabled={downloadTemplateMutation.isPending}>
                {downloadTemplateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Download
              </Button>
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Step 2: Upload Completed File</h4>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}>
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {selectedFile
                  ? `Selected: ${selectedFile.name}`
                  : 'Drag and drop your CSV file here'}
              </p>
              <p className="text-xs text-muted-foreground">
                or click to browse files
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="sm"
                className="mt-3">
                Select File
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {selectedFile && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                File selected: <strong>{selectedFile.name}</strong> (
                {(selectedFile.size / 1024).toFixed(1)} KB)
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Information Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Important Notes</h4>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>
              Make sure your CSV file follows the exact format in the template
            </li>
            <li>Required fields must be filled for all rows</li>
            <li>
              The system will validate your data and create contracts
              automatically
            </li>
            <li>You will be notified of any errors during processing</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderSummaryStep = () => (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-6">
        {importResult && <ImportSummary result={importResult} />}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {currentStep === 'upload' ? (
              <Upload className="h-5 w-5" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-600" />
            )}
            {currentStep === 'upload'
              ? 'Bulk Import Contracts'
              : 'Import Summary'}
          </DialogTitle>
          <DialogDescription>
            {currentStep === 'upload'
              ? 'Import multiple contracts at once using a CSV file. Download the template to get started.'
              : 'Review the results of your bulk import operation.'}
          </DialogDescription>
        </DialogHeader>

        {currentStep === 'upload' ? renderUploadStep() : renderSummaryStep()}

        <DialogFooter className="flex-shrink-0">
          {currentStep === 'upload' ? (
            <>
              <Button onClick={handleClose} variant="outline">
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || processBulkImportMutation.isPending}>
                {processBulkImportMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Contracts
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={handleClose}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
