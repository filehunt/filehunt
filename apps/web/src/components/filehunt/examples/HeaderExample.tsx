"use client";

import { useState } from 'react';
import { Header } from '../Header';
import type { ViewMode } from '../Header';
import { mockBranches } from '@/data/branches';

// Données de test pour les notifications
const mockNotifications = [
  {
    id: '1',
    type: 'approval' as const,
    title: 'Asset Approved',
    message: 'Your winter campaign hero image has been approved by the creative director.',
    timestamp: '2024-01-15T09:30:00Z',
    isRead: false,
    priority: 'high' as const
  },
  {
    id: '2',
    type: 'collaboration' as const,
    title: 'New Comment',
    message: 'Mike Johnson commented on "Product photos batch 3"',
    timestamp: '2024-01-15T08:45:00Z',
    isRead: false,
    priority: 'medium' as const
  },
  {
    id: '3',
    type: 'activity' as const,
    title: 'Branch Merged',
    message: 'feature/ui-redesign branch has been merged into main',
    timestamp: '2024-01-14T17:20:00Z',
    isRead: true,
    priority: 'low' as const
  },
  {
    id: '4',
    type: 'system' as const,
    title: 'Storage Warning',
    message: 'Project storage is 85% full. Consider archiving old assets.',
    timestamp: '2024-01-14T12:00:00Z',
    isRead: false,
    priority: 'medium' as const
  },
  {
    id: '5',
    type: 'collaboration' as const,
    title: 'New Team Member',
    message: 'Alex Chen has been added to the Creative Team',
    timestamp: '2024-01-13T15:30:00Z',
    isRead: true,
    priority: 'low' as const
  }
];

export function HeaderExample() {
  const [currentBranch, setCurrentBranch] = useState(mockBranches[0]);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const handleBranchChange = (branchId: string) => {
    const branch = mockBranches.find(b => b.id === branchId);
    if (branch) {
      setCurrentBranch(branch);
      console.log('Switched to branch:', branch.name);
    }
  };

  const handleNotificationClick = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId 
          ? { ...n, isRead: true }
          : n
      )
    );
    console.log('Notification clicked:', notificationId);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
    console.log('All notifications marked as read');
  };

  const handleUploadFiles = (files: FileList) => {
    console.log('Files uploaded:', Array.from(files).map(f => f.name));
  };

  const handleCreateBranch = () => {
    console.log('Create new branch');
  };

  const handleCreateCollection = () => {
    console.log('Create new collection');
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    console.log('View mode changed to:', mode);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentView="main"
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        currentBranch={currentBranch}
        availableBranches={mockBranches}
        onBranchChange={handleBranchChange}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        onUploadFiles={handleUploadFiles}
        onCreateBranch={handleCreateBranch}
        onCreateCollection={handleCreateCollection}
      />
      
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Header Example</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Current Branch:</h3>
            <code className="bg-muted px-2 py-1 rounded">{currentBranch.name}</code>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Unread Notifications:</h3>
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
              {notifications.filter(n => !n.isRead).length}
            </span>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Current View Mode:</h3>
            <code className="bg-muted px-2 py-1 rounded">{viewMode}</code>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Actions Available:</h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>Branch switcher with {mockBranches.length} branches</li>
              <li>Upload files and folders</li>
              <li>Create new branches, collections, and folders</li>
              <li>Global search</li>
              <li>Notifications with {notifications.length} total items</li>
              <li>View mode controls (Grid, List, Gallery)</li>
              <li>Theme selector</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
