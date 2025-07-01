import { useState } from 'react';
import { VerticalNav } from './components/layout/VerticalNav';
import { LeftSidebar } from './components/layout/LeftSidebar';
import { MainContent } from './components/layout/MainContent';
import { RightSidebar } from './components/layout/RightSidebar';
import { AssetDetail } from './components/AssetDetail';
import { AssetDetailSidebar } from './components/AssetDetailSidebar';
import { UploadScreen } from './components/screens/UploadScreen';
import { SearchScreen } from './components/screens/SearchScreen';
import { CollectionsScreen } from './components/screens/CollectionsScreen';
import { BranchesScreen } from './components/screens/BranchesScreen';

import { SettingsScreen } from './components/screens/SettingsScreen';
import { ActivitiesScreen } from './components/screens/ActivitiesScreen';
import { ActivitiesRightSidebar } from './components/ActivitiesRightSidebar';
import { SearchLeftSidebar } from './components/SearchLeftSidebar';
import { SearchRightSidebar } from './components/SearchRightSidebar';
import { UploadLeftSidebar } from './components/UploadLeftSidebar';
import { UploadRightSidebar } from './components/UploadRightSidebar';
import { CollectionsLeftSidebar } from './components/CollectionsLeftSidebar';
import { CollectionsRightSidebar } from './components/CollectionsRightSidebar';
import { BranchesLeftSidebar } from './components/BranchesLeftSidebar';
import { BranchesRightSidebar } from './components/BranchesRightSidebar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { type Asset, type Collection, type Branch, type UploadFile, type SearchFilters } from '@/shared';

export interface TimelineCommit {
  id: string;
  message: string;
  author: string;
  timestamp: string;
  version: string;
  type: 'commit' | 'merge' | 'branch';
  branch?: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  type: 'comment' | 'approval' | 'rejection' | 'revision-request';
}

export interface Activity {
  id: string;
  type: 'commit' | 'upload' | 'comment' | 'delete' | 'edit' | 'merge' | 'branch' | 'tag' | 'share' | 'approve' | 'reject' | 'archive' | 'favorite' | 'view';
  message: string;
  description?: string;
  author: string;
  authorAvatar: string;
  timestamp: string;
  date: string;
  time: string;
  branch?: string;
  parentBranch?: string;
  tag?: string;
  assetName?: string;
  assetType?: 'image' | 'video' | 'audio' | 'document';
  commitId?: string;
  version?: string;
  branchColor?: string;
  mergeTarget?: string;
  lane?: number;
}

export interface Folder {
  id: string;
  name: string;
  description: string;
  parentFolder?: string;
  createdAt: string;
  createdBy: string;
  assetCount: number;
}

type ViewMode = 'grid' | 'list' | 'gallery' | 'asset-detail';
type AppView = 'main' | 'upload' | 'search' | 'collections' | 'branches' | 'favorites' | 'settings' | 'help' | 'asset-detail' | 'activities';

