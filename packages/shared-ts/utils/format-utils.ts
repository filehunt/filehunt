export const formatTimestamp = (timestamp: string): string => {
  // Add timestamp formatting logic here
  return timestamp;
};

export const formatVersion = (version: string): string => {
  if (!version.startsWith('v') && !version.startsWith('V')) {
    return `v${version}`;
  }
  return version;
};

export const parseVersion = (version: string): number => {
  return parseFloat(version.replace(/^v/i, ''));
};

export const incrementVersion = (version: string, increment = 0.1): string => {
  const versionNumber = parseVersion(version);
  const newVersionNumber = (versionNumber + increment).toFixed(1);
  return `v${newVersionNumber}`;
};
