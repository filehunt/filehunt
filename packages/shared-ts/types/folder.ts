export interface Folder {
  id: string;
  name: string;
  description: string;
  parentFolder?: string;
  createdAt: string;
  createdBy: string;
  assetCount: number;
}
