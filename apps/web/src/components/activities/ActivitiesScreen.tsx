"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Search,
  Filter,
  Calendar,
  User,
  GitCommit,
  GitBranch,
  GitMerge,
  Upload,
  Download,
  MessageSquare,
  Eye,
  Star,
  Tag,
  FolderPlus,
  FileText,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  BarChart3,
  Users,
  Zap,
  Settings,
  ArrowRight,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/button';
import { Badge } from '@/components/badge';
import { Input } from '@/components/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';
import { Separator } from '@/components/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar';
import { cn } from '@/lib/utils';

interface ActivityItem {
  id: string;
  type: 'commit' | 'upload' | 'download' | 'comment' | 'review' | 'approve' | 'reject' |
        'merge' | 'branch_create' | 'branch_delete' | 'tag_create' | 'release' |
        'folder_create' | 'asset_edit' | 'asset_delete' | 'permission_change' | 'login';
  title: string;
  description: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    role: string;
  };
  timestamp: string;
  relativeTime: string;
  metadata?: {
    repository?: string;
    branch?: string;
    asset?: string;
    commit?: string;
    pullRequest?: string;
    release?: string;
    changes?: {
      additions: number;
      deletions: number;
      files: number;
    };
    target?: string;
    source?: string;
    size?: number;
    duration?: string;
  };
  isImportant: boolean;
  tags: string[];
}

interface ActivityStats {
  totalActivities: number;
  todayActivities: number;
  weekActivities: number;
  monthActivities: number;
  topUsers: Array<{
    user: string;
    count: number;
    avatar: string;
  }>;
  topActions: Array<{
    action: string;
    count: number;
  }>;
}

