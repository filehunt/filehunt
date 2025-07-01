import {
  GitCommit, MessageCircle, Trash2, Upload, Download,
  GitBranch, GitMerge, Star, Tag, Edit3, Share,
  Eye, Archive, CheckCircle, XCircle, Clock,
  User, Calendar, Hash, FileText, Image, Video, Music,
  MoreHorizontal, Copy, ExternalLink
} from 'lucide-react';
import { Button } from '@filehunt/shared-ts/ui'; //button';
import { Badge } from '@filehunt/shared-ts/ui'; //badge';
import { Separator } from '@filehunt/shared-ts/ui'; //separator';
import { Avatar, AvatarFallback } from '@filehunt/shared-ts/ui'; //avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@filehunt/shared-ts/ui'; //card';
import { ScrollArea } from '@filehunt/shared-ts/ui'; //scroll-area';

interface Activity {
  id: string;
  type: 'commit' | 'upload' | 'comment' | 'delete' | 'edit' | 'merge' | 'branch' | 'tag' | 'share' | 'approve' | 'reject' | 'archive' | 'favorite' | 'view';
  message: string;
  description?: string;
  author: string;
  authorAvatar: string;
  timestamp: string;
  date: string;
  time: string;
  branch?: string;
  parentBranch?: string;
  tag?: string;
  assetName?: string;
  assetType?: 'image' | 'video' | 'audio' | 'document';
  commitId?: string;
  version?: string;
  branchColor?: string;
  mergeTarget?: string;
  lane?: number;
}

interface ActivitiesRightSidebarProps {
  selectedActivity: Activity | null;
  onClose: () => void; // Still keep this for consistency but won't use it
}

