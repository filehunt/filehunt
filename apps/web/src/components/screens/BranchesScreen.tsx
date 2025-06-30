import { useState } from 'react';
import { GitBranch, GitCommit, GitMerge, Plus, Search, Eye, Trash2, MoreHorizontal, User, Clock, Tag } from 'lucide-react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle, Badge, Avatar, AvatarImage, AvatarFallback, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../shared';
import { type Branch } from '@shared-ts/types';

interface Commit {
  id: string;
  hash: string;
  message: string;
  author: {
    name: string;
    avatar: string;
  };
  timestamp: string;
  branch: string;
  changes: {
    added: number;
    modified: number;
    deleted: number;
  };
  tags: string[];
}

interface BranchesScreenProps {
  branches: Branch[];
  onBranchesChange: (branches: Branch[]) => void;
  selectedBranch: Branch;
  onBranchSelect: (branch: Branch) => void;
}

export function BranchesScreen({
  branches: propBranches,
  onBranchesChange,
  selectedBranch,
  onBranchSelect
}: BranchesScreenProps) {
  const [activeTab, setActiveTab] = useState<'branches' | 'commits'>('branches');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewBranchDialog, setShowNewBranchDialog] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchDescription, setNewBranchDescription] = useState('');

  // Use branches from props
  const branches = propBranches;
  const setBranches = onBranchesChange;

  // Mock commits data
  const commits: Commit[] = [
    {
      id: '1',
      hash: 'a1b2c3d',
      message: 'Update product images with new branding',
      author: {
        name: 'John Smith',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
      },
      timestamp: '2 hours ago',
      branch: 'main',
      changes: {
        added: 5,
        modified: 3,
        deleted: 1
      },
      tags: ['v2.1.0']
    },
    {
      id: '2',
      hash: 'e4f5g6h',
      message: 'Add hero banner variations',
      author: {
        name: 'Sarah Wilson',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=32&h=32&fit=crop&crop=face'
      },
      timestamp: '1 day ago',
      branch: 'feature/new-campaign',
      changes: {
        added: 8,
        modified: 0,
        deleted: 0
      },
      tags: []
    },
    {
      id: '3',
      hash: 'i7j8k9l',
      message: 'Fix logo alignment in header',
      author: {
        name: 'Mike Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
      },
      timestamp: '3 hours ago',
      branch: 'hotfix/logo-update',
      changes: {
        added: 0,
        modified: 2,
        deleted: 0
      },
      tags: []
    },
    {
      id: '4',
      hash: 'm0n1o2p',
      message: 'Initial commit for summer campaign assets',
      author: {
        name: 'Sarah Wilson',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=32&h=32&fit=crop&crop=face'
      },
      timestamp: '1 week ago',
      branch: 'feature/new-campaign',
      changes: {
        added: 15,
        modified: 0,
        deleted: 0
      },
      tags: []
    }
  ];

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    branch.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCommits = commits.filter(commit =>
    commit.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    commit.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    commit.branch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const createBranch = () => {
    if (!newBranchName.trim()) return;

    const newBranch: Branch = {
      id: Date.now().toString(),
      name: newBranchName.trim(),
      description: newBranchDescription.trim(),
      isDefault: false,
      isProtected: false,
      commitsAhead: 0,
      commitsBehind: 0,
      lastCommit: {
        id: Date.now().toString(),
        message: 'Initial branch commit',
        author: {
          name: 'Current User',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
        },
        timestamp: 'now',
        hash: Math.random().toString(36).substr(2, 7)
      },
      createdBy: {
        name: 'Current User',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
      },
      createdAt: 'now',
      assetCount: 0
    };

    setBranches(prev => [newBranch, ...prev]);
    setNewBranchName('');
    setNewBranchDescription('');
    setShowNewBranchDialog(false);
  };

  const deleteBranch = (id: string) => {
    setBranches(prev => prev.filter(branch => branch.id !== id));
  };

  const getBranchTypeColor = (name: string) => {
    if (name === 'main') return 'bg-green-500/20 text-green-300';
    if (name.startsWith('feature/')) return 'bg-blue-500/20 text-blue-300';
    if (name.startsWith('hotfix/')) return 'bg-red-500/20 text-red-300';
    if (name.startsWith('release/')) return 'bg-purple-500/20 text-purple-300';
    return 'bg-gray-500/20 text-gray-300';
  };

  return (
    <div className="flex-1 bg-[#1a1d29] overflow-auto">
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-white text-2xl mb-2">Branches</h1>
              <p className="text-gray-400">
                Manage your asset branches and track changes with git-like version control.
              </p>
            </div>
            <Button
              onClick={() => setShowNewBranchDialog(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Branch
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button
                variant={activeTab === 'branches' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('branches')}
                className={activeTab === 'branches' ? 'bg-blue-600' : 'text-gray-400 hover:text-white'}
              >
                <GitBranch className="w-4 h-4 mr-2" />
                Branches ({branches.length})
              </Button>
              <Button
                variant={activeTab === 'commits' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('commits')}
                className={activeTab === 'commits' ? 'bg-blue-600' : 'text-gray-400 hover:text-white'}
              >
                <GitCommit className="w-4 h-4 mr-2" />
                Commits ({commits.length})
              </Button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab}...`}
                className="bg-[#2a2d3a] border-[#3a3d4a] text-white pl-10 w-80"
              />
            </div>
          </div>

          {/* Content */}
          {activeTab === 'branches' ? (
            <div className="space-y-4">
              {filteredBranches.map(branch => (
                <Card key={branch.id} className="bg-[#1f2029]/50 border-[#2a2d3a] backdrop-blur-sm hover:border-[#3a3d4a] transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <GitBranch className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-white font-medium">{branch.name}</h3>
                            {branch.isDefault && (
                              <Badge variant="secondary" className="bg-green-500/20 text-green-300 text-xs">
                                Default
                              </Badge>
                            )}
                            {branch.isProtected && (
                              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 text-xs">
                                Protected
                              </Badge>
                            )}
                            <Badge variant="secondary" className={`${getBranchTypeColor(branch.name)} text-xs`}>
                              {branch.name.includes('/') ? branch.name.split('/')[0] : 'main'}
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-sm">{branch.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        {/* Status */}
                        <div className="text-center">
                          <div className="text-white text-sm">{branch.assetCount}</div>
                          <div className="text-gray-400 text-xs">assets</div>
                        </div>

                        {/* Commits ahead/behind */}
                        {!branch.isDefault && (
                          <div className="flex items-center space-x-2 text-sm">
                            {branch.commitsAhead > 0 && (
                              <span className="text-green-400">+{branch.commitsAhead}</span>
                            )}
                            {branch.commitsBehind > 0 && (
                              <span className="text-red-400">-{branch.commitsBehind}</span>
                            )}
                          </div>
                        )}

                        {/* Last commit */}
                        <div className="flex items-center space-x-2 min-w-0">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={branch.lastCommit.author.avatar} />
                            <AvatarFallback className="bg-blue-500 text-white text-xs">
                              {branch.lastCommit.author.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="text-white text-sm truncate">{branch.lastCommit.message}</div>
                            <div className="text-gray-400 text-xs">
                              {branch.lastCommit.timestamp} • {branch.lastCommit.hash}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-white h-8 w-8 p-0"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-[#2a2d3a] border-[#3a3d4a] text-white">
                            <DropdownMenuItem className="hover:bg-[#3a3d4a]">
                              <Eye className="w-3 h-3 mr-2" />
                              View Assets
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-[#3a3d4a]">
                              <GitMerge className="w-3 h-3 mr-2" />
                              Merge to Main
                            </DropdownMenuItem>
                            {!branch.isDefault && !branch.isProtected && (
                              <DropdownMenuItem
                                className="hover:bg-[#3a3d4a] text-red-400"
                                onClick={() => deleteBranch(branch.id)}
                              >
                                <Trash2 className="w-3 h-3 mr-2" />
                                Delete Branch
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredBranches.length === 0 && (
                <div className="text-center py-12">
                  <GitBranch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white text-lg mb-2">No branches found</h3>
                  <p className="text-gray-400">
                    {searchQuery ? 'Try adjusting your search criteria.' : 'Create your first branch to get started.'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCommits.map(commit => (
                <Card key={commit.id} className="bg-[#1f2029]/50 border-[#2a2d3a] backdrop-blur-sm hover:border-[#3a3d4a] transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <GitCommit className="w-5 h-5 text-gray-400 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-white font-medium">{commit.message}</h3>
                            {commit.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="bg-purple-500/20 text-purple-300 text-xs">
                                <Tag className="w-2.5 h-2.5 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-5 h-5">
                                <AvatarImage src={commit.author.avatar} />
                                <AvatarFallback className="bg-blue-500 text-white text-xs">
                                  {commit.author.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span>{commit.author.name}</span>
                            </div>

                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{commit.timestamp}</span>
                            </div>

                            <div className="flex items-center space-x-1">
                              <GitBranch className="w-3 h-3" />
                              <Badge variant="secondary" className={`${getBranchTypeColor(commit.branch)} text-xs`}>
                                {commit.branch}
                              </Badge>
                            </div>

                            <div className="font-mono text-xs bg-[#2a2d3a] px-2 py-1 rounded">
                              {commit.hash}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm">
                        {commit.changes.added > 0 && (
                          <span className="text-green-400">+{commit.changes.added}</span>
                        )}
                        {commit.changes.modified > 0 && (
                          <span className="text-yellow-400">~{commit.changes.modified}</span>
                        )}
                        {commit.changes.deleted > 0 && (
                          <span className="text-red-400">-{commit.changes.deleted}</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredCommits.length === 0 && (
                <div className="text-center py-12">
                  <GitCommit className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white text-lg mb-2">No commits found</h3>
                  <p className="text-gray-400">
                    Try adjusting your search criteria.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* New Branch Dialog */}
          <Dialog open={showNewBranchDialog} onOpenChange={setShowNewBranchDialog}>
            <DialogContent className="bg-[#1f2029] border-[#2a2d3a] text-white max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Branch</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Create a new branch to work on features or fixes independently from the main branch.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Branch Name</label>
                  <Input
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                    placeholder="feature/new-feature"
                    className="bg-[#2a2d3a] border-[#3a3d4a] text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Description (optional)</label>
                  <Input
                    value={newBranchDescription}
                    onChange={(e) => setNewBranchDescription(e.target.value)}
                    placeholder="Describe what this branch is for"
                    className="bg-[#2a2d3a] border-[#3a3d4a] text-white"
                  />
                </div>
                <div className="flex space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowNewBranchDialog(false)}
                    className="border-[#3a3d4a] text-gray-300 flex-1"
                  >
                    Cancel
                  </Button>
                  <Button onClick={createBranch} className="bg-blue-600 hover:bg-blue-700 flex-1">
                    Create Branch
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
