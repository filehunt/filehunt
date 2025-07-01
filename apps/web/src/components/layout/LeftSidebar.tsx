import { useState } from 'react';

import {
  Folder, ChevronRight, ChevronDown, Plus, SquareDashedMousePointer, Play,
  Mic, MessageCircle, GitBranch, Image, LayoutGrid, Star,
  Settings, HelpCircle, Tag, X, Trash2, GitMerge, FolderOpen,
  ImageIcon, Video, Music, MessageSquare, CheckCircle, Sparkles,
  MoreHorizontal
} from 'lucide-react';
import { Button, Badge } from '@filehunt/shared-ts/ui';

interface BranchInfo {
  name: string;
  commits: number;
  lastActivity: string;
  isActive: boolean;
}

interface AssetFolder {
  name: string;
  count: number;
  hasSubfolders?: boolean;
  isExpanded?: boolean;
}

interface CollectionInfo {
  name: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  type: 'tag' | 'filter' | 'status' | 'media' | 'action';
}

interface RecentActivity {
  id: string;
  type: 'upload' | 'edit' | 'comment' | 'approval';
  message: string;
  timestamp: string;
  user?: string;
}

export function LeftSidebar() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    assets: true,
    collections: true,
    branches: true,
    tags: true,
    recent: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const branches: BranchInfo[] = [
    { name: 'main', commits: 247, lastActivity: '2 hours ago', isActive: true },
    { name: 'feature/rebrand', commits: 12, lastActivity: '1 day ago', isActive: false },
    { name: 'hotfix/logo-fix', commits: 3, lastActivity: '3 days ago', isActive: false }
  ];

  const assetFolders: AssetFolder[] = [
    { name: 'All Assets', count: 1247 },
    { name: 'Episodes', count: 156, hasSubfolders: true },
    { name: 'Key Scenes', count: 89, hasSubfolders: true, isExpanded: true },
    { name: 'Talent', count: 234, hasSubfolders: true },
    { name: 'Location', count: 67, hasSubfolders: true }
  ];

  const collections: CollectionInfo[] = [
    { name: 'Tagged', count: 234, icon: Tag, type: 'tag' },
    { name: 'Untagged', count: 45, icon: X, type: 'tag' },
    { name: 'Trash', count: 12, icon: Trash2, type: 'filter' },
    { name: 'Needs Retouching', count: 8, icon: Sparkles, type: 'status' },
    { name: 'Videos', count: 156, icon: Video, type: 'media' },
    { name: 'Images', count: 423, icon: ImageIcon, type: 'media' },
    { name: 'Audio', count: 67, icon: Music, type: 'media' },
    { name: 'Needs Review', count: 23, icon: MessageSquare, type: 'status' },
    { name: 'Approved', count: 189, icon: CheckCircle, type: 'status' }
  ];

  const tags = [
    { name: 'logo', count: 45 },
    { name: 'brand', count: 123 },
    { name: 'product', count: 67 },
    { name: 'marketing', count: 89 },
    { name: 'social', count: 34 },
    { name: 'print', count: 56 }
  ];

  const recentActivity: RecentActivity[] = [
    { id: '1', type: 'upload', message: 'New product photos uploaded', timestamp: '2 min ago', user: 'Sarah Chen' },
    { id: '2', type: 'comment', message: 'Comment on logo-v3.png', timestamp: '15 min ago', user: 'Mike Johnson' },
    { id: '3', type: 'approval', message: 'Brand guidelines approved', timestamp: '1 hour ago', user: 'Lisa Wong' },
    { id: '4', type: 'edit', message: 'Updated banner-hero.jpg metadata', timestamp: '2 hours ago', user: 'David Kim' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload': return <Plus className="w-3 h-3 text-blue-400" />;
      case 'comment': return <MessageCircle className="w-3 h-3 text-green-400" />;
      case 'approval': return <Play className="w-3 h-3 text-purple-400" />;
      case 'edit': return <SquareDashedMousePointer className="w-3 h-3 text-orange-400" />;
    }
  };

  const getCollectionIconColor = (type: CollectionInfo['type'], name: string) => {
    switch (type) {
      case 'tag':
        return name === 'Tagged' ? 'text-blue-400' : 'text-gray-400';
      case 'filter':
        return name === 'Trash' ? 'text-red-400' : 'text-gray-400';
      case 'status':
        if (name === 'Needs Review') return 'text-orange-400';
        if (name === 'Approved') return 'text-green-400';
        if (name === 'Needs Retouching') return 'text-purple-400';
        return 'text-gray-400';
      case 'media':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="w-60 bg-[#1f2029] border-r border-[#373a4b] flex flex-col h-full">
      {/* Assets Section */}
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="mb-6">
          <button
            onClick={() => toggleSection('assets')}
            className="flex items-center justify-between w-full text-sm font-medium text-white hover:text-gray-300 mb-3"
          >
            <span>Assets</span>
            <div className="flex items-center space-x-2">
              <Plus className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
              {expandedSections.assets ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          </button>

          {expandedSections.assets && (
            <div className="space-y-1">
              {assetFolders.map((folder, index) => (
                <div key={index}>
                  <div className={`flex items-center justify-between py-2 px-2 rounded hover:bg-[#2a2d3a] cursor-pointer group ${
                    folder.name === 'Key Scenes' ? 'bg-[#2a2d3a]' : ''
                  }`}>
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      {folder.hasSubfolders && (
                        <ChevronRight className={`w-3 h-3 text-gray-400 flex-shrink-0 ${
                          folder.isExpanded ? 'rotate-90' : ''
                        }`} />
                      )}
                      <FolderOpen className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300 truncate">{folder.name}</span>
                    </div>
                    {folder.count && (
                      <Badge variant="secondary" className="text-xs bg-[#373a4b] text-gray-400 ml-2">
                        {folder.count}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Collections Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('collections')}
            className="flex items-center justify-between w-full text-sm font-medium text-white hover:text-gray-300 mb-3"
          >
            <span>Collections</span>
            <div className="flex items-center space-x-2">
              <Plus className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
              {expandedSections.collections ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          </button>

          {expandedSections.collections && (
            <div className="space-y-1">
              {collections.map((collection, index) => {
                const IconComponent = collection.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-2 rounded hover:bg-[#2a2d3a] cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <IconComponent className={`w-4 h-4 flex-shrink-0 ${getCollectionIconColor(collection.type, collection.name)}`} />
                      <span className="text-sm text-gray-300 truncate">{collection.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs bg-[#373a4b] text-gray-400 ml-2">
                      {collection.count}
                    </Badge>
                  </div>
                );
              })}

              <button className="flex items-center space-x-2 py-2 px-2 w-full text-left rounded hover:bg-[#2a2d3a] group">
                <Plus className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400 group-hover:text-white">New Collection</span>
              </button>
            </div>
          )}
        </div>

        {/* Branches Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('branches')}
            className="flex items-center justify-between w-full text-sm font-medium text-white hover:text-gray-300 mb-3"
          >
            <span>Branches</span>
            {expandedSections.branches ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {expandedSections.branches && (
            <div className="space-y-1">
              {branches.map((branch, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between py-2 px-2 rounded cursor-pointer group ${
                    branch.isActive ? 'bg-[#2a2d3a] border border-blue-500/30' : 'hover:bg-[#2a2d3a]'
                  }`}
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <GitBranch className={`w-4 h-4 flex-shrink-0 ${
                      branch.isActive ? 'text-blue-400' : 'text-gray-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm truncate ${
                          branch.isActive ? 'text-white' : 'text-gray-300'
                        }`}>
                          {branch.name}
                        </span>
                        {branch.isActive && (
                          <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-300">
                            active
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {branch.commits} commits • {branch.lastActivity}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button className="flex items-center space-x-2 py-2 px-2 w-full text-left rounded hover:bg-[#2a2d3a] group">
                <GitMerge className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400 group-hover:text-white">New Branch</span>
              </button>
            </div>
          )}
        </div>

        {/* Tags Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('tags')}
            className="flex items-center justify-between w-full text-sm font-medium text-white hover:text-gray-300 mb-3"
          >
            <span>Tags</span>
            {expandedSections.tags ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {expandedSections.tags && (
            <div className="space-y-1">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-[#2a2d3a] cursor-pointer group"
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <Tag className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300 truncate">{tag.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">{tag.count}</span>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3 text-gray-500 hover:text-red-400" />
                    </button>
                  </div>
                </div>
              ))}

              <button className="flex items-center space-x-2 py-1.5 px-2 w-full text-left rounded hover:bg-[#2a2d3a] group">
                <Plus className="w-3 h-3 text-gray-400" />
                <span className="text-sm text-gray-400 group-hover:text-white">Add Tag</span>
              </button>
            </div>
          )}
        </div>

        {/* Recent Activity Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('recent')}
            className="flex items-center justify-between w-full text-sm font-medium text-white hover:text-gray-300 mb-3"
          >
            <span>Recent Activity</span>
            {expandedSections.recent ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {expandedSections.recent && (
            <div className="space-y-2">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="py-2 px-2 rounded hover:bg-[#2a2d3a] cursor-pointer group"
                >
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-300 leading-tight">
                        {activity.message}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {activity.user && `${activity.user} • `}{activity.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
