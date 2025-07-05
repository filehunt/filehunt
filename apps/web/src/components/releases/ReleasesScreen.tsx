"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Tag,
  Plus,
  Search,
  Download,
  Calendar,
  User,
  GitTag,
  Package,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  FileText,
  Code,
  Archive,
  Rocket,
  Star,
  Eye,
  Settings,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Zap,
  Shield,
  Activity,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/button';
import { Badge } from '@/components/badge';
import { Input } from '@/components/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';
import { Separator } from '@/components/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar';
import { cn } from '@/lib/utils';

interface Release {
  id: string;
  tagName: string;
  name: string;
  description: string;
  body: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  createdAt: string;
  publishedAt: string;
  targetCommitish: string;
  isDraft: boolean;
  isPrerelease: boolean;
  isLatest: boolean;
  downloadCount: number;
  assets: Array<{
    id: string;
    name: string;
    size: number;
    downloadCount: number;
    contentType: string;
    browserDownloadUrl: string;
  }>;
  deployments: Array<{
    id: string;
    environment: string;
    status: 'pending' | 'success' | 'failure' | 'cancelled';
    deployedAt?: string;
    url?: string;
  }>;
  changelog: Array<{
    type: 'feature' | 'fix' | 'breaking' | 'docs' | 'chore';
    description: string;
    commit?: string;
  }>;
}

interface Deployment {
  id: string;
  releaseId: string;
  environment: string;
  status: 'pending' | 'in_progress' | 'success' | 'failure' | 'cancelled';
  startedAt: string;
  completedAt?: string;
  duration?: string;
  deployedBy: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  url?: string;
  logs: Array<{
    id: string;
    timestamp: string;
    level: 'info' | 'warn' | 'error';
    message: string;
  }>;
}

