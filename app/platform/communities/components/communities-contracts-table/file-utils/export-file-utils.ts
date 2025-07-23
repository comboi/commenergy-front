import { CommunityContract } from '@/app/platform/communities/model/communityContract';
import { exportToCsv, formatDate } from './csv-export';
import { exportToTxt } from './txt-export';

// Re-export individual format functions
export { exportToCsv } from './csv-export';
export { exportToTxt } from './txt-export';
export { formatDate } from './csv-export';

/**
 * Main export function that handles both CSV and TXT formats
 */
export const exportCommunityContracts = (
  data: CommunityContract[],
  format: 'csv' | 'txt',
  filename?: string
): void => {
  if (!data || data.length === 0) {
    console.warn('No data available for export');
    return;
  }

  try {
    switch (format) {
      case 'csv':
        exportToCsv(data, filename);
        break;
      case 'txt':
        exportToTxt(data, filename);
        break;
      default:
        console.error('Unsupported export format:', format);
    }
  } catch (error) {
    console.error('Error exporting data:', error);
  }
};
