"use client";

import { useState } from 'react';
import { Collection } from '@/types/assets';
import { Badge } from '@/components/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar';
import { 
  FolderOpen, 
  Users, 
  Calendar, 
  FileText, 
  Zap, 
  Lock, 
  Globe,
  Palette,
  Camera,
  Video,
  Music,
  Megaphone,
  CheckCircle
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface CollectionCardProps {
  collection: Collection;
  isSelected?: boolean;
  isActive?: boolean;  // New prop for preview/active state
  searchMode?: boolean;
  viewMode?: 'grid' | 'masonry' | 'list';
  onClick?: () => void;
  onDoubleClick?: () => void;
  onSelectionChange?: (selected: boolean) => void;
}

const iconMap = {
  'palette': Palette,
  'camera': Camera,
  'video': Video,
  'music': Music,
  'megaphone': Megaphone,
  'check-circle': CheckCircle,
  'folder': FolderOpen,
};

export function CollectionCard({ 
  collection, 
  isSelected = false,
  isActive = false,
  searchMode = false,
  viewMode = 'grid',
  onClick, 
  onDoubleClick,
  onSelectionChange 
}: CollectionCardProps) {
  const [imageError, setImageError] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getIcon = () => {
    const IconComponent = iconMap[collection.icon as keyof typeof iconMap] || FolderOpen;
    return <IconComponent className="w-5 h-5" style={{ color: collection.color }} />;
  };

  const handleClick = () => {
    // Simple click just triggers preview (onClick), not selection
    onClick?.();
  };

  const handleCheckboxChange = (checked: boolean) => {
    // Only checkbox changes selection state
    onSelectionChange?.(checked);
  };

  const handleDoubleClick = () => {
    if (!searchMode) {
      onDoubleClick?.();
    }
  };

  const cardClasses = cn(
    "group relative rounded-lg overflow-hidden transition-all duration-200 cursor-pointer",
    "hover:shadow-lg hover:shadow-primary/10",
    searchMode && "hover:ring-1 hover:ring-primary/30",
    isSelected && "ring-1 ring-primary shadow-lg shadow-primary/10",
    isActive && !isSelected && "ring-1 ring-accent shadow-lg shadow-accent/10", // Active/preview indicator
    viewMode === 'list' && "flex items-center p-4 space-x-4"
  );

  if (viewMode === 'list') {
    return (
      <div
        className={cardClasses}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        {/* Checkbox for list mode */}
        <div className="flex-shrink-0">
          <Checkbox
            checked={isSelected}
            onCheckedChange={handleCheckboxChange}
            className="mr-3"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted/20">
            {!imageError ? (
              <img
                src={collection.thumbnailUrl}
                alt={collection.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-muted/20 flex items-center justify-center">
                {getIcon()}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-medium text-foreground truncate">
                {collection.name}
              </h3>
              {collection.type === 'smart' && (
                <Zap className="w-3 h-3 text-primary" />
              )}
              {collection.isPublic ? (
                <Globe className="w-3 h-3 text-muted-foreground" />
              ) : (
                <Lock className="w-3 h-3 text-muted-foreground" />
              )}
            </div>
            <Badge variant="secondary" className="text-xs">
              {collection.assetCount} assets
            </Badge>
          </div>
          
          <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
            {collection.description}
          </p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Avatar className="w-4 h-4">
                <AvatarImage src={collection.createdBy.avatar} />
                <AvatarFallback className="text-xs">
                  {collection.createdBy.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span>{collection.createdBy.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>{formatFileSize(collection.size)}</span>
              <span>•</span>
              <span>{new Date(collection.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Collection Thumbnail */}
      <div className="aspect-[4/3] relative overflow-hidden bg-muted/20">
        {!imageError ? (
          <img
            src={collection.thumbnailUrl}
            alt={collection.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-muted/20 flex items-center justify-center">
            {getIcon()}
          </div>
        )}
        
        {/* Selection checkbox - always visible */}
        <div className="absolute top-2 left-2 z-20">
          <Checkbox
            checked={isSelected}
            onCheckedChange={handleCheckboxChange}
            className="bg-background/60 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            onClick={(e) => e.stopPropagation()} // Prevent card click when clicking checkbox
          />
        </div>

        {/* Type indicator */}
        {collection.type === 'smart' && (
          <div className="absolute top-2 left-10 z-20">
            <Badge variant="secondary" className="text-xs bg-primary/80 text-primary-foreground border-0">
              <Zap className="w-3 h-3 mr-1" />
              Smart
            </Badge>
          </div>
        )}

        {/* Asset count overlay */}
        <div className="absolute bottom-2 right-2 z-20">
          <Badge variant="secondary" className="text-xs bg-background/80 text-foreground border-0">
            {collection.assetCount} files
          </Badge>
        </div>
      </div>

      {/* Collection Info - Minimal */}
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            {getIcon()}
            <h3 className="text-sm font-medium text-foreground truncate">
              {collection.name}
            </h3>
            {collection.type === 'smart' && (
              <Zap className="w-3 h-3 text-primary flex-shrink-0" />
            )}
          </div>
          
          <div className="flex items-center space-x-1 text-xs text-muted-foreground flex-shrink-0">
            {collection.isPublic ? (
              <Globe className="w-3 h-3" />
            ) : (
              <Lock className="w-3 h-3" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