const mockReleases: Release[] = [
  {
    id: '1',
    tagName: 'v2.1.0',
    name: 'Q4 Brand Assets Release',
    description: 'Major release with new brand guidelines and asset library',
    body: `## What's New

### New Features
- Complete brand guideline documentation
- New logo variations and color palettes
- Updated typography system
- Mobile-optimized asset variants

### Bug Fixes
- Fixed logo resolution issues on high-DPI displays
- Corrected color values in CSS exports
- Improved asset naming conventions

### Breaking Changes
- Deprecated old color palette (use migration guide)
- Updated file naming structure

## Migration Guide
Please refer to the migration documentation for updating from v2.0.x`,
    author: {
      id: 'sarah',
      name: 'Sarah Chen',
      username: 'sarahc',
      avatar: '/avatars/sarah.png'
    },
    createdAt: '2024-01-15T10:00:00Z',
    publishedAt: '2024-01-15T14:30:00Z',
    targetCommitish: 'main',
    isDraft: false,
    isPrerelease: false,
    isLatest: true,
    downloadCount: 1247,
    assets: [
      {
        id: '1',
        name: 'brand-assets-v2.1.0.zip',
        size: 45231680,
        downloadCount: 892,
        contentType: 'application/zip',
        browserDownloadUrl: '/releases/v2.1.0/brand-assets.zip'
      },
      {
        id: '2',
        name: 'logo-variants-v2.1.0.sketch',
        size: 12583424,
        downloadCount: 355,
        contentType: 'application/octet-stream',
        browserDownloadUrl: '/releases/v2.1.0/logo-variants.sketch'
      }
    ],
    deployments: [
      {
        id: '1',
        environment: 'production',
        status: 'success',
        deployedAt: '2024-01-15T15:00:00Z',
        url: 'https://assets.company.com'
      },
      {
        id: '2',
        environment: 'staging',
        status: 'success',
        deployedAt: '2024-01-15T14:45:00Z',
        url: 'https://staging-assets.company.com'
      }
    ],
    changelog: [
      {
        type: 'feature',
        description: 'Added new logo variations for different use cases',
        commit: 'a1b2c3d'
      },
      {
        type: 'feature',
        description: 'Implemented mobile-optimized asset variants',
        commit: 'e4f5g6h'
      },
      {
        type: 'fix',
        description: 'Fixed logo resolution on high-DPI displays',
        commit: 'i7j8k9l'
      },
      {
        type: 'breaking',
        description: 'Updated color palette structure',
        commit: 'm1n2o3p'
      }
    ]
  },
  {
    id: '2',
    tagName: 'v2.0.1',
    name: 'Hotfix: Logo Resolution',
    description: 'Critical fix for logo display issues',
    body: `## Bug Fixes
- Fixed logo resolution issues on mobile devices
- Corrected SVG viewBox attributes
- Updated asset documentation`,
    author: {
      id: 'david',
      name: 'David Kim',
      username: 'davidk',
      avatar: '/avatars/david.png'
    },
    createdAt: '2024-01-10T09:00:00Z',
    publishedAt: '2024-01-10T10:15:00Z',
    targetCommitish: 'main',
    isDraft: false,
    isPrerelease: false,
    isLatest: false,
    downloadCount: 534,
    assets: [
      {
        id: '3',
        name: 'hotfix-assets-v2.0.1.zip',
        size: 8947264,
        downloadCount: 534,
        contentType: 'application/zip',
        browserDownloadUrl: '/releases/v2.0.1/hotfix-assets.zip'
      }
    ],
    deployments: [
      {
        id: '3',
        environment: 'production',
        status: 'success',
        deployedAt: '2024-01-10T10:30:00Z',
        url: 'https://assets.company.com'
      }
    ],
    changelog: [
      {
        type: 'fix',
        description: 'Fixed logo resolution on mobile devices',
        commit: 'q4r5s6t'
      },
      {
        type: 'fix',
        description: 'Corrected SVG viewBox attributes',
        commit: 'u7v8w9x'
      }
    ]
  },
  {
    id: '3',
    tagName: 'v2.1.0-beta.1',
    name: 'Beta: Q4 Brand Assets',
    description: 'Beta release for testing new brand assets',
    body: `## Beta Release

This is a beta release for testing the new Q4 brand assets. Please provide feedback before the stable release.

### New in Beta
- New logo variations
- Updated color palette
- Typography improvements`,
    author: {
      id: 'mike',
      name: 'Mike Johnson',
      username: 'mikej',
      avatar: '/avatars/mike.png'
    },
    createdAt: '2024-01-08T14:00:00Z',
    publishedAt: '2024-01-08T16:00:00Z',
    targetCommitish: 'develop',
    isDraft: false,
    isPrerelease: true,
    isLatest: false,
    downloadCount: 89,
    assets: [
      {
        id: '4',
        name: 'beta-assets-v2.1.0-beta.1.zip',
        size: 42193856,
        downloadCount: 89,
        contentType: 'application/zip',
        browserDownloadUrl: '/releases/v2.1.0-beta.1/beta-assets.zip'
      }
    ],
    deployments: [
      {
        id: '4',
        environment: 'beta',
        status: 'success',
        deployedAt: '2024-01-08T16:15:00Z',
        url: 'https://beta-assets.company.com'
      }
    ],
    changelog: [
      {
        type: 'feature',
        description: 'Added beta logo variations',
        commit: 'y1z2a3b'
      }
    ]
  }
];

