export const getENVFile = () => {
  switch (process.env.NODE_ENV?.toLowerCase()) {
    case 'development':
      return '.env.dev';
    default:
      return '.env';
  }
};