export default function App() {
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [detailAsset, setDetailAsset] = useState<Asset | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentView, setCurrentView] = useState<AppView>('main');

  // Activities-specific state - Always have a selected activity for the permanent sidebar
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>({
    id: '1',
    type: 'commit',
    message: 'Refactors messaging and adds worker services',
    description: 'Improved message handling system and added background worker services for better performance',
    author: 'Andy Randrianirina',
    authorAvatar: 'AR',
    timestamp: '2h ago',
    date: 'Today',
    time: '3:13 AM',
    branch: 'develop',
    commitId: 'a1b2c3d',
    version: '2.1.3',
    branchColor: '#10b981',
    lane: 1
  });

  // Search-specific state
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [savedSearches, setSavedSearches] = useState<SearchFilters[]>([]);
  const [searchResults, setSearchResults] = useState<Asset[]>([]);

  // Upload-specific state
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  // Collections-specific state
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [collections, setCollections] = useState<Collection[]>([
    {
      id: '1',
      name: 'Product Photography 2024',
      description: 'High-quality product shots for the new collection launch',
      assetCount: 124,
      isPrivate: false,
      isFavorited: true,
      owner: {
        name: 'John Smith',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
      },
      collaborators: [
        {
          name: 'Jane Doe',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=32&h=32&fit=crop&crop=face'
        }
      ],
      createdAt: '2 weeks ago',
      updatedAt: '2 days ago',
      thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      tags: ['product', 'photography', '2024'],
      assets: [],
      createdBy: 'John Smith'
    }
  ]);

  // Branches-specific state
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [branches, setBranches] = useState<Branch[]>([
    {
      id: '1',
      name: 'main',
      description: 'Main production branch',
      isDefault: true,
      isProtected: true,
      commitsAhead: 0,
      commitsBehind: 0,
      lastCommit: {
        id: '1',
        message: 'Update product images with new branding',
        author: {
          name: 'John Smith',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
        },
        timestamp: '2 hours ago',
        hash: 'a1b2c3d'
      },
      createdBy: {
        name: 'System',
        avatar: ''
      },
      createdAt: '2 months ago',
      assetCount: 156
    }
  ]);

  // Folders state
  const [folders, setFolders] = useState<Folder[]>([]);

  const handleAssetSelect = (asset: Asset, isSelected: boolean) => {
    if (isSelected) {
      setSelectedAssets(prev => [...prev, asset]);
    } else {
      setSelectedAssets(prev => prev.filter(a => a.id !== asset.id));
    }
  };

  const handleAssetPreview = (asset: Asset) => {
    setPreviewAsset(asset);
  };

  const handleAssetDetail = (asset: Asset) => {
    setDetailAsset(asset);
    setCurrentView('asset-detail');
    setPreviewAsset(null);
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    setDetailAsset(null);
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view as AppView);
    setPreviewAsset(null);
    setDetailAsset(null);

    // Don't clear activity selection when changing to activities view
    if (view !== 'activities') {
      setSelectedActivity(null);
    }
  };

  const handleActivitySelect = (activity: Activity | null) => {
    setSelectedActivity(activity);
  };

  const clearSelection = () => {
    setSelectedAssets([]);
  };

  const handleTagAdd = (assetId: string, newTag: string) => {
    const updateAsset = (prev: Asset | null) => {
      if (prev && prev.id === assetId) {
        return {
          ...prev,
          tags: [...prev.tags, newTag]
        };
      }
      return prev;
    };

    setPreviewAsset(updateAsset);
    setDetailAsset(updateAsset);
  };

  const handleTagRemove = (assetId: string, tagToRemove: string) => {
    const updateAsset = (prev: Asset | null) => {
      if (prev && prev.id === assetId) {
        return {
          ...prev,
          tags: prev.tags.filter(tag => tag !== tagToRemove)
        };
      }
      return prev;
    };

    setPreviewAsset(updateAsset);
    setDetailAsset(updateAsset);
  };

  const handleFolderAdd = (assetId: string, newFolder: string) => {
    const updateAsset = (prev: Asset | null) => {
      if (prev && prev.id === assetId) {
        return {
          ...prev,
          folders: [...prev.folders, newFolder]
        };
      }
      return prev;
    };

    setPreviewAsset(updateAsset);
    setDetailAsset(updateAsset);
  };

  const handleFolderRemove = (assetId: string, folderToRemove: string) => {
    const updateAsset = (prev: Asset | null) => {
      if (prev && prev.id === assetId) {
        return {
          ...prev,
          folders: prev.folders.filter(folder => folder !== folderToRemove)
        };
      }
      return prev;
    };

    setPreviewAsset(updateAsset);
    setDetailAsset(updateAsset);
  };

  const handleCommentAdd = (assetId: string, comment: Comment) => {
    if (detailAsset && detailAsset.id === assetId) {
      setDetailAsset(prev => ({
        ...prev!,
        assetComments: [...(prev!.assetComments || []), comment],
        comments: prev!.comments + 1
      }));
    }
  };

  const handleStatusUpdate = (assetId: string, newStatus: Asset['status']) => {
    if (detailAsset && detailAsset.id === assetId) {
      setDetailAsset(prev => ({
        ...prev!,
        status: newStatus
      }));
    }
  };

  // Header action handlers
  const handleUploadFiles = (files: FileList) => {
    // Convert FileList to array and add to upload files
    const fileArray = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'pending'
    }));

    setUploadFiles(prev => [...prev, ...fileArray]);
    setCurrentView('upload');
  };

  const handleCreateFolder = (folderData: { name: string; description: string; parentFolder?: string }) => {
    const newFolder: Folder = {
      id: Math.random().toString(36).substr(2, 9),
      name: folderData.name,
      description: folderData.description,
      parentFolder: folderData.parentFolder,
      createdAt: new Date().toISOString(),
      createdBy: 'Current User',
      assetCount: 0
    };

    setFolders(prev => [...prev, newFolder]);

    // Show success message or notification
    console.log('Folder created:', newFolder);
  };

  const handleCreateCollection = (collectionData?: { name: string; description: string }) => {
    if (collectionData) {
      const newCollection: Collection = {
        id: Math.random().toString(36).substr(2, 9),
        name: collectionData.name,
        description: collectionData.description,
        assetCount: 0,
        isPrivate: false,
        isFavorited: false,
        owner: {
          name: 'Current User',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
        },
        collaborators: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: [],
        assets: [],
        createdBy: 'Current User'
      };

      setCollections(prev => [...prev, newCollection]);
      setSelectedCollection(newCollection);
    }

    setCurrentView('collections');
  };

  const handleCreateBranch = (branchData?: { name: string; description: string; parentBranch?: string }) => {
    if (branchData) {
      const newBranch: Branch = {
        id: Math.random().toString(36).substr(2, 9),
        name: branchData.name,
        description: branchData.description,
        isDefault: false,
        isProtected: false,
        commitsAhead: 0,
        commitsBehind: 0,
        lastCommit: {
          id: '1',
          message: 'Initial commit',
          author: {
            name: 'Current User',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
          },
          timestamp: 'now',
          hash: Math.random().toString(36).substr(2, 7)
        },
        createdBy: {
          name: 'Current User',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
        },
        createdAt: new Date().toISOString(),
        assetCount: 0,
        parentBranch: branchData.parentBranch,
        isActive: false,
        commitCount: 0
      };

      setBranches(prev => [...prev, newBranch]);
      setSelectedBranch(newBranch);
    }

    setCurrentView('branches');
  };

  const shouldShowFooter = () => {
    return ['main', 'asset-detail', 'search', 'collections', 'branches'].includes(currentView);
  };

  const shouldShowHeader = () => {
    return ['main', 'search', 'collections', 'branches', 'upload', 'asset-detail'].includes(currentView);
  };

  const shouldShowViewControls = () => {
    return ['main', 'search', 'collections'].includes(currentView);
  };

  const renderLeftSidebar = () => {
    switch (currentView) {
      case 'main':
      case 'asset-detail':
        return <LeftSidebar />;
      case 'search':
        return (
          <SearchLeftSidebar
            filters={searchFilters}
            onFiltersChange={setSearchFilters}
            savedSearches={savedSearches}
            onSavedSearchesChange={setSavedSearches}
          />
        );
      case 'upload':
        return (
          <UploadLeftSidebar
            uploadFiles={uploadFiles}
            onUploadFilesChange={setUploadFiles}
          />
        );
      case 'collections':
        return (
          <CollectionsLeftSidebar
            collections={collections}
            selectedCollection={selectedCollection}
            onCollectionSelect={setSelectedCollection}
          />
        );
      case 'branches':
        return (
          <BranchesLeftSidebar
            branches={branches}
            selectedBranch={selectedBranch}
            onBranchSelect={setSelectedBranch}
          />
        );
      case 'activities':
      case 'settings':
      case 'help':
      case 'favorites':
        return null; // No left sidebar for these views
      default:
        return null;
    }
  };

  const renderRightSidebar = () => {
    switch (currentView) {
      case 'main':
        return (
          <RightSidebar
            previewAsset={previewAsset}
            onClose={() => setPreviewAsset(null)}
            onTagAdd={handleTagAdd}
            onTagRemove={handleTagRemove}
            onFolderAdd={handleFolderAdd}
            onFolderRemove={handleFolderRemove}
          />
        );
      case 'asset-detail':
        return (
          <AssetDetailSidebar
            asset={detailAsset}
            onCommentAdd={handleCommentAdd}
            onStatusUpdate={handleStatusUpdate}
          />
        );
      case 'search':
        return (
          <SearchRightSidebar
            searchResults={searchResults}
            filters={searchFilters}
          />
        );
      case 'upload':
        return null; // No right sidebar for upload screen
      case 'collections':
        return (
          <CollectionsRightSidebar
            selectedCollection={selectedCollection}
          />
        );
      case 'branches':
        return (
          <BranchesRightSidebar
            selectedBranch={selectedBranch}
          />
        );
      case 'activities':
        // Always show the activities sidebar - no onClose needed since it's permanent
        return (
          <ActivitiesRightSidebar
            selectedActivity={selectedActivity}
            onClose={() => {}} // Empty function since sidebar is permanent
          />
        );
      case 'settings':
      case 'help':
      case 'favorites':
        return null; // No right sidebar for these views
      default:
        return null;
    }
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
            viewMode={viewMode as 'grid' | 'list' | 'gallery'}
            onViewModeChange={(mode) => setViewMode(mode)}
          />
        );

      case 'upload':
        return <UploadScreen />;

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
            viewMode={viewMode as 'grid' | 'list' | 'gallery'}
          />
        );

      case 'collections':
        return (
          <CollectionsScreen
            collections={collections}
            onCollectionsChange={setCollections}
            selectedCollection={selectedCollection || collections[0]}
            onCollectionSelect={setSelectedCollection}
          />
        );

      case 'branches':
        return (
          <BranchesScreen
            branches={branches}
            onBranchesChange={setBranches}
            selectedBranch={selectedBranch || branches[0]}
            onBranchSelect={setSelectedBranch}
          />
        );

      case 'activities':
        return (
          <ActivitiesScreen
            selectedActivity={selectedActivity}
            onActivitySelect={handleActivitySelect}
          />
        );

      case 'favorites':
        return (
          <div className="flex-1 bg-[#1a1d29] flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-white text-2xl mb-4">Favorites</h2>
              <p className="text-gray-400">Your favorited assets will appear here.</p>
            </div>
          </div>
        );

      case 'settings':
        return <SettingsScreen />;

      case 'help':
        return (
          <div className="flex-1 bg-[#1a1d29] flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-white text-2xl mb-4">Help &amp; Support</h2>
              <p className="text-gray-400">Documentation, tutorials, and support resources.</p>
            </div>
          </div>
        );

      case 'asset-detail':
        return (
          <AssetDetail
            asset={detailAsset}
            onBack={handleBackToMain}
            onTagAdd={handleTagAdd}
            onTagRemove={handleTagRemove}
            onFolderAdd={handleFolderAdd}
            onFolderRemove={handleFolderRemove}
            onStatusUpdate={handleStatusUpdate}
          />
        );

      default:
        return (
          <div className="flex-1 bg-[#1a1d29] flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-white text-2xl mb-4">Coming Soon</h2>
              <p className="text-gray-400">This feature is under development.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen bg-[#1f2029] text-white flex">
      {/* Vertical Navigation - Full height */}
      <VerticalNav currentView={currentView} onViewChange={handleViewChange} />

      {/* Main App Content */}
      <div className="flex-1 flex flex-col">
        {shouldShowHeader() && (
          <Header
            onViewChange={handleViewChange}
            onUploadFiles={handleUploadFiles}
            onCreateFolder={handleCreateFolder}
            onCreateCollection={handleCreateCollection}
            onCreateBranch={handleCreateBranch}
            currentView={currentView}
            viewMode={shouldShowViewControls() ? viewMode as 'grid' | 'list' | 'gallery' : undefined}
            onViewModeChange={shouldShowViewControls() ? (mode) => setViewMode(mode) : undefined}
          />
        )}

        <div className="flex flex-1 overflow-hidden">
          {renderLeftSidebar()}
          {renderMainContent()}
          {renderRightSidebar()}
        </div>

        {shouldShowFooter() && (
          <Footer
            selectedAssets={selectedAssets}
            previewAsset={previewAsset}
            onClearSelection={clearSelection}
          />
        )}
      </div>
    </div>
  );
}
