"use client";

import { useState } from 'react';
import { Checkbox } from "@/components/checkbox";
import { Asset } from "@/types/assets";
import { cn } from "@/lib/utils";
import { 
  Image as ImageIcon, 
  Video as VideoIcon, 
  AudioLines as AudioIcon, 
  FileText as FileTextIcon, 
  Heart, 
  MessageSquare 
} from 'lucide-react';
import { Badge } from '@/components/badge';

interface AppearanceSettings {
  cardSize: 'S' | 'M' | 'L';
  aspectRatio: 'masonry' | '16:9' | '4:3' | '1:1';
  thumbnailScale: 'fit' | 'fill';
  showCardInfo: boolean;
}

interface AssetCardProps {
  asset: Asset;
  isSelected: boolean;
  onSelect: (assetId: string, isSelected: boolean) => void;
  onPreview?: (asset: Asset) => void;
  onDetail?: (asset: Asset) => void;
  viewMode?: 'grid' | 'list';
  appearanceSettings?: AppearanceSettings;
}

export function AssetCard({ 
  asset, 
  isSelected, 
  onSelect, 
  onPreview,
  onDetail,
  viewMode = 'grid',
  appearanceSettings = {
    cardSize: 'L',
    aspectRatio: 'masonry',
    thumbnailScale: 'fill',
    showCardInfo: false
  }
}: AssetCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const FileTypeIcon = () => {
    switch (asset.type) {
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'video': return <VideoIcon className="w-4 h-4" />;
      case 'audio': return <AudioIcon className="w-4 h-4" />;
      case 'document': return <FileTextIcon className="w-4 h-4" />;
      default: return <FileTextIcon className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getImageStyles = () => {
    if (appearanceSettings.thumbnailScale === 'fill') {
      return 'object-cover';
    } else {
      return 'object-contain';
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-lg bg-card text-card-foreground shadow-sm transition-all duration-200 cursor-pointer group mb-4 break-inside-avoid",
        isSelected ? "shadow-primary/20 ring-2 ring-primary" : "",
        isHovered && !isSelected ? "shadow-lg transform scale-[1.02]" : "",
        viewMode === 'list' ? 'flex items-center p-2' : 'flex flex-col',
        appearanceSettings.cardSize === 'S' ? 'text-xs' : 
        appearanceSettings.cardSize === 'L' ? 'text-base' : 'text-sm'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        // Allow checkbox and other controls to work without triggering detail view
        if (e.target instanceof HTMLInputElement || (e.target as HTMLElement).closest('button')) {
          return;
        }
        if (onDetail) onDetail(asset);
      }}
    >
      {/* Thumbnail */}
      <div className={cn(
        "relative bg-muted overflow-hidden rounded-t-lg",
        viewMode === 'list' && 'rounded-md w-24 h-16 flex-shrink-0',
        // Apply aspect ratio container only in grid mode when NOT masonry
        viewMode === 'grid' && appearanceSettings.aspectRatio !== 'masonry' && [
          appearanceSettings.aspectRatio === '1:1' && 'aspect-square',
          appearanceSettings.aspectRatio === '4:3' && 'aspect-[4/3]',
          appearanceSettings.aspectRatio === '16:9' && 'aspect-video'
        ].filter(Boolean).join(' ')
      )}>
        <img 
          src={asset.thumbnailUrl} 
          alt={asset.altText || asset.name} 
          className={cn(
            "w-full transition-transform duration-300 group-hover:scale-110",
            // In grid mode: h-auto for masonry OR h-full when forcing aspect ratio
            viewMode === 'grid' ? (
              appearanceSettings.aspectRatio === 'masonry' ? 'h-auto' : 'h-full'
            ) : 'h-full',
            // Apply thumbnail scale
            getImageStyles()
          )} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Overlay with actions - shown on hover */}
        <div className={cn(
          "absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-200",
          isHovered && "opacity-100"
        )} />
        
        {/* Checkbox - always visible in top-left, larger on hover */}
        <div className={cn(
          "absolute top-2 left-2 z-10 transition-transform duration-200",
          isHovered && "scale-125"
        )}>
          <Checkbox 
            checked={isSelected} 
            onCheckedChange={(checked) => onSelect(asset.id, !!checked)}
            className={cn(
              "shadow-lg transition-all duration-200",
              isSelected
                ? "bg-primary border-primary text-primary-foreground"
                : "bg-background/95 border-2 border-white/80 hover:border-white hover:bg-white/10"
            )}
          />
        </div>


        <div className="absolute bottom-2 left-2 text-xs text-white">
          {asset.duration && (
            <span>{Math.floor(asset.duration / 60)}:{('0' + (asset.duration % 60)).slice(-2)}</span>
          )}
        </div>

        {/* Title on hover */}
        <div className={cn(
          "absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/60 transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <div className="text-white font-bold text-lg text-center mb-1 truncate max-w-full">{asset.name}</div>
          <div className="text-white/80 text-sm">{formatFileSize(asset.size)} • {asset.fileExtension}</div>
        </div>

      </div>

      {/* Content */}
      {appearanceSettings.showCardInfo && (
        <div className={cn(
          'p-3 flex-1', 
          viewMode === 'list' ? 'ml-4' : '',
          appearanceSettings.cardSize === 'S' ? 'p-2' : 
          appearanceSettings.cardSize === 'L' ? 'p-4' : 'p-3'
        )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-muted-foreground">
            <FileTypeIcon />
            <span className={cn(
              "ml-1",
              appearanceSettings.cardSize === 'S' ? 'text-[10px]' : 
              appearanceSettings.cardSize === 'L' ? 'text-sm' : 'text-xs'
            )}>{asset.fileExtension}</span>
          </div>
        </div>

        <div className={cn(
          "text-muted-foreground mt-1",
          appearanceSettings.cardSize === 'S' ? 'text-[10px]' : 
          appearanceSettings.cardSize === 'L' ? 'text-sm' : 'text-xs'
        )}>
          {formatFileSize(asset.size)} • {new Date(asset.createdAt).toLocaleDateString()}
        </div>

        <div className={cn(
          "flex items-center justify-between",
          appearanceSettings.cardSize === 'S' ? 'mt-2' : 
          appearanceSettings.cardSize === 'L' ? 'mt-4' : 'mt-3'
        )}>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Heart className={cn(
                asset.isLiked ? 'text-red-500 fill-current' : '',
                appearanceSettings.cardSize === 'S' ? 'w-3 h-3' : 
                appearanceSettings.cardSize === 'L' ? 'w-5 h-5' : 'w-4 h-4'
              )} />
              <span className={cn(
                appearanceSettings.cardSize === 'S' ? 'text-[10px]' : 
                appearanceSettings.cardSize === 'L' ? 'text-sm' : 'text-xs'
              )}>{asset.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare className={cn(
                appearanceSettings.cardSize === 'S' ? 'w-3 h-3' : 
                appearanceSettings.cardSize === 'L' ? 'w-5 h-5' : 'w-4 h-4'
              )} />
              <span className={cn(
                appearanceSettings.cardSize === 'S' ? 'text-[10px]' : 
                appearanceSettings.cardSize === 'L' ? 'text-sm' : 'text-xs'
              )}>{asset.comments}</span>
            </div>
          </div>

          <div className="flex items-center">
            <img 
              src={asset.uploadedBy.avatar} 
              alt={asset.uploadedBy.name} 
              className={cn(
                "rounded-full",
                appearanceSettings.cardSize === 'S' ? 'w-4 h-4' : 
                appearanceSettings.cardSize === 'L' ? 'w-6 h-6' : 'w-5 h-5'
              )} 
            />
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
