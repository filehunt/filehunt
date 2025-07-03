"use client";

import { useState } from 'react';
import { Asset } from '@/types/assets';
import { Button } from '@/components/button';
import { Separator } from '@/components/separator';
import { 
  Download, 
  Share2, 
  Trash2, 
  Archive, 
  FolderPlus, 
  Tag,
  X,
  MoreHorizontal 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";

interface StatusBarProps {
  selectedAssets: Asset[];
  onClearSelection: () => void;
  onDownload: (assets: Asset[]) => void;
  onShare: (assets: Asset[]) => void;
  onDelete: (assets: Asset[]) => void;
  onArchive: (assets: Asset[]) => void;
  onAddToFolder: (assets: Asset[]) => void;
  onAddTags: (assets: Asset[]) => void;
}

export function StatusBar({
  selectedAssets,
  onClearSelection,
  onDownload,
  onShare,
  onDelete,
  onArchive,
  onAddToFolder,
  onAddTags
}: StatusBarProps) {
  if (selectedAssets.length === 0) {
    return null;
  }

  const getTotalSize = () => {
    const totalBytes = selectedAssets.reduce((acc, asset) => acc + asset.size, 0);
    const mb = totalBytes / (1024 * 1024);
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border shadow-lg z-50">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left side - Selection info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
              {selectedAssets.length}
            </div>
            <div className="text-sm">
              <span className="font-medium text-foreground">
                {selectedAssets.length} {selectedAssets.length === 1 ? 'asset' : 'assets'} selected
              </span>
              <div className="text-muted-foreground text-xs">
                {getTotalSize()} total
              </div>
            </div>
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2">
          {/* Primary actions */}
          <Button
            variant="default"
            size="sm"
            onClick={() => onDownload(selectedAssets)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onShare(selectedAssets)}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Secondary actions */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddToFolder(selectedAssets)}
            className="text-muted-foreground hover:text-foreground"
          >
            <FolderPlus className="w-4 h-4 mr-2" />
            Add to Folder
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddTags(selectedAssets)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Tag className="w-4 h-4 mr-2" />
            Add Tags
          </Button>

          {/* More actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onArchive(selectedAssets)}>
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(selectedAssets)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
