"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  User,
  UserPlus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Crown,
  Eye,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  Download,
  Upload,
  Copy,
  ExternalLink,
  Ban,
  Unlock
} from 'lucide-react';
import { Button } from '@/components/button';
import { Badge } from '@/components/badge';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';
import { Separator } from '@/components/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/alert-dialog';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'editor' | 'viewer';
  department: string;
  joinDate: string;
  lastActive: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  permissions: string[];
  stats: {
    uploads: number;
    downloads: number;
    reviews: number;
    comments: number;
  };
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  color: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    avatar: '/avatars/sarah.png',
    role: 'admin',
    department: 'Design',
    joinDate: '2023-01-15',
    lastActive: '2 minutes ago',
    status: 'active',
    permissions: ['manage_users', 'upload_assets', 'delete_assets', 'manage_settings'],
    stats: {
      uploads: 247,
      downloads: 89,
      reviews: 34,
      comments: 156
    }
  },
  {
    id: '2',
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    avatar: '/avatars/mike.png',
    role: 'editor',
    department: 'Photography',
    joinDate: '2023-02-20',
    lastActive: '1 hour ago',
    status: 'active',
    permissions: ['upload_assets', 'edit_assets', 'comment'],
    stats: {
      uploads: 189,
      downloads: 45,
      reviews: 23,
      comments: 78
    }
  },
  {
    id: '3',
    name: 'Lisa Wong',
    email: 'lisa.wong@company.com',
    avatar: '/avatars/lisa.png',
    role: 'editor',
    department: 'Creative',
    joinDate: '2023-01-10',
    lastActive: '3 hours ago',
    status: 'active',
    permissions: ['upload_assets', 'edit_assets', 'comment', 'review'],
    stats: {
      uploads: 156,
      downloads: 234,
      reviews: 67,
      comments: 123
    }
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@company.com',
    avatar: '/avatars/david.png',
    role: 'editor',
    department: 'Development',
    joinDate: '2023-03-05',
    lastActive: '1 day ago',
    status: 'active',
    permissions: ['upload_assets', 'edit_assets', 'comment'],
    stats: {
      uploads: 98,
      downloads: 167,
      reviews: 12,
      comments: 89
    }
  },
  {
    id: '5',
    name: 'Alex Rivera',
    email: 'alex.rivera@company.com',
    avatar: '/avatars/alex.png',
    role: 'viewer',
    department: 'Marketing',
    joinDate: '2023-04-12',
    lastActive: '2 days ago',
    status: 'active',
    permissions: ['download_assets', 'comment'],
    stats: {
      uploads: 12,
      downloads: 345,
      reviews: 5,
      comments: 45
    }
  },
  {
    id: '6',
    name: 'Emma Thompson',
    email: 'emma.thompson@company.com',
    avatar: '/avatars/emma.png',
    role: 'viewer',
    department: 'Sales',
    joinDate: '2023-05-08',
    lastActive: '1 week ago',
    status: 'inactive',
    permissions: ['download_assets'],
    stats: {
      uploads: 3,
      downloads: 89,
      reviews: 2,
      comments: 15
    }
  },
  {
    id: '7',
    name: 'James Wilson',
    email: 'james.wilson@external.com',
    avatar: '/avatars/james.png',
    role: 'viewer',
    department: 'External',
    joinDate: '2023-06-15',
    lastActive: 'Never',
    status: 'pending',
    permissions: [],
    stats: {
      uploads: 0,
      downloads: 0,
      reviews: 0,
      comments: 0
    }
  }
];

const mockRoles: Role[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full access to all features and settings',
    permissions: ['manage_users', 'upload_assets', 'edit_assets', 'delete_assets', 'manage_settings', 'view_analytics'],
    userCount: 1,
    color: 'text-red-600'
  },
  {
    id: 'editor',
    name: 'Editor',
    description: 'Can upload, edit, and manage assets',
    permissions: ['upload_assets', 'edit_assets', 'comment', 'review'],
    userCount: 3,
    color: 'text-blue-600'
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Can view and download assets',
    permissions: ['download_assets', 'comment'],
    userCount: 3,
    color: 'text-green-600'
  }
];

