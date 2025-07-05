"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Branch } from '@/types/assets';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Textarea } from '@/components/textarea';
import { 
  GitBranch, 
  Plus, 
  Search, 
  Filter,
  GitMerge,
  Clock,
  Users,
  AlertCircle
} from 'lucide-react';

interface BranchLeftSidebarProps {
  branches: Branch[];
  onBranchCreate: (branchData: { name: string; description: string; baseBranch?: string }) => void;
  onStatusFilterChange?: (status: 'all' | 'active' | 'merged' | 'abandoned') => void;
}

export const BranchLeftSidebar: React.FC<BranchLeftSidebarProps> = ({
  branches,
  onBranchCreate,
  onStatusFilterChange = () => {},
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'merged' | 'abandoned'>('all');
  const [newBranch, setNewBranch] = useState({
    name: '',
    description: '',
    baseBranch: 'main'
  });

  const handleCreateBranch = () => {
    if (newBranch.name.trim()) {
      onBranchCreate(newBranch);
      setNewBranch({ name: '', description: '', baseBranch: 'main' });
      setShowCreateForm(false);
    }
  };

  const handleStatusFilterChange = (status: 'all' | 'active' | 'merged' | 'abandoned') => {
    setStatusFilter(status);
    onStatusFilterChange(status);
  };

  const getStatusIcon = (status: Branch['status']) => {
    switch (status) {
      case 'active':
        return <GitBranch className="w-4 h-4 text-green-500" />;
      case 'merged':
        return <GitMerge className="w-4 h-4 text-blue-500" />;
      case 'abandoned':
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <GitBranch className="w-4 h-4 text-gray-400" />;
    }
  };

  const getMergeStatusColor = (mergeStatus?: Branch['mergeStatus']) => {
    switch (mergeStatus) {
      case 'can-merge':
        return 'text-green-600';
      case 'conflicts':
        return 'text-red-600';
      case 'behind':
        return 'text-yellow-600';
      case 'up-to-date':
        return 'text-blue-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-80 bg-card/50 backdrop-blur-sm flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Branches
          </h2>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-background/50"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>


        {/* Status Filter */}
        <div className="flex gap-1">
          {(['all', 'active', 'merged', 'abandoned'] as const).map((status) => (
            <Button
              key={status}
              size="sm"
              variant={statusFilter === status ? "default" : "ghost"}
              onClick={() => handleStatusFilterChange(status)}
              className="flex-1 text-xs capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Create Branch Form */}
      {showCreateForm && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-4 pb-4 space-y-3 border-b border-border/50"
        >
          <Input
            placeholder="Branch name"
            value={newBranch.name}
            onChange={(e) => setNewBranch(prev => ({ ...prev, name: e.target.value }))}
            className="bg-background/50"
          />
          <Textarea
            placeholder="Description (optional)"
            value={newBranch.description}
            onChange={(e) => setNewBranch(prev => ({ ...prev, description: e.target.value }))}
            className="bg-background/50 min-h-[80px]"
          />
          <div className="flex gap-2">
            <Button onClick={handleCreateBranch} size="sm" className="flex-1">
              Create
            </Button>
            <Button 
              onClick={() => setShowCreateForm(false)} 
              size="sm" 
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      )}


      {/* Quick Stats */}
      <div className="p-4 border-t border-border/50 bg-background/20">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-foreground">
              {branches.filter(b => b.status === 'active').length}
            </p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">
              {branches.filter(b => b.status === 'merged').length}
            </p>
            <p className="text-xs text-muted-foreground">Merged</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">
              {branches.reduce((total, b) => total + b.commitCount, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Total Commits</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
