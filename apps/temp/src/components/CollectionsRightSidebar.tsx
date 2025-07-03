import { Users, Lock, Star, Eye, Edit3, Share2, Download, Calendar, Tag } from 'lucide-react';
import { type Collection } from "@filehunt/shared-ts/types";
import { Card, CardContent, CardHeader, CardTitle } from '@filehunt/shared-ts/ui'; //card';
import { Badge } from '@filehunt/shared-ts/ui'; //badge';
import { Button } from '@filehunt/shared-ts/ui'; //button';
import { Avatar, AvatarImage, AvatarFallback } from '@filehunt/shared-ts/ui'; //avatar';

interface CollectionsRightSidebarProps {
  selectedCollection: Collection | null;
}

export function CollectionsRightSidebar({ selectedCollection }: CollectionsRightSidebarProps) {
  if (!selectedCollection) {
    return (
      <div className="w-80 bg-[#292b36] border-l border-[#373a4b] flex items-center justify-center">
        <div className="text-center p-4">
          <div className="text-gray-400 text-sm">Select a collection to view details</div>
        </div>
      </div>
    );
  }

  const stats = {
    totalSize: '2.4 GB',
    avgFileSize: '1.2 MB',
    lastModified: '2 days ago',
    totalViews: 1247
  };

  return (
    <div className="w-80 bg-[#292b36] border-l border-[#373a4b] flex flex-col">
      {/* Collection Header */}
      <div className="p-4 border-b border-[#373a4b]">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-white font-medium">{selectedCollection.name}</h3>
          <div className="flex items-center space-x-1">
            {selectedCollection.isPrivate && (
              <Lock className="w-3 h-3 text-red-400" />
            )}
            {selectedCollection.isFavorited && (
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
            )}
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-3">
          {selectedCollection.description || 'No description available'}
        </p>

        <div className="flex items-center space-x-4 text-xs text-gray-400">
          <div className="flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span>{stats.totalViews} views</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Updated {selectedCollection.updatedAt}</span>
          </div>
        </div>
      </div>

      {/* Owner & Collaborators */}
      <div className="p-4 border-b border-[#373a4b]">
        <h4 className="text-white text-sm font-medium mb-3">People</h4>

        {/* Owner */}
        <div className="flex items-center space-x-2 mb-3">
          <Avatar className="w-6 h-6">
            <AvatarImage src={selectedCollection.owner?.avatar} />
            <AvatarFallback className="bg-blue-500 text-white text-xs">
              {selectedCollection.owner?.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="text-white text-sm">{selectedCollection.owner?.name}</div>
            <div className="text-gray-400 text-xs">Owner</div>
          </div>
        </div>

        {/* Collaborators */}
        {selectedCollection.collaborators && selectedCollection.collaborators.length > 0 && (
          <div className="space-y-2">
            <div className="text-gray-400 text-xs">Collaborators ({selectedCollection.collaborators.length})</div>
            {selectedCollection.collaborators.slice(0, 3).map((collaborator: { name: string; avatar?: string }, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={collaborator.avatar} />
                  <AvatarFallback className="bg-green-500 text-white text-xs">
                    {collaborator.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-gray-300 text-xs">{collaborator.name}</span>
              </div>
            ))}
            {selectedCollection.collaborators.length > 3 && (
              <div className="text-gray-400 text-xs">
                +{selectedCollection.collaborators.length - 3} more
              </div>
            )}
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="p-4 border-b border-[#373a4b]">
        <h4 className="text-white text-sm font-medium mb-3">Statistics</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Assets</span>
            <span className="text-white text-sm">{selectedCollection.assetCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Total Size</span>
            <span className="text-white text-sm">{stats.totalSize}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Avg File Size</span>
            <span className="text-white text-sm">{stats.avgFileSize}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Views</span>
            <span className="text-white text-sm">{stats.totalViews}</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      {selectedCollection.tags && selectedCollection.tags.length > 0 && (
        <div className="p-4 border-b border-[#373a4b]">
          <h4 className="text-white text-sm font-medium mb-3 flex items-center">
            <Tag className="w-3 h-3 mr-2" />
            Tags
          </h4>
          <div className="flex flex-wrap gap-1">
            {selectedCollection.tags.map((tag: string, index: number) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-blue-500/20 text-blue-300 text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="p-4 border-b border-[#373a4b]">
        <h4 className="text-white text-sm font-medium mb-3">Actions</h4>
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#373a4b] text-sm"
          >
            <Eye className="w-3 h-3 mr-2" />
            View Assets
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#373a4b] text-sm"
          >
            <Edit3 className="w-3 h-3 mr-2" />
            Edit Collection
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#373a4b] text-sm"
          >
            <Share2 className="w-3 h-3 mr-2" />
            Share Collection
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#373a4b] text-sm"
          >
            <Download className="w-3 h-3 mr-2" />
            Download All
          </Button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="flex-1 p-4">
        <h4 className="text-white text-sm font-medium mb-3">Recent Activity</h4>
        <div className="space-y-3">
          <div className="text-sm">
            <div className="text-gray-300">Asset added by John Smith</div>
            <div className="text-gray-500 text-xs">2 hours ago</div>
          </div>
          <div className="text-sm">
            <div className="text-gray-300">Collection shared with 3 people</div>
            <div className="text-gray-500 text-xs">1 day ago</div>
          </div>
          <div className="text-sm">
            <div className="text-gray-300">Description updated</div>
            <div className="text-gray-500 text-xs">2 days ago</div>
          </div>
        </div>
      </div>
    </div>
  );
}
