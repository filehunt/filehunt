export interface Branch {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  isProtected: boolean;
  commitsAhead: number;
  commitsBehind: number;
  lastCommit: {
    id: string;
    message: string;
    author: {
      name: string;
      avatar: string;
    };
    timestamp: string;
    hash: string;
  };
  createdBy: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  assetCount: number;
  parentBranch?: string;
  isActive?: boolean;
  commitCount?: number;
}
