"use client";

import { useState } from 'react';
import { VerticalNav, AppView } from './VerticalNav';
import { Header, ViewMode } from './Header';
import { Footer } from './Footer';
import { MainContent } from './MainContent';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { StatusBar } from './StatusBar';
import { MouseSpotlight } from './MouseSpotlight';
import { Asset, mockAssets } from '@/types/assets';

export default function FilehuntApp() {
  // Core app state
  const [currentView, setCurrentView] = useState<AppView>('main');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [assets, setAssets] = useState<Asset[]>(mockAssets);

  // Navigation handlers
  const handleViewChange = (view: AppView) => {
    setCurrentView(view);
    // Clear selections when changing views
    setSelectedAssets([]);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  // Asset selection handlers
  const handleAssetSelect = (assetId: string, isSelected: boolean) => {
    if (isSelected) {
      // Find the asset and add it to selection
      const asset = mockAssets.find(a => a.id === assetId);
      if (asset) {
        setSelectedAssets(prev => [...prev, asset]);
      }
    } else {
      setSelectedAssets(prev => prev.filter(a => a.id !== assetId));
    }
  };

  const handleClearSelection = () => {
    setSelectedAssets([]);
  };

  // Asset preview and detail handlers
  const handleAssetPreview = (asset: Asset) => {
    setPreviewAsset(asset);
  };

  const handleAssetDetail = (asset: Asset) => {
    // When an asset is clicked, show it in the preview
    setPreviewAsset(asset);
  };

  // Tag and folder management
  const handleTagAdd = (assetId: string, tag: string) => {
    setAssets(prevAssets => 
      prevAssets.map(asset => 
        asset.id === assetId 
          ? { ...asset, tags: [...asset.tags, tag] }
          : asset
      )
    );
    
    // Update preview asset if it's the same
    if (previewAsset && previewAsset.id === assetId) {
      setPreviewAsset({ ...previewAsset, tags: [...previewAsset.tags, tag] });
    }
  };

  const handleTagRemove = (assetId: string, tag: string) => {
    setAssets(prevAssets => 
      prevAssets.map(asset => 
        asset.id === assetId 
          ? { ...asset, tags: asset.tags.filter(t => t !== tag) }
          : asset
      )
    );
    
    // Update preview asset if it's the same
    if (previewAsset && previewAsset.id === assetId) {
      setPreviewAsset({ ...previewAsset, tags: previewAsset.tags.filter(t => t !== tag) });
    }
  };

  const handleFolderAdd = (assetId: string, folder: string) => {
    setAssets(prevAssets => 
      prevAssets.map(asset => 
        asset.id === assetId 
          ? { ...asset, folders: [...asset.folders, folder] }
          : asset
      )
    );
    
    // Update preview asset if it's the same
    if (previewAsset && previewAsset.id === assetId) {
      setPreviewAsset({ ...previewAsset, folders: [...previewAsset.folders, folder] });
    }
  };

  const handleFolderRemove = (assetId: string, folder: string) => {
    setAssets(prevAssets => 
      prevAssets.map(asset => 
        asset.id === assetId 
          ? { ...asset, folders: asset.folders.filter(f => f !== folder) }
          : asset
      )
    );
    
    // Update preview asset if it's the same
    if (previewAsset && previewAsset.id === assetId) {
      setPreviewAsset({ ...previewAsset, folders: previewAsset.folders.filter(f => f !== folder) });
    }
  };

  const handleClosePreview = () => {
    setPreviewAsset(null);
  };

  // File upload handler
  const handleUploadFiles = (files: FileList) => {
    console.log('Upload files:', Array.from(files).map(f => f.name));
    setCurrentView('upload');
  };

  // Create handlers (placeholder for now)
  const handleCreateFolder = (folderData: { name: string; description: string; parentFolder?: string }) => {
    console.log('Create folder:', folderData);
  };

  const handleCreateCollection = (collectionData?: { name: string; description: string }) => {
    console.log('Create collection:', collectionData);
    setCurrentView('collections');
  };

  const handleCreateBranch = (branchData?: { name: string; description: string; parentBranch?: string }) => {
    console.log('Create branch:', branchData);
    setCurrentView('branches');
  };

  // Footer action handlers (placeholder for now)
  const handleDownload = (assets: Asset[]) => {
    console.log('Download assets:', assets.map(a => a.name));
  };

  const handleShare = (assets: Asset[]) => {
    console.log('Share assets:', assets.map(a => a.name));
  };

  const handleDelete = (assets: Asset[]) => {
    console.log('Delete assets:', assets.map(a => a.name));
    setSelectedAssets([]);
  };

  const handleArchive = (assets: Asset[]) => {
    console.log('Archive assets:', assets.map(a => a.name));
    setSelectedAssets([]);
  };

  const handleAddToFolder = (assets: Asset[]) => {
    console.log('Add to folder:', assets.map(a => a.name));
  };

  const handleAddTags = (assets: Asset[]) => {
    console.log('Add tags to:', assets.map(a => a.name));
  };

  // Determine which components to show based on current view
  const shouldShowHeader = () => {
    return ['main', 'search', 'collections', 'branches', 'upload', 'asset-detail'].includes(currentView);
  };

  const shouldShowFooter = () => {
    return true; // Footer is now always visible as part of the app design
  };

  const shouldShowViewControls = () => {
    return ['main', 'search', 'collections'].includes(currentView);
  };

  const renderMainContent = () => {
    switch (currentView) {
      case 'main':
        return (
          <MainContent
            selectedAssets={selectedAssets}
            onAssetSelect={handleAssetSelect}
            onAssetPreview={handleAssetPreview}
            onAssetDetail={handleAssetDetail}
            viewMode={viewMode}
          />
        );

      case 'search':
        return (
          <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: 'transparent' }}>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Search View</h2>
              <p className="text-muted-foreground">Search functionality will be implemented in Iteration 4</p>
            </div>
          </div>
        );

      case 'upload':
        return (
          <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: 'transparent' }}>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Upload View</h2>
              <p className="text-muted-foreground">Upload interface will be implemented in Iteration 3</p>
            </div>
          </div>
        );

      case 'collections':
        return (
          <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: 'transparent' }}>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Collections View</h2>
              <p className="text-muted-foreground">Collections management will be implemented in Iteration 5</p>
            </div>
          </div>
        );

      case 'branches':
        return (
          <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: 'transparent' }}>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Branches View</h2>
              <p className="text-muted-foreground">Git-like branching will be implemented in Iteration 5</p>
            </div>
          </div>
        );

      case 'activities':
        return (
          <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: 'transparent' }}>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Activities View</h2>
              <p className="text-muted-foreground">Activity timeline will be implemented in Iteration 6</p>
            </div>
          </div>
        );

      case 'favorites':
        return (
          <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: 'transparent' }}>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Favorites View</h2>
              <p className="text-muted-foreground">Your favorited assets will appear here</p>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: 'transparent' }}>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Settings View</h2>
              <p className="text-muted-foreground">Settings panel will be implemented in Iteration 7</p>
            </div>
          </div>
        );

      case 'help':
        return (
          <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: 'transparent' }}>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Help & Support</h2>
              <p className="text-muted-foreground">Documentation, tutorials, and support resources</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: 'transparent' }}>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Coming Soon</h2>
              <p className="text-muted-foreground">This feature is under development</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen eagle-bg text-foreground flex relative">
      {/* Mouse Following Spotlight Background Effect */}
      <MouseSpotlight />
      
      {/* Vertical Navigation */}
      <div className="relative z-10">
        <VerticalNav currentView={currentView} onViewChange={handleViewChange} />
      </div>

      {/* Main App Content */}
      <div className="flex-1 flex flex-col relative z-10">
        {shouldShowHeader() && (
          <Header
            onViewChange={handleViewChange}
            onUploadFiles={handleUploadFiles}
            onCreateFolder={handleCreateFolder}
            onCreateCollection={handleCreateCollection}
            onCreateBranch={handleCreateBranch}
            currentView={currentView}
            viewMode={shouldShowViewControls() ? viewMode : undefined}
            onViewModeChange={shouldShowViewControls() ? handleViewModeChange : undefined}
          />
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          {currentView === 'main' && (
            <LeftSidebar />
          )}

          {/* Main Content */}
          {renderMainContent()}

          {/* Right Sidebar - Always present in main view */}
          {currentView === 'main' && (
            <RightSidebar
              previewAsset={previewAsset}
              onClose={handleClosePreview}
              onTagAdd={handleTagAdd}
              onTagRemove={handleTagRemove}
              onFolderAdd={handleFolderAdd}
              onFolderRemove={handleFolderRemove}
            />
          )}
        </div>

        {shouldShowFooter() && (
          <Footer
            selectedAssets={selectedAssets}
            onClearSelection={handleClearSelection}
            onDownload={handleDownload}
            onShare={handleShare}
            onDelete={handleDelete}
            onArchive={handleArchive}
            onAddToFolder={handleAddToFolder}
            onAddTags={handleAddTags}
          />
        )}
      </div>

      {/* Status Bar - Fixed at bottom when assets are selected */}
      <StatusBar
        selectedAssets={selectedAssets}
        onClearSelection={handleClearSelection}
        onDownload={handleDownload}
        onShare={handleShare}
        onDelete={handleDelete}
        onArchive={handleArchive}
        onAddToFolder={handleAddToFolder}
        onAddTags={handleAddTags}
      />
    </div>
  );
}