const mockActivities: ActivityItem[] = [
  // Recent main branch activity
  {
    id: '1',
    type: 'merge',
    title: 'Merged feature/q4-brand-assets into main',
    description: 'Successfully merged Q4 brand assets with updated color palette and logo variations',
    user: {
      id: 'sarah',
      name: 'Sarah Chen',
      username: 'sarahc',
      avatar: '/avatars/sarah.png',
      role: 'Design Lead'
    },
    timestamp: '2024-01-15T16:30:00Z',
    relativeTime: '30 minutes ago',
    metadata: {
      repository: 'filehunt-assets',
      branch: 'main',
      source: 'feature/q4-brand-assets',
      target: 'main',
      pullRequest: '#45',
      changes: {
        additions: 89,
        deletions: 23,
        files: 12
      }
    },
    isImportant: true,
    tags: ['merge', 'brand']
  },
  // Feature branch work before merge
  {
    id: '2',
    type: 'commit',
    title: 'Final polish on brand guidelines',
    description: 'Updated typography specs and added usage examples for the new brand system',
    user: {
      id: 'sarah',
      name: 'Sarah Chen',
      username: 'sarahc',
      avatar: '/avatars/sarah.png',
      role: 'Design Lead'
    },
    timestamp: '2024-01-15T15:45:00Z',
    relativeTime: '1 hour ago',
    metadata: {
      repository: 'filehunt-assets',
      branch: 'feature/q4-brand-assets',
      commit: 'f9e8d7c',
      changes: {
        additions: 34,
        deletions: 8,
        files: 6
      }
    },
    isImportant: false,
    tags: ['brand', 'design']
  },
  {
    id: '3',
    type: 'upload',
    title: 'Added new logo variations',
    description: 'Uploaded SVG and PNG versions of logo for different use cases and sizes',
    user: {
      id: 'sarah',
      name: 'Sarah Chen',
      username: 'sarahc',
      avatar: '/avatars/sarah.png',
      role: 'Design Lead'
    },
    timestamp: '2024-01-15T14:20:00Z',
    relativeTime: '2 hours ago',
    metadata: {
      repository: 'filehunt-assets',
      branch: 'feature/q4-brand-assets',
      asset: 'logo-variations-batch',
      size: 2456789,
      changes: {
        additions: 18,
        deletions: 0,
        files: 18
      }
    },
    isImportant: false,
    tags: ['logo', 'upload']
  },
  // Main branch commit after merge
  {
    id: '4',
    type: 'commit',
    title: 'Updated version to v2.1.0',
    description: 'Bumped package version and updated changelog for Q4 brand assets release',
    user: {
      id: 'sarah',
      name: 'Sarah Chen',
      username: 'sarahc',
      avatar: '/avatars/sarah.png',
      role: 'Design Lead'
    },
    timestamp: '2024-01-15T14:00:00Z',
    relativeTime: '3 hours ago',
    metadata: {
      repository: 'filehunt-assets',
      branch: 'main',
      commit: 'a1b2c3d',
      changes: {
        additions: 12,
        deletions: 4,
        files: 3
      }
    },
    isImportant: false,
    tags: ['version', 'release']
  },
  // Hotfix branch created from main
  {
    id: '5',
    type: 'branch_create',
    title: 'Created hotfix/urgent-logo-fix',
    description: 'Emergency branch to fix logo scaling issue discovered in production',
    user: {
      id: 'david',
      name: 'David Kim',
      username: 'davidk',
      avatar: '/avatars/david.png',
      role: 'Developer'
    },
    timestamp: '2024-01-15T13:30:00Z',
    relativeTime: '3 hours ago',
    metadata: {
      repository: 'filehunt-assets',
      branch: 'hotfix/urgent-logo-fix',
      source: 'main'
    },
    isImportant: true,
    tags: ['hotfix', 'urgent']
  },
  // Work on hotfix branch
  {
    id: '6',
    type: 'commit',
    title: 'Fixed logo scaling on mobile devices',
    description: 'Corrected SVG viewBox and added responsive scaling for mobile screens',
    user: {
      id: 'david',
      name: 'David Kim',
      username: 'davidk',
      avatar: '/avatars/david.png',
      role: 'Developer'
    },
    timestamp: '2024-01-15T13:15:00Z',
    relativeTime: '3.5 hours ago',
    metadata: {
      repository: 'filehunt-assets',
      branch: 'hotfix/urgent-logo-fix',
      commit: 'h7g6f5e',
      changes: {
        additions: 15,
        deletions: 8,
        files: 4
      }
    },
    isImportant: true,
    tags: ['fix', 'mobile']
  },
  // Hotfix merged back to main
  {
    id: '7',
    type: 'merge',
    title: 'Merged hotfix/urgent-logo-fix into main',
    description: 'Emergency logo fix deployed to production successfully',
    user: {
      id: 'david',
      name: 'David Kim',
      username: 'davidk',
      avatar: '/avatars/david.png',
      role: 'Developer'
    },
    timestamp: '2024-01-15T12:45:00Z',
    relativeTime: '4 hours ago',
    metadata: {
      repository: 'filehunt-assets',
      branch: 'main',
      source: 'hotfix/urgent-logo-fix',
      target: 'main',
      pullRequest: '#44',
      changes: {
        additions: 15,
        deletions: 8,
        files: 4
      }
    },
    isImportant: true,
    tags: ['merge', 'hotfix']
  },
  // Another feature branch created earlier
  {
    id: '8',
    type: 'branch_create',
    title: 'Created feature/product-photography',
    description: 'New branch for organizing and optimizing product photography assets',
    user: {
      id: 'mike',
      name: 'Mike Johnson',
      username: 'mikej',
      avatar: '/avatars/mike.png',
      role: 'Photographer'
    },
    timestamp: '2024-01-15T10:30:00Z',
    relativeTime: '6 hours ago',
    metadata: {
      repository: 'filehunt-assets',
      branch: 'feature/product-photography',
      source: 'main'
    },
    isImportant: false,
    tags: ['photography', 'products']
  },
  // Work on product photography branch
  {
    id: '9',
    type: 'upload',
    title: 'Batch upload of winter collection photos',
    description: 'Added 32 high-resolution product images for the new winter collection launch',
    user: {
      id: 'mike',
      name: 'Mike Johnson',
      username: 'mikej',
      avatar: '/avatars/mike.png',
      role: 'Photographer'
    },
    timestamp: '2024-01-15T09:45:00Z',
    relativeTime: '7 hours ago',
    metadata: {
      repository: 'filehunt-assets',
      branch: 'feature/product-photography',
      asset: 'winter-collection-photos',
      size: 245760000,
      changes: {
        additions: 32,
        deletions: 0,
        files: 32
      }
    },
    isImportant: false,
    tags: ['photography', 'winter']
  },
  {
    id: '10',
    type: 'commit',
    title: 'Optimized image compression settings',
    description: 'Applied new compression algorithm to reduce file sizes while maintaining quality',
    user: {
      id: 'mike',
      name: 'Mike Johnson',
      username: 'mikej',
      avatar: '/avatars/mike.png',
      role: 'Photographer'
    },
    timestamp: '2024-01-15T09:15:00Z',
    relativeTime: '7.5 hours ago',
    metadata: {
      repository: 'filehunt-assets',
      branch: 'feature/product-photography',
      commit: 'p9o8i7u',
      changes: {
        additions: 23,
        deletions: 15,
        files: 8
      }
    },
    isImportant: false,
    tags: ['optimization', 'performance']
  },
  // Main branch activity from yesterday
  {
    id: '11',
    type: 'release',
    title: 'Released v2.0.5 - Performance Update',
    description: 'Minor release with performance improvements and bug fixes',
    user: {
      id: 'sarah',
      name: 'Sarah Chen',
      username: 'sarahc',
      avatar: '/avatars/sarah.png',
      role: 'Design Lead'
    },
    timestamp: '2024-01-14T16:00:00Z',
    relativeTime: '1 day ago',
    metadata: {
      repository: 'filehunt-assets',
      branch: 'main',
      release: 'v2.0.5',
      changes: {
        additions: 67,
        deletions: 34,
        files: 18
      }
    },
    isImportant: true,
    tags: ['release', 'performance']
  },
  // Experimental branch for A/B testing
  {
    id: '12',
    type: 'branch_create',
    title: 'Created experiment/new-color-palette',
    description: 'Experimental branch to test alternative color schemes for user feedback',
    user: {
      id: 'lisa',
      name: 'Lisa Wong',
      username: 'lisaw',
      avatar: '/avatars/lisa.png',
      role: 'Creative Director'
    },
    timestamp: '2024-01-14T14:30:00Z',
    relativeTime: '1 day ago',
    metadata: {
      repository: 'filehunt-assets',
      branch: 'experiment/new-color-palette',
      source: 'main'
    },
    isImportant: false,
    tags: ['experiment', 'colors']
  },
  {
    id: '13',
    type: 'commit',
    title: 'Added variant color schemes',
    description: 'Created 3 alternative color palettes for A/B testing with focus groups',
    user: {
      id: 'lisa',
      name: 'Lisa Wong',
      username: 'lisaw',
      avatar: '/avatars/lisa.png',
      role: 'Creative Director'
    },
    timestamp: '2024-01-14T13:45:00Z',
    relativeTime: '1 day ago',
    metadata: {
      repository: 'filehunt-assets',
      branch: 'experiment/new-color-palette',
      commit: 'x1w2e3r',
      changes: {
        additions: 45,
        deletions: 0,
        files: 9
      }
    },
    isImportant: false,
    tags: ['colors', 'testing']
  }
];

