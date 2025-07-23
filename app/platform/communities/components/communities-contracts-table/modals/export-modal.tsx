'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Download, Info } from 'lucide-react';
import { CommunityContract } from '@/app/platform/communities/model/communityContract';
import { exportToTxt } from '../file-utils/txt-export';
import { exportToCsv } from '../file-utils/csv-export';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CommunityContract[];
  communityName: string;
}

export type ExportFormat = 'txt' | 'csv';

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  data,
  communityName,
}) => {
  const [format, setFormat] = useState<ExportFormat>('txt');
  const [filename, setFilename] = useState(() => {
    // For TXT format, use generation contract code, otherwise use community name
    const generationContract = data.find(
      (contract) => contract.contract.contractType === 'GENERATION'
    );
    if (generationContract) {
      return generationContract.contract.contractCode;
    }
    // Fallback to community name if no generation contract
    const sanitizedCommunityName = communityName
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();
    return `${sanitizedCommunityName}_coefficients`;
  });
  const [isExporting, setIsExporting] = useState(false);

  // Calculate contract summary
  const contractSummary = React.useMemo(() => {
    const generation = data.filter(
      (contract) => contract.contract.contractType === 'GENERATION'
    ).length;
    const consumption = data.filter(
      (contract) => contract.contract.contractType === 'CONSUMPTION'
    ).length;
    return { generation, consumption, total: generation + consumption };
  }, [data]);

  const isTxtExportBlocked = React.useMemo(() => {
    return contractSummary.generation > 1;
  }, [contractSummary.generation]);

  // Update filename when community name or format changes
  React.useEffect(() => {
    if (format === 'txt') {
      // For TXT format, use generation contract code
      const generationContract = data.find(
        (contract) => contract.contract.contractType === 'GENERATION'
      );
      if (generationContract) {
        setFilename(generationContract.contract.contractCode);
      } else {
        // Fallback if no generation contract
        const sanitizedCommunityName = communityName
          .replace(/[^a-z0-9]/gi, '_')
          .toLowerCase();
        setFilename(`${sanitizedCommunityName}_coefficients`);
      }
    } else {
      // For CSV format, use community name
      const sanitizedCommunityName = communityName
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase();
      const baseName = `${sanitizedCommunityName}_contracts`;
      setFilename(baseName);
    }
  }, [communityName, format, data]);

  const handleExport = async () => {
    if (!data || data.length === 0) {
      console.warn('No data available for export');
      return;
    }

    // Prevent export if TXT format is selected but blocked
    if (format === 'txt' && isTxtExportBlocked) {
      console.warn('TXT export blocked due to multiple generation contracts');
      return;
    }

    setIsExporting(true);

    try {
      const finalFilename = `${filename}.${format}`;

      if (format === 'txt') {
        exportToTxt(data, finalFilename);
      } else if (format === 'csv') {
        exportToCsv(data, finalFilename);
      }

      // Close modal after successful export
      setTimeout(() => {
        onClose();
        setIsExporting(false);
      }, 500);
    } catch (error) {
      console.error('Error exporting data:', error);
      setIsExporting(false);
    }
  };

  const handleClose = () => {
    if (!isExporting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[575px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 mb-2">
            <Download className="h-5 w-5" />
            Export Community Contracts
          </DialogTitle>
          <DialogDescription>
            Export {data?.length || 0} contracts from "{communityName}"
            community. Choose your preferred format and customize the filename.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 p-4 rounded-lg border border-border">
          <h4 className="text-sm font-medium mb-3">Contract Summary</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                {contractSummary.generation}
              </div>
              <div className="text-muted-foreground">Generation</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {contractSummary.consumption}
              </div>
              <div className="text-muted-foreground">Consumption</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {contractSummary.total}
              </div>
              <div className="text-muted-foreground">Total</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 py-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Export Format</Label>
            {isTxtExportBlocked && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 mb-3">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                      TXT export unavailable
                    </p>
                    <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                      TXT format can only be used when there is exactly one
                      generation contract. This community has{' '}
                      {contractSummary.generation} generation contracts. Please
                      use CSV format for complete data export.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <TooltipProvider>
              <RadioGroup
                value={format}
                onValueChange={(value) => setFormat(value as ExportFormat)}
                className="grid grid-cols-2 gap-4">
                <div
                  className={`flex items-top space-x-2 border border-border rounded-lg p-3 ${
                    isTxtExportBlocked
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-accent cursor-pointer'
                  }`}>
                  <RadioGroupItem
                    value="txt"
                    id="txt"
                    disabled={isTxtExportBlocked}
                  />
                  <Label
                    htmlFor="txt"
                    className="flex gap-2 cursor-pointer flex-1">
                    <div className="flex-1">
                      <div className="font-medium mb-2">TXT</div>
                      <div className="text-xs text-muted-foreground">
                        Coefficient sharings
                      </div>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p>
                          <strong>TXT Format:</strong> Exports CUPS and share
                          coefficients in semicolon-separated format
                          (CUPS;coefficient). Filename uses the generation
                          contract code (CAU format). Ideal for coefficient
                          validation systems.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                </div>
                <div className="flex items-top space-x-2 border border-border rounded-lg p-3 hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="csv" id="csv" />
                  <Label
                    htmlFor="csv"
                    className="flex items-center gap-2 cursor-pointer flex-1">
                    <div className="flex-1">
                      <div className="font-medium mb-2">CSV</div>
                      <div className="text-xs text-muted-foreground">
                        Full data export
                      </div>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p>
                          <strong>CSV Format:</strong> Exports complete contract
                          data including user information, provider details, and
                          community settings in comma-separated format. Filename
                          uses the community name.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                </div>
              </RadioGroup>
            </TooltipProvider>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filename" className="text-sm font-medium">
              Filename
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="Enter filename"
                disabled={isExporting}
              />
              <span className="text-sm text-muted-foreground min-w-fit">
                .{format}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isExporting}>
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={
              isExporting ||
              !filename.trim() ||
              (format === 'txt' && isTxtExportBlocked)
            }
            className="min-w-[100px]">
            {isExporting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Exporting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
