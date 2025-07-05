"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Asset } from '@/types/assets';
import { Button } from '@/components/button';
import { Badge } from '@/components/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar';
import {
  Activity as ActivityIcon,
  Upload,
  Download,
  Trash2,
  GitBranch,
  Users,
  MessageCircle,
  Tag,
  Folder,
  CheckCircle,
  ExternalLink,
  Clock,
  Eye,
  MoreHorizontal
} from 'lucide-react';

interface ActivityRightSidebarProps {
  activity: Activity | null;
  onViewAsset?: (assetId: string) => void;
  onViewBranch?: (branchId: string) => void;
  onViewCollection?: (collectionId: string) => void;
  onMarkAsRead?: (activityId: string) => void;
}

export const ActivityRightSidebar: React.FC<ActivityRightSidebarProps> = ({
  activity,
  onViewAsset,
  onViewBranch,
  onViewCollection,
  onMarkAsRead,
}) => {
  if (!activity) {
    return (
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-80 bg-card/50 backdrop-blur-sm flex flex-col h-full"
      >
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <ActivityIcon className="w-12 h-12 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-medium text-foreground">No Activity Selected</h3>
              <p className="text-sm text-muted-foreground">
                Select an activity to view details and related actions
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'asset_uploaded':
      case 'asset_updated':
        return <Upload className="w-5 h-5 text-blue-500" />;
      case 'asset_deleted':
        return <Trash2 className="w-5 h-5 text-red-500" />;
      case 'branch_created':
      case 'branch_merged':
        return <GitBranch className="w-5 h-5 text-purple-500" />;
      case 'collection_created':
        return <Folder className="w-5 h-5 text-green-500" />;
      case 'user_joined':
        return <Users className="w-5 h-5 text-orange-500" />;
      case 'comment_added':
        return <MessageCircle className="w-5 h-5 text-pink-500" />;
      case 'status_changed':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'tag_added':
        return <Tag className="w-5 h-5 text-yellow-500" />;
      case 'folder_created':
        return <Folder className="w-5 h-5 text-indigo-500" />;
      default:
        return <ActivityIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActivityTypeLabel = (type: Activity['type']) => {
    switch (type) {
      case 'asset_uploaded':
        return 'Asset Upload';
      case 'asset_updated':
        return 'Asset Update';
      case 'asset_deleted':
        return 'Asset Deletion';
      case 'branch_created':
        return 'Branch Creation';
      case 'branch_merged':
        return 'Branch Merge';
      case 'collection_created':
        return 'Collection Creation';
      case 'user_joined':
        return 'Team Member Joined';
      case 'comment_added':
        return 'Comment Added';
      case 'status_changed':
        return 'Status Change';
      case 'tag_added':
        return 'Tags Added';
      case 'folder_created':
        return 'Folder Creation';
      default:
        return 'Activity';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }),
    };
  };

  const { date, time } = formatTimestamp(activity.timestamp);

  const handleViewRelated = () => {
    if (activity.assetId && onViewAsset) {
      onViewAsset(activity.assetId);
    } else if (activity.branchId && onViewBranch) {
      onViewBranch(activity.branchId);
    } else if (activity.collectionId && onViewCollection) {
      onViewCollection(activity.collectionId);
    }
  };

  const hasRelatedItem = activity.assetId || activity.branchId || activity.collectionId;

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-80 bg-card/50 backdrop-blur-sm flex flex-col h-full border-l border-border/30"
    >
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {getActivityIcon(activity.type)}
            <h2 className="text-lg font-semibold text-foreground">Activity Details</h2>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Activity Type Badge */}
        <Badge variant="outline" className="mb-3">
          {getActivityTypeLabel(activity.type)}
        </Badge>

        {/* Read Status */}
        {!activity.isRead && (
          <div className="flex items-center justify-between bg-blue-500/10 rounded-lg p-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-sm text-blue-600 font-medium">Unread</span>
            </div>
            {onMarkAsRead && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onMarkAsRead(activity.id)}
                className="text-blue-600 hover:text-blue-700"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Mark as read
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Activity Info */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-2">
              {activity.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {activity.description}
            </p>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3 p-3 bg-background/30 rounded-lg">
            <Avatar className="w-10 h-10">
              <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
              <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-foreground">{activity.user.name}</p>
              <p className="text-xs text-muted-foreground">Performed this action</p>
            </div>
          </div>

          {/* Timestamp */}
          <div className="flex items-center gap-2 p-3 bg-background/30 rounded-lg">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">{date}</p>
              <p className="text-xs text-muted-foreground">{time}</p>
            </div>
          </div>
        </div>

        {/* Metadata */}
        {activity.metadata && (
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Details</h4>
            <div className="space-y-2">
              {activity.metadata.assetName && (
                <div className="flex justify-between p-2 bg-background/30 rounded">
                  <span className="text-sm text-muted-foreground">Asset:</span>
                  <span className="text-sm font-medium text-foreground">
                    {activity.metadata.assetName}
                  </span>
                </div>
              )}
              {activity.metadata.assetType && (
                <div className="flex justify-between p-2 bg-background/30 rounded">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <Badge variant="outline" className="text-xs">
                    {activity.metadata.assetType}
                  </Badge>
                </div>
              )}
              {activity.metadata.branchName && (
                <div className="flex justify-between p-2 bg-background/30 rounded">
                  <span className="text-sm text-muted-foreground">Branch:</span>
                  <span className="text-sm font-medium text-foreground">
                    {activity.metadata.branchName}
                  </span>
                </div>
              )}
              {activity.metadata.collectionName && (
                <div className="flex justify-between p-2 bg-background/30 rounded">
                  <span className="text-sm text-muted-foreground">Collection:</span>
                  <span className="text-sm font-medium text-foreground">
                    {activity.metadata.collectionName}
                  </span>
                </div>
              )}
              {activity.metadata.folderName && (
                <div className="flex justify-between p-2 bg-background/30 rounded">
                  <span className="text-sm text-muted-foreground">Folder:</span>
                  <span className="text-sm font-medium text-foreground">
                    {activity.metadata.folderName}
                  </span>
                </div>
              )}
              {activity.metadata.tagName && (
                <div className="flex justify-between p-2 bg-background/30 rounded">
                  <span className="text-sm text-muted-foreground">Tag:</span>
                  <Badge variant="outline" className="text-xs">
                    {activity.metadata.tagName}
                  </Badge>
                </div>
              )}
              {activity.metadata.oldStatus && activity.metadata.newStatus && (
                <div className="p-2 bg-background/30 rounded">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status Change:</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {activity.metadata.oldStatus}
                    </Badge>
                    <span className="text-muted-foreground">→</span>
                    <Badge variant="outline" className="text-xs">
                      {activity.metadata.newStatus}
                    </Badge>
                  </div>
                </div>
              )}
              {activity.metadata.commentText && (
                <div className="p-2 bg-background/30 rounded">
                  <span className="text-sm text-muted-foreground block mb-1">Comment:</span>
                  <p className="text-sm text-foreground italic">
                    "{activity.metadata.commentText}"
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Related Actions */}
        {hasRelatedItem && (
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Related Actions</h4>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewRelated}
                className="w-full justify-start"
              >
                <Eye className="w-4 h-4 mr-2" />
                {activity.assetId && 'View Asset'}
                {activity.branchId && 'View Branch'}
                {activity.collectionId && 'View Collection'}
              </Button>

              {activity.assetId && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in Detail View
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Quick Actions</h4>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Full Timeline
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <Users className="w-4 h-4 mr-2" />
              View User Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/50 bg-background/20">
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Activity ID: {activity.id}</p>
          <p>Logged: {date} at {time}</p>
        </div>
      </div>
    </motion.div>
  );
};
