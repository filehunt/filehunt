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
  searchMode?: boolean;
}

export function AssetCard({ 
  asset, 
  isSelected, 
  onSelect, 
  onPreview,
  onDetail,
  viewMode = 'grid',
  searchMode = false,
  appearanceSettings = {
    cardSize: 'L',
    aspectRatio: 'masonry',
    thumbnailScale: 'fill',
    showCardInfo: false
  }
}: AssetCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

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
        "relative rounded-lg bg-card/20 transition-all duration-200 cursor-pointer group mb-4 break-inside-avoid",
        isSelected ? "bg-blue-500/20 ring-1 ring-blue-500/50" : "",
        isHovered && !isSelected ? "bg-card/30 transform scale-[1.02]" : "",
        viewMode === 'list' ? 'flex items-center p-2' : 'flex flex-col',
        appearanceSettings.cardSize === 'S' ? 'text-xs' : 
        appearanceSettings.cardSize === 'L' ? 'text-base' : 'text-sm',
        searchMode ? 'hover:bg-card/30' : ''
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        // Allow checkbox and other controls to work without triggering preview/selection
        if (e.target instanceof HTMLInputElement || (e.target as HTMLElement).closest('button')) {
          return;
        }
        // In search mode: single click selects/deselects
        if (searchMode) {
          onSelect(asset.id, !isSelected);
        } else {
          // In normal mode: single click triggers preview
          if (onPreview) onPreview(asset);
        }
      }}
      onDoubleClick={(e) => {
        // Allow checkbox and other controls to work without triggering detail view
        if (e.target instanceof HTMLInputElement || (e.target as HTMLElement).closest('button')) {
          return;
        }
        // Double click triggers detail view
        if (onDetail) onDetail(asset);
      }}
    >
      {/* Thumbnail */}
      <div className={cn(
        "relative bg-muted/30 overflow-hidden",
        searchMode ? 'rounded-lg' : 'rounded-t-lg',
        viewMode === 'list' && 'rounded-md w-24 h-16 flex-shrink-0',
        // Apply aspect ratio container only in grid mode when NOT masonry
        viewMode === 'grid' && appearanceSettings.aspectRatio !== 'masonry' && [
          appearanceSettings.aspectRatio === '1:1' && 'aspect-square',
          appearanceSettings.aspectRatio === '4:3' && 'aspect-[4/3]',
          appearanceSettings.aspectRatio === '16:9' && 'aspect-video'
        ].filter(Boolean).join(' ')
      )}>
        {!imageError ? (
          <img 
            src={asset.thumbnailUrl} 
            alt={asset.altText || asset.name} 
            onError={() => setImageError(true)}
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
        ) : (
          <div className={cn(
            "w-full flex items-center justify-center bg-muted/30",
            viewMode === 'grid' ? (
              appearanceSettings.aspectRatio === 'masonry' ? 'h-48' : 'h-full'
            ) : 'h-full'
          )}>
            <div className="flex flex-col items-center text-muted-foreground">
              <FileTypeIcon />
              <span className="text-xs mt-1">{asset.fileExtension}</span>
            </div>
          </div>
        )}
        
        {!searchMode && <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />}
        
        {/* Overlay with actions - shown on hover */}
        {!searchMode && (
          <div className={cn(
            "absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-200",
            isHovered && "opacity-100"
          )} />
        )}
        
        {/* Checkbox - always visible in top-left, larger on hover */}
        <div className={cn(
          "absolute top-2 left-2 z-10 transition-transform duration-200",
          (isHovered || searchMode) && "scale-125"
        )}>
          <Checkbox 
            checked={isSelected} 
            onCheckedChange={(checked) => onSelect(asset.id, !!checked)}
            className={cn(
              "transition-all duration-200",
              searchMode ? "shadow-md" : "shadow-lg",
              isSelected
                ? "bg-blue-600 border-blue-600 text-white"
                : searchMode
                ? "bg-background/90 border border-white/60 hover:border-white hover:bg-white/10"
                : "bg-background/95 border-2 border-white/80 hover:border-white hover:bg-white/10"
            )}
          />
        </div>


        <div className="absolute bottom-2 left-2 text-xs text-white">
          {asset.duration && (
            <span>{Math.floor(asset.duration / 60)}:{('0' + (asset.duration % 60)).slice(-2)}</span>
          )}
        </div>

        {/* Title on hover - only in normal mode */}
        {!searchMode && (
          <div className={cn(
            "absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/60 transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            <div className="text-white font-bold text-lg text-center mb-1 truncate max-w-full">{asset.name}</div>
            <div className="text-white/80 text-sm">{formatFileSize(asset.size)} • {asset.fileExtension}</div>
          </div>
        )}
        
        {/* Selection indicator for search mode */}
        {searchMode && isSelected && (
          <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
            <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
              Selected
            </div>
          </div>
        )}

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
            <div className={cn(
              "rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium",
              appearanceSettings.cardSize === 'S' ? 'w-4 h-4 text-[8px]' : 
              appearanceSettings.cardSize === 'L' ? 'w-6 h-6 text-xs' : 'w-5 h-5 text-[10px]'
            )}>
              {asset.uploadedBy.avatar ? (
                <img 
                  src={asset.uploadedBy.avatar} 
                  alt={asset.uploadedBy.name} 
                  className="w-full h-full rounded-full object-cover" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling!.setAttribute('style', 'display: block');
                  }}
                />
              ) : null}
              <span className={asset.uploadedBy.avatar ? 'hidden' : 'block'}>
                {asset.uploadedBy.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
