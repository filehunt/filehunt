export type ViewMode = 'grid' | 'list' | 'gallery' | 'asset-detail';
export type AppView = 'main' | 'upload' | 'search' | 'collections' | 'branches' | 'favorites' | 'settings' | 'help' | 'asset-detail' | 'activities';

export interface AppearanceSettings {
  cardSize: 'S' | 'M' | 'L';
  aspectRatio: '16:9' | '4:3' | '1:1';
  thumbnailScale: 'fit' | 'fill';
  showCardInfo: boolean;
}

export interface SortSettings {
  field: 'date-uploaded' | 'name' | 'size' | 'type' | 'uploader' | 'comments';
  direction: 'asc' | 'desc';
}

export interface UploadFile {
  id: string;
  file: File;
  preview?: string;
  progress: number;
  status: 'staged' | 'uploading' | 'completed' | 'error';
  tags: string[];
  folders: string[];
  isNewVersion?: boolean;
  existingAssetId?: string;
  existingVersion?: string;
  newVersion?: string;
  changeType: 'new' | 'version-update' | 'metadata-update';
  isApproved: boolean;
}

export interface SearchFilters {
  query?: string;
  type?: string[];
  tags?: string[];
  folders?: string[];
  status?: string[];
  uploader?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'editor' | 'viewer';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  owner: User;
  collaborators: User[];
  createdAt: string;
  updatedAt: string;
  settings: {
    visibility: 'public' | 'private';
    allowComments: boolean;
    autoApproval: boolean;
  };
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  category: string;
  description?: string;
  createdAt: string;
  createdBy: User;
}
