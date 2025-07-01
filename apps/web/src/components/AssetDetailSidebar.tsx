import { useState } from 'react';
import { Send, ChevronDown, MoreHorizontal, Search, Download, Check, Paperclip, Smile, Globe, RotateCcw, ThumbsUp, AtSign, Filter, ArrowUpDown, Clock, GitCommit, GitBranch, GitMerge, Upload, Eye, X, AlertTriangle, FileUp, Settings } from 'lucide-react';
import { Button, Textarea, Badge, Tabs, TabsContent, TabsList, TabsTrigger, Avatar, AvatarImage, AvatarFallback, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@filehunt/shared-ts/ui';
import { type Asset, type Comment, type TimelineCommit } from "@filehunt/shared-ts/types";

interface CommentThread {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  timeCode?: string;
  type: 'comment' | 'approval' | 'rejection';
  attachment?: string;
  commentNumber?: number;
  approved?: boolean;
  reactions?: number;
  replies?: CommentThread[];
}

interface TimelineAction {
  id: string;
  type: 'upload' | 'review-request' | 'approved' | 'rejected' | 'revision-request' | 'commit' | 'merge' | 'branch';
  author: string;
  avatar: string;
  timestamp: string;
  message?: string;
  version?: string;
  branch?: string;
  fromBranch?: string;
  toBranch?: string;
}

interface AssetDetailSidebarProps {
  asset: Asset | null;
  onCommentAdd: (assetId: string, comment: Comment) => void;
  onStatusUpdate: (assetId: string, status: Asset['status']) => void;
}

export function AssetDetailSidebar({ asset, onCommentAdd, onStatusUpdate }: AssetDetailSidebarProps) {
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('comments');

  if (!asset) {
    return (
      <div className="w-80 bg-[#1a1d29] border-l border-[#2a2d3a] p-4">
        <div className="text-gray-400">Select an asset to view details</div>
      </div>
    );
  }

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: 'Current User',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      content: newComment.trim(),
      timestamp: 'now',
      type: 'comment'
    };

    onCommentAdd(asset.id, comment);
    setNewComment('');
  };

  // Mock comment threads with replies
  const commentThreads: CommentThread[] = [
    {
      id: '1',
      author: 'Kate Andrews',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=32&h=32&fit=crop&crop=face',
      content: 'We need to revisit the color correction—let\'s create more contrast, especially in the shadows and mid-tones.',
      timestamp: '2h ago',
      timeCode: '00:10',
      type: 'comment',
      attachment: '_color_reference-02.jpg',
      commentNumber: 1,
      replies: [
        {
          id: '1-1',
          author: 'Mike Chen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
          content: 'Agreed on the contrast. I can handle the color grading adjustments by EOD.',
          timestamp: '1h ago',
          type: 'comment'
        },
        {
          id: '1-2',
          author: 'Kate Andrews',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=32&h=32&fit=crop&crop=face',
          content: 'Perfect! Also make sure the skin tones don\'t shift too much.',
          timestamp: '45m ago',
          type: 'comment'
        }
      ]
    },
    {
      id: '2',
      author: 'Edvin Besic',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      content: 'This shot turned out great but the suit blends in too much. Stronger blacks would help with separation.',
      timestamp: '3h ago',
      timeCode: '00:15',
      type: 'comment',
      commentNumber: 2,
      approved: true
    },
    {
      id: '3',
      author: 'Yuki Tanaka',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=32&h=32&fit=crop&crop=face',
      content: 'Right on, I\'ll have that update by EOD.',
      timestamp: '4h ago',
      type: 'comment',
      reactions: 1
    }
  ];

  // Mock timeline with commits and actions
  const timelineEvents: TimelineAction[] = [
    {
      id: '7',
      type: 'commit',
      author: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      timestamp: '30m ago',
      message: 'Fix color grading and contrast issues',
      version: 'v1.3.2',
      branch: 'color-fix'
    },
    {
      id: '6',
      type: 'approved',
      author: 'Kate Andrews',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=32&h=32&fit=crop&crop=face',
      timestamp: '2h ago'
    },
    {
      id: '5',
      type: 'commit',
      author: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      timestamp: '4h ago',
      message: 'Update suit separation and shadows',
      version: 'v1.3.1',
      branch: 'main'
    },
    {
      id: '4',
      type: 'branch',
      author: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      timestamp: '6h ago',
      branch: 'color-fix'
    },
    {
      id: '3',
      type: 'revision-request',
      author: 'Kate Andrews',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=32&h=32&fit=crop&crop=face',
      timestamp: '8h ago'
    },
    {
      id: '2',
      type: 'review-request',
      author: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      timestamp: '1d ago'
    },
    {
      id: '1',
      type: 'upload',
      author: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      timestamp: '2d ago',
      version: 'v1.0.0'
    }
  ];

  const getTimelineIcon = (type: TimelineAction['type']) => {
    switch (type) {
      case 'upload':
        return <FileUp className="w-3 h-3 text-white" />;
      case 'review-request':
        return <Eye className="w-3 h-3 text-white" />;
      case 'approved':
        return <Check className="w-3 h-3 text-white" />;
      case 'rejected':
        return <X className="w-3 h-3 text-white" />;
      case 'revision-request':
        return <AlertTriangle className="w-3 h-3 text-white" />;
      case 'commit':
        return <GitCommit className="w-3 h-3 text-white" />;
      case 'merge':
        return <GitMerge className="w-3 h-3 text-white" />;
      case 'branch':
        return <GitBranch className="w-3 h-3 text-white" />;
      default:
        return <Clock className="w-3 h-3 text-white" />;
    }
  };

  const getTimelineColor = (type: TimelineAction['type']) => {
    switch (type) {
      case 'upload':
        return 'bg-blue-500';
      case 'review-request':
        return 'bg-yellow-500';
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      case 'revision-request':
        return 'bg-orange-500';
      case 'commit':
        return 'bg-purple-500';
      case 'merge':
        return 'bg-indigo-500';
      case 'branch':
        return 'bg-teal-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTimelineTitle = (event: TimelineAction) => {
    switch (event.type) {
      case 'upload':
        return 'Asset uploaded';
      case 'review-request':
        return 'Review requested';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'revision-request':
        return 'Revision requested';
      case 'commit':
        return event.message || 'Committed changes';
      case 'merge':
        return `Merged ${event.fromBranch} into ${event.toBranch}`;
      case 'branch':
        return `Created branch ${event.branch}`;
      default:
        return 'Unknown action';
    }
  };

  const renderComment = (comment: CommentThread, isReply = false, isLast = false) => (
    <div key={comment.id} className={`relative ${isReply ? 'ml-8' : ''}`}>
      {/* Thread line for replies */}
      {isReply && (
        <div className="absolute left-[-20px] top-0 bottom-0 w-px bg-[#3a3d4a]" />
      )}
      {isReply && !isLast && (
        <div className="absolute left-[-20px] top-6 w-3 h-px bg-[#3a3d4a]" />
      )}
      {isReply && (
        <div className="absolute left-[-20px] top-6 w-3 h-px bg-[#3a3d4a]" />
      )}

      <div className={`p-3 border-b border-[#2a2d3a]/50 hover:bg-[#1e2130] transition-colors ${isReply ? 'bg-[#1a1d29]/50' : ''}`}>
        <div className="flex items-start space-x-3">
          <Avatar className="w-7 h-7 flex-shrink-0 mt-1">
            <AvatarImage src={comment.avatar} />
            <AvatarFallback className="bg-blue-500 text-white text-xs">
              {comment.author.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-white font-medium text-xs">{comment.author}</span>
              <span className="text-gray-400 text-xs">{comment.timestamp}</span>
              {comment.approved && (
                <div className="w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center ml-auto">
                  <Check className="w-2 h-2 text-white" />
                </div>
              )}
            </div>

            <div className="flex items-start space-x-2 mb-2">
              {comment.timeCode && (
                <span className="bg-orange-500/20 text-orange-400 text-xs px-1.5 py-0.5 rounded font-mono">
                  {comment.timeCode}
                </span>
              )}
              <p className="text-gray-300 text-xs leading-relaxed">{comment.content}</p>
            </div>

            {comment.attachment && (
              <div className="mb-2">
                <div className="inline-flex items-center space-x-2 bg-[#2a2d3a] rounded px-2.5 py-1.5 text-xs">
                  <Paperclip className="w-3 h-3 text-orange-400" />
                  <span className="text-gray-300 text-xs">{comment.attachment}</span>
                  <Download className="w-3 h-3 text-gray-400 hover:text-white cursor-pointer" />
                </div>
              </div>
            )}

            {comment.reactions && (
              <div className="mb-2">
                <div className="inline-flex items-center space-x-1 bg-blue-500/20 text-blue-400 rounded-full px-2 py-0.5 text-xs">
                  <ThumbsUp className="w-2.5 h-2.5" />
                  <span className="text-xs">{comment.reactions}</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white text-xs h-auto p-0">
                Reply
              </Button>
              {comment.commentNumber && (
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <span>#{comment.commentNumber}</span>
                  <Globe className="w-2.5 h-2.5" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Render replies */}
      {comment.replies && comment.replies.map((reply, index) =>
        renderComment(reply, true, index === comment.replies!.length - 1)
      )}
    </div>
  );

  return (
    <div className="w-80 bg-[#1a1d29] border-l border-[#2a2d3a] flex flex-col">
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 m-0 bg-transparent border-b border-[#2a2d3a] rounded-none h-12 p-0">
          <TabsTrigger
            value="comments"
            className="data-[state=active]:bg-transparent data-[state=active]:text-white text-gray-400 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 h-full text-xs"
          >
            Comments
          </TabsTrigger>
          <TabsTrigger
            value="timeline"
            className="data-[state=active]:bg-transparent data-[state=active]:text-white text-gray-400 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 h-full text-xs"
          >
            Timeline
          </TabsTrigger>
          <TabsTrigger
            value="workflow"
            className="data-[state=active]:bg-transparent data-[state=active]:text-white text-gray-400 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 h-full text-xs"
          >
            Workflow
          </TabsTrigger>
        </TabsList>

        <TabsContent value="comments" className="flex-1 flex flex-col m-0">
          {/* Comments Header */}
          <div className="p-4 border-b border-[#2a2d3a]">
            <div className="flex items-center justify-between">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-white hover:bg-[#2a2d3a] p-0 h-auto bg-transparent border-none cursor-pointer flex items-center">
                    <span className="mr-2">All comments</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#2a2d3a] border-[#3a3d4a] text-white">
                  <DropdownMenuItem className="hover:bg-[#3a3d4a]">All comments</DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-[#3a3d4a]">My comments</DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-[#3a3d4a]">Unresolved</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-[#2a2d3a] h-7 w-7 p-0" title="Filter comments">
                  <Filter className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-[#2a2d3a] h-7 w-7 p-0" title="Sort comments">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-[#2a2d3a] h-7 w-7 p-0" title="Search comments">
                  <Search className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-[#2a2d3a] h-7 w-7 p-0" title="More actions">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-auto">
            {commentThreads.map((thread, threadIndex) => (
              <div key={thread.id} className={`${threadIndex % 2 === 0 ? 'bg-[#1a1d29]' : 'bg-[#1c1f2a]'}`}>
                {renderComment(thread)}
              </div>
            ))}
          </div>

          {/* Comment Input */}
          <div className="p-4 border-t border-[#2a2d3a] bg-[#1a1d29]">
            <div className="flex items-start space-x-3">
              <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded font-mono mt-2">
                00:04
              </span>
              <div className="flex-1">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Leave your comment..."
                  className="bg-transparent border-none text-white placeholder-gray-400 resize-none min-h-[40px] p-2 focus:ring-0 text-sm focus:outline-none"
                />

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white h-7 w-7 p-0">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white h-7 w-7 p-0">
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white h-7 w-7 p-0">
                      <Paperclip className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white h-7 w-7 p-0">
                      <AtSign className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-gray-400 hover:text-white text-xs h-auto p-1 bg-transparent border-none cursor-pointer flex items-center">
                          <Globe className="w-3 h-3 mr-1" />
                          <span>Public</span>
                          <ChevronDown className="w-3 h-3 ml-1" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-[#2a2d3a] border-[#3a3d4a] text-white">
                        <DropdownMenuItem className="hover:bg-[#3a3d4a]">Public</DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-[#3a3d4a]">Private</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                      onClick={handleCommentSubmit}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-3"
                      disabled={!newComment.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="flex-1 flex flex-col m-0">
          {/* Timeline Header */}
          <div className="p-4 border-b border-[#2a2d3a]">
            <div className="flex items-center justify-between">
              <span className="text-white text-sm">Asset Timeline</span>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-[#2a2d3a] h-7 w-7 p-0" title="Filter timeline">
                  <Filter className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-[#2a2d3a] h-7 w-7 p-0" title="Timeline settings">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Timeline Events */}
          <div className="flex-1 overflow-auto p-3">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-[#3a3d4a]" />

              <div className="space-y-3">
                {timelineEvents.map((event, index) => (
                  <div key={event.id} className="relative flex items-start space-x-3">
                    {/* Timeline dot */}
                    <div className={`w-6 h-6 ${getTimelineColor(event.type)} rounded-full flex items-center justify-center relative z-10 flex-shrink-0`}>
                      {getTimelineIcon(event.type)}
                    </div>

                    {/* Event content */}
                    <div className="flex-1 min-w-0 pb-2">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-1 mb-0.5">
                            <span className="text-white text-xs font-medium truncate">
                              {getTimelineTitle(event)}
                            </span>
                            {event.version && (
                              <Badge variant="secondary" className="text-xs px-1 py-0 bg-[#2a2d3a] text-gray-300 border-none h-4">
                                {event.version}
                              </Badge>
                            )}
                          </div>

                          {event.branch && (
                            <div className="flex items-center space-x-1 mb-1">
                              <GitBranch className="w-2.5 h-2.5 text-blue-400" />
                              <span className="text-blue-400 text-xs truncate">{event.branch}</span>
                            </div>
                          )}

                          <div className="flex items-center space-x-1">
                            <Avatar className="w-3.5 h-3.5">
                              <AvatarImage src={event.avatar} />
                              <AvatarFallback className="bg-blue-500 text-white text-xs">
                                {event.author.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-gray-400 text-xs truncate">{event.author}</span>
                            <span className="text-gray-500 text-xs">•</span>
                            <span className="text-gray-400 text-xs">{event.timestamp}</span>
                          </div>

                          {event.message && event.type === 'commit' && (
                            <div className="bg-[#2a2d3a]/50 rounded p-2 mt-1">
                              <p className="text-gray-300 text-xs font-mono truncate">{event.message}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="workflow" className="flex-1 flex flex-col m-0">
          {/* Workflow Header */}
          <div className="p-4 border-b border-[#2a2d3a]">
            <div className="flex items-center justify-between">
              <span className="text-white text-sm">Workflow Status</span>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-[#2a2d3a] h-7 w-7 p-0" title="Workflow settings">
                  <Settings className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-[#2a2d3a] h-7 w-7 p-0" title="More actions">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="p-4 border-b border-[#2a2d3a]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Current Status</span>
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

              {/* Status Description */}
              <p className="text-xs text-gray-400 leading-relaxed">
                {asset.status === 'approved' && 'This asset has been approved and is ready for use.'}
                {asset.status === 'needs-review' && 'This asset is waiting for review and approval.'}
                {asset.status === 'needs-retouching' && 'This asset requires additional work before approval.'}
                {!asset.status && 'This asset is in draft state and hasn\'t entered the workflow yet.'}
              </p>
            </div>
          </div>

          {/* Workflow Actions */}
          <div className="p-4 border-b border-[#2a2d3a]">
            <div className="space-y-3">
              <span className="text-sm text-white block">Actions</span>
              <div className="space-y-2">
                <Button
                  onClick={() => onStatusUpdate(asset.id, 'needs-review')}
                  size="sm"
                  variant="ghost"
                  className={`w-full text-xs px-3 py-2 h-auto justify-start ${
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
                  onClick={() => onStatusUpdate(asset.id, 'approved')}
                  size="sm"
                  variant="ghost"
                  className={`w-full text-xs px-3 py-2 h-auto justify-start ${
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
                  onClick={() => onStatusUpdate(asset.id, 'needs-retouching')}
                  size="sm"
                  variant="ghost"
                  className={`w-full text-xs px-3 py-2 h-auto justify-start ${
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
          </div>

          {/* Workflow History */}
          <div className="flex-1 overflow-auto">
            <div className="p-4">
              <span className="text-sm text-white block mb-3">Status History</span>
              <div className="space-y-3">
                {/* Mock workflow history */}
                <div className="flex items-start space-x-3 pb-3 border-b border-[#2a2d3a]/50">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-white">Approved</span>
                      <span className="text-xs text-gray-400">2h ago</span>
                    </div>
                    <p className="text-xs text-gray-400">Approved by Kate Andrews</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 pb-3 border-b border-[#2a2d3a]/50">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-white">Retouching Requested</span>
                      <span className="text-xs text-gray-400">1d ago</span>
                    </div>
                    <p className="text-xs text-gray-400">Requested by Kate Andrews</p>
                    <p className="text-xs text-gray-500 mt-1">Color correction needed for shadows</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 pb-3 border-b border-[#2a2d3a]/50">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-white">Review Requested</span>
                      <span className="text-xs text-gray-400">2d ago</span>
                    </div>
                    <p className="text-xs text-gray-400">Requested by John Smith</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Upload className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-white">Asset Created</span>
                      <span className="text-xs text-gray-400">3d ago</span>
                    </div>
                    <p className="text-xs text-gray-400">Created by John Smith</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