export function UsersScreen() {
  const [activeTab, setActiveTab] = useState('users');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Crown;
      case 'editor': return Edit;
      case 'viewer': return Eye;
      default: return User;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-600 bg-red-50';
      case 'editor': return 'text-blue-600 bg-blue-50';
      case 'viewer': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'inactive': return 'text-gray-600 bg-gray-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'suspended': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="h-full relative">
      {/* Main Content */}
      <div className="h-full pr-64"> {/* Space for sidebar */}
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">Users</h1>
                <p className="text-muted-foreground">Manage team members and permissions</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Invite User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite New User</DialogTitle>
                      <DialogDescription>
                        Send an invitation to a new team member
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" placeholder="John" />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" placeholder="Doe" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="john.doe@company.com" />
                      </div>
                      <div>
                        <Label htmlFor="role">Role</Label>
                        <Select defaultValue="viewer">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrator</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="development">Development</SelectItem>
                            <SelectItem value="sales">Sales</SelectItem>
                            <SelectItem value="external">External</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setShowInviteDialog(false)}>
                          Send Invitation
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Users Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
                <TabsTrigger value="activity">Activity Log</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              
              {/* Users Tab */}
              <TabsContent value="users" className="p-0">
                {/* Table Header */}
                <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border/30">
                  <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-muted-foreground">
                    <div className="col-span-4">User</div>
                    <div className="col-span-2">Role</div>
                    <div className="col-span-2">Department</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-1">Activity</div>
                    <div className="col-span-1">Actions</div>
                  </div>
                </div>
                
                {/* User Rows */}
                <div>
                  {filteredUsers.map((user, index) => {
                    const RoleIcon = getRoleIcon(user.role);
                    return (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className={cn(
                          "grid grid-cols-12 gap-4 p-4 hover:bg-muted/20 cursor-pointer transition-colors border-b border-border/30",
                          selectedUser?.id === user.id && "bg-primary/5 border-l-2 border-l-primary"
                        )}
                        onClick={() => setSelectedUser(user)}
                      >
                        {/* User Column */}
                        <div className="col-span-4 flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium truncate">{user.name}</h3>
                            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </div>
                        
                        {/* Role Column */}
                        <div className="col-span-2 flex items-center">
                          <Badge variant="outline" className={getRoleColor(user.role)}>
                            <RoleIcon className="w-3 h-3 mr-1" />
                            {user.role}
                          </Badge>
                        </div>
                        
                        {/* Department Column */}
                        <div className="col-span-2 flex items-center">
                          <span className="text-sm">{user.department}</span>
                        </div>
                        
                        {/* Status Column */}
                        <div className="col-span-2 flex items-center">
                          <Badge variant="outline" className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </div>
                        
                        {/* Activity Column */}
                        <div className="col-span-1 flex items-center">
                          <span className="text-sm text-muted-foreground">{user.lastActive}</span>
                        </div>
                        
                        {/* Actions Column */}
                        <div className="col-span-1 flex items-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy Email
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="w-4 h-4 mr-2" />
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.status === 'active' ? (
                                <DropdownMenuItem className="text-red-600">
                                  <Ban className="w-4 h-4 mr-2" />
                                  Suspend User
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem className="text-green-600">
                                  <Unlock className="w-4 h-4 mr-2" />
                                  Activate User
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Roles Tab */}
              <TabsContent value="roles" className="p-6 space-y-6">
                <div className="space-y-4">
                  {mockRoles.map((role) => {
                    const RoleIcon = getRoleIcon(role.id);
                    return (
                      <Card key={role.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", 
                                role.id === 'admin' ? 'bg-red-50' :
                                role.id === 'editor' ? 'bg-blue-50' : 'bg-green-50'
                              )}>
                                <RoleIcon className={cn("w-6 h-6", role.color)} />
                              </div>
                              <div>
                                <h3 className="font-medium">{role.name}</h3>
                                <p className="text-sm text-muted-foreground">{role.description}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {role.userCount} user{role.userCount !== 1 ? 's' : ''}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                              <Button variant="outline" size="sm">
                                <Users className="w-4 h-4 mr-2" />
                                Manage Users
                              </Button>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <h4 className="font-medium text-sm mb-2">Permissions</h4>
                            <div className="flex flex-wrap gap-2">
                              {role.permissions.map((permission) => (
                                <Badge key={permission} variant="secondary" className="text-xs">
                                  {permission.replace('_', ' ')}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Activity Log Tab */}
              <TabsContent value="activity" className="p-6 space-y-6">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent User Activity</CardTitle>
                      <CardDescription>Track user actions and login history</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { user: 'Sarah Chen', action: 'Updated user permissions', time: '2 minutes ago', type: 'admin' },
                          { user: 'Mike Johnson', action: 'Uploaded 5 new assets', time: '1 hour ago', type: 'upload' },
                          { user: 'Lisa Wong', action: 'Downloaded asset package', time: '2 hours ago', type: 'download' },
                          { user: 'David Kim', action: 'Invited new user', time: '3 hours ago', type: 'invite' },
                          { user: 'Alex Rivera', action: 'Logged in from new device', time: '1 day ago', type: 'login' }
                        ].map((activity, index) => (
                          <div key={index} className="flex items-center space-x-4 p-3 bg-muted/30 rounded-lg">
                            <div className={cn("w-2 h-2 rounded-full",
                              activity.type === 'admin' ? 'bg-red-500' :
                              activity.type === 'upload' ? 'bg-green-500' :
                              activity.type === 'download' ? 'bg-blue-500' :
                              activity.type === 'invite' ? 'bg-purple-500' : 'bg-gray-500'
                            )} />
                            <div className="flex-1">
                              <p className="text-sm">
                                <span className="font-medium">{activity.user}</span> {activity.action}
                              </p>
                              <p className="text-xs text-muted-foreground">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Right Sidebar - User Details */}
      <div className="fixed right-0 w-64 flex flex-col" style={{ top: '140px', bottom: '0' }}>
        <div className="px-6 py-4">
          <h3 className="font-semibold">User Details</h3>
        </div>
        
        <div className="px-6 pb-4 flex-1 overflow-auto">
          {selectedUser ? (
            <div className="space-y-4">
              <div className="text-center">
                <Avatar className="w-16 h-16 mx-auto mb-3">
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h4 className="font-medium">{selectedUser.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                <Badge variant="outline" className={cn("mt-2", getRoleColor(selectedUser.role))}>
                  {selectedUser.role}
                </Badge>
              </div>
              
              <Separator />
              
              {/* User Information */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Department</span>
                  <span>{selectedUser.department}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="outline" className={getStatusColor(selectedUser.status)}>
                    {selectedUser.status}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Joined</span>
                  <span>{new Date(selectedUser.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Active</span>
                  <span>{selectedUser.lastActive}</span>
                </div>
              </div>
              
              <Separator />
              
              {/* Activity Stats */}
              <div>
                <h5 className="font-medium mb-2">Activity Stats</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-center p-2 bg-muted/30 rounded">
                    <div className="font-medium">{selectedUser.stats.uploads}</div>
                    <div className="text-xs text-muted-foreground">Uploads</div>
                  </div>
                  <div className="text-center p-2 bg-muted/30 rounded">
                    <div className="font-medium">{selectedUser.stats.downloads}</div>
                    <div className="text-xs text-muted-foreground">Downloads</div>
                  </div>
                  <div className="text-center p-2 bg-muted/30 rounded">
                    <div className="font-medium">{selectedUser.stats.reviews}</div>
                    <div className="text-xs text-muted-foreground">Reviews</div>
                  </div>
                  <div className="text-center p-2 bg-muted/30 rounded">
                    <div className="font-medium">{selectedUser.stats.comments}</div>
                    <div className="text-xs text-muted-foreground">Comments</div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Permissions */}
              <div>
                <h5 className="font-medium mb-2">Permissions</h5>
                <div className="space-y-1">
                  {selectedUser.permissions.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>{permission.replace('_', ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              {/* Actions */}
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit User
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Change Role
                </Button>
                {selectedUser.status === 'active' ? (
                  <Button variant="outline" size="sm" className="w-full justify-start text-red-600">
                    <Ban className="w-4 h-4 mr-2" />
                    Suspend User
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="w-full justify-start text-green-600">
                    <Unlock className="w-4 h-4 mr-2" />
                    Activate User
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Select a user to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
