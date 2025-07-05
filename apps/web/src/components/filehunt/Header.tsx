"use client";

import { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  ChevronUp,
  Plus, 
  Grid3X3, 
  List, 
  GalleryVerticalEnd, 
  Search,
  File,
  FolderOpen,
  FolderPlus,
  Users,
  GitBranch,
  Bell,
  Check,
  Clock,
  AlertCircle
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
import { Branch } from '@/data/branches';

export type ViewMode = 'grid' | 'list' | 'gallery';

interface Notification {
  id: string;
  type: 'approval' | 'activity' | 'system' | 'collaboration';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  avatar?: string;
  priority?: 'low' | 'medium' | 'high';
}

interface HeaderProps {
  onViewChange?: (view: AppView) => void;
  onUploadFiles?: (files: FileList) => void;
  onCreateFolder?: (folderData: { name: string; description: string; parentFolder?: string }) => void;
  onCreateCollection?: (collectionData?: { name: string; description: string }) => void;
  onCreateBranch?: (branchData?: { name: string; description: string; parentBranch?: string }) => void;
  currentView?: AppView;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  // Branch management
  currentBranch?: Branch;
  availableBranches?: Branch[];
  onBranchChange?: (branchId: string) => void;
  // Notifications
  notifications?: Notification[];
  onNotificationClick?: (notificationId: string) => void;
  onMarkAllNotificationsRead?: () => void;
}

export function Header({
  onViewChange,
  onUploadFiles,
  onCreateFolder,
  onCreateCollection,
  onCreateBranch,
  currentView = 'main',
  viewMode = 'grid',
  onViewModeChange,
  currentBranch,
  availableBranches = [],
  onBranchChange,
  notifications = [],
  onNotificationClick,
  onMarkAllNotificationsRead
}: HeaderProps) {
  const [searchValue, setSearchValue] = useState('');
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);

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

    createActions.push({
      key: 'new-branch',
      label: 'New Branch',
      icon: GitBranch,
      description: 'Create a new branch'
    });

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
      {/* Left side - Logo, Branch Switcher and Breadcrumb */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded flex items-center justify-center">
            <div className="w-4 h-4 bg-primary-foreground/20 rounded-sm"></div>
          </div>
          <h1 className="text-lg font-bold text-foreground">Filehunt</h1>
        </div>

        {/* Branch Switcher - VS Code/Obsidian style - Always visible */}
        <DropdownMenu onOpenChange={setIsBranchDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-3 text-sm font-medium hover:bg-accent border border-border/50 hover:border-border transition-all"
            >
              <GitBranch className="w-4 h-4 mr-2" />
              <span>{currentBranch?.name || 'main'}</span>
              {isBranchDropdownOpen ? (
                <ChevronUp className="w-3 h-3 ml-2" />
              ) : (
                <ChevronDown className="w-3 h-3 ml-2" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72" align="start">
            <DropdownMenuLabel className="flex items-center space-x-2">
              <GitBranch className="w-4 h-4" />
              <span>Switch branch</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-64 overflow-y-auto">
              {availableBranches.length > 0 ? availableBranches.map((branch) => (
                <DropdownMenuItem
                  key={branch.id}
                  onClick={() => onBranchChange?.(branch.id)}
                  className="flex items-center justify-between px-3 py-2 cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <GitBranch className={`w-4 h-4 flex-shrink-0 ${
                      branch.id === currentBranch?.id ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium truncate ${
                        branch.id === currentBranch?.id ? 'text-primary' : 'text-foreground'
                      }`}>
                        {branch.name}
                      </div>
                      {branch.description && (
                        <div className="text-xs text-muted-foreground truncate">
                          {branch.description}
                        </div>
                      )}
                    </div>
                  </div>
                  {branch.id === currentBranch?.id && (
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                </DropdownMenuItem>
              )) : (
                <DropdownMenuItem disabled className="text-center text-muted-foreground">
                  No branches available
                </DropdownMenuItem>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

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

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">
                    {notifications.filter(n => !n.isRead).length}
                  </span>
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end">
            <div className="flex items-center justify-between p-3">
              <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
              {notifications.filter(n => !n.isRead).length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMarkAllNotificationsRead}
                  className="h-6 px-2 text-xs"
                >
                  Mark all read
                </Button>
              )}
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    onClick={() => onNotificationClick?.(notification.id)}
                    className={`flex items-start space-x-3 p-3 cursor-pointer ${
                      !notification.isRead ? 'bg-accent/20' : ''
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {notification.type === 'approval' && (
                        <Check className="w-4 h-4 text-green-500" />
                      )}
                      {notification.type === 'activity' && (
                        <Clock className="w-4 h-4 text-blue-500" />
                      )}
                      {notification.type === 'system' && (
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                      )}
                      {notification.type === 'collaboration' && (
                        <Users className="w-4 h-4 text-purple-500" />
                      )}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm">{notification.title}</div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{notification.message}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(notification.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Selector */}
        <ThemeSelector />
      </div>
    </div>
  );
}
