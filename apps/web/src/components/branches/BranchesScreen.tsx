"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GitBranch,
  GitMerge,
  Plus,
  Search,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Settings,
  MoreHorizontal,
  User,
  Calendar,
  FileText,
  Zap
} from 'lucide-react';
import { Button } from '@/components/button';
import { Badge } from '@/components/badge';
import { Input } from '@/components/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';
import { Separator } from '@/components/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar';
import { cn } from '@/lib/utils';

interface Branch {
  id: string;
  name: string;
  description: string;
  purpose: 'feature' | 'campaign' | 'experiment' | 'hotfix';
  creator: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
  collaborators: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
  createdAt: string;
  lastActivity: string;
  assetsCount: number;
  changesCount: number;
  status: 'active' | 'ready_for_review' | 'merged' | 'archived';
  isProtected: boolean;
  readyForMerge: boolean;
}

const mockBranches: Branch[] = [
  {
    id: '1',
    name: 'main',
    description: 'Main production branch with approved assets',
    purpose: 'feature',
    creator: {
      id: 'system',
      name: 'System',
      avatar: '/avatars/system.png',
      role: 'System'
    },
    collaborators: [
      { id: 'sarah', name: 'Sarah Chen', avatar: '/avatars/sarah.png' },
      { id: 'mike', name: 'Mike Johnson', avatar: '/avatars/mike.png' },
      { id: 'lisa', name: 'Lisa Wong', avatar: '/avatars/lisa.png' }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    lastActivity: '2 hours ago',
    assetsCount: 247,
    changesCount: 0,
    status: 'active',
    isProtected: true,
    readyForMerge: false
  },
  {
    id: '2',
    name: 'q4-campaign-assets',
    description: 'Q4 marketing campaign brand assets and materials',
    purpose: 'campaign',
    creator: {
      id: 'sarah',
      name: 'Sarah Chen',
      avatar: '/avatars/sarah.png',
      role: 'Design Lead'
    },
    collaborators: [
      { id: 'sarah', name: 'Sarah Chen', avatar: '/avatars/sarah.png' },
      { id: 'alex', name: 'Alex Rivera', avatar: '/avatars/alex.png' }
    ],
    createdAt: '2024-01-10T09:00:00Z',
    lastActivity: '1 day ago',
    assetsCount: 45,
    changesCount: 12,
    status: 'ready_for_review',
    isProtected: false,
    readyForMerge: true
  },
  {
    id: '3',
    name: 'product-photography-refresh',
    description: 'Updated product photos with new lighting and backgrounds',
    purpose: 'feature',
    creator: {
      id: 'mike',
      name: 'Mike Johnson',
      avatar: '/avatars/mike.png',
      role: 'Photographer'
    },
    collaborators: [
      { id: 'mike', name: 'Mike Johnson', avatar: '/avatars/mike.png' },
      { id: 'lisa', name: 'Lisa Wong', avatar: '/avatars/lisa.png' }
    ],
    createdAt: '2024-01-12T14:00:00Z',
    lastActivity: '3 hours ago',
    assetsCount: 28,
    changesCount: 8,
    status: 'active',
    isProtected: false,
    readyForMerge: false
  },
  {
    id: '4',
    name: 'social-media-templates',
    description: 'Instagram and Facebook post templates for upcoming launches',
    purpose: 'experiment',
    creator: {
      id: 'alex',
      name: 'Alex Rivera',
      avatar: '/avatars/alex.png',
      role: 'Social Media Manager'
    },
    collaborators: [
      { id: 'alex', name: 'Alex Rivera', avatar: '/avatars/alex.png' }
    ],
    createdAt: '2024-01-08T11:00:00Z',
    lastActivity: '5 days ago',
    assetsCount: 15,
    changesCount: 3,
    status: 'merged',
    isProtected: false,
    readyForMerge: false
  }
];

export function BranchesScreen() {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusColor = (status: Branch['status']) => {
    switch (status) {
      case 'active': return 'text-blue-600 bg-blue-50';
      case 'ready_for_review': return 'text-yellow-600 bg-yellow-50';
      case 'merged': return 'text-green-600 bg-green-50';
      case 'archived': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPurposeColor = (purpose: Branch['purpose']) => {
    switch (purpose) {
      case 'feature': return 'text-blue-600';
      case 'campaign': return 'text-purple-600';
      case 'experiment': return 'text-orange-600';
      case 'hotfix': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const filteredBranches = mockBranches.filter(branch => {
    const matchesSearch = branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         branch.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'active' && branch.status === 'active') ||
                         (filterStatus === 'ready' && branch.status === 'ready_for_review') ||
                         (filterStatus === 'merged' && branch.status === 'merged');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full h-full">
      <div className="flex h-full">
        {/* Left Sidebar */}
        <div className="w-64 flex flex-col flex-shrink-0">
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
              <GitBranch className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Branches</h2>
              <p className="text-sm text-muted-foreground">Team Workspaces</p>
            </div>
          </div>

          {/* Branch Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3 rounded-lg">
              <div className="text-lg font-semibold">
                {mockBranches.filter(b => b.status === 'active').length}
              </div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div className="p-3 rounded-lg">
              <div className="text-lg font-semibold">
                {mockBranches.filter(b => b.status === 'ready_for_review').length}
              </div>
              <div className="text-xs text-muted-foreground">Ready</div>
            </div>
            <div className="p-3 rounded-lg">
              <div className="text-lg font-semibold">
                {mockBranches.reduce((sum, b) => sum + b.assetsCount, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Total Assets</div>
            </div>
            <div className="p-3 rounded-lg">
              <div className="text-lg font-semibold">
                {mockBranches.filter(b => b.status === 'merged').length}
              </div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              New Branch
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <GitMerge className="w-4 h-4 mr-2" />
              Review Ready
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              My Branches
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Branches</h1>
              <p className="text-muted-foreground">
                Collaborate on different workstreams and experiments
              </p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Branch
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search branches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="ready">Ready for Review</SelectItem>
                <SelectItem value="merged">Merged</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Branch Purpose Explanation */}
          <div className="rounded-lg p-4">
            <h3 className="font-medium mb-2">Why use Branches?</h3>
            <p className="text-sm text-muted-foreground">
              Work on different projects simultaneously without interfering with each other.
              Perfect for campaigns, experiments, or feature development.
            </p>
          </div>
        </div>

        {/* Branches List */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-4">
            {filteredBranches.map((branch) => (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    selectedBranch?.id === branch.id && "ring-2 ring-primary",
                    branch.isProtected && "border-l-4 border-l-yellow-500"
                  )}
                  onClick={() => setSelectedBranch(branch)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-1">
                        {/* Branch Header */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <GitBranch className={cn("w-5 h-5", getPurposeColor(branch.purpose))} />
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-medium text-lg">{branch.name}</h3>
                                {branch.isProtected && (
                                  <Badge variant="outline" className="text-xs">Protected</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {branch.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className={getPurposeColor(branch.purpose)}>
                              {branch.purpose}
                            </Badge>
                            <Badge variant="outline" className={getStatusColor(branch.status)}>
                              {branch.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>

                        {/* Creator and Collaborators */}
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={branch.creator.avatar} />
                              <AvatarFallback>{branch.creator.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{branch.creator.name}</span>
                            <Badge variant="outline" className="text-xs">{branch.creator.role}</Badge>
                          </div>

                          {branch.collaborators.length > 1 && (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-muted-foreground">+</span>
                              <div className="flex -space-x-2">
                                {branch.collaborators.slice(1, 4).map((collaborator) => (
                                  <Avatar key={collaborator.id} className="w-5 h-5 border-2 border-background">
                                    <AvatarImage src={collaborator.avatar} />
                                    <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                              {branch.collaborators.length > 4 && (
                                <span className="text-xs text-muted-foreground">
                                  +{branch.collaborators.length - 4} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Branch Stats */}
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center space-x-1">
                            <FileText className="w-4 h-4" />
                            <span>{branch.assetsCount} assets</span>
                          </div>
                          {branch.changesCount > 0 && (
                            <div className="flex items-center space-x-1">
                              <Zap className="w-4 h-4" />
                              <span>{branch.changesCount} changes</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>Updated {branch.lastActivity}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Created {new Date(branch.createdAt).toLocaleDateString()}
                          </span>

                          <div className="flex items-center space-x-2">
                            {branch.readyForMerge && (
                              <Button size="sm" variant="default">
                                <GitMerge className="w-4 h-4 mr-1" />
                                Ready to Merge
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              View Assets
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-64 flex flex-col flex-shrink-0">
        <div className="p-4">
          <h3 className="font-semibold mb-4">Branch Details</h3>

          {selectedBranch ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">{selectedBranch.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedBranch.description}</p>
              </div>

              <Separator />

              {/* Branch Information */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Purpose</span>
                  <Badge variant="outline" className={getPurposeColor(selectedBranch.purpose)}>
                    {selectedBranch.purpose}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="outline" className={getStatusColor(selectedBranch.status)}>
                    {selectedBranch.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Assets</span>
                  <span>{selectedBranch.assetsCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Changes</span>
                  <span>{selectedBranch.changesCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Protected</span>
                  <span>{selectedBranch.isProtected ? 'Yes' : 'No'}</span>
                </div>
              </div>

              <Separator />

              {/* Creator */}
              <div>
                <h5 className="font-medium mb-2">Created by</h5>
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={selectedBranch.creator.avatar} />
                    <AvatarFallback>{selectedBranch.creator.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{selectedBranch.creator.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedBranch.creator.role}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Collaborators */}
              <div>
                <h5 className="font-medium mb-2">Collaborators ({selectedBranch.collaborators.length})</h5>
                <div className="space-y-2">
                  {selectedBranch.collaborators.map((collaborator) => (
                    <div key={collaborator.id} className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={collaborator.avatar} />
                        <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{collaborator.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  View Assets
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Access
                </Button>
                {selectedBranch.readyForMerge && (
                  <Button size="sm" className="w-full justify-start">
                    <GitMerge className="w-4 h-4 mr-2" />
                    Merge to Main
                  </Button>
                )}
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Branch Settings
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <GitBranch className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Select a branch to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