export function ReleasesScreen() {
  const [activeTab, setActiveTab] = useState('releases');
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [expandedRelease, setExpandedRelease] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'failure': return 'text-red-500';
      case 'pending': return 'text-yellow-500';
      case 'in_progress': return 'text-blue-500';
      case 'cancelled': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case 'feature': return 'text-green-600';
      case 'fix': return 'text-blue-600';
      case 'breaking': return 'text-red-600';
      case 'docs': return 'text-purple-600';
      case 'chore': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const filteredReleases = mockReleases.filter(release => {
    const matchesSearch = release.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         release.tagName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         release.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === 'all' ||
                         (filterType === 'stable' && !release.isPrerelease && !release.isDraft) ||
                         (filterType === 'prerelease' && release.isPrerelease) ||
                         (filterType === 'draft' && release.isDraft);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full h-full">
      <div className="flex h-full">
        {/* Left Sidebar */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Releases</h1>
              <p className="text-muted-foreground">Package and distribute final asset collections</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Release
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search releases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Releases</SelectItem>
                <SelectItem value="stable">Stable</SelectItem>
                <SelectItem value="prerelease">Pre-release</SelectItem>
                <SelectItem value="draft">Drafts</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Release Purpose Explanation */}
          <div className="rounded-lg p-4">
            <h3 className="font-medium mb-2">Why create Releases?</h3>
            <p className="text-sm text-muted-foreground">
              Package final asset collections for distribution. Releases create stable snapshots with version numbers, 
              making it easy to download complete asset packages and track what changed between versions.
            </p>
          </div>

          {/* Release Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="releases">Releases</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Releases Tab */}
            <TabsContent value="releases" className="p-6 space-y-6">
              <div className="space-y-4">
                {filteredReleases.map((release) => (
                  <motion.div
                    key={release.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-md",
                        selectedRelease?.id === release.id && "ring-2 ring-primary",
                        release.isDraft && "opacity-75"
                      )}
                      onClick={() => setSelectedRelease(release)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex items-center space-x-2">
                            <Tag className="w-5 h-5 text-primary" />
                            {release.isLatest && (
                              <Badge variant="default" className="text-xs">Latest</Badge>
                            )}
                            {release.isPrerelease && (
                              <Badge variant="secondary" className="text-xs">Pre-release</Badge>
                            )}
                            {release.isDraft && (
                              <Badge variant="outline" className="text-xs">Draft</Badge>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            {/* Release Header */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <h3 className="text-xl font-semibold">{release.name}</h3>
                                <code className="bg-muted px-2 py-1 rounded text-sm">{release.tagName}</code>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <Download className="w-4 h-4" />
                                  <span>{release.downloadCount}</span>
                                </div>
                                <span>{new Date(release.publishedAt).toLocaleDateString()}</span>
                              </div>
                            </div>

                            {/* Release Description */}
                            <p className="text-muted-foreground mb-4">{release.description}</p>

                            {/* Author and Metadata */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={release.author.avatar} />
                                  <AvatarFallback>{release.author.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{release.author.name}</span>
                                <span className="text-sm text-muted-foreground">
                                  published {new Date(release.publishedAt).toLocaleDateString()}
                                </span>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedRelease(
                                    expandedRelease === release.id ? null : release.id
                                  );
                                }}
                              >
                                {expandedRelease === release.id ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                                Details
                              </Button>
                            </div>

                            {/* Assets */}
                            <div className="flex items-center space-x-4 mb-4">
                              <span className="text-sm text-muted-foreground">Assets:</span>
                              <div className="flex items-center space-x-2">
                                {release.assets.map((asset) => (
                                  <Button
                                    key={asset.id}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Handle download
                                    }}
                                  >
                                    <Download className="w-3 h-3 mr-1" />
                                    {asset.name}
                                    <span className="ml-1 text-muted-foreground">
                                      ({formatFileSize(asset.size)})
                                    </span>
                                  </Button>
                                ))}
                              </div>
                            </div>

                            {/* Deployment Status */}
                            <div className="flex items-center space-x-4">
                              <span className="text-sm text-muted-foreground">Deployments:</span>
                              <div className="flex items-center space-x-2">
                                {release.deployments.map((deployment) => (
                                  <div key={deployment.id} className="flex items-center space-x-1">
                                    <Badge
                                      variant="outline"
                                      className={cn("text-xs", getStatusColor(deployment.status))}
                                    >
                                      {deployment.environment}
                                    </Badge>
                                    {deployment.status === 'success' && (
                                      <CheckCircle className="w-3 h-3 text-green-500" />
                                    )}
                                    {deployment.status === 'failure' && (
                                      <AlertCircle className="w-3 h-3 text-red-500" />
                                    )}
                                    {deployment.status === 'pending' && (
                                      <Clock className="w-3 h-3 text-yellow-500" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Expanded Details */}
                            {expandedRelease === release.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-6 pt-6 border-t border-border"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* Changelog */}
                                  <div>
                                    <h4 className="font-medium mb-3">Changelog</h4>
                                    <div className="space-y-2">
                                      {release.changelog.map((change, index) => (
                                        <div key={index} className="flex items-start space-x-2">
                                          <Badge
                                            variant="outline"
                                            className={cn("text-xs", getChangeTypeColor(change.type))}
                                          >
                                            {change.type}
                                          </Badge>
                                          <p className="text-sm flex-1">{change.description}</p>
                                          {change.commit && (
                                            <code className="text-xs bg-muted px-1 rounded">
                                              {change.commit}
                                            </code>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Release Notes */}
                                  <div>
                                    <h4 className="font-medium mb-3">Release Notes</h4>
                                    <div className="prose prose-sm max-w-none">
                                      <pre className="text-sm whitespace-pre-wrap bg-muted p-3 rounded">
                                        {release.body}
                                      </pre>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Deployments Tab */}
            <TabsContent value="deployments" className="p-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Deployment Status</CardTitle>
                    <CardDescription>Current deployment status across environments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['production', 'staging', 'beta'].map((env) => {
                        const latestDeployment = mockReleases
                          .flatMap(r => r.deployments)
                          .filter(d => d.environment === env)
                          .sort((a, b) => new Date(b.deployedAt || '').getTime() - new Date(a.deployedAt || '').getTime())[0];
                        
                        return (
                          <div key={env} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className={cn(
                                "w-3 h-3 rounded-full",
                                latestDeployment?.status === 'success' ? 'bg-green-500' :
                                latestDeployment?.status === 'failure' ? 'bg-red-500' :
                                'bg-yellow-500'
                              )} />
                              <div>
                                <h4 className="font-medium capitalize">{env}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {latestDeployment ? 
                                    `Deployed ${new Date(latestDeployment.deployedAt || '').toLocaleDateString()}` :
                                    'No deployments'
                                  }
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {latestDeployment?.url && (
                                <Button variant="outline" size="sm">
                                  <ExternalLink className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              )}
                              <Button variant="outline" size="sm">
                                <Rocket className="w-4 h-4 mr-1" />
                                Deploy
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Downloads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {mockReleases.reduce((sum, r) => sum + r.downloadCount, 0).toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">Across all releases</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Latest Release</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {mockReleases.find(r => r.isLatest)?.tagName}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {mockReleases.find(r => r.isLatest)?.downloadCount} downloads
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Release Frequency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {mockReleases.length}
                    </div>
                    <p className="text-sm text-muted-foreground">Total releases</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-64 flex flex-col flex-shrink-0">
        <div className="p-4">
          <h3 className="font-semibold mb-4">Release Details</h3>
          
          {selectedRelease ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">{selectedRelease.tagName}</h4>
                <p className="text-sm text-muted-foreground">{selectedRelease.name}</p>
              </div>
              
              <Separator />
              
              {/* Release Information */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <div className="flex items-center space-x-1">
                    {selectedRelease.isLatest && <Badge variant="default" className="text-xs">Latest</Badge>}
                    {selectedRelease.isPrerelease && <Badge variant="secondary" className="text-xs">Pre-release</Badge>}
                    {selectedRelease.isDraft && <Badge variant="outline" className="text-xs">Draft</Badge>}
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Downloads</span>
                  <span>{selectedRelease.downloadCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Published</span>
                  <span>{new Date(selectedRelease.publishedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Author</span>
                  <span>{selectedRelease.author.name}</span>
                </div>
              </div>
              
              <Separator />
              
              {/* Assets */}
              <div>
                <h5 className="font-medium mb-2">Assets ({selectedRelease.assets.length})</h5>
                <div className="space-y-2">
                  {selectedRelease.assets.map((asset) => (
                    <div key={asset.id} className="p-2 bg-muted/50 rounded">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{asset.name}</span>
                        <Button variant="ghost" size="sm">
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{formatFileSize(asset.size)}</span>
                        <span>{asset.downloadCount} downloads</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              {/* Deployments */}
              <div>
                <h5 className="font-medium mb-2">Deployments</h5>
                <div className="space-y-2">
                  {selectedRelease.deployments.map((deployment) => (
                    <div key={deployment.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          deployment.status === 'success' ? 'bg-green-500' :
                          deployment.status === 'failure' ? 'bg-red-500' :
                          'bg-yellow-500'
                        )} />
                        <span className="text-sm">{deployment.environment}</span>
                      </div>
                      {deployment.url && (
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              {/* Actions */}
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Download Assets
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  View Changelog
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Rocket className="w-4 h-4 mr-2" />
                  Deploy Release
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Code className="w-4 h-4 mr-2" />
                  View Source
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Select a release to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
