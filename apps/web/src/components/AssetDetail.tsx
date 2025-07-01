import { ArrowLeft, Download, Share2, MoreHorizontal, Play, Pause, Volume2, VolumeX, Maximize, Copy, Archive, Heart, Lock, Unlock, RefreshCw, Trash2, Eye, EyeOff, Star, GitBranch, Upload, ExternalLink, Check, Clock, AlertTriangle, Plus } from 'lucide-react';
import { Button, Badge, Card, CardContent, CardHeader, CardTitle, ImageWithFallback } from '@filehunt/shared-ts/ui';
import { TagSuggestionPopover } from './dam/TagSuggestionPopover';
import { type Asset } from '@filehunt/shared-ts/types';

import { useState } from 'react';

interface AssetDetailProps {
  asset: Asset | null;
  onBack: () => void;
  onTagAdd: (assetId: string, tag: string) => void;
  onTagRemove: (assetId: string, tag: string) => void;
  onFolderAdd: (assetId: string, folder: string) => void;
  onFolderRemove: (assetId: string, folder: string) => void;
  onStatusUpdate?: (assetId: string, status: Asset['status']) => void;
}

export function AssetDetail({ asset, onBack, onTagAdd, onTagRemove, onFolderAdd, onFolderRemove, onStatusUpdate }: AssetDetailProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [newFolder, setNewFolder] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  if (!asset) {
    return (
      <div className="flex-1 bg-[#1a1d29] p-6">
        <div className="text-center text-gray-400 mt-20">
          No asset selected
        </div>
      </div>
    );
  }

  const handleAddTag = (tag: string) => {
    if (tag.trim()) {
      onTagAdd(asset.id, tag.trim());
    }
  };

  const handleAddFolder = () => {
    if (newFolder.trim()) {
      onFolderAdd(asset.id, newFolder.trim());
      setNewFolder('');
    }
  };

  const handleDuplicate = () => {
    console.log('Duplicating asset:', asset.name);
  };

  const handleArchive = () => {
    console.log('Archiving asset:', asset.name);
  };

  const handleExport = () => {
    console.log('Exporting asset:', asset.name);
  };

  const handleShare = () => {
    console.log('Sharing asset:', asset.name);
  };

  const handleStatusUpdate = (newStatus: Asset['status']) => {
    if (onStatusUpdate && asset) {
      onStatusUpdate(asset.id, newStatus);
    }
  };

  return (
    <div className="flex-1 bg-[#1a1d29] overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-gray-400 hover:text-white hover:bg-[#2a2d3a]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Assets
            </Button>
            <div>
              <h1 className="text-white text-xl">{asset.name}</h1>
              <p className="text-gray-400 text-sm">
                {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)} • {asset.size} • {asset.uploadDate}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFavorited(!isFavorited)}
              className={`${isFavorited ? 'text-yellow-400' : 'text-gray-400'} hover:text-yellow-400 hover:bg-[#2a2d3a]`}
            >
              <Star className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-[#2a2d3a]">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-[#2a2d3a]">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-[#2a2d3a]">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Asset Preview */}
          <div className="bg-[#1f2029] rounded-lg mb-8 relative group">
            <div className="aspect-video rounded-lg overflow-hidden">
              <ImageWithFallback
                src={asset.thumbnail}
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

          {/* Asset Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Tags Card */}
            <Card className="bg-[#1f2029]/50 border-[#2a2d3a] backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center justify-between">
                  Tags
                  <Badge variant="secondary" className="bg-[#2a2d3a] text-gray-300 text-xs">
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
                      className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 cursor-pointer group text-xs px-2 py-1"
                      onClick={() => onTagRemove(asset.id, tag)}
                    >
                      {tag}
                      <span className="ml-1 opacity-0 group-hover:opacity-100 text-red-400">×</span>
                    </Badge>
                  ))}
                </div>

                <TagSuggestionPopover
                  asset={asset}
                  onTagAdd={(tag) => handleAddTag(tag)}
                  existingTags={asset.tags}
                  trigger={
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-[#2a2d3a] border-[#3a3d4a] text-gray-300 hover:text-white hover:bg-[#3a3d4a] text-xs px-3 py-2 h-auto justify-start"
                    >
                      <Plus className="w-3 h-3 mr-2" />
                      Add tag...
                    </Button>
                  }
                />
              </CardContent>
            </Card>

            {/* Folders Card */}
            <Card className="bg-[#1f2029]/50 border-[#2a2d3a] backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center justify-between">
                  Folders
                  <Badge variant="secondary" className="bg-[#2a2d3a] text-gray-300 text-xs">
                    {asset.folders.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {asset.folders.map((folder) => (
                    <Badge
                      key={folder}
                      variant="outline"
                      className="border-green-500/30 text-green-300 hover:bg-green-500/20 cursor-pointer group text-xs px-2 py-1"
                      onClick={() => onFolderRemove(asset.id, folder)}
                    >
                      {folder}
                      <span className="ml-1 opacity-0 group-hover:opacity-100 text-red-400">×</span>
                    </Badge>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newFolder}
                    onChange={(e) => setNewFolder(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddFolder()}
                    placeholder="Add folder..."
                    className="flex-1 bg-[#2a2d3a] border-none rounded px-2 py-1.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                  <Button onClick={handleAddFolder} size="sm" className="bg-green-600 hover:bg-green-700 text-xs px-3 py-1.5 h-auto">
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Properties Card */}
            <Card className="bg-[#1f2029]/50 border-[#2a2d3a] backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-xs text-gray-400">File Size</dt>
                    <dd className="text-xs text-white">{asset.size}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-xs text-gray-400">Upload Date</dt>
                    <dd className="text-xs text-white">{asset.uploadDate}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-xs text-gray-400">Uploader</dt>
                    <dd className="text-xs text-white">{asset.uploader}</dd>
                  </div>
                  {asset.duration && (
                    <div className="flex justify-between">
                      <dt className="text-xs text-gray-400">Duration</dt>
                      <dd className="text-xs text-white">{asset.duration}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-xs text-gray-400">Version</dt>
                    <dd className="text-xs text-white">v{asset.version || '1.0'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-xs text-gray-400">Comments</dt>
                    <dd className="text-xs text-white">{asset.comments}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* Version Control Card */}
            <Card className="bg-[#1f2029]/50 border-[#2a2d3a] backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center">
                  <GitBranch className="w-3 h-3 mr-2" />
                  Version Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Current Version</span>
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 text-xs">
                      v{asset.version || '1.0'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Branch</span>
                    <span className="text-xs text-blue-300">main</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Status</span>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        asset.status === 'approved'
                          ? 'bg-green-500/20 text-green-300'
                          : asset.status === 'needs-review'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'bg-orange-500/20 text-orange-300'
                      }`}
                    >
                      {asset.status?.replace('-', ' ') || 'draft'}
                    </Badge>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="ghost" className="text-gray-300 hover:text-white hover:bg-[#2a2d3a] text-xs px-2 py-1.5 h-auto flex-1">
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Sync
                  </Button>
                  <Button size="sm" variant="ghost" className="text-gray-300 hover:text-white hover:bg-[#2a2d3a] text-xs px-2 py-1.5 h-auto flex-1">
                    <Upload className="w-3 h-3 mr-1" />
                    Push
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Workflow Actions Card */}
            <Card className="bg-[#1f2029]/50 border-[#2a2d3a] backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center">
                  <Clock className="w-3 h-3 mr-2" />
                  Workflow Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Current Status</span>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        asset.status === 'approved'
                          ? 'bg-green-500/20 text-green-300 border-green-500/30'
                          : asset.status === 'needs-review'
                          ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                          : asset.status === 'needs-retouching'
                          ? 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                          : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                      }`}
                    >
                      {asset.status === 'needs-review' ? 'Needs Review' :
                       asset.status === 'needs-retouching' ? 'Needs Retouching' :
                       asset.status === 'approved' ? 'Approved' : 'Draft'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-gray-400 block">Update Status:</span>
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      onClick={() => handleStatusUpdate('needs-review')}
                      size="sm"
                      variant="ghost"
                      className={`text-xs px-2 py-1.5 h-auto justify-start ${
                        asset.status === 'needs-review'
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                          : 'text-yellow-300 hover:text-yellow-200 hover:bg-yellow-500/10'
                      }`}
                      disabled={asset.status === 'needs-review'}
                    >
                      <Clock className="w-3 h-3 mr-2" />
                      Request Review
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate('approved')}
                      size="sm"
                      variant="ghost"
                      className={`text-xs px-2 py-1.5 h-auto justify-start ${
                        asset.status === 'approved'
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : 'text-green-300 hover:text-green-200 hover:bg-green-500/10'
                      }`}
                      disabled={asset.status === 'approved'}
                    >
                      <Check className="w-3 h-3 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate('needs-retouching')}
                      size="sm"
                      variant="ghost"
                      className={`text-xs px-2 py-1.5 h-auto justify-start ${
                        asset.status === 'needs-retouching'
                          ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                          : 'text-orange-300 hover:text-orange-200 hover:bg-orange-500/10'
                      }`}
                      disabled={asset.status === 'needs-retouching'}
                    >
                      <AlertTriangle className="w-3 h-3 mr-2" />
                      Request Retouching
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Visibility & Sharing Card */}
            <Card className="bg-[#1f2029]/50 border-[#2a2d3a] backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Visibility &amp; Sharing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Visibility</span>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsPublic(!isPublic)}
                        className="text-gray-300 hover:text-white h-auto p-1"
                      >
                        {isPublic ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      </Button>
                      <span className="text-xs text-white">
                        {isPublic ? 'Public' : 'Private'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Shared with</span>
                    <span className="text-xs text-blue-300">3 people</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Last accessed</span>
                    <span className="text-xs text-gray-300">2h ago</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={handleShare} size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1.5 h-auto flex-1">
                    <Share2 className="w-3 h-3 mr-1" />
                    Share
                  </Button>
                  <Button size="sm" variant="ghost" className="text-gray-300 hover:text-white hover:bg-[#2a2d3a] text-xs px-2 py-1.5 h-auto">
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
