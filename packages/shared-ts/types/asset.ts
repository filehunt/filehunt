import type { TimelineCommit } from './timeline';
import type { Comment } from './comment';

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'other';
  size: string;
  uploadDate: string;
  uploader: string;
  tags: string[];
  folders: string[];
  thumbnail?: string;
  status: 'approved' | 'needs-review' | 'rejected' | 'needs-retouching';
  duration?: string;
  comments: number;
  version?: string;
  timeline?: TimelineCommit[];
  assetComments?: Comment[];
}

export type AssetType = Asset['type'];
export type AssetStatus = Asset['status'];
