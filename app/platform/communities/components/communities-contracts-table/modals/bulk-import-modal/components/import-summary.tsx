'use client';

import React from 'react';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  FileText,
  Building,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BulkImportResult } from '../types/bulk-import.types';

interface ImportSummaryProps {
  result: BulkImportResult;
}

export const ImportSummary: React.FC<ImportSummaryProps> = ({ result }) => {
  const hasErrors = result.errors && result.errors.length > 0;
  const hasWarnings = result.warnings && result.warnings.length > 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              Processed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {result.totalProcessed}
            </div>
            <p className="text-xs text-muted-foreground">
              Total rows processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              Successful
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {result.successful}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully imported
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              Community Contracts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {result.summary.relationshipsCreated}
            </div>
            <p className="text-xs text-muted-foreground">Contracts imported</p>
          </CardContent>
        </Card>
      </div>

      {/* Error/Warning Cards */}
      {(result.failed > 0 || result.skipped > 0) && (
        <div className="grid grid-cols-2 gap-4">
          {result.failed > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  Failed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {result.failed}
                </div>
                <p className="text-xs text-muted-foreground">
                  Failed to import
                </p>
              </CardContent>
            </Card>
          )}

          {result.skipped > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  Skipped
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {result.skipped}
                </div>
                <p className="text-xs text-muted-foreground">Skipped rows</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Created Items Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Created Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-2" />
              <div>
                <div className="text-lg font-semibold">
                  {result.summary.usersCreated}
                </div>
                <p className="text-xs text-muted-foreground">Users</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 rounded-lg p-2" />
              <div>
                <div className="text-lg font-semibold">
                  {result.summary.contractsCreated}
                </div>
                <p className="text-xs text-muted-foreground">Contracts</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building className="h-8 w-8 text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded-lg p-2" />
              <div>
                <div className="text-lg font-semibold">
                  {result.summary.relationshipsCreated}
                </div>
                <p className="text-xs text-muted-foreground">
                  Community Contracts
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Errors Section */}
      {hasErrors && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">
                {result.errors!.length} error(s) occurred during import:
              </p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {result.errors!.slice(0, 5).map((error, index) => (
                  <div key={index} className="text-sm">
                    <Badge variant="destructive" className="mr-2">
                      Row {error.row}
                    </Badge>
                    {error.field && (
                      <Badge variant="outline" className="mr-2">
                        {error.field}
                      </Badge>
                    )}
                    {error.message}
                  </div>
                ))}
                {result.errors!.length > 5 && (
                  <p className="text-sm text-muted-foreground">
                    And {result.errors!.length - 5} more error(s)...
                  </p>
                )}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Warnings Section */}
      {hasWarnings && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">
                {result.warnings!.length} warning(s) during import:
              </p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {result.warnings!.slice(0, 3).map((warning, index) => (
                  <div key={index} className="text-sm">
                    <Badge variant="secondary" className="mr-2">
                      Row {warning.row}
                    </Badge>
                    {warning.field && (
                      <Badge variant="outline" className="mr-2">
                        {warning.field}
                      </Badge>
                    )}
                    {warning.message}
                  </div>
                ))}
                {result.warnings!.length > 3 && (
                  <p className="text-sm text-muted-foreground">
                    And {result.warnings!.length - 3} more warning(s)...
                  </p>
                )}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Success Message */}
      {!hasErrors && result.successful > 0 && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Import completed successfully! {result.successful} row(s) were
            processed and imported.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
