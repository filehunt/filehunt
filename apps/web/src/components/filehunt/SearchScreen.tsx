"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Search, Filter, X, Calendar, Tag, Folder, User, Clock, SortAsc, SortDesc, BookmarkPlus, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Badge } from '@/components/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';
import { AssetCard } from './AssetCard';
import { Asset, SearchFilters, mockAssets } from '@/types/assets';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/dialog';

// Types pour les collections
interface Collection {
  id: string;
  name: string;
  description: string;
  assetCount: number;
  thumbnail: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Mock data pour les collections
const mockCollections: Collection[] = [
  {
    id: 'col1',
    name: 'Brand Assets',
    description: 'Official brand logos, colors, and guidelines',
    assetCount: 24,
    thumbnail: '/assets/brand-logo.jpg',
    tags: ['brand', 'logo', 'official'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z'
  },
  {
    id: 'col2',
    name: 'Product Photography',
    description: 'High-resolution product images for marketing',
    assetCount: 156,
    thumbnail: '/assets/product-1.jpg',
    tags: ['product', 'photography', 'marketing'],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-25T11:45:00Z'
  },
  {
    id: 'col3',
    name: 'UI Components',
    description: 'Design system components and patterns',
    assetCount: 89,
    thumbnail: '/assets/ui-component.svg',
    tags: ['ui', 'design', 'components'],
    createdAt: '2024-01-12T14:20:00Z',
    updatedAt: '2024-01-22T16:10:00Z'
  }
];

interface SearchScreenProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  searchResults: Asset[];
  onSearchResultsChange: (results: Asset[]) => void;
  onAssetSelect: (asset: Asset, isSelected: boolean) => void;
  onAssetPreview: (asset: Asset) => void;
  onAssetDetail: (asset: Asset) => void;
  viewMode?: 'grid' | 'list' | 'gallery';
  selectedAssets?: Asset[];
  appearanceSettings?: {
    cardSize: 'S' | 'M' | 'L';
    aspectRatio: 'masonry' | '16:9' | '4:3' | '1:1';
    thumbnailScale: 'fit' | 'fill';
    showCardInfo: boolean;
  };
}

export function SearchScreen({
  filters,
  onFiltersChange,
  searchResults,
  onSearchResultsChange,
  onAssetSelect,
  onAssetPreview,
  onAssetDetail,
  viewMode = 'grid',
  selectedAssets = [],
  appearanceSettings = {
    cardSize: 'M',
    aspectRatio: 'masonry',
    thumbnailScale: 'fill',
    showCardInfo: true
  }
}: SearchScreenProps) {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState('');
  const [searchCategory, setSearchCategory] = useState<'all' | 'assets' | 'collections'>('all');
  const [collections, setCollections] = useState<Collection[]>(mockCollections);

  // Initialize search results with mock data if empty
  useEffect(() => {
    if (searchResults.length === 0) {
      onSearchResultsChange(mockAssets);
    }
  }, [searchResults.length, onSearchResultsChange]);

  const updateFilter = (key: keyof SearchFilters, value: string | string[]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const addTagFilter = (tag: string) => {
    if (!filters.tags?.includes(tag)) {
      updateFilter('tags', [...(filters.tags || []), tag]);
    }
  };

  const removeTagFilter = (tag: string) => {
    updateFilter('tags', (filters.tags || []).filter((t: string) => t !== tag));
  };

  const addFolderFilter = (folder: string) => {
    if (!filters.folders?.includes(folder)) {
      updateFilter('folders', [...(filters.folders || []), folder]);
    }
  };

  const removeFolderFilter = (folder: string) => {
    updateFilter('folders', (filters.folders || []).filter((f: string) => f !== folder));
  };

  const toggleTypeFilter = (type: string) => {
    const currentTypes = filters.type || [];
    if (currentTypes.includes(type)) {
      updateFilter('type', currentTypes.filter((t: string) => t !== type));
    } else {
      updateFilter('type', [...currentTypes, type]);
    }
  };

  const toggleStatusFilter = (status: string) => {
    const currentStatuses = filters.status || [];
    if (currentStatuses.includes(status)) {
      updateFilter('status', currentStatuses.filter((s: string) => s !== status));
    } else {
      updateFilter('status', [...currentStatuses, status]);
    }
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = () => {
    return (filters.type?.length > 0) ||
           (filters.tags?.length > 0) ||
           (filters.folders?.length > 0) ||
           (filters.status?.length > 0) ||
           filters.query?.trim() ||
           filters.uploader?.trim();
  };

  // Filtrer les résultats selon la catégorie
  const filteredAssets = searchResults;
  const filteredCollections = collections.filter(collection => {
    if (!filters.query) return true;
    const query = filters.query.toLowerCase();
    return collection.name.toLowerCase().includes(query) ||
           collection.description.toLowerCase().includes(query) ||
           collection.tags.some(tag => tag.toLowerCase().includes(query));
  });

  const CollectionCard = ({ collection }: { collection: Collection }) => (
    <div className="bg-card/15 rounded-lg p-3 hover:bg-card/25 transition-all cursor-pointer group">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Folder className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium text-sm truncate group-hover:text-blue-400 transition-colors">
            {collection.name}
          </h3>
          <p className="text-gray-400 text-xs mt-1 line-clamp-2">
            {collection.description}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-gray-500 text-xs">
              {collection.assetCount} assets
            </span>
            <div className="flex gap-1">
              {collection.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="secondary" className="text-[10px] py-0 px-1 h-4 border-0 bg-muted/50">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-auto" style={{ backgroundColor: 'transparent' }}>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-white text-2xl mb-2">Search Assets</h1>
            <p className="text-gray-400">
              Find exactly what you're looking for with powerful search and filtering options.
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-card/20 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  value={filters.query || ''}
                  onChange={(e) => updateFilter('query', e.target.value)}
                  placeholder="Search assets by name, description, or metadata..."
                  className="bg-background/30 border-0 text-white pl-10 h-10"
                />
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowSaveDialog(true)}
                className="text-gray-300 hover:text-white"
                disabled={!hasActiveFilters()}
              >
                <BookmarkPlus className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>

            {/* Active Filters - Fixed height container to prevent layout shift */}
            <div className={`transition-all duration-200 overflow-hidden ${
              hasActiveFilters() ? 'mt-3 pt-3 border-t border-white/5 opacity-100 max-h-20' : 'max-h-0 opacity-0'
            }`}>
              <div className="flex items-center space-x-2 flex-wrap gap-1">
                {filters.type?.map((type: string) => (
                  <Badge key={type} variant="secondary" className="bg-blue-500/15 text-blue-300 border-0 text-xs">
                    {type}
                    <button
                      onClick={() => toggleTypeFilter(type)}
                      className="ml-1 hover:text-red-400"
                    >
                      ×
                    </button>
                  </Badge>
                ))}

                {filters.tags?.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="bg-green-500/15 text-green-300 border-0 text-xs">
                    #{tag}
                    <button
                      onClick={() => removeTagFilter(tag)}
                      className="ml-1 hover:text-red-400"
                    >
                      ×
                    </button>
                  </Badge>
                ))}

                {filters.folders?.map((folder: string) => (
                  <Badge key={folder} variant="secondary" className="bg-purple-500/15 text-purple-300 border-0 text-xs">
                    📁 {folder}
                    <button
                      onClick={() => removeFolderFilter(folder)}
                      className="ml-1 hover:text-red-400"
                    >
                      ×
                    </button>
                  </Badge>
                ))}

                {filters.status?.map((status: string) => (
                  <Badge key={status} variant="secondary" className="bg-orange-500/15 text-orange-300 border-0 text-xs">
                    {status}
                    <button
                      onClick={() => toggleStatusFilter(status)}
                      className="ml-1 hover:text-red-400"
                    >
                      ×
                    </button>
                  </Badge>
                ))}

                {filters.uploader && (
                  <Badge variant="secondary" className="bg-pink-500/15 text-pink-300 border-0 text-xs">
                    👤 {filters.uploader}
                    <button
                      onClick={() => updateFilter('uploader', '')}
                      className="ml-1 hover:text-red-400"
                    >
                      ×
                    </button>
                  </Badge>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-400 hover:text-white h-5 px-2 text-xs"
                >
                  Clear all
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div>
            {/* Toolbar simplifié */}
            <div className="flex items-center justify-between mb-4">
              {/* Catégories */}
              <div className="flex bg-card/20 rounded-lg p-1">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'assets', label: 'Assets' },
                  { value: 'collections', label: 'Collections' }
                ].map((category) => (
                  <Button
                    key={category.value}
                    variant={searchCategory === category.value ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSearchCategory(category.value as 'all' | 'assets' | 'collections')}
                    className={`h-7 px-3 text-xs font-medium border-0 ${
                      searchCategory === category.value
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-background/30'
                    }`}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>

              {/* Tri simplifié */}
              <div className="flex items-center space-x-2">
                <Select value={filters.sortBy || 'relevance'} onValueChange={(value) => updateFilter('sortBy', value)}>
                  <SelectTrigger className="bg-card/20 border-0 text-white w-28 h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-0 text-white">
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="size">Size</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="bg-card/20 text-gray-300 h-7 w-7 p-0"
                >
                  {filters.sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />}
                </Button>
              </div>
            </div>

            {/* Results count simplifié */}
            <div className="mb-6">
              <p className="text-gray-400 text-sm">
                {searchCategory === 'all' 
                  ? `${filteredAssets.length + filteredCollections.length} results`
                  : searchCategory === 'assets'
                  ? `${filteredAssets.length} assets`
                  : `${filteredCollections.length} collections`
                }
              </p>
            </div>

            {/* Results Content */}
            <div className="space-y-8">
              {/* Assets Section - Affiché en premier */}
              {(searchCategory === 'all' || searchCategory === 'assets') && filteredAssets.length > 0 && (
                <div>
                  {searchCategory === 'all' && filteredAssets.length > 0 && (
                    <div className="mb-3">
                      <h3 className="text-gray-400 text-sm font-medium">
                        Assets ({filteredAssets.length})
                      </h3>
                    </div>
                  )}
                  <LayoutGroup>
                    <motion.div 
                      className={`gap-4 ${
                        viewMode === 'list' 
                          ? 'grid grid-cols-1 lg:grid-cols-2' 
                          : 'columns-1 md:columns-2 lg:columns-3 xl:columns-4'
                      }`}
                      layout
                      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    >
                    {filteredAssets.map(asset => {
                      const isSelected = selectedAssets.some(selected => selected.id === asset.id);
                      return (
                        <motion.div 
                          key={asset.id} 
                          className={viewMode === 'list' ? '' : 'break-inside-avoid'}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ 
                            layout: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
                            opacity: { duration: 0.3 },
                            scale: { duration: 0.3 }
                          }}
                        >
                          <AssetCard
                            asset={asset}
                            isSelected={isSelected}
                            onSelect={(assetId, selected) => onAssetSelect(asset.id, !isSelected)}
                            onPreview={undefined}
                            onDetail={() => onAssetDetail(asset)}
                            appearanceSettings={{
                              ...appearanceSettings,
                              aspectRatio: viewMode === 'list' ? '16:9' : 'masonry',
                              showCardInfo: true
                            }}
                            viewMode={viewMode}
                            searchMode={true}
                          />
                        </motion.div>
                      );
                    })}
                    </motion.div>
                  </LayoutGroup>
                </div>
              )}

              {/* Collections Section - Affiché après les assets */}
              {(searchCategory === 'all' || searchCategory === 'collections') && filteredCollections.length > 0 && (
                <div className={searchCategory === 'all' && filteredAssets.length > 0 ? 'mt-8' : ''}>
                  {(searchCategory === 'all' || filteredCollections.length > 0) && (
                    <div className="mb-3">
                      <h3 className="text-gray-400 text-sm font-medium">
                        Collections ({filteredCollections.length})
                      </h3>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredCollections.map(collection => (
                      <CollectionCard key={collection.id} collection={collection} />
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {((searchCategory === 'all' && filteredAssets.length === 0 && filteredCollections.length === 0) ||
                (searchCategory === 'assets' && filteredAssets.length === 0) ||
                (searchCategory === 'collections' && filteredCollections.length === 0)) && (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white text-lg mb-2">No results found</h3>
                  <p className="text-gray-400">
                    Try adjusting your search criteria or filters to find what you're looking for.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Save Search Dialog */}
          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogContent className="bg-card border-0 text-white max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">Save Search</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Save this search configuration to quickly access it later from your saved searches.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  value={saveSearchName}
                  onChange={(e) => setSaveSearchName(e.target.value)}
                  placeholder="Enter search name"
                  className="bg-background/50 border-0 text-white"
                />
                <div className="flex space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowSaveDialog(false)}
                    className="border-0 bg-background/50 text-gray-300 flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (saveSearchName.trim()) {
                        // This would be handled by the parent component
                        console.log('Save search:', saveSearchName, filters);
                        setSaveSearchName('');
                        setShowSaveDialog(false);
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 flex-1 border-0"
                  >
                    Save
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
