import { useState, useCallback } from 'react';
import type { Asset, SearchFilters } from '../types';

export function useSearch() {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<Asset[]>([]);

  const updateFilter = useCallback((key: string, value: any) => {
    setSearchFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchFilters({});
  }, []);

  return {
    searchFilters,
    savedSearches,
    searchResults,
    setSearchFilters,
    setSavedSearches,
    setSearchResults,
    updateFilter,
    clearFilters
  };
}
