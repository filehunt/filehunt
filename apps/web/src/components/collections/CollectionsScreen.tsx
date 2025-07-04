"use client";

import { useState } from 'react';
import { motion, LayoutGroup } from "framer-motion";
import { Collection } from '@/types/assets';
import { CollectionCard } from '@/components/collections/CollectionCard';
import { CollectionRightSidebar } from '@/components/collections/CollectionRightSidebar';
import { CollectionLeftSidebar } from '@/components/collections/CollectionLeftSidebar';
import { mockCollections } from '@/types/assets';
import { Button } from '@/components/button';
import { ViewMode } from '../filehunt/Header';
import { cn } from '@/lib/utils';
import { CollectionStatusBar } from './CollectionStatusBar';

interface CollectionsScreenProps {
  onNavigateToAssets?: (collectionId: string) => void;
  viewMode?: ViewMode;
  appearanceSettings?: {
    cardSize: 'S' | 'M' | 'L';
    aspectRatio: 'masonry' | '16:9' | '4:3' | '1:1';
    thumbnailScale: 'fit' | 'fill';
    showCardInfo: boolean;
  };
  selectedCollections?: Collection[];
  onSelectedCollectionsChange?: (collections: Collection[]) => void;
  onCollectionCreated?: (collection: Collection) => void;
}

export function CollectionsScreen({ 
  onNavigateToAssets, 
  viewMode = 'grid',
  appearanceSettings,
  selectedCollections: externalSelectedCollections,
  onSelectedCollectionsChange,
  onCollectionCreated
}: CollectionsScreenProps) {
  const [collections, setCollections] = useState<Collection[]>(mockCollections);
  // Use external state if provided, otherwise use internal state
  const [internalSelectedCollections, setInternalSelectedCollections] = useState<Set<string>>(new Set());
  
  const selectedCollectionIds = externalSelectedCollections 
    ? new Set(externalSelectedCollections.map(c => c.id))
    : internalSelectedCollections;
    
  const setSelectedCollections = onSelectedCollectionsChange
    ? (newSet: Set<string> | ((prev: Set<string>) => Set<string>)) => {
        const resolvedSet = typeof newSet === 'function' ? newSet(selectedCollectionIds) : newSet;
        const selectedObjects = collections.filter(c => resolvedSet.has(c.id));
        onSelectedCollectionsChange(selectedObjects);
      }
    : setInternalSelectedCollections;
  const [activeCollection, setActiveCollection] = useState<Collection | null>(mockCollections[0] || null);

  const handleSelectionChange = (id: string, isSelected: boolean) => {
    setSelectedCollections((prev) => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const handleCardClick = (collection: Collection) => {
    setActiveCollection(collection);
  };

  const handleCardDoubleClick = (collection: Collection) => {
    // Logic to navigate to the homepage with this collection pre-selected
    if (onNavigateToAssets) {
      onNavigateToAssets(collection.id);
    }
  };

  // Collection action handlers
  const handleShare = (collections: Collection[]) => {
    console.log('Share collections:', collections.map(c => c.name));
  };

  const handleDownload = (collections: Collection[]) => {
    console.log('Download collections:', collections.map(c => c.name));
  };

  const handleDelete = (collections: Collection[]) => {
    console.log('Delete collections:', collections.map(c => c.name));
    // Remove deleted collections from selection
    const deletedIds = new Set(collections.map(c => c.id));
    setSelectedCollections(prev => new Set([...prev].filter(id => !deletedIds.has(id))));
  };

  const handleEdit = (collections: Collection[]) => {
    console.log('Edit collections:', collections.map(c => c.name));
  };

  const handlePreview = (collections: Collection[]) => {
    console.log('Preview collections:', collections.map(c => c.name));
  };

  const handleCollectionCreate = (newCollection: Collection) => {
    console.log('🎯 CollectionsScreen: Received new collection:', newCollection.name, 'ID:', newCollection.id);
    setCollections(prev => {
      console.log('📊 Previous collections count:', prev.length);
      // Add new collection at the beginning to show it prominently
      const newList = [newCollection, ...prev];
      console.log('📈 New collections count:', newList.length);
      console.log('📋 All collections:', newList.map(c => ({ id: c.id, name: c.name })));
      return newList;
    });
    // Set the new collection as active to show it in the right sidebar
    setActiveCollection(newCollection);
    console.log('✨ Set new collection as active and placed at top of list');
    onCollectionCreated?.(newCollection);
  };

  const selectedCollectionObjects = collections.filter(c => selectedCollectionIds.has(c.id));
  
  // Only show status bar for actual selections, not for preview/active collection
  const statusBarCollections = selectedCollectionObjects;

  return (
    <>
      <motion.div 
        className="flex h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Left Sidebar for Smart Folders */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          <CollectionLeftSidebar onCollectionCreated={handleCollectionCreate} />
        </motion.div>

        {/* Main Collection Display */}
        <motion.div 
          className="flex-1 overflow-auto p-4 pb-20 max-w-[calc(100vw-608px)]" 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <LayoutGroup>
            <motion.div className={cn(
              "gap-4",
              viewMode === 'list' ? "space-y-2" : (
                appearanceSettings?.aspectRatio === 'masonry' 
                  ? "columns-1 sm:columns-2 md:columns-3 lg:columns-4 space-y-4"
                  : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              )
            )}>
              {collections.map((collection, index) => (
                <motion.div
                  key={collection.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ 
                    layout: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
                    opacity: { duration: 0.4, delay: index * 0.05 },
                    scale: { duration: 0.4, delay: index * 0.05 },
                    y: { duration: 0.4, delay: index * 0.05 },
                    hover: { duration: 0.2 }
                  }}
                  className={viewMode === 'list' ? "" : "break-inside-avoid mb-4"}
                >
                  <CollectionCard
                    collection={collection}
                    isSelected={selectedCollectionIds.has(collection.id)}
                    isActive={activeCollection?.id === collection.id}
                    onClick={() => handleCardClick(collection)}
                    onDoubleClick={() => handleCardDoubleClick(collection)}
                    onSelectionChange={(isSelected) => handleSelectionChange(collection.id, isSelected)}
                    searchMode={true} // Always show checkboxes
                    viewMode={viewMode}
                  />
                </motion.div>
              ))}
            </motion.div>
          </LayoutGroup>
        </motion.div>

        {/* Right Sidebar for Details - Always visible, no actions (moved to StatusBar) */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        >
          <CollectionRightSidebar 
            collection={activeCollection}
          />
        </motion.div>
      </motion.div>

      {/* Status Bar for selected collections only */}
      {statusBarCollections.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <CollectionStatusBar
            selectedCollections={statusBarCollections}
            onClearSelection={() => setSelectedCollections(new Set())}
            onShare={handleShare}
            onDownload={handleDownload}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onPreview={handlePreview}
          />
        </motion.div>
      )}
    </>
  );
}

