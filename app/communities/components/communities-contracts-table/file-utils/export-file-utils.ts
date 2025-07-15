import { CommunityContract } from '@/app/communities/model/communityContract';

/**
 * Utility functions for exporting community contracts data to different file formats
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
  communityName: string
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

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${communityName
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase()}_contracts_${timestamp}.csv`;

  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
};

/**
 * Converts community contracts data to TXT format
 */
export const exportToTxt = (
  data: CommunityContract[],
  communityName: string
): void => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const timestamp = new Date().toLocaleString();
  let content = `COMMUNITY CONTRACTS REPORT\n`;
  content += `Community: ${communityName}\n`;
  content += `Generated: ${timestamp}\n`;
  content += `Total Contracts: ${data.length}\n`;
  content += `${'='.repeat(80)}\n\n`;

  data.forEach((contract, index) => {
    content += `CONTRACT ${index + 1}\n`;
    content += `${'-'.repeat(40)}\n`;
    content += `Contract ID: ${contract.contract.id}\n`;
    content += `Contract Name: ${contract.contract.name}\n`;
    content += `Contract Code: ${contract.contract.contractCode}\n`;
    content += `Type: ${contract.contract.contractType}\n`;
    content += `Power: ${
      contract.contract.contractPower
        ? `${contract.contract.contractPower} kW`
        : 'N/A'
    }\n`;
    content += `State: ${contract.contract.state}\n`;
    content += `Address: ${contract.contract.fullAddress}\n`;
    content += `\n`;

    content += `PROVIDER INFORMATION:\n`;
    content += `  Name: ${contract.contract.provider.name}\n`;
    content += `  VAT: ${contract.contract.provider.vat}\n`;
    content += `  Code: ${contract.contract.provider.code}\n`;
    content += `\n`;

    content += `USER INFORMATION:\n`;
    content += `  Name: ${contract.contract.user.name}\n`;
    content += `  VAT: ${contract.contract.user.vat}\n`;
    content += `  Email: ${contract.contract.user.email}\n`;
    content += `  Mobile: ${contract.contract.user.mobile}\n`;
    content += `\n`;

    content += `COMMUNITY DETAILS:\n`;
    content += `  Join Date: ${formatDate(contract.communityJoinDate)}\n`;
    content += `  Community Fee: ${formatCurrency(contract.communityFee)}\n`;
    content += `  Fee Period: ${contract.communityFeePeriodType || 'N/A'}\n`;
    content += `  Community Share: ${formatPercentage(
      contract.sharing?.share || null
    )}\n`;
    content += `  Sharing Version: ${contract.sharing?.version?.id || 'N/A'}\n`;
    content += `\n`;

    if (contract.contract.energySourceType) {
      content += `ENERGY SOURCE: ${contract.contract.energySourceType}\n\n`;
    }

    if (contract.termsAgreement) {
      content += `TERMS AGREEMENT:\n`;
      content += `${contract.termsAgreement}\n\n`;
    }

    content += `${'='.repeat(80)}\n\n`;
  });

  // Add summary statistics
  const totalShares = data.reduce(
    (sum, contract) => sum + (contract.sharing?.share || 0),
    0
  );
  const averageShare = data.length > 0 ? totalShares / data.length : 0;
  const totalFees = data.reduce(
    (sum, contract) => sum + (contract.communityFee || 0),
    0
  );
  const contractTypes = data.reduce((acc, contract) => {
    const type = contract.contract.contractType;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  content += `SUMMARY STATISTICS\n`;
  content += `${'-'.repeat(40)}\n`;
  content += `Total Contracts: ${data.length}\n`;
  content += `Total Community Shares: ${formatPercentage(totalShares)}\n`;
  content += `Average Share per Contract: ${formatPercentage(averageShare)}\n`;
  content += `Total Community Fees: ${formatCurrency(totalFees)}\n`;
  content += `\nContract Types:\n`;
  Object.entries(contractTypes).forEach(([type, count]) => {
    content += `  ${type}: ${count} contracts\n`;
  });
  content += `\n`;

  // Generate filename with timestamp
  const fileTimestamp = new Date().toISOString().split('T')[0];
  const filename = `${communityName
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase()}_contracts_${fileTimestamp}.txt`;

  downloadFile(content, filename, 'text/plain;charset=utf-8;');
};

/**
 * Main export function that handles both CSV and TXT formats
 */
export const exportCommunityContracts = (
  data: CommunityContract[],
  format: 'csv' | 'txt',
  communityName: string
): void => {
  if (!data || data.length === 0) {
    console.warn('No data available for export');
    return;
  }

  try {
    switch (format) {
      case 'csv':
        exportToCsv(data, communityName);
        break;
      case 'txt':
        exportToTxt(data, communityName);
        break;
      default:
        console.error('Unsupported export format:', format);
    }
  } catch (error) {
    console.error('Error exporting data:', error);
  }
};
