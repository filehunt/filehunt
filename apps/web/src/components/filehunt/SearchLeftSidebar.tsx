"use client";

import { useState, useEffect } from 'react';
import { Search, Filter, Tag, Folder, Calendar, User, Clock, Bookmark, Trash2, Plus, X, Star, Image, Play, Mic, MessageCircle, SquareDashedMousePointer } from 'lucide-react';
import { SearchFilters, SavedSearch } from '@/types/assets';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Badge } from '@/components/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';

interface SearchLeftSidebarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  savedSearches: SavedSearch[];
  onSavedSearchesChange: (searches: SavedSearch[]) => void;
}

export function SearchLeftSidebar({ filters, onFiltersChange, savedSearches, onSavedSearchesChange }: SearchLeftSidebarProps) {
  const [newSavedSearchName, setNewSavedSearchName] = useState('');

  // Initialize with some default saved searches if empty
  useEffect(() => {
    if (savedSearches.length === 0) {
      const defaultSearches: SavedSearch[] = [
        {
          id: '1',
          name: 'Recent Product Images',
          filters: {
            query: 'product',
            type: ['image'],
            tags: ['product'],
            status: ['approved'],
            sortBy: 'date',
            sortOrder: 'desc'
          },
          createdAt: '2 days ago'
        },
        {
          id: '2',
          name: 'Pending Reviews',
          filters: {
            query: '',
            type: [],
            tags: [],
            status: ['review'],
            sortBy: 'date',
            sortOrder: 'desc'
          },
          createdAt: '1 week ago'
        }
      ];
      onSavedSearchesChange(defaultSearches);
    }
  }, [savedSearches.length, onSavedSearchesChange]);

  const updateFilter = (key: keyof SearchFilters, value: string | string[]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleFilter = (key: keyof SearchFilters, item: string) => {
    const currentArray = (filters[key] as string[]) || [];
    if (currentArray.includes(item)) {
      updateFilter(key, currentArray.filter((i: string) => i !== item));
    } else {
      updateFilter(key, [...currentArray, item]);
    }
  };

  const saveCurrentSearch = () => {
    if (!newSavedSearchName.trim()) return;

    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: newSavedSearchName.trim(),
      filters: { ...filters },
      createdAt: new Date().toISOString()
    };

    onSavedSearchesChange([newSearch, ...savedSearches]);
    setNewSavedSearchName('');
  };

  const applySavedSearch = (search: SavedSearch) => {
    onFiltersChange(search.filters);
  };

  const deleteSavedSearch = (id: string) => {
    onSavedSearchesChange(savedSearches.filter(s => s.id !== id));
  };

  return (
    <div className="w-[240px] flex flex-col" style={{ backgroundColor: 'transparent' }}>
      {/* Header */}
      <div className="p-4">
        <h2 className="text-white font-medium text-base mb-2">Search Filters</h2>
      </div>

      {/* Saved Searches */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white text-sm font-medium">Saved Searches</h3>
        </div>

        <div className="space-y-2 mb-3">
          {savedSearches.slice(0, 5).map(search => (
            <div key={search.id} className="flex items-center justify-between group">
              <button
                onClick={() => applySavedSearch(search)}
                className="text-sm text-gray-300 hover:text-white truncate flex-1 text-left"
              >
                <Bookmark className="w-3 h-3 inline mr-1" />
                {search.name}
              </button>
              <button
                onClick={() => deleteSavedSearch(search.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex space-x-1">
          <Input
            value={newSavedSearchName}
            onChange={(e) => setNewSavedSearchName(e.target.value)}
            placeholder="Save current search..."
            className="bg-background border-border text-white text-sm h-8"
            onKeyDown={(e) => e.key === 'Enter' && saveCurrentSearch()}
          />
          <Button
            onClick={saveCurrentSearch}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-sm h-8 px-3"
          >
            Save
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* File Type - matching LeftSidebar categories */}
        <div>
          <h4 className="text-white text-sm font-medium mb-3 flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            File Type
          </h4>
          <div className="space-y-2">
            {[
              { key: 'image', label: 'Images', icon: Image },
              { key: 'video', label: 'Videos', icon: Play },
              { key: 'audio', label: 'Audio', icon: Mic },
              { key: 'document', label: 'Documents', icon: Folder }
            ].map(type => (
              <div key={type.key} className="flex items-center space-x-3 py-1">
                <div
                  className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                    (filters.type || []).includes(type.key)
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-500 shadow-lg shadow-blue-500/30'
                      : 'border-gray-500 hover:border-blue-400 hover:shadow-md hover:shadow-blue-400/20'
                  }`}
                  onClick={() => toggleFilter('type', type.key)}
                >
                  {(filters.type || []).includes(type.key) && (
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <type.icon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300 select-none">{type.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status - matching LeftSidebar categories */}
        <div>
          <h4 className="text-white text-sm font-medium mb-3">Status</h4>
          <div className="space-y-2">
            {[
              { key: 'approved', label: 'Approved', icon: Star },
              { key: 'review', label: 'Needs Review', icon: MessageCircle },
              { key: 'draft', label: 'Draft', icon: SquareDashedMousePointer }
            ].map(status => (
              <div key={status.key} className="flex items-center space-x-3 py-1">
                <div
                  className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                    (filters.status || []).includes(status.key)
                      ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-500 shadow-lg shadow-emerald-500/30'
                      : 'border-gray-500 hover:border-emerald-400 hover:shadow-md hover:shadow-emerald-400/20'
                  }`}
                  onClick={() => toggleFilter('status', status.key)}
                >
                  {(filters.status || []).includes(status.key) && (
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <status.icon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300 select-none">{status.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tags */}
        <div>
          <h4 className="text-white text-sm font-medium mb-3 flex items-center">
            <Tag className="w-4 h-4 mr-2" />
            Popular Tags
          </h4>
          <div className="flex flex-wrap gap-2">
            {['product', 'brand', 'marketing', 'social', 'hero', 'banner'].map(tag => (
              <Badge
                key={tag}
                variant="secondary"
                className={`text-sm cursor-pointer transition-all duration-200 hover:scale-105 ${
                  (filters.tags || []).includes(tag)
                    ? 'bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 border border-purple-500/40 shadow-lg shadow-purple-500/20'
                    : 'bg-background text-gray-300 hover:bg-muted border border-transparent hover:border-purple-500/20'
                }`}
                onClick={() => toggleFilter('tags', tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Quick Folders - matching LeftSidebar structure */}
        <div>
          <h4 className="text-white text-sm font-medium mb-3 flex items-center">
            <Folder className="w-4 h-4 mr-2" />
            Common Folders
          </h4>
          <div className="space-y-1">
            {[
              'Episodes',
              'Key Scenes',
              'Talent',
              'Location',
              'Campaign 2024',
              'Brand Assets',
              'Social Media'
            ].map(folder => (
              <button
                key={folder}
                onClick={() => toggleFilter('folders', folder)}
                className={`w-full text-left text-sm px-3 py-2 rounded-md transition-all duration-200 hover:scale-[1.02] ${
                  (filters.folders || []).includes(folder)
                    ? 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-300 border border-orange-500/40 shadow-lg shadow-orange-500/20'
                    : 'text-gray-300 hover:bg-background hover:text-white border border-transparent hover:border-orange-500/20'
                }`}
              >
                {folder}
              </button>
            ))}
          </div>
        </div>

        {/* Uploader */}
        <div>
          <h4 className="text-white text-sm font-medium mb-3 flex items-center">
            <User className="w-4 h-4 mr-2" />
            Uploader
          </h4>
          <Input
            value={filters.uploader || ''}
            onChange={(e) => updateFilter('uploader', e.target.value)}
            placeholder="Filter by uploader..."
            className="bg-background border-border text-white text-sm focus:border-cyan-500 focus:ring-cyan-500/20"
          />
        </div>

        {/* Sort */}
        <div>
          <h4 className="text-white text-sm font-medium mb-3 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Sort By
          </h4>
          <Select value={filters.sortBy || 'relevance'} onValueChange={(value) => updateFilter('sortBy', value)}>
            <SelectTrigger className="bg-background border-border text-white text-sm focus:border-cyan-500 focus:ring-cyan-500/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-white">
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="size">Size</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Clear Filters */}
      <div className="p-4">
        <Button
          variant="outline"
          onClick={() => onFiltersChange({})}
          className="w-full border-border text-gray-300 hover:text-white text-sm hover:border-red-500/50 hover:bg-red-500/10 transition-colors duration-200"
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );
}
