import { useState, useEffect } from 'react';
import { Search, Filter, X, Calendar, Tag, Folder, User, Clock, SortAsc, SortDesc, BookmarkPlus } from 'lucide-react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle, Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, DatePickerWithRange, Checkbox, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../shared';
import { AssetCard } from '../../shared';
import { type Asset, type SearchFilters } from '@shared-ts/types';

interface SearchScreenProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  searchResults: Asset[];
  onSearchResultsChange: (results: Asset[]) => void;
  onAssetSelect: (asset: Asset, isSelected: boolean) => void;
  onAssetPreview: (asset: Asset) => void;
  onAssetDetail: (asset: Asset) => void;
  viewMode?: 'grid' | 'list' | 'gallery';
}

// Mock data for demonstration
const mockAssets = [
  {
    id: '1',
    name: 'Product Hero Shot',
    type: 'image' as const,
    duration: undefined,
    comments: 12,
    size: '2.4 MB',
    uploadDate: '2 days ago',
    uploader: 'John Smith',
    tags: ['product', 'hero', 'marketing'],
    folders: ['Campaign 2024', 'Products'],
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    status: 'approved' as const
  },
  {
    id: '2',
    name: 'Brand Video',
    type: 'video' as const,
    duration: '2:30',
    comments: 8,
    size: '45.2 MB',
    uploadDate: '1 week ago',
    uploader: 'Jane Doe',
    tags: ['brand', 'video', 'promotion'],
    folders: ['Marketing', 'Video Assets'],
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
    status: 'needs-review' as const
  }
];

export function SearchScreen({
  filters,
  onFiltersChange,
  searchResults,
  onSearchResultsChange,
  onAssetSelect,
  onAssetPreview,
  onAssetDetail,
  viewMode = 'grid'
}: SearchScreenProps) {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState('');

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

  return (
    <div className="flex-1 bg-[#1a1d29] overflow-auto">
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
          <Card className="bg-[#1f2029]/50 border-[#2a2d3a] backdrop-blur-sm mb-6">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    value={filters.query || ''}
                    onChange={(e) => updateFilter('query', e.target.value)}
                    placeholder="Search assets by name, description, or metadata..."
                    className="bg-[#2a2d3a] border-[#3a3d4a] text-white pl-10 h-12"
                  />
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setShowSaveDialog(true)}
                  className="text-gray-300 hover:text-white"
                  disabled={!hasActiveFilters()}
                >
                  <BookmarkPlus className="w-4 h-4 mr-2" />
                  Save Search
                </Button>
              </div>

              {/* Active Filters */}
              {hasActiveFilters() && (
                <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-[#2a2d3a]">
                  <span className="text-sm text-gray-400">Active filters:</span>

                  {filters.type?.map((type: string) => (
                    <Badge key={type} variant="secondary" className="bg-blue-500/20 text-blue-300">
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
                    <Badge key={tag} variant="secondary" className="bg-green-500/20 text-green-300">
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
                    <Badge key={folder} variant="secondary" className="bg-purple-500/20 text-purple-300">
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
                    <Badge key={status} variant="secondary" className="bg-orange-500/20 text-orange-300">
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
                    <Badge variant="secondary" className="bg-pink-500/20 text-pink-300">
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
                    className="text-gray-400 hover:text-white h-6 px-2"
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          <div>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-lg">
                {searchResults.length} results found
              </h2>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Sort by:</span>
                <Select value={filters.sortBy || 'relevance'} onValueChange={(value) => updateFilter('sortBy', value)}>
                  <SelectTrigger className="bg-[#2a2d3a] border-[#3a3d4a] text-white w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2a2d3a] border-[#3a3d4a] text-white">
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="size">Size</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="border-[#3a3d4a] text-gray-300"
                >
                  {filters.sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map(asset => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  isSelected={false}
                  onSelect={() => onAssetSelect(asset, true)}
                  onPreview={() => onAssetPreview(asset)}
                  onDetail={() => onAssetDetail(asset)}
                />
              ))}
            </div>

            {searchResults.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-white text-lg mb-2">No results found</h3>
                <p className="text-gray-400">
                  Try adjusting your search criteria or filters to find what you're looking for.
                </p>
              </div>
            )}
          </div>

          {/* Save Search Dialog */}
          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogContent className="bg-[#1f2029] border-[#2a2d3a] text-white max-w-md">
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
                  className="bg-[#2a2d3a] border-[#3a3d4a] text-white"
                />
                <div className="flex space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowSaveDialog(false)}
                    className="border-[#3a3d4a] text-gray-300 flex-1"
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
                    className="bg-blue-600 hover:bg-blue-700 flex-1"
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
