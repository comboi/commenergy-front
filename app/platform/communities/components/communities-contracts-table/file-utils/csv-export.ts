import { CommunityContract } from '@/app/platform/communities/model/communityContract';

/**
 * Utility functions for exporting community contracts data to CSV format
 */

/**
 * Downloads a file with the specified content and filename
 */
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Formats a date string to a readable format
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return 'Invalid Date';
  }
};

/**
 * Formats currency values
 */
const formatCurrency = (amount: number | null): string => {
  if (amount === null || amount === undefined) return 'N/A';
  return `€${amount.toFixed(2)}`;
};

/**
 * Formats percentage values
 */
const formatPercentage = (value: number | null): string => {
  if (value === null || value === undefined) return 'N/A';
  return `${(value * 100).toFixed(2)}%`;
};

/**
 * Converts community contracts data to CSV format
 */
export const exportToCsv = (
  data: CommunityContract[],
  filename?: string
): void => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Define CSV headers
  const headers = [
    'Contract ID',
    'Contract Name',
    'Code',
    'Contract Type',
    'Contract Power (kW)',
    'State',
    'Full Address',
    'Provider Name',
    'Provider VAT',
    'User Name',
    'User VAT',
    'User Email',
    'User Mobile',
    'Energy Source Type',
    'Community Join Date',
    'Community Fee',
    'Fee Period Type',
    'Community Share (%)',
    'Sharing Version',
    'Terms Agreement',
  ];

  // Convert data to CSV rows
  const rows = data.map((contract) => [
    contract.contract.id,
    contract.contract.name,
    contract.contract.contractCode,
    contract.contract.contractType,
    contract.contract.contractPower?.toString() || 'N/A',
    contract.contract.state,
    contract.contract.fullAddress,
    contract.contract.provider.name,
    contract.contract.provider.vat,
    contract.contract.user.name,
    contract.contract.user.vat,
    contract.contract.user.email,
    contract.contract.user.mobile,
    contract.contract.energySourceType || 'N/A',
    formatDate(contract.communityJoinDate),
    formatCurrency(contract.communityFee),
    contract.communityFeePeriodType || 'N/A',
    formatPercentage(contract.sharing?.share || null),
    contract.sharing?.version?.id || 'N/A',
    contract.termsAgreement || 'N/A',
  ]);

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map((row) =>
      row
        .map((field) => {
          // Escape fields containing commas, quotes, or newlines
          const stringField = String(field);
          if (
            stringField.includes(',') ||
            stringField.includes('"') ||
            stringField.includes('\n')
          ) {
            return `"${stringField.replace(/"/g, '""')}"`;
          }
          return stringField;
        })
        .join(',')
    )
    .join('\n');

  // Use provided filename or generate default filename with timestamp
  const finalFilename =
    filename ||
    `community_contracts_${new Date().toISOString().split('T')[0]}.csv`;

  downloadFile(csvContent, finalFilename, 'text/csv;charset=utf-8;');
};
