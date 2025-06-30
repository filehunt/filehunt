import { Clock, TrendingUp, Star, Eye, Download } from 'lucide-react';
import { type SearchFilters } from '@shared-ts/types';
import { Card, CardContent, CardHeader, CardTitle } from '../shared'; //card';
import { Badge } from '../shared'; //badge';
import { Button } from '../shared'; //button';

interface SearchRightSidebarProps {
  searchResults: Asset[];
  filters: SearchFilters;
}

export function SearchRightSidebar({ searchResults, filters }: SearchRightSidebarProps) {
  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key];
    return value && (Array.isArray(value) ? value.length > 0 : value.toString().trim());
  });

  const recentSearches = [
    { query: 'product photography', timestamp: '2 hours ago', results: 45 },
    { query: 'brand assets', timestamp: '1 day ago', results: 23 },
    { query: 'social media templates', timestamp: '2 days ago', results: 67 },
    { query: 'video content', timestamp: '3 days ago', results: 34 },
  ];

  const trendingTags = [
    { name: 'product', count: 156 },
    { name: 'brand', count: 89 },
    { name: 'marketing', count: 134 },
    { name: 'social', count: 78 },
    { name: 'hero', count: 45 },
    { name: 'banner', count: 56 },
  ];

  const searchStats = {
    totalAssets: 1247,
    avgSearchTime: '0.12s',
    popularFormat: 'Image',
    mostActive: 'John Smith'
  };

  return (
    <div className="w-80 bg-[#292b36] border-l border-[#373a4b] flex flex-col">
      {/* Search Results Summary */}
      <div className="p-4 border-b border-[#373a4b]">
        <h3 className="text-white font-medium mb-3">Search Results</h3>

        {hasActiveFilters ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Found</span>
              <span className="text-white font-medium">{searchResults.length} assets</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Search time</span>
              <span className="text-gray-300 text-sm">0.08s</span>
            </div>

            {/* Active Filters Summary */}
            <div className="pt-2">
              <span className="text-gray-400 text-xs">Active filters:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {filters.type?.map((type: string) => (
                  <Badge key={type} variant="secondary" className="bg-blue-500/20 text-blue-300 text-xs">
                    {type}
                  </Badge>
                ))}
                {filters.tags?.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="bg-green-500/20 text-green-300 text-xs">
                    #{tag}
                  </Badge>
                ))}
                {filters.status?.map((status: string) => (
                  <Badge key={status} variant="secondary" className="bg-orange-500/20 text-orange-300 text-xs">
                    {status}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-gray-400 text-sm">
              Start typing or use filters to search
            </div>
          </div>
        )}
      </div>

      {/* Recent Searches */}
      <div className="p-4 border-b border-[#373a4b]">
        <h4 className="text-white text-sm font-medium mb-3 flex items-center">
          <Clock className="w-3 h-3 mr-2" />
          Recent Searches
        </h4>
        <div className="space-y-2">
          {recentSearches.map((search, index) => (
            <div key={index} className="flex items-center justify-between group cursor-pointer hover:bg-[#373a4b] rounded p-2 -m-2">
              <div className="flex-1 min-w-0">
                <div className="text-gray-300 text-xs truncate">{search.query}</div>
                <div className="text-gray-500 text-xs">{search.timestamp}</div>
              </div>
              <div className="text-gray-400 text-xs">{search.results}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Tags */}
      <div className="p-4 border-b border-[#373a4b]">
        <h4 className="text-white text-sm font-medium mb-3 flex items-center">
          <TrendingUp className="w-3 h-3 mr-2" />
          Trending Tags
        </h4>
        <div className="space-y-2">
          {trendingTags.map((tag, index) => (
            <div key={index} className="flex items-center justify-between">
              <Badge
                variant="secondary"
                className="bg-[#373a4b] text-gray-300 hover:bg-[#434656] cursor-pointer text-xs"
              >
                #{tag.name}
              </Badge>
              <span className="text-gray-400 text-xs">{tag.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search Statistics */}
      <div className="p-4 border-b border-[#373a4b]">
        <h4 className="text-white text-sm font-medium mb-3">Statistics</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-xs">Total Assets</span>
            <span className="text-white text-xs">{searchStats.totalAssets}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-xs">Avg Search Time</span>
            <span className="text-green-400 text-xs">{searchStats.avgSearchTime}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-xs">Popular Format</span>
            <span className="text-blue-400 text-xs">{searchStats.popularFormat}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-xs">Most Active</span>
            <span className="text-purple-400 text-xs">{searchStats.mostActive}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4">
        <h4 className="text-white text-sm font-medium mb-3">Quick Actions</h4>
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#373a4b] text-xs"
          >
            <Star className="w-3 h-3 mr-2" />
            Save Search
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#373a4b] text-xs"
          >
            <Eye className="w-3 h-3 mr-2" />
            View All Results
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#373a4b] text-xs"
          >
            <Download className="w-3 h-3 mr-2" />
            Export Results
          </Button>
        </div>
      </div>
    </div>
  );
}
