const format = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'medium',
  timeZone: 'UTC',
});

export const formatTimestamp = (timestamp: number): string => {
  return format.format(new Date(timestamp * 1e3));
};

export const formatISO8601Timestamp = (timestamp: string): string => {
  return format.format(new Date(timestamp));
};
