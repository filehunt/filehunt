export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  type: 'comment' | 'approval' | 'rejection' | 'revision-request';
}

export type CommentType = Comment['type'];
