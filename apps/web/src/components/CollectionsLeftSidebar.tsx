import { FolderOpen, Plus, Star, Lock, Users, Search, Grid, List } from 'lucide-react';
import { type Collection } from '@shared-ts/types';
import { Input } from '../shared'; //input';
import { Button } from '../shared'; //button';
import { Badge } from '../shared'; //badge';

interface CollectionsLeftSidebarProps {
  collections: Collection[];
  selectedCollection: Collection | null;
  onCollectionSelect: (collection: Collection) => void;
}

export function CollectionsLeftSidebar({ collections, selectedCollection, onCollectionSelect }: CollectionsLeftSidebarProps) {
  const collectionCategories = [
    { name: 'All Collections', count: collections.length, filter: 'all' },
    { name: 'My Collections', count: collections.filter(c => c.owner?.name === 'Current User').length, filter: 'mine' },
    { name: 'Shared with Me', count: collections.filter(c => c.collaborators?.length > 0).length, filter: 'shared' },
    { name: 'Favorites', count: collections.filter(c => c.isFavorited).length, filter: 'favorites' },
    { name: 'Private', count: collections.filter(c => c.isPrivate).length, filter: 'private' },
  ];

  const recentCollections = collections.slice(0, 5);

  return (
    <div className="w-[240px] bg-[#292b36] border-r border-[#373a4b] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#373a4b]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-medium">Collections</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white h-6 w-6 p-0"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search collections..."
            className="bg-[#373a4b] border-[#434656] text-white pl-10 text-sm"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 border-b border-[#373a4b]">
        <h3 className="text-white text-sm font-medium mb-3">Categories</h3>
        <div className="space-y-1">
          {collectionCategories.map(category => (
            <button
              key={category.filter}
              className="w-full flex items-center justify-between text-left p-2 rounded hover:bg-[#373a4b] transition-colors"
            >
              <div className="flex items-center space-x-2">
                {category.filter === 'favorites' && <Star className="w-3 h-3 text-yellow-400" />}
                {category.filter === 'private' && <Lock className="w-3 h-3 text-red-400" />}
                {category.filter === 'shared' && <Users className="w-3 h-3 text-blue-400" />}
                {!['favorites', 'private', 'shared'].includes(category.filter) && <FolderOpen className="w-3 h-3 text-gray-400" />}
                <span className="text-gray-300 text-sm">{category.name}</span>
              </div>
              <Badge variant="secondary" className="bg-[#373a4b] text-gray-400 text-xs">
                {category.count}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Collections */}
      <div className="p-4 border-b border-[#373a4b]">
        <h3 className="text-white text-sm font-medium mb-3">Recent</h3>
        <div className="space-y-1">
          {recentCollections.map(collection => (
            <button
              key={collection.id}
              onClick={() => onCollectionSelect(collection)}
              className={`w-full text-left p-2 rounded transition-colors ${
                selectedCollection?.id === collection.id
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'hover:bg-[#373a4b] text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <FolderOpen className="w-3 h-3" />
                <span className="text-sm truncate">{collection.name}</span>
                {collection.isPrivate && <Lock className="w-2 h-2 text-red-400" />}
                {collection.isFavorited && <Star className="w-2 h-2 text-yellow-400 fill-current" />}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{collection.assetCount} assets</span>
                <span className="text-xs text-gray-500">{collection.updatedAt}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4">
        <h3 className="text-white text-sm font-medium mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#373a4b] text-sm"
          >
            <Plus className="w-3 h-3 mr-2" />
            New Collection
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#373a4b] text-sm"
          >
            <FolderOpen className="w-3 h-3 mr-2" />
            Import Collection
          </Button>
        </div>
      </div>
    </div>
  );
}
