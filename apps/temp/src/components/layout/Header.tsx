import { useState } from 'react';
import { ChevronRight, ChevronDown, Plus, Grid3X3, List, GalleryVerticalEnd, Search, Upload, FolderPlus, FolderOpen, Users, GitBranch, File } from 'lucide-react';
import { Button, Popover, PopoverContent, PopoverTrigger, Separator } from '@filehunt/shared-ts/ui';
import { NewFolderDialog } from '../dam/NewFolderDialog';

interface HeaderProps {
  onViewChange?: (view: string) => void;
  onUploadFiles?: (files: FileList) => void;
  onCreateFolder?: (folderData: { name: string; description: string; parentFolder?: string }) => void;
  onCreateCollection?: (collectionData?: { name: string; description: string }) => void;
  onCreateBranch?: (branchData?: { name: string; description: string; parentBranch?: string }) => void;
  currentView?: string;
  viewMode?: 'grid' | 'list' | 'gallery';
  onViewModeChange?: (mode: 'grid' | 'list' | 'gallery') => void;
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
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleAction = (action: string) => {
    setIsPopoverOpen(false); // Close popover after action

    switch (action) {
      case 'upload-file':
        // Trigger file picker
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
        // Trigger folder picker
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
        // Show new folder dialog
        setIsNewFolderDialogOpen(true);
        break;
      case 'new-collection':
        // Navigate to collections view or create collection
        if (onCreateCollection) {
          onCreateCollection();
        } else {
          onViewChange?.('collections');
        }
        break;
      case 'new-branch':
        // Navigate to branches view or create branch
        if (onCreateBranch) {
          onCreateBranch();
        } else {
          onViewChange?.('branches');
        }
        break;
    }
  };

  const handleCreateFolderSubmit = (folderData: { name: string; description: string; parentFolder?: string }) => {
    if (onCreateFolder) {
      onCreateFolder(folderData);
    } else {
      // Fallback: just navigate to main view
      onViewChange?.('main');
    }
    setIsNewFolderDialogOpen(false);
  };

  // Determine which actions are available based on current view
  const getAvailableActions = () => {
    const uploadActions = [
      {
        key: 'upload-file',
        label: 'Upload File',
        icon: File,
        color: 'text-blue-400'
      },
      {
        key: 'upload-folder',
        label: 'Upload Folder',
        icon: FolderOpen,
        color: 'text-blue-400'
      }
    ];

    const createActions = [];

    // New Folder is available on most views
    if (['main', 'search', 'collections', 'asset-detail'].includes(currentView)) {
      createActions.push({
        key: 'new-folder',
        label: 'New Folder',
        icon: FolderPlus,
        color: 'text-green-400'
      });
    }

    // New Collection is available everywhere except collections view (unless we want to allow nested collections)
    if (currentView !== 'collections') {
      createActions.push({
        key: 'new-collection',
        label: 'New Collection',
        icon: Users,
        color: 'text-purple-400'
      });
    }

    // New Branch is available everywhere except branches view (unless we want to allow sub-branches)
    if (currentView !== 'branches') {
      createActions.push({
        key: 'new-branch',
        label: 'New Branch',
        icon: GitBranch,
        color: 'text-orange-400'
      });
    }

    return { uploadActions, createActions };
  };

  const { uploadActions, createActions } = getAvailableActions();

  const handleViewModeClick = (mode: 'grid' | 'list' | 'gallery') => {
    if (onViewModeChange) {
      onViewModeChange(mode);
    }
  };

  const getViewModeButtonClass = (mode: 'grid' | 'list' | 'gallery') => {
    const baseClass = "w-4 h-4 cursor-pointer transition-colors";
    if (viewMode === mode) {
      return `${baseClass} text-blue-400`; // Active state
    }
    return `${baseClass} text-gray-500 hover:text-white`; // Inactive state
  };

  return (
    <>
      <div className="bg-[#292b36] border-b border-[#373a4b] h-[60px] flex items-center justify-between px-4">
        {/* Left side - Logo and Breadcrumb */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded flex items-center justify-center">
              <div className="w-4 h-4 bg-white/20 rounded-sm"></div>
            </div>
            <h1 className="text-lg font-bold text-white">Filehunt</h1>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">All Assets</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-white">Key Scenes</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Right side - Controls and Search */}
        <div className="flex items-center space-x-4">
          {/* View controls - moved before New button */}
          {onViewModeChange && (
            <div className="flex items-center space-x-2">
              <Grid3X3
                className={getViewModeButtonClass('grid')}
                onClick={() => handleViewModeClick('grid')}
              />
              <List
                className={getViewModeButtonClass('list')}
                onClick={() => handleViewModeClick('list')}
              />
              <GalleryVerticalEnd
                className={getViewModeButtonClass('gallery')}
                onClick={() => handleViewModeClick('gallery')}
              />
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          )}

          {/* New Button with Popover - Only show if there are available actions */}
          {(uploadActions.length > 0 || createActions.length > 0) && (
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="secondary" size="sm" className="bg-gray-600 hover:bg-gray-500 text-white border-none">
                  <Plus className="w-4 h-4 mr-2" />
                  New
                  <ChevronDown className="w-3 h-3 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0 bg-[#2a2d3a] border-[#3a3d4a]" align="end">
                <div className="p-2">
                  {/* Upload Section */}
                  {uploadActions.length > 0 && (
                    <>
                      <div className="space-y-1">
                        <div className="px-2 py-1">
                          <span className="text-xs text-gray-400 uppercase tracking-wider">Upload</span>
                        </div>

                        {uploadActions.map((action) => (
                          <Button
                            key={action.key}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAction(action.key)}
                            className="w-full justify-start text-white hover:bg-[#3a3d4a] h-8 px-2"
                          >
                            <action.icon className={`w-4 h-4 mr-3 ${action.color}`} />
                            {action.label}
                          </Button>
                        ))}
                      </div>

                      {createActions.length > 0 && <Separator className="my-2 bg-[#3a3d4a]" />}
                    </>
                  )}

                  {/* Create Section */}
                  {createActions.length > 0 && (
                    <div className="space-y-1">
                      <div className="px-2 py-1">
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Create</span>
                      </div>

                      {createActions.map((action) => (
                        <Button
                          key={action.key}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAction(action.key)}
                          className="w-full justify-start text-white hover:bg-[#3a3d4a] h-8 px-2"
                        >
                          <action.icon className={`w-4 h-4 mr-3 ${action.color}`} />
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Quick Tips */}
                  <div className="mt-3 p-2 bg-[#1f2029] rounded-md border border-[#3a3d4a]">
                    <div className="text-xs text-gray-500 space-y-1">
                      <p><span className="text-blue-400">💡 Tip:</span> Drag & drop files anywhere to upload</p>
                      <p><span className="text-green-400">⌨️ Shortcut:</span> Ctrl+U for quick upload</p>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Search - reduced size */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-[#3d4045] rounded-md pl-10 pr-4 py-1.5 text-sm text-gray-300 placeholder-gray-500 border-none focus:ring-2 focus:ring-blue-500 w-48"
            />
          </div>
        </div>
      </div>

      {/* New Folder Dialog */}
      <NewFolderDialog
        isOpen={isNewFolderDialogOpen}
        onClose={() => setIsNewFolderDialogOpen(false)}
        onCreateFolder={handleCreateFolderSubmit}
      />
    </>
  );
}
