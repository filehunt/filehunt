export interface Activity {
  id: string;
  type: 'commit' | 'upload' | 'comment' | 'delete' | 'edit' | 'merge' | 'branch' | 'tag' | 'share' | 'approve' | 'reject' | 'archive' | 'favorite' | 'view';
  message: string;
  description?: string;
  author: string;
  authorAvatar: string;
  timestamp: string;
  date: string;
  time: string;
  branch?: string;
  parentBranch?: string;
  tag?: string;
  assetName?: string;
  assetType?: 'image' | 'video' | 'audio' | 'document';
  commitId?: string;
  version?: string;
  branchColor?: string;
  mergeTarget?: string;
  lane?: number;
}

export type ActivityType = Activity['type'];
