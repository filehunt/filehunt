"use client";

import { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  MoreHorizontal, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Copy, 
  Archive, 
  Heart, 
  RefreshCw, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  GitBranch, 
  Upload, 
  Check, 
  Clock, 
  AlertTriangle, 
  Plus,
  Folder
} from 'lucide-react';
import { Button } from '@/components/button';
import { Badge } from '@/components/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Input } from '@/components/input';
import { TagSuggestionPopover } from './TagSuggestionPopover';
import { Asset } from '@/types/assets';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu';

interface AssetDetailProps {
  asset: Asset | null;
  onBack: () => void;
  onTagAdd?: (assetId: string, tag: string) => void;
  onTagRemove?: (assetId: string, tag: string) => void;
  onFolderAdd?: (assetId: string, folder: string) => void;
  onFolderRemove?: (assetId: string, folder: string) => void;
  onStatusUpdate?: (assetId: string, status: Asset['status']) => void;
}

export function AssetDetail({ 
  asset, 
  onBack,
  onTagAdd,
  onTagRemove,
  onFolderAdd,
  onFolderRemove,
  onStatusUpdate
}: AssetDetailProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [newFolder, setNewFolder] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  if (!asset) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">No asset selected</p>
        </div>
      </div>
    );
  }


  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleAddTag = (tag: string) => {
    if (tag.trim() && onTagAdd) {
      onTagAdd(asset.id, tag.trim());
    }
  };

  const handleAddFolder = () => {
    if (newFolder.trim() && onFolderAdd) {
      onFolderAdd(asset.id, newFolder.trim());
      setNewFolder('');
    }
  };

  const handleStatusUpdate = (newStatus: Asset['status']) => {
    if (onStatusUpdate && asset) {
      onStatusUpdate(asset.id, newStatus);
    }
  };


  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Assets
            </Button>
            <div>
              <h1 className="text-foreground text-xl font-semibold">{asset.name}</h1>
              <p className="text-muted-foreground text-sm">
                {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)} • {formatFileSize(asset.size)} • {new Date(asset.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFavorited(!isFavorited)}
              className={cn(
                "hover:text-yellow-400",
                isFavorited ? 'text-yellow-400' : 'text-muted-foreground'
              )}
            >
              <Star className={cn("w-4 h-4", isFavorited && 'fill-current')} />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Asset Preview */}
          <div className="bg-card rounded-lg mb-8 relative group">
            <div className="aspect-video rounded-lg overflow-hidden max-w-3xl mx-auto">
              <img
                src={asset.thumbnailUrl}
                alt={asset.name}
                className="w-full h-full object-cover"
              />

              {/* Media Controls Overlay */}
              {(asset.type === 'video' || asset.type === 'audio') && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="bg-white/20 hover:bg-white/30 text-white"
                    >
                      {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMuted(!isMuted)}
                      className="bg-white/20 hover:bg-white/30 text-white"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white"
                    >
                      <Maximize className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Asset Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {/* Tags Card */}
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-foreground text-sm flex items-center justify-between">
                  Tags
                  <Badge variant="secondary" className="text-xs">
                    {asset.tags.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {asset.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 cursor-pointer group text-xs px-2 py-1"
                      onClick={() => onTagRemove && onTagRemove(asset.id, tag)}
                    >
                      {tag}
                      <span className="ml-1 opacity-0 group-hover:opacity-100 text-red-400">×</span>
                    </Badge>
                  ))}
                </div>

                {onTagAdd && (
                  <TagSuggestionPopover
                    asset={asset}
                    onTagAdd={(tag) => handleAddTag(tag)}
                    existingTags={asset.tags}
                    trigger={
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs"
                      >
                        <Plus className="w-3 h-3 mr-2" />
                        Add tag...
                      </Button>
                    }
                  />
                )}
              </CardContent>
            </Card>

            {/* Folders Card */}
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-foreground text-sm flex items-center justify-between">
                  Folders
                  <Badge variant="secondary" className="text-xs">
                    {asset.folders?.length || 0}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {asset.folders?.map((folder) => (
                    <Badge
                      key={folder}
                      variant="outline"
                      className="text-green-400 hover:bg-green-500/20 cursor-pointer group text-xs px-2 py-1"
                      onClick={() => onFolderRemove && onFolderRemove(asset.id, folder)}
                    >
                      <Folder className="w-3 h-3 mr-1" />
                      {folder}
                      <span className="ml-1 opacity-0 group-hover:opacity-100 text-red-400">×</span>
                    </Badge>
                  ))}
                </div>

                {onFolderAdd && (
                  <div className="flex space-x-2">
                    <Input
                      value={newFolder}
                      onChange={(e) => setNewFolder(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddFolder()}
                      placeholder="Add folder..."
                      className="text-xs h-8"
                    />
                    <Button onClick={handleAddFolder} size="sm" className="h-8 px-3">
                      Add
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Properties Card */}
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-foreground text-sm">Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-xs text-muted-foreground">File Size</dt>
                    <dd className="text-xs text-foreground">{formatFileSize(asset.size)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-xs text-muted-foreground">Upload Date</dt>
                    <dd className="text-xs text-foreground">{new Date(asset.createdAt).toLocaleDateString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-xs text-muted-foreground">Uploader</dt>
                    <dd className="text-xs text-foreground">{asset.uploadedBy.name}</dd>
                  </div>
                  {asset.duration && (
                    <div className="flex justify-between">
                      <dt className="text-xs text-muted-foreground">Duration</dt>
                      <dd className="text-xs text-foreground">{Math.floor(asset.duration / 60)}:{('0' + (asset.duration % 60)).slice(-2)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-xs text-muted-foreground">Version</dt>
                    <dd className="text-xs text-foreground">v{asset.version}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-xs text-muted-foreground">Comments</dt>
                    <dd className="text-xs text-foreground">{asset.comments}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* Version Control Card */}
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-foreground text-sm flex items-center">
                  <GitBranch className="w-3 h-3 mr-2" />
                  Version Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Current Version</span>
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 text-xs">
                      v{asset.version}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Branch</span>
                    <span className="text-xs text-blue-400">main</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Status</span>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs",
                        asset.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        asset.status === 'review' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-orange-500/20 text-orange-400'
                      )}
                    >
                      {asset.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="ghost" className="text-xs h-7 flex-1">
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Sync
                  </Button>
                  <Button size="sm" variant="ghost" className="text-xs h-7 flex-1">
                    <Upload className="w-3 h-3 mr-1" />
                    Push
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Workflow Actions Card */}
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-foreground text-sm flex items-center">
                  <Clock className="w-3 h-3 mr-2" />
                  Workflow Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Current Status</span>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs",
                        asset.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        asset.status === 'review' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-orange-500/20 text-orange-400'
                      )}
                    >
                      {asset.status === 'review' ? 'Needs Review' :
                       asset.status === 'approved' ? 'Approved' : 'Draft'}
                    </Badge>
                  </div>
                </div>

                {onStatusUpdate && (
                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground block">Update Status:</span>
                    <div className="grid grid-cols-1 gap-2">
                      <Button
                        onClick={() => handleStatusUpdate('review')}
                        size="sm"
                        variant="ghost"
                        className={cn(
                          "text-xs h-7 justify-start",
                          asset.status === 'review'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10'
                        )}
                        disabled={asset.status === 'review'}
                      >
                        <Clock className="w-3 h-3 mr-2" />
                        Request Review
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate('approved')}
                        size="sm"
                        variant="ghost"
                        className={cn(
                          "text-xs h-7 justify-start",
                          asset.status === 'approved'
                            ? 'bg-green-500/20 text-green-400'
                            : 'text-green-400 hover:text-green-300 hover:bg-green-500/10'
                        )}
                        disabled={asset.status === 'approved'}
                      >
                        <Check className="w-3 h-3 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate('draft')}
                        size="sm"
                        variant="ghost"
                        className={cn(
                          "text-xs h-7 justify-start",
                          asset.status === 'draft'
                            ? 'bg-orange-500/20 text-orange-400'
                            : 'text-orange-400 hover:text-orange-300 hover:bg-orange-500/10'
                        )}
                        disabled={asset.status === 'draft'}
                      >
                        <AlertTriangle className="w-3 h-3 mr-2" />
                        Mark as Draft
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Visibility & Sharing Card */}
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-foreground text-sm">Visibility & Sharing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Visibility</span>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsPublic(!isPublic)}
                        className="h-auto p-1"
                      >
                        {isPublic ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      </Button>
                      <span className="text-xs text-foreground">
                        {isPublic ? 'Public' : 'Private'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Shared with</span>
                    <span className="text-xs text-blue-400">3 people</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Last accessed</span>
                    <span className="text-xs text-muted-foreground">2h ago</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" className="text-xs h-7 flex-1">
                    <Share2 className="w-3 h-3 mr-1" />
                    Share
                  </Button>
                  <Button size="sm" variant="ghost" className="text-xs h-7">
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
