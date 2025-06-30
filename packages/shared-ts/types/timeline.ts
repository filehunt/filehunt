export interface TimelineCommit {
  id: string;
  message: string;
  author: string;
  timestamp: string;
  hash: string;
  type: 'commit' | 'merge' | 'tag';
  changes: {
    added: string[];
    modified: string[];
    deleted: string[];
  };
}

export type TimelineCommitType = TimelineCommit['type'];
