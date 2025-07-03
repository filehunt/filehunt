"use client";

import { X, Download, Share2, Trash2, Archive, Tag, FolderPlus } from 'lucide-react';
import { Button } from '@/components/button';
import { Badge } from '@/components/badge';

// Mock Asset interface for now - will be defined properly in later iterations
interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  size: number;
  thumbnailUrl: string;
}

interface FooterProps {
  selectedAssets: Asset[];
  onClearSelection: () => void;
  onDownload?: (assets: Asset[]) => void;
  onShare?: (assets: Asset[]) => void;
  onDelete?: (assets: Asset[]) => void;
  onArchive?: (assets: Asset[]) => void;
  onAddToFolder?: (assets: Asset[]) => void;
  onAddTags?: (assets: Asset[]) => void;
}

export function Footer({
  selectedAssets,
  onClearSelection,
  onDownload,
  onShare,
  onDelete,
  onArchive,
  onAddToFolder,
  onAddTags
}: FooterProps) {
  if (selectedAssets.length === 0) {
    return null;
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTotalSize = (): string => {
    const totalBytes = selectedAssets.reduce((sum, asset) => sum + asset.size, 0);
    return formatFileSize(totalBytes);
  };

  const getTypeDistribution = () => {
    const distribution = selectedAssets.reduce((acc, asset) => {
      acc[asset.type] = (acc[asset.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([type, count]) => (
      <Badge key={type} variant="secondary" className="text-xs">
        {count} {type}{count > 1 ? 's' : ''}
      </Badge>
    ));
  };

  return (
    <div className="bg-card h-16 flex items-center justify-between px-4">
      {/* Left side - Selection info */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
          <span className="font-medium text-foreground">
            {selectedAssets.length} selected
          </span>
        </div>

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>{getTotalSize()}</span>
          <span>•</span>
          <div className="flex items-center space-x-1">
            {getTypeDistribution()}
          </div>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAddTags?.(selectedAssets)}
          className="h-8"
        >
          <Tag className="w-4 h-4 mr-2" />
          Add Tags
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAddToFolder?.(selectedAssets)}
          className="h-8"
        >
          <FolderPlus className="w-4 h-4 mr-2" />
          Add to Folder
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onShare?.(selectedAssets)}
          className="h-8"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDownload?.(selectedAssets)}
          className="h-8"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>

        <div className="w-px h-6 bg-border/30 mx-2" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onArchive?.(selectedAssets)}
          className="h-8"
        >
          <Archive className="w-4 h-4 mr-2" />
          Archive
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete?.(selectedAssets)}
          className="h-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
}
