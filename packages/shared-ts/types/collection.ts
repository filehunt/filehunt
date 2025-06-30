import type { Asset } from './asset';

export interface Collection {
  id: string;
  name: string;
  description: string;
  assetCount: number;
  isPrivate: boolean;
  isFavorited: boolean;
  owner: {
    name: string;
    avatar: string;
  };
  collaborators: Array<{
    name: string;
    avatar: string;
  }>;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
  tags: string[];
  assets: Asset[];
  createdBy: string;
}
