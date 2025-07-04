"use client";

import { Collection } from '@/types/assets';
import { Badge } from '@/components/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar';
import { Button } from '@/components/button';
import { Separator } from '@/components/separator';
import { 
  X, 
  Calendar, 
  Users, 
  FileText, 
  Zap, 
  Lock, 
  Globe,
  Palette,
  Camera,
  Video,
  Music,
  Megaphone,
  CheckCircle,
  FolderOpen
} from 'lucide-react';

interface CollectionRightSidebarProps {
  collection: Collection | null;
  onClose?: () => void;
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

export function CollectionRightSidebar({ 
  collection, 
  onClose
}: CollectionRightSidebarProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getIcon = () => {
    const IconComponent = iconMap[collection.icon as keyof typeof iconMap] || FolderOpen;
    return <IconComponent className="w-6 h-6" style={{ color: collection.color }} />;
  };

  const getRuleDisplayText = (rule: any) => {
    return `${rule.field} ${rule.operator} "${rule.value}"`;
  };

  if (!collection) {
    return (
      <div className="w-80 flex flex-col h-full" style={{ backgroundColor: 'transparent' }}>
        <div className="p-4">
          <h2 className="text-white font-semibold text-sm">Collection Details</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Select a collection to view details</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 flex flex-col h-full" style={{ backgroundColor: 'transparent' }}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-white font-semibold text-sm">Collection Details</h2>
          <Badge variant="outline" className="text-xs bg-blue-600/20 text-blue-400 border-blue-400/30">
            Preview
          </Badge>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Preview */}
      <div className="p-4">
        <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden mb-4 relative">
          <img
            src={collection.thumbnailUrl}
            alt={collection.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center space-x-2 mb-2">
              {getIcon()}
              <h3 className="text-white font-medium text-lg">{collection.name}</h3>
            </div>
            <div className="flex items-center space-x-4 text-white/80 text-sm">
              <div className="flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>{collection.assetCount} assets</span>
              </div>
              {collection.type === 'smart' && (
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4" />
                  <span>Smart</span>
                </div>
              )}
              {collection.isPublic ? (
                <Globe className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto overflow-x-hidden">
        {/* Description */}
        {collection.description && (
          <div>
            <h3 className="text-white font-semibold text-sm mb-2">Description</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {collection.description}
            </p>
          </div>
        )}

        <div className="my-4 h-px bg-muted/30" />

        {/* Tags */}
        {collection.tags.length > 0 && (
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {collection.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="my-4 h-px bg-muted/30" />

        {/* Smart Rules */}
        {collection.type === 'smart' && collection.smartRules && collection.smartRules.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="text-white font-semibold text-sm">Smart Rules</h3>
            </div>
            <div className="space-y-2">
              {collection.smartRules.map((rule, index) => (
                <div key={rule.id} className="p-2 bg-background/30 rounded text-xs">
                  {index > 0 && (
                    <span className="text-primary font-medium mr-1">
                      {rule.logic}
                    </span>
                  )}
                  <span className="text-muted-foreground">
                    {getRuleDisplayText(rule)}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Assets matching these rules are automatically included in this collection.
            </p>
          </div>
        )}

        {(collection.type === 'smart' && collection.smartRules && collection.smartRules.length > 0) && (
          <div className="my-4 h-px bg-muted/30" />
        )}

        {/* Collaborators */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-3">Access</h3>
          
          <div className="space-y-3">
            {/* Owner */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">Owner</span>
                <Badge variant="outline" className="text-xs">
                  {collection.isPublic ? 'Public' : 'Private'}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={collection.createdBy.avatar} />
                  <AvatarFallback className="text-xs">
                    {collection.createdBy.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {collection.createdBy.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {collection.createdBy.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Collaborators */}
            {collection.collaborators.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Collaborators ({collection.collaborators.length})
                  </span>
                </div>
                <div className="space-y-2">
                  {collection.collaborators.map((collaborator) => (
                    <div key={collaborator.id} className="flex items-center space-x-2">
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={collaborator.avatar} />
                        <AvatarFallback className="text-xs">
                          {collaborator.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">
                          {collaborator.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {collaborator.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="my-4 h-px bg-muted/30" />

        {/* Properties */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-3">Properties</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Size</span>
              <span className="text-white">{formatFileSize(collection.size)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Asset Count</span>
              <span className="text-white">{collection.assetCount}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Type</span>
              <Badge 
                variant={collection.type === 'smart' ? "default" : "secondary"} 
                className="text-xs"
              >
                {collection.type === 'smart' ? 'Smart Collection' : 'Manual Collection'}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Created</span>
              <span className="text-white">
                {new Date(collection.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Last Updated</span>
              <span className="text-white">
                {new Date(collection.updatedAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Visibility</span>
              <div className="flex items-center space-x-1">
                {collection.isPublic ? (
                  <>
                    <Globe className="w-3 h-3 text-muted-foreground" />
                    <span className="text-white">Public</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-white">Private</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
}
