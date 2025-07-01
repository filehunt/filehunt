import { useState, useCallback } from 'react';
import type { Branch } from '../types';

export function useBranches() {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);

  const handleCreateBranch = useCallback((branchData?: { name: string; description: string; parentBranch?: string }) => {
    if (branchData) {
      const newBranch: Branch = {
        id: Math.random().toString(36).substr(2, 9),
        name: branchData.name,
        description: branchData.description,
        parentBranch: branchData.parentBranch,
        createdAt: new Date().toISOString(),
        createdBy: {
          name: 'Current User',
          avatar: 'CU'
        },
        isDefault: false,
        isProtected: false,
        commitsAhead: 0,
        commitsBehind: 0,
        lastCommit: {
          id: '1',
          message: 'Initial commit',
          author: {
            name: 'Current User',
            avatar: 'CU'
          },
          timestamp: 'now',
          hash: Math.random().toString(36).substr(2, 7)
        },
        assetCount: 0,
        isActive: false,
        commitCount: 0
      };

      setBranches(prev => [...prev, newBranch]);
      setSelectedBranch(newBranch);
      return newBranch;
    }
    return null;
  }, []);

  return {
    selectedBranch,
    branches,
    setSelectedBranch,
    setBranches,
    handleCreateBranch
  };
}
