"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MessageSquare,
  User,
  Calendar,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Send,
  Plus,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/button';
import { Badge } from '@/components/badge';
import { Input } from '@/components/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';
import { Separator } from '@/components/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar';
import { Textarea } from '@/components/textarea';
import { cn } from '@/lib/utils';

interface ApprovalRequest {
  id: string;
  title: string;
  description: string;
  submittedBy: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
  assets: Array<{
    id: string;
    name: string;
    type: string;
    thumbnailUrl: string;
    size: number;
  }>;
  status: 'pending' | 'approved' | 'rejected' | 'changes_requested';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedAt: string;
  deadline?: string;
  approvers: Array<{
    id: string;
    name: string;
    avatar: string;
    status: 'pending' | 'approved' | 'rejected' | 'changes_requested';
    comment?: string;
    reviewedAt?: string;
  }>;
  comments: Array<{
    id: string;
    user: {
      id: string;
      name: string;
      avatar: string;
    };
    message: string;
    timestamp: string;
  }>;
  tags: string[];
}

const mockApprovalRequests: ApprovalRequest[] = [
  {
    id: '1',
    title: 'Q4 Campaign Brand Assets',
    description: 'New brand assets for the Q4 marketing campaign including updated logos, color palettes, and social media templates.',
    submittedBy: {
      id: 'sarah',
      name: 'Sarah Chen',
      avatar: '/avatars/sarah.png',
      role: 'Design Lead'
    },
    assets: [
      {
        id: 'a1',
        name: 'brand-logo-primary.png',
        type: 'image',
        thumbnailUrl: '/assets/logo-thumb.png',
        size: 245760
      },
      {
        id: 'a2',
        name: 'color-palette-q4.pdf',
        type: 'document',
        thumbnailUrl: '/assets/pdf-thumb.png',
        size: 1048576
      },
      {
        id: 'a3',
        name: 'social-templates.zip',
        type: 'archive',
        thumbnailUrl: '/assets/zip-thumb.png',
        size: 15728640
      }
    ],
    status: 'pending',
    priority: 'high',
    submittedAt: '2024-01-15T10:00:00Z',
    deadline: '2024-01-18T17:00:00Z',
    approvers: [
      {
        id: 'lisa',
        name: 'Lisa Wong',
        avatar: '/avatars/lisa.png',
        status: 'approved',
        comment: 'Looks great! The new brand direction is exactly what we need.',
        reviewedAt: '2024-01-15T14:30:00Z'
      },
      {
        id: 'mike',
        name: 'Mike Johnson',
        avatar: '/avatars/mike.png',
        status: 'pending'
      }
    ],
    comments: [
      {
        id: 'c1',
        user: {
          id: 'sarah',
          name: 'Sarah Chen',
          avatar: '/avatars/sarah.png'
        },
        message: 'Please review by end of week. These assets are needed for the campaign launch.',
        timestamp: '2024-01-15T10:30:00Z'
      }
    ],
    tags: ['brand', 'campaign', 'q4']
  },
  {
    id: '2',
    title: 'Product Photography Updates',
    description: 'Updated product photos with new lighting and backgrounds for the website refresh.',
    submittedBy: {
      id: 'mike',
      name: 'Mike Johnson',
      avatar: '/avatars/mike.png',
      role: 'Photographer'
    },
    assets: [
      {
        id: 'b1',
        name: 'product-hero-shot.jpg',
        type: 'image',
        thumbnailUrl: '/assets/product-thumb.jpg',
        size: 3145728
      },
      {
        id: 'b2',
        name: 'product-gallery-set.zip',
        type: 'archive',
        thumbnailUrl: '/assets/gallery-thumb.png',
        size: 52428800
      }
    ],
    status: 'changes_requested',
    priority: 'medium',
    submittedAt: '2024-01-14T15:00:00Z',
    approvers: [
      {
        id: 'lisa',
        name: 'Lisa Wong',
        avatar: '/avatars/lisa.png',
        status: 'changes_requested',
        comment: 'Great shots but please adjust the color temperature to match our brand guidelines.',
        reviewedAt: '2024-01-15T09:00:00Z'
      }
    ],
    comments: [
      {
        id: 'c2',
        user: {
          id: 'mike',
          name: 'Mike Johnson',
          avatar: '/avatars/mike.png'
        },
        message: 'Working on the color corrections now. Will resubmit tomorrow.',
        timestamp: '2024-01-15T10:00:00Z'
      }
    ],
    tags: ['photography', 'products', 'website']
  },
  {
    id: '3',
    title: 'Social Media Templates',
    description: 'Instagram and Facebook templates for upcoming product launches.',
    submittedBy: {
      id: 'alex',
      name: 'Alex Rivera',
      avatar: '/avatars/alex.png',
      role: 'Social Media Manager'
    },
    assets: [
      {
        id: 'c1',
        name: 'instagram-story-template.psd',
        type: 'design',
        thumbnailUrl: '/assets/insta-thumb.png',
        size: 8388608
      },
      {
        id: 'c2',
        name: 'facebook-post-template.psd',
        type: 'design',
        thumbnailUrl: '/assets/fb-thumb.png',
        size: 6291456
      }
    ],
    status: 'approved',
    priority: 'low',
    submittedAt: '2024-01-13T11:00:00Z',
    approvers: [
      {
        id: 'lisa',
        name: 'Lisa Wong',
        avatar: '/avatars/lisa.png',
        status: 'approved',
        comment: 'Perfect! These templates maintain brand consistency.',
        reviewedAt: '2024-01-13T16:00:00Z'
      },
      {
        id: 'sarah',
        name: 'Sarah Chen',
        avatar: '/avatars/sarah.png',
        status: 'approved',
        comment: 'Approved. Ready for launch.',
        reviewedAt: '2024-01-14T09:00:00Z'
      }
    ],
    comments: [],
    tags: ['social', 'templates', 'marketing']
  }
];

