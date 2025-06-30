import { useState, useEffect } from 'react';

import {
GitCommit, MessageCircle, Trash2, Upload, Download,
  GitBranch, GitMerge, Star, Tag, Edit3, Share,
  Eye, Archive, CheckCircle, XCircle, Clock,
  Filter, Search, Calendar, User, ChevronDown,
  MoreHorizontal, FileText, Image, Video, Music
} from 'lucide-react';
import { Button, Input, Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Separator, Avatar, AvatarFallback } from '../../shared';

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
  parents?: string[];
  children?: string[];
}

interface ActivitiesScreenProps {
  selectedActivity?: Activity | null;
  onActivitySelect?: (activity: Activity | null) => void;
}

export function ActivitiesScreen({ selectedActivity, onActivitySelect }: ActivitiesScreenProps) {
  // Organized activities in proper Git chronological order
  const [activities] = useState<Activity[]>([
    // Most recent at top
    {
      id: '1',
      type: 'commit',
      message: 'Refactors messaging and adds worker services',
      author: 'Andy Randriamarina',
      authorAvatar: 'AR',
      timestamp: '2h ago',
      date: 'Today',
      time: '3:13 AM',
      branch: 'develop',
      commitId: 'a1b2c3d',
      branchColor: '#10b981',
      lane: 1,
      parents: ['2'],
      children: []
    },
    {
      id: '2',
      type: 'merge',
      message: 'Merge feature/user-auth into develop',
      author: 'Sarah Chen',
      authorAvatar: 'SC',
      timestamp: '4h ago',
      date: 'Today',
      time: '1:45 PM',
      branch: 'develop',
      parentBranch: 'feature/user-auth',
      mergeTarget: 'develop',
      commitId: 'x9y8z7w',
      branchColor: '#10b981',
      lane: 1,
      parents: ['4', '3'],
      children: ['1']
    },
    {
      id: '3',
      type: 'commit',
      message: 'Add user authentication endpoints',
      author: 'Sarah Chen',
      authorAvatar: 'SC',
      timestamp: '6h ago',
      date: 'Today',
      time: '10:30 AM',
      branch: 'feature/user-auth',
      commitId: 'f1g2h3i',
      branchColor: '#8b5cf6',
      lane: 2,
      parents: ['6'],
      children: ['2']
    },
    {
      id: '4',
      type: 'commit',
      message: 'Improves Git commit reliability',
      author: 'Andy Randriamarina',
      authorAvatar: 'AR',
      timestamp: '1d ago',
      date: 'Yesterday',
      time: '11:55 PM',
      branch: 'develop',
      commitId: 'e4f5g6h',
      branchColor: '#10b981',
      lane: 1,
      parents: ['7'],
      children: ['2']
    },
    {
      id: '5',
      type: 'upload',
      message: 'Uploaded product images',
      author: 'Mike Johnson',
      authorAvatar: 'MJ',
      timestamp: '1d ago',
      date: 'Yesterday',
      time: '4:30 PM',
      assetName: 'product-lineup.jpg',
      assetType: 'image',
      branch: 'main',
      branchColor: '#3b82f6',
      lane: 0,
      parents: ['8'],
      children: []
    },
    {
      id: '6',
      type: 'branch',
      message: 'Created feature/user-auth from develop',
      author: 'Sarah Chen',
      authorAvatar: 'SC',
      timestamp: '2d ago',
      date: 'Jun 27',
      time: '9:00 AM',
      branch: 'feature/user-auth',
      parentBranch: 'develop',
      branchColor: '#8b5cf6',
      lane: 2,
      parents: ['7'],
      children: ['3']
    },
    {
      id: '7',
      type: 'commit',
      message: 'Refactors file service for versioning',
      author: 'Andy Randriamarina',
      authorAvatar: 'AR',
      timestamp: '2d ago',
      date: 'Jun 27',
      time: '7:18 PM',
      branch: 'develop',
      commitId: 'i7j8k9l',
      branchColor: '#10b981',
      lane: 1,
      parents: ['9'],
      children: ['4', '6']
    },
    {
      id: '8',
      type: 'merge',
      message: 'Merge hotfix/logo-fix into main',
      author: 'Lisa Wong',
      authorAvatar: 'LW',
      timestamp: '3d ago',
      date: 'Jun 26',
      time: '2:00 PM',
      branch: 'main',
      parentBranch: 'hotfix/logo-fix',
      mergeTarget: 'main',
      commitId: 'h3k5m7n',
      branchColor: '#3b82f6',
      lane: 0,
      parents: ['10', '9-hotfix'],
      children: ['5']
    },
    {
      id: '9-hotfix',
      type: 'commit',
      message: 'Fix logo display issue',
      author: 'Lisa Wong',
      authorAvatar: 'LW',
      timestamp: '3d ago',
      date: 'Jun 26',
      time: '1:30 PM',
      branch: 'hotfix/logo-fix',
      commitId: 'g2j4l6n',
      branchColor: '#ef4444',
      lane: 3,
      parents: ['10'],
      children: ['8']
    },
    {
      id: '9',
      type: 'merge',
      message: 'Merge main into develop',
      author: 'Andy Randriamarina',
      authorAvatar: 'AR',
      timestamp: '4d ago',
      date: 'Jun 25',
      time: '2:00 PM',
      branch: 'develop',
      parentBranch: 'main',
      mergeTarget: 'develop',
      commitId: 'm1n2o3p',
      branchColor: '#10b981',
      lane: 1,
      parents: ['10'],
      children: ['7']
    },
    {
      id: '10',
      type: 'tag',
      message: 'Tagged release v2.1.0 on main',
      author: 'Andy Randriamarina',
      authorAvatar: 'AR',
      timestamp: '4d ago',
      date: 'Jun 25',
      time: '1:30 PM',
      tag: 'v2.1.0',
      branch: 'main',
      branchColor: '#3b82f6',
      lane: 0,
      parents: [],
      children: ['8', '9', '9-hotfix']
    }
  ]);

  const [filteredActivities, setFilteredActivities] = useState<Activity[]>(activities);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterAuthor, setFilterAuthor] = useState<string>('all');

  // Set first activity as selected by default
  useEffect(() => {
    if (!selectedActivity && filteredActivities.length > 0) {
      onActivitySelect?.(filteredActivities[0]);
    }
  }, [selectedActivity, filteredActivities, onActivitySelect]);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'commit': return <GitCommit className="w-3 h-3 text-blue-400" />;
      case 'upload': return <Upload className="w-3 h-3 text-green-400" />;
      case 'comment': return <MessageCircle className="w-3 h-3 text-purple-400" />;
      case 'delete': return <Trash2 className="w-3 h-3 text-red-400" />;
      case 'edit': return <Edit3 className="w-3 h-3 text-orange-400" />;
      case 'merge': return <GitMerge className="w-3 h-3 text-cyan-400" />;
      case 'branch': return <GitBranch className="w-3 h-3 text-yellow-400" />;
      case 'tag': return <Tag className="w-3 h-3 text-pink-400" />;
      case 'share': return <Share className="w-3 h-3 text-indigo-400" />;
      case 'approve': return <CheckCircle className="w-3 h-3 text-green-400" />;
      case 'reject': return <XCircle className="w-3 h-3 text-red-400" />;
      case 'archive': return <Archive className="w-3 h-3 text-gray-400" />;
      case 'favorite': return <Star className="w-3 h-3 text-yellow-400" />;
      case 'view': return <Eye className="w-3 h-3 text-gray-400" />;
      default: return <Clock className="w-3 h-3 text-gray-400" />;
    }
  };

  const getBranchBadge = (activity: Activity) => {
    if (activity.tag) {
      return (
        <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30 text-xs">
          {activity.tag}
        </Badge>
      );
    }
    if (activity.branch) {
      return (
        <Badge className={`border text-xs ${
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
          {activity.branch}
        </Badge>
      );
    }
    return null;
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterActivities(term, filterType, filterAuthor);
  };

  const handleFilterType = (type: string) => {
    setFilterType(type);
    filterActivities(searchTerm, type, filterAuthor);
  };

  const handleFilterAuthor = (author: string) => {
    setFilterAuthor(author);
    filterActivities(searchTerm, filterType, author);
  };

  const filterActivities = (search: string, type: string, author: string) => {
    let filtered = activities;

    if (search) {
      filtered = filtered.filter(activity =>
        activity.message.toLowerCase().includes(search.toLowerCase()) ||
        activity.author.toLowerCase().includes(search.toLowerCase()) ||
        activity.assetName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (type !== 'all') {
      filtered = filtered.filter(activity => activity.type === type);
    }

    if (author !== 'all') {
      filtered = filtered.filter(activity => activity.author === author);
    }

    setFilteredActivities(filtered);
  };

  const handleActivityClick = (activity: Activity) => {
    onActivitySelect?.(activity);
  };

  const renderNetworkGraph = (activity: Activity, index: number) => {
    const laneWidth = 20;
    const centerY = 24;
    const currentLane = activity.lane || 0;
    const convergencePoint = 80; // Reduced from 96 to pull messages closer
    const dotX = 12 + currentLane * laneWidth;

    // Get previous and next activities in the filtered list
    const prevActivity = index > 0 ? filteredActivities[index - 1] : null;
    const nextActivity = index < filteredActivities.length - 1 ? filteredActivities[index + 1] : null;

    return (
      <div className="relative w-24 h-12 flex items-center justify-start">
        {/* SVG for drawing the git graph */}
        <svg
          className="absolute inset-0 w-full h-full overflow-visible"
          style={{ zIndex: 1 }}
          viewBox="0 0 96 48"
        >
          {/* Draw continuous vertical lines for all active lanes */}
          {[0, 1, 2, 3].map(lane => {
            const color = lane === 0 ? '#3b82f6' :
                         lane === 1 ? '#10b981' :
                         lane === 2 ? '#8b5cf6' : '#ef4444';
            const x = 12 + lane * laneWidth;

            // Check if this lane has activities in the current view
            const hasActivitiesInLane = filteredActivities.some(a => a.lane === lane);

            if (hasActivitiesInLane) {
              return (
                <line
                  key={`bg-lane-${lane}`}
                  x1={x}
                  y1={0}
                  x2={x}
                  y2={48}
                  stroke={color}
                  strokeWidth="2"
                  opacity="0.2"
                />
              );
            }
            return null;
          })}

          {/* Draw connection from previous activity */}
          {prevActivity && (
            <>
              {/* Check if current activity is in the previous activity's children */}
              {prevActivity.children?.includes(activity.id) ? (
                // Direct connection from previous activity
                (() => {
                  const prevLane = prevActivity.lane || 0;
                  const prevX = 12 + prevLane * laneWidth;
                  const prevColor = prevActivity.branchColor || '#6b7280';

                  if (prevLane === currentLane) {
                    // Same lane - straight line
                    return (
                      <line
                        key="prev-connection"
                        x1={prevX}
                        y1={0}
                        x2={dotX}
                        y2={centerY}
                        stroke={prevColor}
                        strokeWidth="2"
                        opacity="0.8"
                      />
                    );
                  } else {
                    // Different lane - curved line
                    return (
                      <path
                        key="prev-connection"
                        d={`M ${prevX} 0
                            Q ${prevX} ${centerY * 0.3}
                              ${dotX} ${centerY}`}
                        fill="none"
                        stroke={prevColor}
                        strokeWidth="2"
                        opacity="0.8"
                        strokeDasharray={activity.type === 'merge' ? '4,2' : '0'}
                      />
                    );
                  }
                })()
              ) : (
                // Continue the lane line from top if no direct connection
                currentLane === (prevActivity.lane || 0) && (
                  <line
                    key="lane-continuation"
                    x1={dotX}
                    y1={0}
                    x2={dotX}
                    y2={centerY}
                    stroke={activity.branchColor || '#6b7280'}
                    strokeWidth="2"
                    opacity="0.6"
                  />
                )
              )}
            </>
          )}

          {/* Draw merge lines from all parent activities */}
          {activity.type === 'merge' && activity.parents && activity.parents.length > 1 && (
            <>
              {activity.parents.map((parentId, idx) => {
                const parent = activities.find(a => a.id === parentId);
                if (parent && parent.lane !== currentLane) {
                  const parentLane = parent.lane || 0;
                  const parentX = 12 + parentLane * laneWidth;
                  const parentColor = parent.branchColor || '#6b7280';

                  return (
                    <path
                      key={`merge-${idx}`}
                      d={`M ${parentX} 0
                          Q ${parentX} ${centerY * 0.3}
                            ${dotX} ${centerY}`}
                      fill="none"
                      stroke={parentColor}
                      strokeWidth="2"
                      opacity="0.8"
                      strokeDasharray="4,2"
                    />
                  );
                }
                return null;
              })}
            </>
          )}

          {/* Draw connection to next activity */}
          {nextActivity && (
            <>
              {/* Check if next activity is in current activity's children */}
              {activity.children?.includes(nextActivity.id) ? (
                // Direct connection to next activity
                (() => {
                  const nextLane = nextActivity.lane || 0;
                  const nextX = 12 + nextLane * laneWidth;
                  const currentColor = activity.branchColor || '#6b7280';

                  if (nextLane === currentLane) {
                    // Same lane - straight line
                    return (
                      <line
                        key="next-connection"
                        x1={dotX}
                        y1={centerY}
                        x2={nextX}
                        y2={48}
                        stroke={currentColor}
                        strokeWidth="2"
                        opacity="0.8"
                      />
                    );
                  } else if (activity.type === 'branch') {
                    // Branch creation - curved line to new lane
                    return (
                      <path
                        key="next-connection"
                        d={`M ${dotX} ${centerY}
                            Q ${dotX} ${centerY + 10}
                              ${nextX} ${48}`}
                        fill="none"
                        stroke={nextActivity.branchColor || currentColor}
                        strokeWidth="2"
                        opacity="0.8"
                      />
                    );
                  }
                  return null;
                })()
              ) : (
                // Continue the lane line down if no direct connection
                currentLane === (nextActivity.lane || 0) && (
                  <line
                    key="lane-continuation-down"
                    x1={dotX}
                    y1={centerY}
                    x2={dotX}
                    y2={48}
                    stroke={activity.branchColor || '#6b7280'}
                    strokeWidth="2"
                    opacity="0.6"
                  />
                )
              )}
            </>
          )}

          {/* Convergence line - from dot to convergence point (shorter now) */}
          <line
            x1={dotX}
            y1={centerY}
            x2={convergencePoint}
            y2={centerY}
            stroke={activity.branchColor || '#6b7280'}
            strokeWidth="2"
            opacity="0.4"
            strokeDasharray="1,2"
          />
        </svg>

        {/* Activity dots positioned according to their lane */}
        <div
          className={`absolute z-10 w-4 h-4 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
            selectedActivity?.id === activity.id
              ? 'scale-125 shadow-lg ring-2 ring-white/50'
              : 'hover:scale-110'
          }`}
          style={{
            left: `${dotX - 8}px`,
            top: `${centerY - 8}px`,
            backgroundColor: activity.branchColor || '#6b7280',
            borderColor: '#1a1d29'
          }}
          onClick={() => handleActivityClick(activity)}
        >
          {activity.type === 'merge' ? (
            <GitMerge className="w-2 h-2 text-white" />
          ) : activity.type === 'branch' ? (
            <GitBranch className="w-2 h-2 text-white" />
          ) : activity.type === 'tag' ? (
            <Tag className="w-2 h-2 text-white" />
          ) : (
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-[#1a1d29] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#373a4b]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl text-white mb-1">Activities</h1>
            <p className="text-sm text-gray-400">Git-style branch history and activity timeline</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Calendar className="w-3 h-3 mr-1" />
              Range
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <Download className="w-3 h-3 mr-1" />
              Export
            </Button>
          </div>
        </div>

        {/* Compact Filters */}
        <div className="flex items-center space-x-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-7 h-8 text-xs bg-[#2a2d3a] border-[#373a4b] text-white"
            />
          </div>

          <Select value={filterType} onValueChange={handleFilterType}>
            <SelectTrigger className="w-24 h-8 bg-[#2a2d3a] border-[#373a4b] text-white text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="commit">Commits</SelectItem>
              <SelectItem value="upload">Uploads</SelectItem>
              <SelectItem value="merge">Merges</SelectItem>
              <SelectItem value="branch">Branches</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterAuthor} onValueChange={handleFilterAuthor}>
            <SelectTrigger className="w-32 h-8 bg-[#2a2d3a] border-[#373a4b] text-white text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Authors</SelectItem>
              <SelectItem value="Andy Randriamarina">Andy R.</SelectItem>
              <SelectItem value="Sarah Chen">Sarah C.</SelectItem>
              <SelectItem value="Mike Johnson">Mike J.</SelectItem>
              <SelectItem value="Lisa Wong">Lisa W.</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Branch Legend */}
      <div className="px-4 py-2 bg-[#1f2029] border-b border-[#373a4b] flex items-center space-x-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-gray-400">main</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-400">develop</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span className="text-gray-400">feature/*</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-gray-400">hotfix/*</span>
        </div>
      </div>

      {/* Compact Table Header */}
      <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-[#1f2029] border-b border-[#373a4b] text-xs text-gray-400">
        <div className="col-span-2">GRAPH</div>
        <div className="col-span-4">MESSAGE</div>
        <div className="col-span-2">BRANCH</div>
        <div className="col-span-2">AUTHOR</div>
        <div className="col-span-2">DATE</div>
      </div>

      {/* Activities List */}
      <div className="flex-1 overflow-y-auto">
        {filteredActivities.map((activity, index) => (
          <div
            key={activity.id}
            onClick={() => handleActivityClick(activity)}
            className={`grid grid-cols-12 gap-2 px-4 py-3 border-b border-[#373a4b]/30 hover:bg-[#2a2d3a]/30 transition-colors cursor-pointer text-xs ${
              selectedActivity?.id === activity.id ? 'bg-blue-500/10 border-blue-500/30' : ''
            }`}
          >
            {/* Network Graph - Reduced width */}
            <div className="col-span-2 flex items-center">
              {renderNetworkGraph(activity, index)}
            </div>

            {/* Message - Increased width and aligned close to graph */}
            <div className="col-span-4 flex items-center min-w-0 -ml-2">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                {getActivityIcon(activity.type)}
                <div className="min-w-0 flex-1">
                  <div className="text-white truncate text-sm">{activity.message}</div>
                  {activity.commitId && (
                    <code className="text-xs bg-[#373a4b] text-gray-300 px-1 rounded mt-1 inline-block">
                      {activity.commitId}
                    </code>
                  )}
                </div>
              </div>
            </div>

            {/* Branch */}
            <div className="col-span-2 flex items-center">
              {getBranchBadge(activity)}
            </div>

            {/* Author */}
            <div className="col-span-2 flex items-center">
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                    {activity.authorAvatar}
                  </AvatarFallback>
                </Avatar>
                <span className="text-gray-300 truncate text-sm">{activity.author.split(' ')[0]}</span>
              </div>
            </div>

            {/* Date - New format */}
            <div className="col-span-2 flex items-center text-gray-400">
              <div className="text-right">
                <div className="text-sm text-white">{activity.date}</div>
                <div className="text-xs text-gray-500">{activity.time}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Compact Footer */}
      <div className="px-4 py-2 bg-[#1f2029] border-t border-[#373a4b] text-xs text-gray-400">
        {filteredActivities.length} activities • {activities.filter(a => a.type === 'commit').length} commits • {activities.filter(a => a.type === 'merge').length} merges
      </div>
    </div>
  );
}
