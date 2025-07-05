"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Branch, Asset } from '@/types/assets';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Textarea } from '@/components/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar';
import { Badge } from '@/components/badge';
import { 
  GitBranch, 
  GitMerge, 
  GitPullRequest,
  Users,
  Clock,
  FileText,
  Settings,
  Trash2,
  Shield,
  AlertCircle,
  Check,
  X,
  MoreHorizontal
} from 'lucide-react';

interface BranchRightSidebarProps {
  branch: Branch | null;
  assets: Asset[];
  onBranchUpdate: (branchId: string, updates: Partial<Branch>) => void;
  onMergeBranch: (branchId: string, targetBranch: string) => void;
  onDeleteBranch: (branchId: string) => void;
}

export const BranchRightSidebar: React.FC<BranchRightSidebarProps> = ({
  branch,
  assets,
  onBranchUpdate,
  onMergeBranch,
  onDeleteBranch,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBranch, setEditedBranch] = useState(branch);

  if (!branch) {
    return (
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-80 bg-card/50 backdrop-blur-sm flex flex-col h-full"
      >
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <GitBranch className="w-12 h-12 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-medium text-foreground">No Branch Selected</h3>
              <p className="text-sm text-muted-foreground">
                Select a branch to view details and manage it
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const handleSave = () => {
    if (editedBranch) {
      onBranchUpdate(branch.id, {
        name: editedBranch.name,
        description: editedBranch.description,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedBranch(branch);
    setIsEditing(false);
  };

  const getStatusColor = (status: Branch['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'merged':
        return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'abandoned':
        return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getMergeStatusInfo = (mergeStatus?: Branch['mergeStatus']) => {
    switch (mergeStatus) {
      case 'can-merge':
        return { icon: Check, color: 'text-green-600', text: 'Ready to merge' };
      case 'conflicts':
        return { icon: AlertCircle, color: 'text-red-600', text: 'Has conflicts' };
      case 'behind':
        return { icon: Clock, color: 'text-yellow-600', text: 'Behind main' };
      case 'up-to-date':
        return { icon: Check, color: 'text-blue-600', text: 'Up to date' };
      default:
        return { icon: GitBranch, color: 'text-gray-500', text: 'Unknown' };
    }
  };

  const mergeStatusInfo = getMergeStatusInfo(branch.mergeStatus);

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-80 bg-card/50 backdrop-blur-sm flex flex-col h-full border-l border-border/30"
    >
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Branch Details</h2>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Branch Status */}
        <div className="flex items-center gap-2 mb-3">
          <Badge className={getStatusColor(branch.status)}>
            {branch.status}
          </Badge>
          {branch.isPrimary && (
            <Badge variant="outline">Primary</Badge>
          )}
          {branch.isProtected && (
            <Badge variant="outline" className="text-yellow-600">
              <Shield className="w-3 h-3 mr-1" />
              Protected
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Branch Info */}
        <div className="space-y-4">
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">
                  Branch Name
                </label>
                <Input
                  value={editedBranch?.name || ''}
                  onChange={(e) => setEditedBranch(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="bg-background/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">
                  Description
                </label>
                <Textarea
                  value={editedBranch?.description || ''}
                  onChange={(e) => setEditedBranch(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className="bg-background/50 min-h-[100px]"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm" className="flex-1">
                  Save
                </Button>
                <Button onClick={handleCancel} size="sm" variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {branch.name}
              </h3>
              {branch.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {branch.description}
                </p>
              )}
            </div>
          )}

          {/* Branch Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-background/30 rounded-lg">
              <p className="text-xl font-semibold text-foreground">{branch.commitCount}</p>
              <p className="text-xs text-muted-foreground">Commits</p>
            </div>
            <div className="text-center p-3 bg-background/30 rounded-lg">
              <p className="text-xl font-semibold text-foreground">{branch.assetsCount}</p>
              <p className="text-xs text-muted-foreground">Assets</p>
            </div>
          </div>
        </div>

        {/* Merge Status */}
        {branch.mergeStatus && (
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Merge Status</h4>
            <div className="flex items-center gap-3 p-3 bg-background/30 rounded-lg">
              <mergeStatusInfo.icon className={`w-5 h-5 ${mergeStatusInfo.color}`} />
              <div>
                <p className={`font-medium ${mergeStatusInfo.color}`}>
                  {mergeStatusInfo.text}
                </p>
                {branch.baseBranch && (
                  <p className="text-xs text-muted-foreground">
                    Base: {branch.baseBranch}
                  </p>
                )}
              </div>
            </div>
            
            {branch.mergeStatus === 'can-merge' && !branch.isPrimary && (
              <Button
                onClick={() => onMergeBranch(branch.id, branch.baseBranch || 'main')}
                className="w-full"
                size="sm"
              >
                <GitMerge className="w-4 h-4 mr-2" />
                Merge Branch
              </Button>
            )}
          </div>
        )}

        {/* Last Commit */}
        {branch.lastCommit && (
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Latest Commit</h4>
            <div className="p-3 bg-background/30 rounded-lg space-y-2">
              <p className="text-sm text-foreground font-medium">
                {branch.lastCommit.message}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>by {branch.lastCommit.author}</span>
                <span>{branch.lastCommit.timestamp}</span>
              </div>
            </div>
          </div>
        )}

        {/* Collaborators */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">
            Collaborators ({branch.collaborators.length})
          </h4>
          <div className="space-y-2">
            {branch.collaborators.map((collaborator) => (
              <div key={collaborator.id} className="flex items-center gap-3 p-2 bg-background/30 rounded-lg">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                  <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {collaborator.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {collaborator.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Branch Actions */}
        {!branch.isPrimary && (
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Actions</h4>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <GitPullRequest className="w-4 h-4 mr-2" />
                Create Pull Request
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-red-600 hover:text-red-700"
                onClick={() => onDeleteBranch(branch.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Branch
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/50 bg-background/20">
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Created: {new Date(branch.createdAt).toLocaleDateString()}</p>
          <p>Updated: {new Date(branch.updatedAt).toLocaleDateString()}</p>
          <p>Author: {branch.author.name}</p>
        </div>
      </div>
    </motion.div>
  );
};
