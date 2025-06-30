import { useState, useCallback } from 'react';
import type { Collection } from '../types';

export function useCollections() {
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);

  const handleCreateCollection = useCallback((collectionData?: { name: string; description: string }) => {
    if (collectionData) {
      const newCollection: Collection = {
        id: Math.random().toString(36).substr(2, 9),
        name: collectionData.name,
        description: collectionData.description,
        assets: [],
        createdAt: new Date().toISOString(),
        createdBy: 'Current User',
        collaborators: []
      };

      setCollections(prev => [...prev, newCollection]);
      setSelectedCollection(newCollection);
      return newCollection;
    }
    return null;
  }, []);

  return {
    selectedCollection,
    collections,
    setSelectedCollection,
    setCollections,
    handleCreateCollection
  };
}
