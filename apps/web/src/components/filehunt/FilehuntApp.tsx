"use client";

import { useState, useEffect } from 'react';
import { VerticalNav, AppView } from './VerticalNav';
import { Header, ViewMode } from './Header';
import { Footer } from './Footer';
import { MainContent } from './MainContent';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { StatusBar } from './StatusBar';
import { MouseSpotlight } from './MouseSpotlight';
import { AssetDetail } from './AssetDetail';
import { AssetDetailSidebar } from './AssetDetailSidebar';
import { Asset, Collection, SearchFilters, SavedSearch, mockAssets } from '@/types/assets';
import { Notification, mockNotifications } from '@/types/notifications';
import { SearchScreen } from './SearchScreen';
import { SearchLeftSidebar } from './SearchLeftSidebar';
import { SearchRightSidebar } from './SearchRightSidebar';
import { UploadScreen } from './UploadScreen';
import { CollectionsScreen } from '@/components/collections/CollectionsScreen';
import { CollectionStatusBar } from '@/components/collections/CollectionStatusBar';
import { BranchesScreen } from '@/components/branches/BranchesScreen';
import { ApprovalsScreen } from '@/components/approvals/ApprovalsScreen';
import { ReleasesScreen } from '@/components/releases/ReleasesScreen';
import { ActivitiesScreen } from '@/components/activities/ActivitiesScreen';
import { SettingsScreen } from '@/components/settings/SettingsScreen';
import { UsersScreen } from '@/components/users/UsersScreen';
import { HelpScreen } from '@/components/help/HelpScreen';
import { mockBranches } from '@/data/branches';

