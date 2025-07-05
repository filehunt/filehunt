"use client";

import { useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { ArrowUpDown, Filter, ChevronDown, Search } from "lucide-react";
import { AssetCard } from "@/components/filehunt/AssetCard";
import { Asset, mockAssets } from "@/types/assets";
import { ViewMode } from "./Header";
import { AppearancePopover } from "./AppearancePopover";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";

interface AppearanceSettings {
  cardSize: 'S' | 'M' | 'L';
  aspectRatio: 'masonry' | '16:9' | '4:3' | '1:1';
  thumbnailScale: 'fit' | 'fill';
  showCardInfo: boolean;
}

type SortOption = 'name' | 'date' | 'size' | 'type';
type SortDirection = 'asc' | 'desc';
type StatusFilter = 'all' | 'approved' | 'draft' | 'review';

interface MainContentProps {
  selectedAssets: Asset[];
  onAssetSelect: (assetId: string, isSelected: boolean) => void;
  onAssetPreview: (asset: Asset) => void;
  onAssetDetail: (asset: Asset) => void;
  viewMode: ViewMode;
  appearanceSettings?: AppearanceSettings;
  onAppearanceSettingsChange?: (settings: AppearanceSettings) => void;
}

export function MainContent({
  selectedAssets,
  onAssetSelect,
  onAssetPreview,
  onAssetDetail,
  viewMode,
  appearanceSettings: externalAppearanceSettings,
  onAppearanceSettingsChange,
}: MainContentProps) {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [localAppearanceSettings, setLocalAppearanceSettings] = useState<AppearanceSettings>({
    cardSize: 'M',
    aspectRatio: 'masonry',
    thumbnailScale: 'fill',
    showCardInfo: false
  });
  
  const appearanceSettings = externalAppearanceSettings || localAppearanceSettings;
  
  const handleAppearanceChange = (settings: AppearanceSettings) => {
    if (onAppearanceSettingsChange) {
      onAppearanceSettingsChange(settings);
    } else {
      setLocalAppearanceSettings(settings);
    }
  };

  const sortAssets = (assets: Asset[], sortBy: SortOption, direction: SortDirection) => {
    return [...assets].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'size':
          aValue = a.size;
          bValue = b.size;
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // Filter assets by status
  const filteredAssets = assets.filter(asset => {
    if (statusFilter === 'all') return true;
    return asset.status === statusFilter;
  });

  const sortedAssets = sortAssets(filteredAssets, sortBy, sortDirection);

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortDirection('asc');
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Toolbar */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Appearance */}
            <AppearancePopover
              settings={appearanceSettings}
              onSettingsChange={handleAppearanceChange}
            />
            
            {/* Sort */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-muted px-3 py-2 h-8 flex items-center"
                >
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Sorted by</span>
                  <span className="text-sm ml-1 capitalize">{sortBy}</span>
                  <ChevronDown className="w-3 h-3 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => handleSort('name')}>
                  Name {sortBy === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('date')}>
                  Date {sortBy === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('size')}>
                  Size {sortBy === 'size' && (sortDirection === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('type')}>
                  Type {sortBy === 'type' && (sortDirection === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-muted px-3 py-2 h-8 flex items-center"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Status:</span>
                  <span className="text-sm ml-1 capitalize">{statusFilter === 'all' ? 'All' : statusFilter}</span>
                  <ChevronDown className="w-3 h-3 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  All {statusFilter === 'all' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('approved')}>
                  Approved {statusFilter === 'approved' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('draft')}>
                  Draft {statusFilter === 'draft' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('review')}>
                  Review {statusFilter === 'review' && '✓'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search in Key Scenes"
                className="bg-background rounded-md pl-9 pr-3 py-1.5 text-sm text-white placeholder-gray-400 w-64 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            
            {/* User avatars */}
            <div className="flex items-center -space-x-2">
              {Array.from(new Set(sortedAssets.map(asset => asset.uploadedBy.name))).slice(0, 4).map((userName, index) => {
                const user = sortedAssets.find(asset => asset.uploadedBy.name === userName)?.uploadedBy;
                return (
                  <img
                    key={userName}
                    src={user?.avatar}
                    alt={userName}
                    className="w-8 h-8 rounded-full ring-2 ring-background"
                    title={userName}
                  />
                );
              })}
              {Array.from(new Set(sortedAssets.map(asset => asset.uploadedBy.name))).length > 4 && (
                <div className="w-8 h-8 rounded-full bg-muted ring-2 ring-background flex items-center justify-center text-xs text-gray-400">
                  +{Array.from(new Set(sortedAssets.map(asset => asset.uploadedBy.name))).length - 4}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="text-sm text-gray-400 pl-2">
          <span className="text-white font-medium">{sortedAssets.length} Assets</span>
          {' • '}
          <span>1623 GB</span>
        </div>
      </div>

      {/* Asset Grid */}
      <LayoutGroup>
        <motion.div
          className={cn(
            "p-4 flex-1 overflow-y-auto pb-20",
            viewMode === "grid" 
              ? "" 
              : "flex flex-col space-y-2"
          )}
          style={{
            columnCount: viewMode === "grid" 
              ? appearanceSettings.cardSize === 'S' ? 6 : appearanceSettings.cardSize === 'L' ? 3 : 4
              : undefined,
            columnGap: viewMode === "grid" ? '16px' : undefined,
            columnFill: 'balance',
            columnWidth: viewMode === "grid" 
              ? appearanceSettings.cardSize === 'S' ? '180px' : appearanceSettings.cardSize === 'L' ? '320px' : '240px'
              : undefined
          }}
          layout
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
        {sortedAssets.map((asset, index) => (
          <motion.div 
            key={asset.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.02 }}
            transition={{ 
              layout: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.3, delay: index * 0.03 },
              scale: { duration: 0.3, delay: index * 0.03 },
              hover: { duration: 0.2 }
            }}
          >
            <AssetCard
              asset={asset}
              isSelected={selectedAssets.some((a) => a.id === asset.id)}
              onSelect={onAssetSelect}
              onPreview={onAssetPreview}
              onDetail={onAssetDetail}
              viewMode={viewMode}
              appearanceSettings={appearanceSettings}
            />
          </motion.div>
        ))}
        </motion.div>
      </LayoutGroup>
    </div>
  );
}
