import { useState } from 'react';
import { X, Calendar, User, FileIcon, Eye, Tag, Folder, Plus, MessageCircle, GitBranch, GitCommit, GitMerge } from 'lucide-react';
import { Button, Badge, Separator, Input, Tabs, TabsContent, TabsList, TabsTrigger } from '../../shared';
import { TagSuggestionPopover } from '../../shared';
import { type Asset } from '@shared-ts/types';

interface TimelineCommit {
  id: string;
  message: string;
  author: string;
  timestamp: string;
  version: string;
  type: 'commit' | 'merge' | 'branch';
  branch?: string;
}

interface RightSidebarProps {
  previewAsset: Asset | null;
  onClose: () => void;
  onTagAdd: (assetId: string, tag: string) => void;
  onTagRemove: (assetId: string, tag: string) => void;
  onFolderAdd: (assetId: string, folder: string) => void;
  onFolderRemove: (assetId: string, folder: string) => void;
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

  if (!previewAsset) {
    return (
      <div className="w-80 bg-[#292b36] border-l border-[#373a4b] p-6 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">Select an asset to preview</p>
        </div>
      </div>
    );
  }

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'coloring':
        return 'bg-orange-900/50 text-orange-300';
      case 'retouching':
        return 'bg-orange-900/50 text-orange-300';
      case 'social':
        return 'bg-emerald-900/50 text-emerald-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  const getFolderColor = (folder: string) => {
    switch (folder.toLowerCase()) {
      case 'episodes':
        return 'border-blue-400/50 text-blue-300 bg-transparent';
      case 'talent':
        return 'border-purple-400/50 text-purple-300 bg-transparent';
      case 'location':
        return 'border-green-400/50 text-green-300 bg-transparent';
      case 'key scenes':
        return 'border-yellow-400/50 text-yellow-300 bg-transparent';
      default:
        return 'border-gray-400/50 text-gray-300 bg-transparent';
    }
  };

  const getCommitIcon = (type: TimelineCommit['type']) => {
    switch (type) {
      case 'commit':
        return <GitCommit className="w-3 h-3" />;
      case 'merge':
        return <GitMerge className="w-3 h-3" />;
      case 'branch':
        return <GitBranch className="w-3 h-3" />;
      default:
        return <GitCommit className="w-3 h-3" />;
    }
  };

  const getCommitColor = (type: TimelineCommit['type']) => {
    switch (type) {
      case 'commit':
        return 'bg-blue-500';
      case 'merge':
        return 'bg-purple-500';
      case 'branch':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleAddFolder = () => {
    if (newFolder.trim() && previewAsset) {
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

  return (
    <div className="w-80 bg-[#292b36] border-l border-[#373a4b] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#373a4b] flex items-center justify-between">
        <h2 className="text-white font-medium">File Preview</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Preview */}
      <div className="p-4">
        <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden mb-4">
          <img
            src={previewAsset.thumbnail}
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
              <h3 className="text-white font-medium text-sm">Tags</h3>
            </div>
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
          </div>

          <div className="space-y-2">
            {previewAsset.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {previewAsset.tags.map((tag, index) => (
                  <Badge key={index} className={`text-xs ${getTagColor(tag)} group`}>
                    {tag}
                    <button
                      onClick={() => onTagRemove(previewAsset.id, tag)}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-2 h-2" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {previewAsset.tags.length === 0 && (
              <p className="text-gray-400 text-sm">No tags assigned</p>
            )}
          </div>
        </div>

        <Separator className="bg-[#373a4b]" />

        {/* Folders Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Folder className="w-4 h-4 text-gray-400" />
              <h3 className="text-white font-medium text-sm">Folders</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFolderInput(true)}
              className="text-gray-400 hover:text-white"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {previewAsset.folders && previewAsset.folders.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {previewAsset.folders.map((folder, index) => (
                  <div key={index} className={`inline-flex items-center px-2 py-1 rounded border text-xs ${getFolderColor(folder)} group`}>
                    <Folder className="w-3 h-3 mr-1" />
                    {folder}
                    <button
                      onClick={() => onFolderRemove(previewAsset.id, folder)}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-2 h-2" />
                    </button>
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
                  className="text-xs h-7 bg-[#1f2029] border-[#373a4b]"
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

        <Separator className="bg-[#373a4b]" />

        {/* Properties Section */}
        <div className="space-y-3">
          <h3 className="text-white font-medium text-sm">Properties</h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Name</span>
              <span className="text-white text-right break-all ml-2">{previewAsset.name}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Size</span>
              <span className="text-white">{previewAsset.size}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Type</span>
              <span className="text-white capitalize">{previewAsset.type}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Upload Date</span>
              <span className="text-white">{previewAsset.uploadDate}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Uploaded by</span>
              <span className="text-white">{previewAsset.uploader}</span>
            </div>

            {previewAsset.duration && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Duration</span>
                <span className="text-white">{previewAsset.duration}</span>
              </div>
            )}

            {previewAsset.version && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Version</span>
                <span className="text-white">{previewAsset.version}</span>
              </div>
            )}

            {previewAsset.status && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Status</span>
                <Badge
                  className={`text-xs ${
                    previewAsset.status === 'approved' ? 'bg-green-900/50 text-green-300' :
                    previewAsset.status === 'needs-review' ? 'bg-yellow-900/50 text-yellow-300' :
                    'bg-orange-900/50 text-orange-300'
                  }`}
                >
                  {previewAsset.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Comments</span>
              <span className="text-white">{previewAsset.comments}</span>
            </div>
          </div>
        </div>

        <Separator className="bg-[#373a4b]" />

        {/* Comments and Timeline Tabs */}
        <div className="space-y-3">
          <Tabs defaultValue="comments" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#1f2029] border border-[#373a4b]">
              <TabsTrigger
                value="comments"
                className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-[#373a4b]"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Comments
              </TabsTrigger>
              <TabsTrigger
                value="timeline"
                className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-[#373a4b]"
              >
                <GitBranch className="w-4 h-4 mr-2" />
                Timeline
              </TabsTrigger>
            </TabsList>

            <TabsContent value="comments" className="space-y-3">
              {previewAsset.comments > 0 ? (
                <div className="space-y-2">
                  <div className="bg-[#1f2029] rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white">
                        A
                      </div>
                      <span className="text-white text-sm">Alex Chen</span>
                      <span className="text-gray-400 text-xs">2h ago</span>
                    </div>
                    <p className="text-gray-300 text-sm">The color grading looks great on this shot. Ready for approval.</p>
                  </div>
                  <div className="bg-[#1f2029] rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs text-white">
                        S
                      </div>
                      <span className="text-white text-sm">Sarah Kim</span>
                      <span className="text-gray-400 text-xs">4h ago</span>
                    </div>
                    <p className="text-gray-300 text-sm">Added some effects to enhance the visual impact. What do you think?</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No comments yet</p>
              )}
            </TabsContent>

            <TabsContent value="timeline" className="space-y-3">
              {previewAsset.timeline && previewAsset.timeline.length > 0 ? (
                <div className="space-y-1">
                  {previewAsset.timeline.map((commit, index) => (
                    <div key={commit.id} className="flex items-start space-x-3 relative">
                      {/* Git branch line */}
                      {index < previewAsset.timeline!.length - 1 && (
                        <div className="absolute left-2 top-6 w-0.5 h-8 bg-gray-600"></div>
                      )}

                      {/* Commit dot */}
                      <div className={`w-4 h-4 rounded-full ${getCommitColor(commit.type)} flex items-center justify-center text-white z-10`}>
                        {getCommitIcon(commit.type)}
                      </div>

                      {/* Commit info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-white text-xs font-medium">{commit.version}</span>
                          <span className="text-gray-400 text-xs">{commit.timestamp}</span>
                        </div>
                        <p className="text-gray-300 text-xs leading-tight mb-1">{commit.message}</p>
                        <div className="flex items-center space-x-2">
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
                <p className="text-gray-400 text-sm">No timeline history</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
