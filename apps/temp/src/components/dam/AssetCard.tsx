import { MessageCircle, Check, Play, Image, Volume2, FileText } from 'lucide-react';
import { Badge } from '@filehunt/shared-ts/ui';
import { type Asset } from "@filehunt/shared-ts/types";

import { useState, useRef } from 'react';

interface AppearanceSettings {
  cardSize: 'S' | 'M' | 'L';
  aspectRatio: '16:9' | '4:3' | '1:1';
  thumbnailScale: 'fit' | 'fill';
  showCardInfo: boolean;
}

interface AssetCardProps {
  asset: Asset;
  isSelected: boolean;
  onSelect: (isSelected: boolean) => void;
  onPreview: () => void;
  onDetail: () => void;
  appearanceSettings?: AppearanceSettings;
}

export function AssetCard({
  asset,
  isSelected,
  onSelect,
  onPreview,
  onDetail,
  appearanceSettings = {
    cardSize: 'M',
    aspectRatio: '16:9',
    thumbnailScale: 'fit',
    showCardInfo: true
  }
}: AssetCardProps) {
  const [clickCount, setClickCount] = useState(0);
  const [imageError, setImageError] = useState(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'coloring':
        return 'bg-orange-900/50 text-orange-300';
      case 'retouching':
        return 'bg-orange-900/50 text-orange-300';
      case 'social':
        return 'bg-emerald-900/50 text-emerald-300';
      case 'hero':
      case 'marketing':
        return 'bg-blue-900/50 text-blue-300';
      case 'portrait':
      case 'talent':
        return 'bg-purple-900/50 text-purple-300';
      case 'logo':
      case 'branding':
        return 'bg-pink-900/50 text-pink-300';
      case 'soundtrack':
      case 'theme':
      case 'music':
        return 'bg-cyan-900/50 text-cyan-300';
      case 'voiceover':
      case 'narrator':
      case 'dialogue':
        return 'bg-indigo-900/50 text-indigo-300';
      case 'sfx':
      case 'sound effects':
        return 'bg-yellow-900/50 text-yellow-300';
      case 'script':
      case 'final draft':
        return 'bg-red-900/50 text-red-300';
      case 'budget':
      case 'planning':
        return 'bg-green-900/50 text-green-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  const getImageStyles = () => {
    if (appearanceSettings.thumbnailScale === 'fill') {
      // For fill mode, we want the image to completely fill the container
      return {
        objectFit: 'cover' as const,
        width: '100%',
        height: '100%',
        objectPosition: 'center'
      };
    } else {
      // For fit mode, we want the entire image to be visible
      return {
        objectFit: 'contain' as const,
        width: '100%',
        height: '100%',
        objectPosition: 'center'
      };
    }
  };

  const getCardPadding = () => {
    switch (appearanceSettings.cardSize) {
      case 'S':
        return 'p-1.5';
      case 'L':
        return 'p-3';
      case 'M':
      default:
        return 'p-2';
    }
  };

  const getTextSize = () => {
    switch (appearanceSettings.cardSize) {
      case 'S':
        return 'text-xs';
      case 'L':
        return 'text-sm';
      case 'M':
      default:
        return 'text-xs';
    }
  };

  const getBadgeSize = () => {
    switch (appearanceSettings.cardSize) {
      case 'S':
        return 'text-xs px-1 py-0 h-3';
      case 'L':
        return 'text-xs px-2 py-0.5 h-5';
      case 'M':
      default:
        return 'text-xs px-1 py-0 h-4';
    }
  };

  const getMaxTags = () => {
    switch (appearanceSettings.cardSize) {
      case 'S':
        return 1;
      case 'L':
        return 4;
      case 'M':
      default:
        return 2;
    }
  };

  const getIconSize = () => {
    switch (appearanceSettings.cardSize) {
      case 'S':
        return 'w-8 h-8';
      case 'L':
        return 'w-16 h-16';
      case 'M':
      default:
        return 'w-12 h-12';
    }
  };

  const getTypeIcon = () => {
    switch (asset.type) {
      case 'video':
        return Play;
      case 'image':
        return Image;
      case 'audio':
        return Volume2;
      case 'document':
        return FileText;
      default:
        return FileText;
    }
  };

  // Calculate the content area height based on card info settings
  const getContentHeight = () => {
    if (!appearanceSettings.showCardInfo) return '0px';

    let baseHeight = 0;

    // Add height for tags if they exist
    if (asset.tags.length > 0) {
      baseHeight += appearanceSettings.cardSize === 'S' ? 16 :
                   appearanceSettings.cardSize === 'L' ? 24 : 20;
    }

    // Add padding
    const paddingHeight = appearanceSettings.cardSize === 'S' ? 12 :
                         appearanceSettings.cardSize === 'L' ? 24 : 16;

    return `${baseHeight + paddingHeight}px`;
  };

  const handleClick = () => {
    setClickCount(prev => prev + 1);

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    clickTimeoutRef.current = setTimeout(() => {
      if (clickCount === 0) {
        // Single click - show preview
        onPreview();
      } else if (clickCount === 1) {
        // Double click - show detail
        onDetail();
      }
      setClickCount(0);
    }, 300); // 300ms delay to detect double click
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const TypeIcon = getTypeIcon();

  const renderImageContent = () => {
    if (imageError) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <TypeIcon className={`mx-auto text-white/60 mb-2 ${getIconSize()}`} />
            <p className="text-white/60 text-xs capitalize">{asset.type}</p>
          </div>
        </div>
      );
    }

    const imageStyles = getImageStyles();

    return (
      <div className="w-full h-full overflow-hidden flex items-center justify-center">
        <img
          src={asset.thumbnail}
          alt={asset.name}
          style={imageStyles}
          onError={handleImageError}
          className={`${appearanceSettings.thumbnailScale === 'fill' ? 'min-w-full min-h-full' : ''}`}
        />
      </div>
    );
  };

  return (
    <div
      className={`h-full bg-[#292b36] rounded-lg border ${isSelected ? 'border-indigo-500' : 'border-gray-600'} overflow-hidden cursor-pointer group flex flex-col`}
      onClick={handleClick}
    >
      {/* Image container - takes remaining space after content area */}
      <div
        className="relative bg-gray-600 flex-1 overflow-hidden"
        style={{
          height: appearanceSettings.showCardInfo
            ? `calc(100% - ${getContentHeight()})`
            : '100%'
        }}
      >
        {renderImageContent()}

        {/* Overlay controls */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200">
          {/* Type icon - always visible for non-image assets */}
          {asset.type !== 'image' && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`bg-black/60 rounded-full ${getIconSize()} flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity`}>
                <TypeIcon className="w-1/2 h-1/2 text-white" />
              </div>
            </div>
          )}

          {/* Filename overlay - shows on hover */}
          <div className="absolute inset-x-2 top-1/2 transform -translate-y-1/2 bg-black/80 rounded px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <h3 className={`text-white ${getTextSize()} text-center line-clamp-2 leading-tight`}>
              {asset.name}
            </h3>
          </div>

          {/* Checkbox */}
          <div
            className="absolute top-2 left-2 w-4 h-4 bg-black/50 rounded border border-white/50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(!isSelected);
            }}
          >
            {isSelected && <Check className="w-3 h-3 text-white" />}
          </div>

          {/* Version badge */}
          {asset.version && (
            <div className={`absolute top-2 right-2 bg-indigo-500 text-white ${getTextSize()} px-1.5 py-0.5 rounded`}>
              {asset.version}
            </div>
          )}

          {/* Bottom overlays */}
          <div className="absolute bottom-2 left-2 flex items-center space-x-1">
            {asset.comments > 0 && (
              <div className="bg-black/70 rounded-full px-1.5 py-0.5 flex items-center space-x-1">
                <MessageCircle className="w-3 h-3 text-white" />
                <span className={`text-white ${getTextSize()}`}>{asset.comments}</span>
              </div>
            )}
          </div>

          {asset.duration && (
            <div className="absolute bottom-2 right-2 bg-black/70 rounded px-1.5 py-0.5">
              <span className={`text-white ${getTextSize()}`}>{asset.duration}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content area - fixed height based on settings */}
      {appearanceSettings.showCardInfo && (
        <div
          className={`${getCardPadding()} flex-shrink-0 space-y-1`}
          style={{ height: getContentHeight() }}
        >
          {/* Tags */}
          {asset.tags.length > 0 && (
            <div className="flex flex-wrap gap-0.5">
              {asset.tags.slice(0, getMaxTags()).map((tag, index) => (
                <Badge key={index} className={`${getBadgeSize()} ${getTagColor(tag)}`}>
                  {tag}
                </Badge>
              ))}
              {asset.tags.length > getMaxTags() && (
                <Badge className={`${getBadgeSize()} bg-gray-700 text-gray-300`}>
                  +{asset.tags.length - getMaxTags()}
                </Badge>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