const mockStats: ActivityStats = {
  totalActivities: 247,
  todayActivities: 12,
  weekActivities: 89,
  monthActivities: 247,
  topUsers: [
    { user: 'Sarah Chen', count: 45, avatar: '/avatars/sarah.png' },
    { user: 'Mike Johnson', count: 38, avatar: '/avatars/mike.png' },
    { user: 'David Kim', count: 32, avatar: '/avatars/david.png' },
    { user: 'Lisa Wong', count: 28, avatar: '/avatars/lisa.png' }
  ],
  topActions: [
    { action: 'Commits', count: 89 },
    { action: 'Uploads', count: 56 },
    { action: 'Reviews', count: 34 },
    { action: 'Downloads', count: 68 }
  ]
};

export function ActivitiesScreen() {
  const [activeTab, setActiveTab] = useState('timeline');
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [timeRange, setTimeRange] = useState('all');

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'commit': return GitCommit;
      case 'upload': return Upload;
      case 'download': return Download;
      case 'comment': return MessageSquare;
      case 'review': return Eye;
      case 'approve': return CheckCircle;
      case 'reject': return XCircle;
      case 'merge': return GitMerge;
      case 'branch_create': return GitBranch;
      case 'branch_delete': return GitBranch;
      case 'tag_create': return Tag;
      case 'release': return Tag;
      case 'folder_create': return FolderPlus;
      case 'asset_edit': return Edit;
      case 'asset_delete': return Trash2;
      case 'permission_change': return Settings;
      case 'login': return User;
      default: return Activity;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'commit': return 'text-blue-500';
      case 'upload': return 'text-green-500';
      case 'download': return 'text-cyan-500';
      case 'comment': return 'text-purple-500';
      case 'review': return 'text-orange-500';
      case 'approve': return 'text-green-600';
      case 'reject': return 'text-red-600';
      case 'merge': return 'text-emerald-500';
      case 'branch_create': return 'text-blue-600';
      case 'branch_delete': return 'text-red-500';
      case 'tag_create': return 'text-yellow-600';
      case 'release': return 'text-purple-600';
      case 'folder_create': return 'text-indigo-500';
      case 'asset_edit': return 'text-amber-500';
      case 'asset_delete': return 'text-red-500';
      case 'permission_change': return 'text-gray-600';
      case 'login': return 'text-blue-400';
      default: return 'text-gray-500';
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const filteredActivities = mockActivities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.user.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'all' || activity.type === filterType;
    const matchesUser = filterUser === 'all' || activity.user.id === filterUser;

    return matchesSearch && matchesType && matchesUser;
  });

  return (
    <div className="h-full relative">
      {/* Main Content */}
      <div className="h-full pr-64"> {/* Add right padding for sidebar */}
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">Activities</h1>
                <p className="text-muted-foreground">Track all repository activities and changes</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Activity Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="commit">Commits</SelectItem>
                  <SelectItem value="upload">Uploads</SelectItem>
                  <SelectItem value="download">Downloads</SelectItem>
                  <SelectItem value="review">Reviews</SelectItem>
                  <SelectItem value="merge">Merges</SelectItem>
                  <SelectItem value="release">Releases</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterUser} onValueChange={setFilterUser}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="User" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="sarah">Sarah Chen</SelectItem>
                  <SelectItem value="mike">Mike Johnson</SelectItem>
                  <SelectItem value="david">David Kim</SelectItem>
                  <SelectItem value="lisa">Lisa Wong</SelectItem>
                </SelectContent>
              </Select>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Activity Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Timeline Tab */}
            <TabsContent value="timeline" className="p-0">
              {/* Table Header */}
              <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border/30">
                <div className="grid grid-cols-10 gap-4 p-4 text-sm font-medium text-muted-foreground">
                  <div className="col-span-1">Graph</div>
                  <div className="col-span-5">Activity</div>
                  <div className="col-span-2">User</div>
                  <div className="col-span-1">Time</div>
                  <div className="col-span-1">Tags</div>
                </div>
              </div>

              {/* Activity Rows */}
              <div>
                {filteredActivities.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type);
                  const isFirst = index === 0;
                  const isLast = index === filteredActivities.length - 1;
                  const nextActivity = filteredActivities[index + 1];
                  const prevActivity = filteredActivities[index - 1];

                  // Determine branch level based on activity type and metadata
                  const getBranchLevel = (act: ActivityItem) => {
                    if (act.type === 'merge') return 0; // Main branch
                    if (act.type === 'branch_create') return 1; // Feature branch
                    if (act.metadata?.branch === 'main') return 0;
                    if (act.metadata?.branch?.includes('feature/')) return 1;
                    if (act.metadata?.branch?.includes('hotfix/')) return 2;
                    return 0;
                  };

                  const currentLevel = getBranchLevel(activity);
                  const nextLevel = nextActivity ? getBranchLevel(nextActivity) : 0;
                  const prevLevel = prevActivity ? getBranchLevel(prevActivity) : 0;

                  // Determine connection type
                  const getConnectionType = () => {
                    if (activity.type === 'merge') return 'merge';
                    if (activity.type === 'branch_create') return 'branch';
                    if (currentLevel !== nextLevel) return 'level-change';
                    return 'straight';
                  };

                  const connectionType = getConnectionType();

                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className={cn(
                        "grid grid-cols-10 gap-4 p-4 hover:bg-muted/20 cursor-pointer transition-colors relative group",
                        selectedActivity?.id === activity.id && "bg-primary/5 border-l-2 border-l-primary"
                      )}
                      onClick={() => setSelectedActivity(activity)}
                    >
                      {/* Graph Column - GitKraken style */}
                      <div className="col-span-1 flex items-center justify-start relative">
                        {/* Connection lines */}
                        <div className="absolute inset-0 flex items-center">
                          {/* Vertical line from previous */}
                          {!isFirst && (
                            <div
                              className="absolute bg-border/60"
                              style={{
                                left: `${8 + prevLevel * 16}px`,
                                top: '0',
                                width: '2px',
                                height: '50%'
                              }}
                            />
                          )}

                          {/* Vertical line to next */}
                          {!isLast && (
                            <div
                              className="absolute bg-border/60"
                              style={{
                                left: `${8 + currentLevel * 16}px`,
                                bottom: '0',
                                width: '2px',
                                height: '50%'
                              }}
                            />
                          )}

                          {/* Horizontal connection for merges */}
                          {connectionType === 'merge' && currentLevel > 0 && (
                            <div
                              className="absolute bg-border/60"
                              style={{
                                left: `${8}px`,
                                top: '50%',
                                width: `${currentLevel * 16}px`,
                                height: '2px',
                                transform: 'translateY(-1px)'
                              }}
                            />
                          )}

                          {/* Branch creation line */}
                          {connectionType === 'branch' && (
                            <div
                              className="absolute bg-border/60"
                              style={{
                                left: `${8}px`,
                                top: '50%',
                                width: `${currentLevel * 16}px`,
                                height: '2px',
                                transform: 'translateY(-1px)'
                              }}
                            />
                          )}

                          {/* Level change connection */}
                          {connectionType === 'level-change' && currentLevel !== nextLevel && (
                            <>
                              <div
                                className="absolute bg-border/60"
                                style={{
                                  left: `${8 + Math.min(currentLevel, nextLevel) * 16}px`,
                                  top: '50%',
                                  width: `${Math.abs(currentLevel - nextLevel) * 16}px`,
                                  height: '2px',
                                  transform: 'translateY(-1px)'
                                }}
                              />
                            </>
                          )}
                        </div>

                        {/* Activity node */}
                        <div
                          className={cn(
                            "relative z-10 w-4 h-4 rounded-full border-2 flex items-center justify-center",
                            "bg-background border-border",
                            connectionType === 'merge' && "bg-green-500 border-green-500",
                            connectionType === 'branch' && "bg-blue-500 border-blue-500",
                            activity.isImportant && "border-primary"
                          )}
                          style={{
                            marginLeft: `${currentLevel * 16}px`
                          }}
                        >
                          {activity.isImportant && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          )}
                        </div>

                        {/* Activity type indicator */}
                        <div
                          className={cn(
                            "ml-2 w-6 h-6 rounded-sm flex items-center justify-center bg-muted/30"
                          )}
                        >
                          <Icon className={cn(
                            "w-3 h-3",
                            getActivityColor(activity.type)
                          )} />
                        </div>
                      </div>

                      {/* Activity Column */}
                      <div className="col-span-5 flex flex-col justify-center min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-sm truncate">
                            {activity.title}
                          </h3>
                          {activity.isImportant && (
                            <Badge variant="outline" className="text-xs border-primary text-primary">important</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {activity.description}
                        </p>
                      </div>

                      {/* User Column */}
                      <div className="col-span-2 flex items-center space-x-2 min-w-0">
                        <Avatar className="w-6 h-6 flex-shrink-0">
                          <AvatarImage src={activity.user.avatar} />
                          <AvatarFallback className="text-xs">{activity.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{activity.user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{activity.user.role}</p>
                        </div>
                      </div>

                      {/* Time Column */}
                      <div className="col-span-1 flex flex-col justify-center">
                        <p className="text-sm">{activity.relativeTime}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Tags Column */}
                      <div className="col-span-1 flex items-center">
                        <div className="flex flex-wrap gap-1">
                          {activity.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                              {tag}
                            </Badge>
                          ))}
                          {activity.tags.length > 2 && (
                            <span className="text-xs text-muted-foreground">+{activity.tags.length - 2}</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Analytics Tab - Combined Analytics & Insights */}
            <TabsContent value="analytics" className="p-6 space-y-6 h-full">
              <div className="w-full space-y-6">
                {/* Statistics Overview - 4 columns that fill the width */}
                <div className="grid grid-cols-4 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Total Activities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{mockStats.totalActivities}</div>
                      <p className="text-sm text-muted-foreground">All time</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>This Week</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{mockStats.weekActivities}</div>
                      <p className="text-sm text-muted-foreground">+12% from last week</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{mockStats.todayActivities}</div>
                      <p className="text-sm text-muted-foreground">Active contributors</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Peak Hour</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">2-3 PM</div>
                      <p className="text-sm text-muted-foreground">Most active time</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Main Analytics Row - 4 columns for better horizontal usage */}
                <div className="grid grid-cols-4 gap-6 w-full">
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>Activity Breakdown</CardTitle>
                      <CardDescription>By activity type</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {mockStats.topActions.map((action, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm">{action.action}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 h-2 bg-muted rounded-full">
                                <div
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${(action.count / Math.max(...mockStats.topActions.map(a => a.count))) * 100}%` }}
                                />
                              </div>
                              <span className="text-xs font-medium">{action.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>Top Contributors</CardTitle>
                      <CardDescription>Most active users</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {mockStats.topUsers.map((user, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground w-3">#{index + 1}</span>
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback className="text-xs">{user.user.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm flex-1 truncate">{user.user}</span>
                            <Badge variant="secondary" className="text-xs">{user.count}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>Activity Trends</CardTitle>
                      <CardDescription>Weekly comparison</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48 flex items-center justify-center text-muted-foreground">
                        <TrendingUp className="w-6 h-6 mr-2" />
                        <span className="text-sm">Chart placeholder</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>Team Insights</CardTitle>
                      <CardDescription>Collaboration metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Reviews</span>
                          <Badge className="text-xs">High</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Response</span>
                          <Badge variant="secondary" className="text-xs">2.3h</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Score</span>
                          <Badge variant="outline" className="text-xs">85%</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Velocity</span>
                          <Badge variant="outline" className="text-xs">+15%</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Fixed position, starts below main header */}
      <div className="fixed right-0 w-64 flex flex-col" style={{ top: '100px', bottom: '0' }}>
        {/* Header section aligned with main content */}
        {/* <div className="px-6 py-4">
          <h3 className="font-semibold">Activity Details</h3>
        </div> */}

        <div className="px-6 pb-4 flex-1 overflow-auto">

          {selectedActivity ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">{selectedActivity.title}</h4>
                <p className="text-sm text-muted-foreground">{selectedActivity.description}</p>
              </div>

              <Separator />

              {/* User Information */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedActivity.user.avatar} />
                    <AvatarFallback>{selectedActivity.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedActivity.user.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedActivity.user.role}</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Time</span>
                  <span>{selectedActivity.relativeTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Type</span>
                  <Badge variant="outline" className="text-xs">{selectedActivity.type}</Badge>
                </div>
              </div>

              <Separator />

              {/* Metadata */}
              {selectedActivity.metadata && (
                <div>
                  <h5 className="font-medium mb-2">Details</h5>
                  <div className="space-y-2">
                    {selectedActivity.metadata.repository && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Repository</span>
                        <span>{selectedActivity.metadata.repository}</span>
                      </div>
                    )}
                    {selectedActivity.metadata.branch && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Branch</span>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          {selectedActivity.metadata.branch}
                        </code>
                      </div>
                    )}
                    {selectedActivity.metadata.commit && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Commit</span>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          {selectedActivity.metadata.commit}
                        </code>
                      </div>
                    )}
                    {selectedActivity.metadata.changes && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Changes</span>
                          <div className="space-x-2">
                            <span className="text-green-600">+{selectedActivity.metadata.changes.additions}</span>
                            <span className="text-red-600">-{selectedActivity.metadata.changes.deletions}</span>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Files</span>
                          <span>{selectedActivity.metadata.changes.files}</span>
                        </div>
                      </>
                    )}
                    {selectedActivity.metadata.size && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Size</span>
                        <span>{formatFileSize(selectedActivity.metadata.size)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Separator />

              {/* Tags */}
              <div>
                <h5 className="font-medium mb-2">Tags</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedActivity.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Add Comment
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Star className="w-4 h-4 mr-2" />
                  Mark Important
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-100 text-muted-foreground">
              <div className="text-center">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Select an activity to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
