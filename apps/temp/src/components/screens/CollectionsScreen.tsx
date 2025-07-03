import { useState } from 'react';
import { FolderOpen, Plus, Search, Grid, List, Eye, Star, Users, Lock, Unlock, Trash2, Edit3, MoreHorizontal } from 'lucide-react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle, Badge, Avatar, AvatarImage, AvatarFallback, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@filehunt/shared-ts/ui';
import { type Collection } from "@filehunt/shared-ts/types";

interface CollectionsScreenProps {
  collections: Collection[];
  onCollectionsChange: (collections: Collection[]) => void;
  selectedCollection: Collection;
  onCollectionSelect: (collection: Collection) => void;
}

export function CollectionsScreen({
  collections: propCollections,
  onCollectionsChange,
  selectedCollection,
  onCollectionSelect
}: CollectionsScreenProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewCollectionDialog, setShowNewCollectionDialog] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');

  // Use collections from props
  const collections = propCollections;
  const setCollections = onCollectionsChange;

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const createCollection = () => {
    if (!newCollectionName.trim()) return;

    const newCollection: Collection = {
      id: Date.now().toString(),
      name: newCollectionName.trim(),
      description: newCollectionDescription.trim(),
      assetCount: 0,
      isPrivate: false,
      isFavorited: false,
      owner: {
        name: 'Current User',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
      },
      collaborators: [],
      createdAt: 'now',
      updatedAt: 'now',
      tags: []
    };

    setCollections(prev => [newCollection, ...prev]);
    setNewCollectionName('');
    setNewCollectionDescription('');
    setShowNewCollectionDialog(false);
  };

  const toggleFavorite = (id: string) => {
    setCollections(prev => prev.map(collection =>
      collection.id === id
        ? { ...collection, isFavorited: !collection.isFavorited }
        : collection
    ));
  };

  const togglePrivacy = (id: string) => {
    setCollections(prev => prev.map(collection =>
      collection.id === id
        ? { ...collection, isPrivate: !collection.isPrivate }
        : collection
    ));
  };

  const deleteCollection = (id: string) => {
    setCollections(prev => prev.filter(collection => collection.id !== id));
  };

  const renderCollectionCard = (collection: Collection) => (
    <Card key={collection.id} className="bg-[#1f2029]/50 border-[#2a2d3a] backdrop-blur-sm hover:border-[#3a3d4a] transition-all group">
      <CardContent className="p-0">
        {/* Thumbnail */}
        <div className="aspect-video bg-[#2a2d3a] relative overflow-hidden rounded-t-lg">
          {collection.thumbnail ? (
            <img
              src={collection.thumbnail}
              alt={collection.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FolderOpen className="w-12 h-12 text-gray-400" />
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
          </div>

          {/* Status badges */}
          <div className="absolute top-2 left-2 flex items-center space-x-1">
            {collection.isPrivate && (
              <Badge variant="secondary" className="bg-red-500/20 text-red-300 text-xs">
                <Lock className="w-2.5 h-2.5 mr-1" />
                Private
              </Badge>
            )}
            {collection.isFavorited && (
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 text-xs">
                <Star className="w-2.5 h-2.5 fill-current" />
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                >
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#2a2d3a] border-[#3a3d4a] text-white">
                <DropdownMenuItem className="hover:bg-[#3a3d4a]">
                  <Edit3 className="w-3 h-3 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-[#3a3d4a]"
                  onClick={() => toggleFavorite(collection.id)}
                >
                  <Star className="w-3 h-3 mr-2" />
                  {collection.isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-[#3a3d4a]"
                  onClick={() => togglePrivacy(collection.id)}
                >
                  {collection.isPrivate ? <Unlock className="w-3 h-3 mr-2" /> : <Lock className="w-3 h-3 mr-2" />}
                  Make {collection.isPrivate ? 'public' : 'private'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-[#3a3d4a] text-red-400"
                  onClick={() => deleteCollection(collection.id)}
                >
                  <Trash2 className="w-3 h-3 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-white font-medium truncate flex-1">{collection.name}</h3>
            <span className="text-gray-400 text-sm ml-2">{collection.assetCount}</span>
          </div>

          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {collection.description || 'No description'}
          </p>

          {/* Tags */}
          {collection.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {collection.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary" className="bg-blue-500/20 text-blue-300 text-xs">
                  {tag}
                </Badge>
              ))}
              {collection.tags.length > 3 && (
                <Badge variant="secondary" className="bg-gray-500/20 text-gray-300 text-xs">
                  +{collection.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="w-5 h-5">
                <AvatarImage src={collection.owner.avatar} />
                <AvatarFallback className="bg-blue-500 text-white text-xs">
                  {collection.owner.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-gray-400 text-xs">{collection.owner.name}</span>
            </div>

            {collection.collaborators.length > 0 && (
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3 text-gray-400" />
                <span className="text-gray-400 text-xs">+{collection.collaborators.length}</span>
              </div>
            )}
          </div>

          <div className="text-gray-500 text-xs mt-2">
            Updated {collection.updatedAt}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCollectionListItem = (collection: Collection) => (
    <Card key={collection.id} className="bg-[#1f2029]/50 border-[#2a2d3a] backdrop-blur-sm hover:border-[#3a3d4a] transition-all">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {/* Thumbnail */}
          <div className="w-16 h-12 bg-[#2a2d3a] rounded overflow-hidden flex-shrink-0">
            {collection.thumbnail ? (
              <img
                src={collection.thumbnail}
                alt={collection.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-white font-medium truncate">{collection.name}</h3>
              {collection.isPrivate && (
                <Lock className="w-3 h-3 text-red-400" />
              )}
              {collection.isFavorited && (
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
              )}
            </div>
            <p className="text-gray-400 text-sm truncate">{collection.description}</p>
          </div>

          {/* Stats */}
          <div className="text-right">
            <div className="text-white text-sm">{collection.assetCount} assets</div>
            <div className="text-gray-400 text-xs">Updated {collection.updatedAt}</div>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white h-8 w-8 p-0"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#2a2d3a] border-[#3a3d4a] text-white">
              <DropdownMenuItem className="hover:bg-[#3a3d4a]">
                <Eye className="w-3 h-3 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-[#3a3d4a]">
                <Edit3 className="w-3 h-3 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-[#3a3d4a]"
                onClick={() => toggleFavorite(collection.id)}
              >
                <Star className="w-3 h-3 mr-2" />
                {collection.isFavorited ? 'Unfavorite' : 'Favorite'}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-[#3a3d4a] text-red-400"
                onClick={() => deleteCollection(collection.id)}
              >
                <Trash2 className="w-3 h-3 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex-1 bg-[#1a1d29] overflow-auto">
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-white text-2xl mb-2">Collections</h1>
              <p className="text-gray-400">
                Organize your assets into collections for better management and collaboration.
              </p>
            </div>
            <Button
              onClick={() => setShowNewCollectionDialog(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Collection
            </Button>
          </div>

          {/* Search and View Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search collections..."
                  className="bg-[#2a2d3a] border-[#3a3d4a] text-white pl-10 w-80"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-blue-600' : 'text-gray-400 hover:text-white'}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-blue-600' : 'text-gray-400 hover:text-white'}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Collections */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCollections.map(renderCollectionCard)}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCollections.map(renderCollectionListItem)}
            </div>
          )}

          {filteredCollections.length === 0 && (
            <div className="text-center py-12">
              <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-white text-lg mb-2">No collections found</h3>
              <p className="text-gray-400 mb-4">
                {searchQuery ? 'Try adjusting your search criteria.' : 'Create your first collection to get started.'}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => setShowNewCollectionDialog(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Collection
                </Button>
              )}
            </div>
          )}

          {/* New Collection Dialog */}
          <Dialog open={showNewCollectionDialog} onOpenChange={setShowNewCollectionDialog}>
            <DialogContent className="bg-[#1f2029] border-[#2a2d3a] text-white max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Collection</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Create a new collection to organize and group related assets together.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Collection Name</label>
                  <Input
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="Enter collection name"
                    className="bg-[#2a2d3a] border-[#3a3d4a] text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Description (optional)</label>
                  <Input
                    value={newCollectionDescription}
                    onChange={(e) => setNewCollectionDescription(e.target.value)}
                    placeholder="Enter collection description"
                    className="bg-[#2a2d3a] border-[#3a3d4a] text-white"
                  />
                </div>
                <div className="flex space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowNewCollectionDialog(false)}
                    className="border-[#3a3d4a] text-gray-300 flex-1"
                  >
                    Cancel
                  </Button>
                  <Button onClick={createCollection} className="bg-blue-600 hover:bg-blue-700 flex-1">
                    Create
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
