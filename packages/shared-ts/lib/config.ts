import type { AppearanceSettings, SortSettings } from '../types';

export interface FilehuntConfig {
  // API configuration
  apiUrl?: string;
  apiKey?: string;

  // Upload configuration
  maxFileSize?: number;
  supportedFileTypes?: {
    image: string[];
    video: string[];
    audio: string[];
    document: string[];
  };

  // Default settings
  defaultAppearance?: Partial<AppearanceSettings>;
  defaultSort?: Partial<SortSettings>;

  // Feature flags
  features?: {
    enableVersionControl?: boolean;
    enableCollections?: boolean;
    enableBranches?: boolean;
    enableActivities?: boolean;
    enableSearch?: boolean;
  };

  // Theme configuration
  theme?: {
    darkMode?: boolean;
    primaryColor?: string;
    accentColor?: string;
  };
}

export const defaultConfig: FilehuntConfig = {
  maxFileSize: 2 * 1024 * 1024 * 1024, // 2GB
  supportedFileTypes: {
    image: ['jpg', 'jpeg', 'png', 'gif', 'svg'],
    video: ['mp4', 'mov', 'avi', 'mkv'],
    audio: ['mp3', 'wav', 'flac'],
    document: ['pdf', 'doc', 'docx', 'txt', 'xlsx']
  },
  defaultAppearance: {
    cardSize: 'L',
    aspectRatio: '16:9',
    thumbnailScale: 'fill',
    showCardInfo: false
  },
  defaultSort: {
    field: 'date-uploaded',
    direction: 'desc'
  },
  features: {
    enableVersionControl: true,
    enableCollections: true,
    enableBranches: true,
    enableActivities: true,
    enableSearch: true
  },
  theme: {
    darkMode: true,
    primaryColor: '#636AE8',
    accentColor: '#22C55E'
  }
};
