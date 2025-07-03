"use client";

import { useState } from 'react';
import { X, Heart, MessageSquare, Download, Share2, Eye, Calendar, User, FileType, Tag, Folder, Plus, GitBranch } from 'lucide-react';
import { Button } from '@/components/button';
import { Badge } from '@/components/badge';
import { Input } from '@/components/input';
import { Separator } from '@/components/separator';
import { Asset } from '@/types/assets';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs';
import { TagSuggestionPopover } from './TagSuggestionPopover';

interface RightSidebarProps {
  previewAsset: Asset | null;
  onClose: () => void;
  onTagAdd?: (assetId: string, tag: string) => void;
  onTagRemove?: (assetId: string, tag: string) => void;
  onFolderAdd?: (assetId: string, folder: string) => void;
  onFolderRemove?: (assetId: string, folder: string) => void;
}

export function RightSidebar({
  previewAsset,
  onClose,
  onTagAdd,
  onTagRemove,
  onFolderAdd,
  onFolderRemove
}: RightSidebarProps) {
  const [newFolder, setNewFolder] = useState('');
  const [showFolderInput, setShowFolderInput] = useState(false);

  const handleAddFolder = () => {
    if (newFolder.trim() && previewAsset && onFolderAdd) {
      onFolderAdd(previewAsset.id, newFolder.trim());
      setNewFolder('');
      setShowFolderInput(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddFolder();
    } else if (e.key === 'Escape') {
      setShowFolderInput(false);
      setNewFolder('');
    }
  };

  if (!previewAsset) {
    return (
      <div className="w-80 p-6 flex items-center justify-center" style={{ backgroundColor: 'transparent' }}>
        <div className="text-center text-muted-foreground">
          <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">Select an asset to preview</p>
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

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'draft':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'featured':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'final':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'ready':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="w-80 flex flex-col" style={{ backgroundColor: 'transparent' }}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-white font-semibold text-sm">File Preview</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Preview */}
      <div className="p-4">
        <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden mb-4">
          <img
            src={previewAsset.thumbnailUrl}
            alt={previewAsset.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Tags Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4 text-gray-400" />
              <h3 className="text-white font-semibold text-sm">Tags</h3>
            </div>
            {onTagAdd && (
              <TagSuggestionPopover
                asset={previewAsset}
                onTagAdd={(tag) => onTagAdd(previewAsset.id, tag)}
                existingTags={previewAsset.tags}
                trigger={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                }
              />
            )}
          </div>

          <div className="space-y-2">
            {previewAsset.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {previewAsset.tags.map((tag, index) => (
                  <Badge key={index} className={`text-xs ${getTagColor(tag)} group`}>
                    {tag}
                    {onTagRemove && (
                      <button
                        onClick={() => onTagRemove(previewAsset.id, tag)}
                        className="ml-1 hover:bg-white/20 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-2 h-2" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            )}

            {previewAsset.tags.length === 0 && (
              <p className="text-gray-400 text-sm">No tags assigned</p>
            )}
          </div>
        </div>


        {/* Folders Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Folder className="w-4 h-4 text-gray-400" />
              <h3 className="text-white font-semibold text-sm">Folders</h3>
            </div>
            {onFolderAdd && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFolderInput(true)}
                className="text-gray-400 hover:text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {previewAsset.folders && previewAsset.folders.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {previewAsset.folders.map((folder, index) => (
                  <div key={index} className="inline-flex items-center px-2 py-1 rounded text-blue-400 bg-blue-500/20 text-xs group">
                    <Folder className="w-3 h-3 mr-1" />
                    {folder}
                    {onFolderRemove && (
                      <button
                        onClick={() => onFolderRemove(previewAsset.id, folder)}
                        className="ml-1 hover:bg-white/20 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-2 h-2" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {showFolderInput && (
              <div className="flex space-x-2">
                <Input
                  value={newFolder}
                  onChange={(e) => setNewFolder(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Add folder..."
                  className="text-xs h-7 bg-card"
                  autoFocus
                />
                <Button size="sm" onClick={handleAddFolder} className="h-7 px-2">
                  Add
                </Button>
              </div>
            )}

            {(!previewAsset.folders || previewAsset.folders.length === 0) && !showFolderInput && (
              <p className="text-gray-400 text-sm">No folders assigned</p>
            )}
          </div>
        </div>


        {/* Properties Section */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold text-sm">Properties</h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Name</span>
              <span className="text-white text-right break-all ml-2">{previewAsset.name}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Size</span>
              <span className="text-white">{formatFileSize(previewAsset.size)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Type</span>
              <span className="text-white capitalize">{previewAsset.type}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Upload Date</span>
              <span className="text-white">{new Date(previewAsset.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Uploaded by</span>
              <span className="text-white">{previewAsset.uploadedBy.name}</span>
            </div>

            {previewAsset.duration && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Duration</span>
                <span className="text-white">{formatDuration(previewAsset.duration)}</span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Version</span>
              <span className="text-white">{previewAsset.version}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Status</span>
              <Badge
                className={`text-xs ${
                  previewAsset.status === 'approved' ? 'bg-green-900/50 text-green-300' :
                  previewAsset.status === 'review' ? 'bg-yellow-900/50 text-yellow-300' :
                  'bg-orange-900/50 text-orange-300'
                }`}
              >
                {previewAsset.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Comments</span>
              <span className="text-white">{previewAsset.comments}</span>
            </div>
          </div>
        </div>


        {/* Comments and Timeline Tabs */}
        <div className="space-y-3">
          <Tabs defaultValue="comments" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-card">
              <TabsTrigger
                value="comments"
                className="text-gray-400 text-xs data-[state=active]:text-white data-[state=active]:bg-border"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Comments
              </TabsTrigger>
              <TabsTrigger
                value="timeline"
                className="text-gray-400 text-xs data-[state=active]:text-white data-[state=active]:bg-border"
              >
                <GitBranch className="w-4 h-4 mr-2" />
                Timeline
              </TabsTrigger>
            </TabsList>

            <TabsContent value="comments" className="space-y-2">
              {previewAsset.comments > 0 ? (
                <div className="space-y-1.5">
                  <div className="bg-card rounded-lg p-2.5">
                    <div className="flex items-center space-x-2 mb-1.5">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white">
                        A
                      </div>
                      <span className="text-white text-xs">Alex Chen</span>
                      <span className="text-gray-400 text-xs">2h ago</span>
                    </div>
                    <p className="text-gray-300 text-xs leading-relaxed">The color grading looks great on this shot. Ready for approval.</p>
                  </div>
                  <div className="bg-card rounded-lg p-2.5">
                    <div className="flex items-center space-x-2 mb-1.5">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs text-white">
                        S
                      </div>
                      <span className="text-white text-xs">Sarah Kim</span>
                      <span className="text-gray-400 text-xs">4h ago</span>
                    </div>
                    <p className="text-gray-300 text-xs leading-relaxed">Added some effects to enhance the visual impact. What do you think?</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-xs">No comments yet</p>
              )}
            </TabsContent>

            <TabsContent value="timeline" className="space-y-2">
              {previewAsset.timeline && previewAsset.timeline.length > 0 ? (
                <div className="space-y-1">
                  {previewAsset.timeline.map((commit, index) => (
                    <div key={commit.id} className="flex items-start space-x-2 relative">
                      {/* Git branch line */}
                      {index < previewAsset.timeline!.length - 1 && (
                        <div className="absolute left-1.5 top-5 w-0.5 h-6 bg-gray-600"></div>
                      )}

                      {/* Commit dot */}
                      <div className={`w-3 h-3 rounded-full ${
                        commit.type === 'commit' ? 'bg-blue-500' :
                        commit.type === 'merge' ? 'bg-purple-500' :
                        'bg-green-500'
                      } flex items-center justify-center text-white z-10 mt-0.5`}>
                        <GitBranch className="w-1.5 h-1.5" />
                      </div>

                      {/* Commit info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1.5 mb-0.5">
                          <span className="text-white text-xs font-medium">{commit.version}</span>
                          <span className="text-gray-400 text-xs">{commit.timestamp}</span>
                        </div>
                        <p className="text-gray-300 text-xs leading-tight mb-0.5">{commit.message}</p>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-gray-400 text-xs">{commit.author}</span>
                          {commit.branch && (
                            <Badge className="text-xs bg-gray-700 text-gray-300 px-1 py-0">
                              {commit.branch}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-xs">No timeline history</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
