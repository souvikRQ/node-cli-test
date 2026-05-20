// Helper function to ensure value is a string
export const ensureString = (value: any): string | null => {
  if (typeof value === 'string') {
    return value;
  }
  return null;
};
