"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity } from '@/types/assets';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Badge } from '@/components/badge';
import { 
  Activity as ActivityIcon, 
  Search, 
  Filter,
  Clock,
  FileText,
  GitBranch,
  Users,
  MessageCircle,
  Tag,
  Folder,
  Upload,
  Download,
  Trash2,
  Settings,
  Bell,
  CheckCircle
} from 'lucide-react';

interface ActivityLeftSidebarProps {
  activities: Activity[];
  onMarkAllAsRead: () => void;
  onTypeFilterChange?: (type: Activity['type'] | 'all') => void;
  onStatusFilterChange?: (status: 'all' | 'unread' | 'read') => void;
}

export const ActivityLeftSidebar: React.FC<ActivityLeftSidebarProps> = ({
  activities,
  onMarkAllAsRead,
  onTypeFilterChange = () => {},
  onStatusFilterChange = () => {},
}) => {
  const [typeFilter, setTypeFilter] = useState<Activity['type'] | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');

  const handleTypeFilterChange = (type: Activity['type'] | 'all') => {
    setTypeFilter(type);
    onTypeFilterChange(type);
  };

  const handleStatusFilterChange = (status: 'all' | 'unread' | 'read') => {
    setStatusFilter(status);
    onStatusFilterChange(status);
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'asset_uploaded':
      case 'asset_updated':
        return <Upload className="w-4 h-4 text-blue-500" />;
      case 'asset_deleted':
        return <Trash2 className="w-4 h-4 text-red-500" />;
      case 'branch_created':
      case 'branch_merged':
        return <GitBranch className="w-4 h-4 text-purple-500" />;
      case 'collection_created':
        return <Folder className="w-4 h-4 text-green-500" />;
      case 'user_joined':
        return <Users className="w-4 h-4 text-orange-500" />;
      case 'comment_added':
        return <MessageCircle className="w-4 h-4 text-pink-500" />;
      case 'status_changed':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'tag_added':
        return <Tag className="w-4 h-4 text-yellow-500" />;
      case 'folder_created':
        return <Folder className="w-4 h-4 text-indigo-500" />;
      default:
        return <ActivityIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = activities.filter(a => !a.isRead).length;

  const activityTypes: { type: Activity['type'] | 'all', label: string, count: number }[] = [
    { type: 'all', label: 'All', count: activities.length },
    { type: 'asset_uploaded', label: 'Uploads', count: activities.filter(a => a.type === 'asset_uploaded').length },
    { type: 'asset_updated', label: 'Updates', count: activities.filter(a => a.type === 'asset_updated').length },
    { type: 'branch_created', label: 'Branches', count: activities.filter(a => a.type.includes('branch')).length },
    { type: 'collection_created', label: 'Collections', count: activities.filter(a => a.type === 'collection_created').length },
    { type: 'comment_added', label: 'Comments', count: activities.filter(a => a.type === 'comment_added').length },
    { type: 'user_joined', label: 'Team', count: activities.filter(a => a.type === 'user_joined').length },
  ];

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-80 bg-card/50 backdrop-blur-sm flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <ActivityIcon className="w-5 h-5" />
            Activities
          </h2>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={onMarkAllAsRead}
              className="text-xs"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Mark all read
            </Button>
          </div>
        </div>


        {/* Status Filter */}
        <div className="flex gap-1">
          {(['all', 'unread', 'read'] as const).map((status) => (
            <Button
              key={status}
              size="sm"
              variant={statusFilter === status ? "default" : "ghost"}
              onClick={() => handleStatusFilterChange(status)}
              className="flex-1 text-xs capitalize"
            >
              {status === 'unread' && unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs mr-1 min-w-0 px-1">
                  {unreadCount}
                </Badge>
              )}
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Activity Types */}
      <div className="px-4 pb-4 space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Filter by Type</h3>
        <div className="space-y-1">
          {activityTypes.filter(t => t.count > 0).map((activityType) => (
            <Button
              key={activityType.type}
              variant={typeFilter === activityType.type ? "default" : "ghost"}
              size="sm"
              onClick={() => handleTypeFilterChange(activityType.type)}
              className="w-full justify-between text-xs"
            >
              <span>{activityType.label}</span>
              <Badge variant="outline" className="text-xs">
                {activityType.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>


      {/* Quick Stats */}
      <div className="p-4 border-t border-border/50 bg-background/20">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-foreground">
              {activities.length}
            </p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">
              {unreadCount}
            </p>
            <p className="text-xs text-muted-foreground">Unread</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
