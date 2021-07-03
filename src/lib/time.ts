export const formatTimestamp = (timestamp: number): string => {
  const format = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'medium',
    timeZone: 'UTC'
  });

  return format.format(new Date(timestamp * 1e3));
};