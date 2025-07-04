"use client";

import { Collection } from '@/types/assets';
import { Button } from '@/components/button';
import { Separator } from '@/components/separator';
import { 
  Download, 
  Share2, 
  Trash2, 
  Settings, 
  Eye,
  X,
  MoreHorizontal,
  Edit
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";

interface CollectionStatusBarProps {
  selectedCollections: Collection[];
  onClearSelection: () => void;
  onShare?: (collections: Collection[]) => void;
  onDownload?: (collections: Collection[]) => void;
  onDelete?: (collections: Collection[]) => void;
  onEdit?: (collections: Collection[]) => void;
  onPreview?: (collections: Collection[]) => void;
}

export function CollectionStatusBar({
  selectedCollections,
  onClearSelection,
  onShare,
  onDownload,
  onDelete,
  onEdit,
  onPreview
}: CollectionStatusBarProps) {
  if (selectedCollections.length === 0) {
    return null;
  }

  const getTotalAssets = () => {
    return selectedCollections.reduce((acc, collection) => acc + collection.assetCount, 0);
  };

  const getTotalSize = () => {
    const totalBytes = selectedCollections.reduce((acc, collection) => acc + collection.size, 0);
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
              {selectedCollections.length}
            </div>
            <div className="text-sm">
              <span className="font-medium text-foreground">
                {selectedCollections.length === 1 ? (
                  <>Selected: {selectedCollections[0].name}</>
                ) : (
                  <>{selectedCollections.length} collections selected</>
                )}
              </span>
              <div className="text-muted-foreground text-xs">
                {getTotalAssets()} assets • {getTotalSize()} total
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
            onClick={() => onDownload?.(selectedCollections)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download All
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onShare?.(selectedCollections)}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Secondary actions */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(selectedCollections)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPreview?.(selectedCollections)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
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
              <DropdownMenuItem onClick={() => onEdit?.(selectedCollections)}>
                <Settings className="w-4 h-4 mr-2" />
                Edit Settings
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete?.(selectedCollections)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Collections
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
