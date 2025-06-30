import { useState, useCallback } from 'react';
import type { ViewMode, AppView, Folder } from '../types';

export function useApp() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentView, setCurrentView] = useState<AppView>('main');
  const [folders, setFolders] = useState<Folder[]>([]);

  const handleViewChange = useCallback((view: string) => {
    setCurrentView(view as AppView);
  }, []);

  const handleCreateFolder = useCallback((folderData: { name: string; description: string; parentFolder?: string }) => {
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
    console.log('Folder created:', newFolder);
    return newFolder;
  }, []);

  const shouldShowFooter = useCallback(() => {
    return ['main', 'asset-detail', 'search', 'collections', 'branches'].includes(currentView);
  }, [currentView]);

  const shouldShowHeader = useCallback(() => {
    return ['main', 'search', 'collections', 'branches', 'upload', 'asset-detail'].includes(currentView);
  }, [currentView]);

  const shouldShowViewControls = useCallback(() => {
    return ['main', 'search', 'collections'].includes(currentView);
  }, [currentView]);

  return {
    viewMode,
    currentView,
    folders,
    setViewMode,
    setCurrentView,
    setFolders,
    handleViewChange,
    handleCreateFolder,
    shouldShowFooter,
    shouldShowHeader,
    shouldShowViewControls
  };
}