export function ApprovalsScreen() {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [newComment, setNewComment] = useState('');

  const getStatusColor = (status: ApprovalRequest['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600';
      case 'approved': return 'text-green-600';
      case 'rejected': return 'text-red-600';
      case 'changes_requested': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: ApprovalRequest['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-blue-600 bg-blue-50';
      case 'low': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const filteredRequests = mockApprovalRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === 'all' ||
                      (activeTab === 'pending' && request.status === 'pending') ||
                      (activeTab === 'approved' && request.status === 'approved') ||
                      (activeTab === 'rejected' && (request.status === 'rejected' || request.status === 'changes_requested'));
    
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    
    return matchesSearch && matchesTab && matchesPriority;
  });

  const handleApprove = (requestId: string) => {
    console.log('Approving request:', requestId);
  };

  const handleReject = (requestId: string) => {
    console.log('Rejecting request:', requestId);
  };

  const handleRequestChanges = (requestId: string) => {
    console.log('Requesting changes for:', requestId);
  };

  const handleAddComment = (requestId: string, comment: string) => {
    console.log('Adding comment to request:', requestId, comment);
    setNewComment('');
  };

  return (
    <div className="w-full h-full">
      <div className="flex h-full">
        {/* Left Sidebar */}
        <div className="w-64 flex flex-col flex-shrink-0">
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Approvals</h2>
              <p className="text-sm text-muted-foreground">Review & Approve</p>
            </div>
          </div>

          {/* Approval Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3 rounded-lg">
              <div className="text-lg font-semibold">
                {mockApprovalRequests.filter(r => r.status === 'pending').length}
              </div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div className="p-3 rounded-lg">
              <div className="text-lg font-semibold">
                {mockApprovalRequests.filter(r => r.status === 'approved').length}
              </div>
              <div className="text-xs text-muted-foreground">Approved</div>
            </div>
            <div className="p-3 rounded-lg">
              <div className="text-lg font-semibold">
                {mockApprovalRequests.filter(r => r.priority === 'urgent' || r.priority === 'high').length}
              </div>
              <div className="text-xs text-muted-foreground">High Priority</div>
            </div>
            <div className="p-3 rounded-lg">
              <div className="text-lg font-semibold">
                {mockApprovalRequests.filter(r => r.deadline && new Date(r.deadline) < new Date()).length}
              </div>
              <div className="text-xs text-muted-foreground">Overdue</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <AlertCircle className="w-4 h-4 mr-2" />
              My Pending
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
              <h1 className="text-2xl font-bold">Approval Requests</h1>
              <p className="text-muted-foreground">Review and approve asset submissions</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search approval requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="pending">
                Pending ({mockApprovalRequests.filter(r => r.status === 'pending').length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({mockApprovalRequests.filter(r => r.status === 'approved').length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Needs Changes ({mockApprovalRequests.filter(r => r.status === 'rejected' || r.status === 'changes_requested').length})
              </TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Approval Requests List */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    selectedRequest?.id === request.id && "ring-2 ring-primary"
                  )}
                  onClick={() => setSelectedRequest(request)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-1">
                        {/* Request Header */}
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium text-lg">{request.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {request.description}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className={getPriorityColor(request.priority)}>
                              {request.priority}
                            </Badge>
                            <Badge variant="outline" className={getStatusColor(request.status)}>
                              {request.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>

                        {/* Submitter Info */}
                        <div className="flex items-center space-x-2 mb-3">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={request.submittedBy.avatar} />
                            <AvatarFallback>{request.submittedBy.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{request.submittedBy.name}</span>
                          <Badge variant="outline" className="text-xs">{request.submittedBy.role}</Badge>
                          <span className="text-sm text-muted-foreground">
                            submitted {new Date(request.submittedAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Assets Preview */}
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-sm text-muted-foreground">Assets:</span>
                          <div className="flex items-center space-x-2">
                            {request.assets.slice(0, 3).map((asset) => (
                              <div key={asset.id} className="flex items-center space-x-1 bg-muted/50 px-2 py-1 rounded text-xs">
                                <span>{asset.name}</span>
                                <span className="text-muted-foreground">({formatFileSize(asset.size)})</span>
                              </div>
                            ))}
                            {request.assets.length > 3 && (
                              <span className="text-xs text-muted-foreground">+{request.assets.length - 3} more</span>
                            )}
                          </div>
                        </div>

                        {/* Deadline */}
                        {request.deadline && (
                          <div className="flex items-center space-x-2 mb-3">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              Deadline: {new Date(request.deadline).toLocaleDateString()}
                            </span>
                            {new Date(request.deadline) < new Date() && (
                              <Badge variant="destructive" className="text-xs">Overdue</Badge>
                            )}
                          </div>
                        )}

                        {/* Approvers Status */}
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-muted-foreground">Approvers:</span>
                          <div className="flex items-center space-x-2">
                            {request.approvers.map((approver) => (
                              <div key={approver.id} className="flex items-center space-x-1">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={approver.avatar} />
                                  <AvatarFallback>{approver.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{approver.name}</span>
                                {approver.status === 'approved' && (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                )}
                                {approver.status === 'rejected' && (
                                  <XCircle className="w-4 h-4 text-red-500" />
                                )}
                                {approver.status === 'changes_requested' && (
                                  <AlertCircle className="w-4 h-4 text-orange-500" />
                                )}
                                {approver.status === 'pending' && (
                                  <Clock className="w-4 h-4 text-yellow-500" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex items-center space-x-2 mt-3">
                          {request.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
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
          <h3 className="font-semibold mb-4">Request Details</h3>
          
          {selectedRequest ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">{selectedRequest.title}</h4>
                <p className="text-sm text-muted-foreground">{selectedRequest.description}</p>
              </div>
              
              <Separator />
              
              {/* Status and Priority */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="outline" className={getStatusColor(selectedRequest.status)}>
                    {selectedRequest.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Priority</span>
                  <Badge variant="outline" className={getPriorityColor(selectedRequest.priority)}>
                    {selectedRequest.priority}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Assets</span>
                  <span>{selectedRequest.assets.length}</span>
                </div>
                {selectedRequest.deadline && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Deadline</span>
                    <span>{new Date(selectedRequest.deadline).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              
              <Separator />
              
              {/* Approval Actions */}
              {selectedRequest.status === 'pending' && (
                <div className="space-y-2">
                  <Button 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => handleApprove(selectedRequest.id)}
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => handleRequestChanges(selectedRequest.id)}
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Request Changes
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => handleReject(selectedRequest.id)}
                  >
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
              
              <Separator />
              
              {/* Assets List */}
              <div>
                <h5 className="font-medium mb-2">Assets ({selectedRequest.assets.length})</h5>
                <div className="space-y-2">
                  {selectedRequest.assets.map((asset) => (
                    <div key={asset.id} className="p-2 bg-muted/50 rounded">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{asset.name}</span>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {asset.type} • {formatFileSize(asset.size)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              {/* Comments */}
              <div>
                <h5 className="font-medium mb-2">Comments</h5>
                <div className="space-y-3 max-h-40 overflow-auto">
                  {selectedRequest.comments.map((comment) => (
                    <div key={comment.id} className="text-sm">
                      <div className="flex items-center space-x-2 mb-1">
                        <Avatar className="w-5 h-5">
                          <AvatarImage src={comment.user.avatar} />
                          <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{comment.user.name}</span>
                        <span className="text-muted-foreground">
                          {new Date(comment.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground ml-7">{comment.message}</p>
                    </div>
                  ))}
                </div>
                
                {/* Add Comment */}
                <div className="mt-3">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="text-sm"
                    rows={2}
                  />
                  <Button 
                    size="sm" 
                    className="mt-2 w-full"
                    onClick={() => handleAddComment(selectedRequest.id, newComment)}
                    disabled={!newComment.trim()}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Add Comment
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Select a request to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