export default function FilehuntApp() {
  // Core app state
  const [currentView, setCurrentView] = useState<AppView>('main');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [detailAsset, setDetailAsset] = useState<Asset | null>(null);
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [previousView, setPreviousView] = useState<AppView>('main');
  
  // Collections state
  const [selectedCollections, setSelectedCollections] = useState<Collection[]>([]);
  
  // Search state
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [searchResults, setSearchResults] = useState<Asset[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  
  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    cardSize: 'M' as 'S' | 'M' | 'L',
    aspectRatio: 'masonry' as 'masonry' | '16:9' | '4:3' | '1:1',
    thumbnailScale: 'fill' as 'fit' | 'fill',
    showCardInfo: false
  });
  
  // Branch management state
  const [currentBranch, setCurrentBranch] = useState(mockBranches[0]); // Start with main branch
  
  
  // Notifications state
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Initialize notifications with mock data
  useEffect(() => {
    setNotifications(mockNotifications);
  }, []);

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
  const handleAssetSelect = (asset: Asset, isSelected: boolean) => {
    if (isSelected) {
      // Add asset to selection if not already selected
      setSelectedAssets(prev => {
        if (prev.some(a => a.id === asset.id)) {
          return prev; // Already selected
        }
        return [...prev, asset];
      });
    } else {
      setSelectedAssets(prev => prev.filter(a => a.id !== asset.id));
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
    // When an asset is double-clicked, show it in detail view
    setPreviousView(currentView);
    setDetailAsset(asset);
    setCurrentView('asset-detail');
  };

  const handleBackFromDetail = () => {
    setDetailAsset(null);
    setCurrentView(previousView);
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
    
    // Update detail asset if it's the same
    if (detailAsset && detailAsset.id === assetId) {
      setDetailAsset({ ...detailAsset, tags: [...detailAsset.tags, tag] });
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
    
    // Update detail asset if it's the same
    if (detailAsset && detailAsset.id === assetId) {
      setDetailAsset({ ...detailAsset, tags: detailAsset.tags.filter(t => t !== tag) });
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
    
    // Update detail asset if it's the same
    if (detailAsset && detailAsset.id === assetId) {
      setDetailAsset({ ...detailAsset, folders: [...detailAsset.folders, folder] });
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
    
    // Update detail asset if it's the same
    if (detailAsset && detailAsset.id === assetId) {
      setDetailAsset({ ...detailAsset, folders: detailAsset.folders.filter(f => f !== folder) });
    }
  };

  const handleClosePreview = () => {
    setPreviewAsset(null);
  };


  // Notification management
  const handleNotificationClick = (notificationId: string) => {
    // Mark notification as read when clicked
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    );
    
    // Navigate to relevant asset or view if needed
    const notification = notifications.find(n => n.id === notificationId);
    if (notification?.assetId) {
      const asset = assets.find(a => a.id === notification.assetId);
      if (asset) {
        handleAssetDetail(asset);
      }
    }
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);
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
  
  // Branch management handler
  const handleBranchChange = (branchId: string) => {
    const branch = mockBranches.find(b => b.id === branchId);
    if (branch) {
      setCurrentBranch(branch);
      console.log('Switched to branch:', branch.name);
    }
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

  // Collection action handlers
  const handleCollectionShare = (collections: Collection[]) => {
    console.log('Share collections:', collections.map(c => c.name));
  };

  const handleCollectionDownload = (collections: Collection[]) => {
    console.log('Download collections:', collections.map(c => c.name));
  };

  const handleCollectionDelete = (collections: Collection[]) => {
    console.log('Delete collections:', collections.map(c => c.name));
    setSelectedCollections([]);
  };

  const handleCollectionEdit = (collections: Collection[]) => {
    console.log('Edit collections:', collections.map(c => c.name));
  };

  const handleCollectionPreview = (collections: Collection[]) => {
    console.log('Preview collections:', collections.map(c => c.name));
  };

  const handleClearCollectionSelection = () => {
    setSelectedCollections([]);
  };

  // Status update handler for asset detail
  const handleStatusUpdate = (assetId: string, status: Asset['status']) => {
    setAssets(prevAssets => 
      prevAssets.map(asset => 
        asset.id === assetId 
          ? { ...asset, status }
          : asset
      )
    );
    
    // Update detail asset if it's the same
    if (detailAsset && detailAsset.id === assetId) {
      setDetailAsset({ ...detailAsset, status });
    }
  };

  // Determine which components to show based on current view
  const shouldShowHeader = () => {
    return ['main', 'search', 'upload', 'collections', 'branches', 'approvals', 'releases', 'activity', 'users', 'settings', 'help', 'asset-detail'].includes(currentView);
  };

  const shouldShowFooter = () => {
    return true; // Footer is now always visible as part of the app design
  };

  const shouldShowViewControls = () => {
    return ['main', 'search', 'collections'].includes(currentView);
  };

  const shouldShowAppearanceControls = () => {
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
            appearanceSettings={appearanceSettings}
            onAppearanceSettingsChange={setAppearanceSettings}
          />
        );

      case 'asset-detail':
        return (
          <AssetDetail
            asset={detailAsset}
            onBack={handleBackFromDetail}
            onTagAdd={handleTagAdd}
            onTagRemove={handleTagRemove}
            onFolderAdd={handleFolderAdd}
            onFolderRemove={handleFolderRemove}
            onStatusUpdate={handleStatusUpdate}
          />
        );

      case 'search':
        return (
          <SearchScreen
            filters={searchFilters}
            onFiltersChange={setSearchFilters}
            searchResults={searchResults}
            onSearchResultsChange={setSearchResults}
            onAssetSelect={handleAssetSelect}
            onAssetPreview={handleAssetPreview}
            onAssetDetail={handleAssetDetail}
            viewMode={viewMode}
            selectedAssets={selectedAssets}
            appearanceSettings={appearanceSettings}
          />
        );

      case 'upload':
        return (
          <UploadScreen
            onUpload={(uploadedFiles) => {
              // Handle uploaded files - convert to Asset format and add to assets
              const newAssets: Asset[] = uploadedFiles.map(file => ({
                id: file.id,
                name: file.file.name,
                type: file.file.type.split('/')[0] as 'image' | 'video' | 'audio' | 'document',
                size: file.file.size,
                url: file.preview || '/placeholder-file.png',
                thumbnailUrl: file.preview || '/placeholder-file.png',
                tags: file.tags,
                folders: file.folders,
                status: 'approved' as const,
                createdAt: new Date().toISOString(),
                uploadedBy: {
                  id: 'current-user',
                  name: 'Current User',
                  avatar: '/avatar-placeholder.png'
                },
                metadata: {
                  width: 1920,
                  height: 1080,
                  format: file.file.type.split('/')[1] || 'unknown',
                  colorProfile: 'sRGB',
                  camera: 'Unknown',
                  lens: 'Unknown',
                  settings: 'Unknown'
                },
                description: '',
                version: '1.0',
                isPrivate: false
              }));
              
              // Add new assets to the main assets list
              setAssets(prev => [...prev, ...newAssets]);
              
              // Navigate back to main view to see uploaded files
              setCurrentView('main');
              console.log('Uploaded files successfully:', newAssets.map(a => a.name));
            }}
            onBack={() => setCurrentView('main')}
          />
        );

      case 'collections':
        return (
          <CollectionsScreen
            onNavigateToAssets={(collectionId) => {
              // Navigate to main view with the selected collection pre-filtered
              console.log('Navigate to assets with collection:', collectionId);
              setCurrentView('main');
            }}
            viewMode={viewMode}
            appearanceSettings={appearanceSettings}
            selectedCollections={selectedCollections}
            onSelectedCollectionsChange={setSelectedCollections}
            onCollectionCreated={(newCollection) => {
              console.log('New collection created:', newCollection.name);
            }}
          />
        );

      case 'branches':
        return (
          <BranchesScreen />
        );

      case 'approvals':
        return (
          <ApprovalsScreen />
        );

      case 'releases':
        return (
          <ReleasesScreen />
        );

      case 'activity':
        return (
          <ActivitiesScreen />
        );



      case 'settings':
        return (
          <SettingsScreen />
        );

      case 'users':
        return (
          <UsersScreen />
        );

      case 'help':
        return (
          <HelpScreen />
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
    <div className={`h-screen eagle-bg text-foreground flex relative`}>
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
            currentBranch={currentBranch}
            availableBranches={mockBranches}
            onBranchChange={handleBranchChange}
            notifications={notifications}
            onNotificationClick={handleNotificationClick}
            onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
          />
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          {(currentView === 'main' || currentView === 'asset-detail') && (
            <LeftSidebar />
          )}
          
          {/* Search Left Sidebar */}
          {currentView === 'search' && (
            <SearchLeftSidebar
              filters={searchFilters}
              onFiltersChange={setSearchFilters}
              savedSearches={savedSearches}
              onSavedSearchesChange={setSavedSearches}
            />
          )}

          {/* Main Content */}
          {renderMainContent()}

          {/* Right Sidebar - Different for main and asset-detail views */}
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
          
          {currentView === 'asset-detail' && (
            <div className="pr-4">
              <AssetDetailSidebar
                asset={detailAsset}
                onCommentAdd={(assetId, comment) => console.log('Comment added:', comment)}
                onStatusUpdate={handleStatusUpdate}
              />
            </div>
          )}
          
          {/* Search Right Sidebar */}
          {currentView === 'search' && (
            <SearchRightSidebar
              searchResults={searchResults}
              filters={searchFilters}
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
      {currentView !== 'collections' && (
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
      )}
      
      {/* Collection Status Bar - Only for collections view */}
      {currentView === 'collections' && (
        <CollectionStatusBar
          selectedCollections={selectedCollections}
          onClearSelection={handleClearCollectionSelection}
          onShare={handleCollectionShare}
          onDownload={handleCollectionDownload}
          onDelete={handleCollectionDelete}
          onEdit={handleCollectionEdit}
          onPreview={handleCollectionPreview}
        />
      )}
    </div>
  );
}
