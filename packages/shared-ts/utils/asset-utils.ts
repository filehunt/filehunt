import type { Asset, UploadFile } from '../types';

export const detectFileChanges = (
  file: File,
  existingAssets: { id: string; name: string; version: string }[]
): {
  isNewVersion: boolean;
  existingAssetId?: string;
  existingVersion?: string;
  newVersion?: string;
  changeType: UploadFile['changeType'];
} => {
  const existing = existingAssets.find(asset => asset.name === file.name);
  if (existing) {
    const currentVersionNumber = parseFloat(existing.version.replace('v', ''));
    const newVersionNumber = (currentVersionNumber + 0.1).toFixed(1);
    return {
      isNewVersion: true,
      existingAssetId: existing.id,
      existingVersion: existing.version,
      newVersion: `v${newVersionNumber}`,
      changeType: 'version-update'
    };
  }
  return {
    isNewVersion: false,
    newVersion: 'v1.0',
    changeType: 'new'
  };
};

export const getChangeTypeColor = (changeType: UploadFile['changeType']): string => {
  switch (changeType) {
    case 'new': return 'bg-green-500/20 text-green-300 border-green-500/30';
    case 'version-update': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    case 'metadata-update': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
  }
};

export const getChangeTypeLabel = (changeType: UploadFile['changeType']): string => {
  switch (changeType) {
    case 'new': return 'New File';
    case 'version-update': return 'Version Update';
    case 'metadata-update': return 'Metadata Update';
  }
};
