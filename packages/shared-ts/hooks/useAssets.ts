import { useState, useCallback } from 'react';
import type { Asset, Comment } from '../types';

export function useAssets() {
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const [detailAsset, setDetailAsset] = useState<Asset | null>(null);

  const handleAssetSelect = useCallback((asset: Asset, isSelected: boolean) => {
    if (isSelected) {
      setSelectedAssets(prev => [...prev, asset]);
    } else {
      setSelectedAssets(prev => prev.filter(a => a.id !== asset.id));
    }
  }, []);

  const handleAssetPreview = useCallback((asset: Asset) => {
    setPreviewAsset(asset);
  }, []);

  const handleAssetDetail = useCallback((asset: Asset) => {
    setDetailAsset(asset);
    setPreviewAsset(null);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedAssets([]);
  }, []);

  const handleTagAdd = useCallback((assetId: string, newTag: string) => {
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
  }, []);

  const handleTagRemove = useCallback((assetId: string, tagToRemove: string) => {
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
  }, []);

  const handleFolderAdd = useCallback((assetId: string, newFolder: string) => {
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
  }, []);

  const handleFolderRemove = useCallback((assetId: string, folderToRemove: string) => {
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
  }, []);

  const handleCommentAdd = useCallback((assetId: string, comment: Comment) => {
    if (detailAsset && detailAsset.id === assetId) {
      setDetailAsset(prev => ({
        ...prev!,
        assetComments: [...(prev!.assetComments || []), comment],
        comments: prev!.comments + 1
      }));
    }
  }, [detailAsset]);

  const handleStatusUpdate = useCallback((assetId: string, newStatus: Asset['status']) => {
    if (detailAsset && detailAsset.id === assetId) {
      setDetailAsset(prev => ({
        ...prev!,
        status: newStatus
      }));
    }
  }, [detailAsset]);

  return {
    selectedAssets,
    previewAsset,
    detailAsset,
    handleAssetSelect,
    handleAssetPreview,
    handleAssetDetail,
    clearSelection,
    handleTagAdd,
    handleTagRemove,
    handleFolderAdd,
    handleFolderRemove,
    handleCommentAdd,
    handleStatusUpdate,
    setDetailAsset,
    setPreviewAsset
  };
}