export function ActivitiesRightSidebar({ selectedActivity }: ActivitiesRightSidebarProps) {
  if (!selectedActivity) {
    return (
      <div className="w-80 bg-[#1f2029] border-l border-[#373a4b] flex flex-col h-full">
        <div className="p-4 border-b border-[#373a4b]">
          <h3 className="text-lg text-white">Activity Details</h3>
          <p className="text-sm text-gray-400">Select an activity to view details</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No activity selected</p>
          </div>
        </div>
      </div>
    );
  }

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'commit': return <GitCommit className="w-5 h-5 text-blue-400" />;
      case 'upload': return <Upload className="w-5 h-5 text-green-400" />;
      case 'comment': return <MessageCircle className="w-5 h-5 text-purple-400" />;
      case 'delete': return <Trash2 className="w-5 h-5 text-red-400" />;
      case 'edit': return <Edit3 className="w-5 h-5 text-orange-400" />;
      case 'merge': return <GitMerge className="w-5 h-5 text-cyan-400" />;
      case 'branch': return <GitBranch className="w-5 h-5 text-yellow-400" />;
      case 'tag': return <Tag className="w-5 h-5 text-pink-400" />;
      case 'share': return <Share className="w-5 h-5 text-indigo-400" />;
      case 'approve': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'reject': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'archive': return <Archive className="w-5 h-5 text-gray-400" />;
      case 'favorite': return <Star className="w-5 h-5 text-yellow-400" />;
      case 'view': return <Eye className="w-5 h-5 text-gray-400" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getAssetIcon = (assetType?: Activity['assetType']) => {
    switch (assetType) {
      case 'image': return <Image className="w-4 h-4 text-blue-400" />;
      case 'video': return <Video className="w-4 h-4 text-red-400" />;
      case 'audio': return <Music className="w-4 h-4 text-green-400" />;
      case 'document': return <FileText className="w-4 h-4 text-orange-400" />;
      default: return null;
    }
  };

  const getActivityTypeLabel = (type: Activity['type']) => {
    switch (type) {
      case 'commit': return 'Git Commit';
      case 'upload': return 'Asset Upload';
      case 'comment': return 'Comment';
      case 'delete': return 'Deletion';
      case 'edit': return 'Edit';
      case 'merge': return 'Git Merge';
      case 'branch': return 'Branch Creation';
      case 'tag': return 'Tag Creation';
      case 'share': return 'Share';
      case 'approve': return 'Approval';
      case 'reject': return 'Rejection';
      case 'archive': return 'Archive';
      case 'favorite': return 'Favorite';
      case 'view': return 'View';
      default: return 'Activity';
    }
  };

  const getBranchTagBadge = (activity: Activity) => {
    if (activity.tag) {
      return (
        <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">
          <Tag className="w-3 h-3 mr-1" />
          {activity.tag}
        </Badge>
      );
    }
    if (activity.branch) {
      return (
        <Badge className={`border ${
          activity.branch === 'main'
            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
            : activity.branch === 'develop'
            ? 'bg-green-500/20 text-green-300 border-green-500/30'
            : activity.branch?.startsWith('feature/')
            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
            : activity.branch?.startsWith('hotfix/')
            ? 'bg-red-500/20 text-red-300 border-red-500/30'
            : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
        }`}>
          <GitBranch className="w-3 h-3 mr-1" />
          {activity.branch}
        </Badge>
      );
    }
    return null;
  };

  return (
    <div className="w-80 bg-[#1f2029] border-l border-[#373a4b] flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-[#373a4b]">
        <div className="mb-3">
          <h3 className="text-lg text-white">Activity Details</h3>
          <p className="text-sm text-gray-400">Permanent sidebar view</p>
        </div>

        <div className="flex items-center space-x-3">
          {getActivityIcon(selectedActivity.type)}
          <div>
            <p className="text-white text-sm">{getActivityTypeLabel(selectedActivity.type)}</p>
            <p className="text-xs text-gray-400">{selectedActivity.timestamp}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {/* Main Info */}
          <Card className="bg-[#2a2d3a] border-[#373a4b]">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm">{selectedActivity.message}</CardTitle>
              {selectedActivity.description && (
                <CardDescription className="text-gray-400 text-xs">
                  {selectedActivity.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Author */}
              <div className="flex items-center space-x-2">
                <User className="w-3 h-3 text-gray-400" />
                <div className="flex items-center space-x-2">
                  <Avatar className="w-5 h-5">
                    <AvatarFallback className="bg-blue-500 text-white text-xs">
                      {selectedActivity.authorAvatar}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-gray-300 text-sm">{selectedActivity.author}</span>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center space-x-2">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span className="text-gray-300 text-sm">{selectedActivity.date} @ {selectedActivity.time}</span>
              </div>

              {/* Branch/Tag */}
              {(selectedActivity.branch || selectedActivity.tag) && (
                <div className="flex items-center space-x-2">
                  <GitBranch className="w-3 h-3 text-gray-400" />
                  {getBranchTagBadge(selectedActivity)}
                </div>
              )}

              {/* Commit ID */}
              {selectedActivity.commitId && (
                <div className="flex items-center space-x-2">
                  <Hash className="w-3 h-3 text-gray-400" />
                  <div className="flex items-center space-x-2">
                    <code className="text-xs bg-[#373a4b] text-gray-300 px-2 py-1 rounded">
                      {selectedActivity.commitId}
                    </code>
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Version */}
              {selectedActivity.version && (
                <div className="flex items-center space-x-2">
                  <Tag className="w-3 h-3 text-gray-400" />
                  <Badge variant="outline" className="text-gray-400 border-gray-600 text-xs">
                    {selectedActivity.version}
                  </Badge>
                </div>
              )}

              {/* Asset */}
              {selectedActivity.assetName && (
                <div className="flex items-center space-x-2">
                  {getAssetIcon(selectedActivity.assetType)}
                  <span className="text-gray-300 text-sm">{selectedActivity.assetName}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-2">
            <h4 className="text-sm text-gray-400 mb-2">Quick Actions</h4>

            {selectedActivity.type === 'commit' && (
              <>
                <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8">
                  <Eye className="w-3 h-3 mr-2" />
                  View Commit
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8">
                  <Copy className="w-3 h-3 mr-2" />
                  Copy Hash
                </Button>
              </>
            )}

            {selectedActivity.assetName && (
              <>
                <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8">
                  <Eye className="w-3 h-3 mr-2" />
                  View Asset
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8">
                  <Download className="w-3 h-3 mr-2" />
                  Download
                </Button>
              </>
            )}

            <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8">
              <ExternalLink className="w-3 h-3 mr-2" />
              Open Timeline
            </Button>
          </div>

          {/* Statistics */}
          {selectedActivity.type === 'commit' && (
            <div>
              <h4 className="text-sm text-gray-400 mb-2">Changes</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-[#2a2d3a] rounded border border-[#373a4b] text-center">
                  <div className="text-sm text-green-400">+247</div>
                  <div className="text-xs text-gray-400">Added</div>
                </div>
                <div className="p-2 bg-[#2a2d3a] rounded border border-[#373a4b] text-center">
                  <div className="text-sm text-red-400">-18</div>
                  <div className="text-xs text-gray-400">Removed</div>
                </div>
              </div>
            </div>
          )}

          {/* Related Files */}
          {selectedActivity.type === 'commit' && (
            <div>
              <h4 className="text-sm text-gray-400 mb-2">Files Changed</h4>
              <div className="space-y-1">
                <div className="p-2 bg-[#2a2d3a] rounded border border-[#373a4b] text-xs">
                  <div className="text-white">src/services/messaging.ts</div>
                  <div className="text-gray-400">+45 -8</div>
                </div>
                <div className="p-2 bg-[#2a2d3a] rounded border border-[#373a4b] text-xs">
                  <div className="text-white">src/workers/index.ts</div>
                  <div className="text-gray-400">+202 -10</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
