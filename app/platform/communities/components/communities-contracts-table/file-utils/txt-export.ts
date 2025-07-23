import { CommunityContract } from '@/app/platform/communities/model/communityContract';

/**
 * Utility functions for exporting community contracts data to TXT format
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
 * Converts community contracts data to TXT format with semicolon-separated values
 * Format: contractCode;share (with comma as decimal separator)
 * Two columns: CUPS (contractCode) on the left, share on the right of the semicolon
 */
export const exportToTxt = (
  data: CommunityContract[],
  filename?: string
): void => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Create content with contractCode;share format (two columns separated by semicolon)
  let content = '';

  data.forEach((contract) => {
    const contractCode = contract.contract.contractCode || '';
    const share = contract.sharing?.share || 0;

    // Format share with 6 decimal places and comma as decimal separator (European format)
    const formattedShare = share.toFixed(6).replace('.', ',');

    content += `${contractCode};${formattedShare}\n`;
  });

  // Use provided filename or default to community name + coefficients
  const finalFilename = filename || 'community_coefficients.txt';

  downloadFile(content, finalFilename, 'text/plain;charset=utf-8;');
};
