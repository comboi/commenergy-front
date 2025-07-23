export const translateDocumentType = (documentType: string) => {
  switch (documentType) {
    case 'COMMUNITY_DOCUMENT':
      return 'Community document';
    case 'COMMUNITY_MODEL':
      return 'Community contract model';
    case 'CONTRACT_DOCUMENT':
      return 'Contract document';
    default:
      return '';
  }
};
