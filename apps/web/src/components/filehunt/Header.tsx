"use client";

import { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Grid3X3, 
  List, 
  GalleryVerticalEnd, 
  Search,
  File,
  FolderOpen,
  FolderPlus,
  Users,
  GitBranch
} from 'lucide-react';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu';
import { ThemeSelector } from '@/components/theme-selector';
import { AppView } from './VerticalNav';

export type ViewMode = 'grid' | 'list' | 'gallery';

interface HeaderProps {
  onViewChange?: (view: AppView) => void;
  onUploadFiles?: (files: FileList) => void;
  onCreateFolder?: (folderData: { name: string; description: string; parentFolder?: string }) => void;
  onCreateCollection?: (collectionData?: { name: string; description: string }) => void;
  onCreateBranch?: (branchData?: { name: string; description: string; parentBranch?: string }) => void;
  currentView?: AppView;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
}

export function Header({
  onViewChange,
  onUploadFiles,
  onCreateFolder,
  onCreateCollection,
  onCreateBranch,
  currentView = 'main',
  viewMode = 'grid',
  onViewModeChange
}: HeaderProps) {
  const [searchValue, setSearchValue] = useState('');

  const handleAction = (action: string) => {
    switch (action) {
      case 'upload-file':
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.accept = 'image/*,video/*,audio/*,.pdf,.doc,.docx,.txt';
        fileInput.onchange = (e) => {
          const files = (e.target as HTMLInputElement).files;
          if (files && files.length > 0) {
            if (onUploadFiles) {
              onUploadFiles(files);
            } else {
              onViewChange?.('upload');
            }
          }
        };
        fileInput.click();
        break;
      case 'upload-folder':
        const folderInput = document.createElement('input');
        folderInput.type = 'file';
        folderInput.webkitdirectory = true;
        folderInput.onchange = (e) => {
          const files = (e.target as HTMLInputElement).files;
          if (files && files.length > 0) {
            if (onUploadFiles) {
              onUploadFiles(files);
            } else {
              onViewChange?.('upload');
            }
          }
        };
        folderInput.click();
        break;
      case 'new-folder':
        // TODO: Show new folder dialog
        console.log('New folder action');
        break;
      case 'new-collection':
        if (onCreateCollection) {
          onCreateCollection();
        } else {
          onViewChange?.('collections');
        }
        break;
      case 'new-branch':
        if (onCreateBranch) {
          onCreateBranch();
        } else {
          onViewChange?.('branches');
        }
        break;
    }
  };

  const getAvailableActions = () => {
    const uploadActions = [
      {
        key: 'upload-file',
        label: 'Upload File',
        icon: File,
        description: 'Upload single or multiple files'
      },
      {
        key: 'upload-folder',
        label: 'Upload Folder',
        icon: FolderOpen,
        description: 'Upload an entire folder'
      }
    ];

    const createActions = [];

    if (['main', 'search', 'collections', 'asset-detail'].includes(currentView)) {
      createActions.push({
        key: 'new-folder',
        label: 'New Folder',
        icon: FolderPlus,
        description: 'Create a new folder'
      });
    }

    if (currentView !== 'collections') {
      createActions.push({
        key: 'new-collection',
        label: 'New Collection',
        icon: Users,
        description: 'Create a new collection'
      });
    }

    if (currentView !== 'branches') {
      createActions.push({
        key: 'new-branch',
        label: 'New Branch',
        icon: GitBranch,
        description: 'Create a new branch'
      });
    }

    return { uploadActions, createActions };
  };

  const { uploadActions, createActions } = getAvailableActions();

  const handleViewModeClick = (mode: ViewMode) => {
    if (onViewModeChange) {
      onViewModeChange(mode);
    }
  };

  const getViewModeButtonClass = (mode: ViewMode) => {
    return viewMode === mode ? 'text-primary' : 'text-muted-foreground hover:text-foreground';
  };

  const shouldShowViewControls = () => {
    return ['main', 'search', 'collections'].includes(currentView);
  };

  return (
    <div className="h-[60px] flex items-center justify-between px-4" style={{ backgroundColor: 'transparent' }}>
      {/* Left side - Logo and Breadcrumb */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded flex items-center justify-center">
            <div className="w-4 h-4 bg-primary-foreground/20 rounded-sm"></div>
          </div>
          <h1 className="text-lg font-bold text-foreground">Filehunt</h1>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">All Assets</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground">Key Scenes</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      {/* Right side - Controls */}
      <div className="flex items-center space-x-4">
        {/* View controls */}
        {shouldShowViewControls() && onViewModeChange && (
          <div className="flex items-center space-x-2 bg-accent/30 rounded-md p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewModeClick('grid')}
              className={`h-7 w-7 p-0 ${getViewModeButtonClass('grid')}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewModeClick('list')}
              className={`h-7 w-7 p-0 ${getViewModeButtonClass('list')}`}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewModeClick('gallery')}
              className={`h-7 w-7 p-0 ${getViewModeButtonClass('gallery')}`}
            >
              <GalleryVerticalEnd className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* New Button with Dropdown */}
        {(uploadActions.length > 0 || createActions.length > 0) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New
                <ChevronDown className="w-3 h-3 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
              {uploadActions.length > 0 && (
                <>
                  <DropdownMenuLabel>Upload</DropdownMenuLabel>
                  {uploadActions.map((action) => (
                    <DropdownMenuItem
                      key={action.key}
                      onClick={() => handleAction(action.key)}
                      className="flex items-start space-x-3 p-3"
                    >
                      <action.icon className="w-4 h-4 mt-0.5 text-primary" />
                      <div className="space-y-1">
                        <div className="font-medium">{action.label}</div>
                        <div className="text-xs text-muted-foreground">{action.description}</div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  {createActions.length > 0 && <DropdownMenuSeparator />}
                </>
              )}

              {createActions.length > 0 && (
                <>
                  <DropdownMenuLabel>Create</DropdownMenuLabel>
                  {createActions.map((action) => (
                    <DropdownMenuItem
                      key={action.key}
                      onClick={() => handleAction(action.key)}
                      className="flex items-start space-x-3 p-3"
                    >
                      <action.icon className="w-4 h-4 mt-0.5 text-primary" />
                      <div className="space-y-1">
                        <div className="font-medium">{action.label}</div>
                        <div className="text-xs text-muted-foreground">{action.description}</div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search assets..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 w-48 h-8"
          />
        </div>

        {/* Theme Selector */}
        <ThemeSelector />
      </div>
    </div>
  );
}
