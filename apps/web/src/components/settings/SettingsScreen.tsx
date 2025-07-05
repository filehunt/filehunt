"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  User,
  Users,
  Shield,
  Bell,
  Palette,
  Monitor,
  Smartphone,
  Globe,
  Key,
  CreditCard,
  Download,
  Upload,
  Trash2,
  Save,
  RefreshCw,
  ExternalLink,
  Check,
  X,
  Plus,
  Edit,
  Eye,
  EyeOff,
  AlertTriangle,
  Info,
  HelpCircle,
  Zap,
  Keyboard
} from 'lucide-react';
import { Button } from '@/components/button';
import { Badge } from '@/components/badge';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { Switch } from '@/components/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';
import { Separator } from '@/components/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar';
import { Alert, AlertDescription } from '@/components/alert';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'editor' | 'viewer';
  department: string;
  lastActive: string;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  lastSync?: string;
  status: 'active' | 'error' | 'pending';
}

const mockUser: User = {
  id: 'current-user',
  name: 'Sarah Chen',
  email: 'sarah.chen@company.com',
  avatar: '/avatars/sarah.png',
  role: 'admin',
  department: 'Design',
  lastActive: 'Now'
};

const mockIntegrations: Integration[] = [
  {
    id: 'slack',
    name: 'Slack',
    description: 'Get notifications and collaborate in your Slack workspace',
    icon: '💬',
    connected: true,
    lastSync: '2 minutes ago',
    status: 'active'
  },
  {
    id: 'figma',
    name: 'Figma',
    description: 'Sync designs and prototypes from your Figma workspace',
    icon: '🎨',
    connected: true,
    lastSync: '1 hour ago',
    status: 'active'
  },
  {
    id: 'adobe',
    name: 'Adobe Creative Cloud',
    description: 'Import assets directly from Adobe CC applications',
    icon: '🔴',
    connected: false,
    status: 'pending'
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    description: 'Collaborate and share updates in Microsoft Teams',
    icon: '🟦',
    connected: false,
    status: 'pending'
  }
];

export function SettingsScreen() {
  const [activeSection, setActiveSection] = useState<'account' | 'billing' | 'teams' | 'appearance' | 'features' | 'shortcuts' | 'notifications' | 'privacy' | 'about'>('account');
  const [currentUser, setCurrentUser] = useState(mockUser);
  const [integrations, setIntegrations] = useState(mockIntegrations);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const handleSave = () => {
    // Simulate save
    setIsDirty(false);
    // Show success message
  };

  const toggleIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration =>
      integration.id === integrationId
        ? { ...integration, connected: !integration.connected }
        : integration
    ));
  };

  const settingsSections = [
    { id: 'account' as const, name: 'Account', icon: User },
    { id: 'billing' as const, name: 'Plans & Billing', icon: CreditCard },
    { id: 'teams' as const, name: 'Teams', icon: Users },
    { id: 'appearance' as const, name: 'Appearance', icon: Palette },
    { id: 'features' as const, name: 'Features', icon: Zap },
    { id: 'shortcuts' as const, name: 'Keyboard shortcuts', icon: Keyboard },
    { id: 'notifications' as const, name: 'Notifications', icon: Bell },
    { id: 'privacy' as const, name: 'Privacy', icon: Shield },
    { id: 'about' as const, name: 'About', icon: Info }
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* Settings Navigation Tabs */}
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and workspace preferences</p>
        </div>

        <div className="flex items-center space-x-1 overflow-x-auto">
          {settingsSections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <motion.button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap",
                  activeSection === section.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted/50'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <IconComponent className="w-4 h-4 flex-shrink-0" />
                <span>{section.name}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="flex items-center space-x-2 mt-4">
          {isDirty && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </motion.div>
          )}
          {/* <Button variant="outline" size="sm">
            <HelpCircle className="w-4 h-4 mr-2" />
            Help
          </Button> */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <motion.div
          className="max-w-6xl mx-auto p-6"
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >

          {/* Content */}
          <div>
            {/* Account Section */}
            {activeSection === 'account' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="grid grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <div className="mb-4">
                      <h3 className="font-medium text-lg">Personal Information</h3>
                      <p className="text-muted-foreground text-sm">Update your personal details and profile</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-20 h-20">
                          <AvatarImage src={currentUser.avatar} />
                          <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm">
                            <Upload className="w-4 h-4 mr-2" />
                            Change Photo
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" defaultValue="Sarah" onChange={() => setIsDirty(true)} />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" defaultValue="Chen" onChange={() => setIsDirty(true)} />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={currentUser.email} onChange={() => setIsDirty(true)} />
                      </div>

                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Select defaultValue={currentUser.department} onValueChange={() => setIsDirty(true)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Design">Design</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Development">Development</SelectItem>
                            <SelectItem value="Product">Product</SelectItem>
                            <SelectItem value="Sales">Sales</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Workspace Settings */}
                  <div className="space-y-4">
                    <div className="mb-4">
                      <h3 className="font-medium text-lg">Workspace Preferences</h3>
                      <p className="text-muted-foreground text-sm">Customize your workspace experience</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select defaultValue="UTC-8" onValueChange={() => setIsDirty(true)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                            <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                            <SelectItem value="UTC+0">GMT (UTC+0)</SelectItem>
                            <SelectItem value="UTC+1">Central European (UTC+1)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="language">Language</Label>
                        <Select defaultValue="en" onValueChange={() => setIsDirty(true)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="de">Deutsch</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Auto-save drafts</Label>
                            <p className="text-sm text-muted-foreground">Automatically save work in progress</p>
                          </div>
                          <Switch defaultChecked onCheckedChange={() => setIsDirty(true)} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Show file extensions</Label>
                            <p className="text-sm text-muted-foreground">Display file extensions in asset names</p>
                          </div>
                          <Switch onCheckedChange={() => setIsDirty(true)} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Enable keyboard shortcuts</Label>
                            <p className="text-sm text-muted-foreground">Use keyboard shortcuts for quick actions</p>
                          </div>
                          <Switch defaultChecked onCheckedChange={() => setIsDirty(true)} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notifications Section */}
            {activeSection === 'notifications' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="mb-4">
                      <h3 className="font-medium text-lg">Email Notifications</h3>
                      <p className="text-muted-foreground text-sm">Choose what email notifications you receive</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Asset uploads</Label>
                          <p className="text-sm text-muted-foreground">When someone uploads new assets</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Comments and reviews</Label>
                          <p className="text-sm text-muted-foreground">When someone comments on your assets</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Mentions</Label>
                          <p className="text-sm text-muted-foreground">When you're mentioned in comments</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Weekly digest</Label>
                          <p className="text-sm text-muted-foreground">Summary of workspace activity</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="mb-4">
                      <h3 className="font-medium text-lg">Push Notifications</h3>
                      <p className="text-muted-foreground text-sm">Manage real-time notifications</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Browser notifications</Label>
                          <p className="text-sm text-muted-foreground">Show notifications in your browser</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Desktop notifications</Label>
                          <p className="text-sm text-muted-foreground">Show notifications on your desktop</p>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Mobile notifications</Label>
                          <p className="text-sm text-muted-foreground">Push notifications to mobile app</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div>
                        <Label>Quiet hours</Label>
                        <p className="text-sm text-muted-foreground mb-2">Don't send notifications during these hours</p>
                        <div className="flex items-center space-x-2">
                          <Input placeholder="22:00" className="w-20" />
                          <span className="text-sm">to</span>
                          <Input placeholder="08:00" className="w-20" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Appearance Section */}
            {activeSection === 'appearance' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="mb-4">
                      <h3 className="font-medium text-lg">Theme</h3>
                      <p className="text-muted-foreground text-sm">Customize the appearance of your workspace</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label>Color theme</Label>
                        <div className="grid grid-cols-3 gap-4 mt-2">
                          <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                            <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
                            <span className="text-sm">Iris</span>
                          </div>
                          <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                            <div className="w-12 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded"></div>
                            <span className="text-sm">Plum</span>
                          </div>
                          <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                            <div className="w-12 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded"></div>
                            <span className="text-sm">Crimson</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Dark mode</Label>
                          <p className="text-sm text-muted-foreground">Use dark theme</p>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Reduced motion</Label>
                          <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="mb-4">
                      <h3 className="font-medium text-lg">Layout</h3>
                      <p className="text-muted-foreground text-sm">Customize how content is displayed</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label>Sidebar position</Label>
                        <Select defaultValue="left">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Default view</Label>
                        <Select defaultValue="grid">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="grid">Grid</SelectItem>
                            <SelectItem value="list">List</SelectItem>
                            <SelectItem value="masonry">Masonry</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Grid size</Label>
                        <Select defaultValue="medium">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Security Section */}
            {activeSection === 'privacy' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="grid grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Password & Authentication</CardTitle>
                      <CardDescription>Manage your login credentials</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" />
                      </div>

                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" />
                      </div>

                      <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" />
                      </div>

                      <Button>Update Password</Button>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Two-factor authentication</Label>
                          <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Enable 2FA
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>API Access</CardTitle>
                      <CardDescription>Manage API keys and access tokens</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>API Key</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            type={showApiKey ? "text" : "password"}
                            value="fh_1234567890abcdef..."
                            readOnly
                            className="font-mono"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowApiKey(!showApiKey)}
                          >
                            {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Regenerate
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          API Docs
                        </Button>
                      </div>

                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Keep your API key secure. Don't share it or expose it in client-side code.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {/* Features Section */}
            {activeSection === 'features' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="grid grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>AI Features</CardTitle>
                      <CardDescription>Intelligent features to enhance your workflow</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Auto-tagging</Label>
                          <p className="text-sm text-muted-foreground">Automatically tag assets using AI</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Duplicate detection</Label>
                          <p className="text-sm text-muted-foreground">Find and manage duplicate assets</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Smart collections</Label>
                          <p className="text-sm text-muted-foreground">Create collections based on content analysis</p>
                        </div>
                        <Switch />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Workflow Features</CardTitle>
                      <CardDescription>Collaboration and workflow management</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Approval workflows</Label>
                          <p className="text-sm text-muted-foreground">Enable approval processes for assets</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Version control</Label>
                          <p className="text-sm text-muted-foreground">Track changes and versions</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Real-time collaboration</Label>
                          <p className="text-sm text-muted-foreground">See who's viewing and editing assets</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                <Card>
                  <CardHeader>
                    <CardTitle>Integrations</CardTitle>
                    <CardDescription>Connect with external services and tools</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {integrations.map((integration) => (
                        <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="text-2xl">{integration.icon}</div>
                            <div>
                              <h3 className="font-medium">{integration.name}</h3>
                              <p className="text-sm text-muted-foreground">{integration.description}</p>
                              {integration.connected && integration.lastSync && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Last sync: {integration.lastSync}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={integration.connected ? "default" : "outline"}>
                              {integration.connected ? "Connected" : "Disconnected"}
                            </Badge>
                            <Button
                              variant={integration.connected ? "outline" : "default"}
                              size="sm"
                              onClick={() => toggleIntegration(integration.id)}
                            >
                              {integration.connected ? "Disconnect" : "Connect"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Billing Section */}
            {activeSection === 'billing' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="grid grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Plan</CardTitle>
                      <CardDescription>Your subscription details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Pro Plan</h3>
                          <p className="text-sm text-muted-foreground">$29/month per user</p>
                        </div>
                        <Badge>Active</Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Users</span>
                          <span>8 / 15</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Storage</span>
                          <span>2.3GB / 100GB</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>API Calls</span>
                          <span>1,234 / 10,000</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Upgrade</Button>
                        <Button variant="outline" size="sm">Change Plan</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Method</CardTitle>
                      <CardDescription>Manage your billing information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-8 h-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">•••• •••• •••• 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 12/26</p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Update
                        </Button>
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Card
                        </Button>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-2">Billing Address</h4>
                        <p className="text-sm text-muted-foreground">
                          123 Design Street<br />
                          San Francisco, CA 94102<br />
                          United States
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {/* Teams Section */}
            {activeSection === 'teams' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Team Management</CardTitle>
                    <CardDescription>Manage team members and permissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Team management features coming soon.</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Shortcuts Section */}
            {activeSection === 'shortcuts' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export Shortcuts
                  </Button>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      category: 'General',
                      shortcuts: [
                        { keys: ['Cmd', 'K'], description: 'Open command palette' },
                        { keys: ['Cmd', 'N'], description: 'New asset' },
                        { keys: ['Cmd', 'U'], description: 'Upload files' },
                        { keys: ['Cmd', 'F'], description: 'Search' },
                        { keys: ['Cmd', 'S'], description: 'Save current view' }
                      ]
                    },
                    {
                      category: 'Navigation',
                      shortcuts: [
                        { keys: ['G', 'A'], description: 'Go to Assets' },
                        { keys: ['G', 'C'], description: 'Go to Collections' },
                        { keys: ['G', 'B'], description: 'Go to Branches' },
                        { keys: ['G', 'F'], description: 'Go to Favorites' },
                        { keys: ['Esc'], description: 'Close panel/modal' }
                      ]
                    },
                    {
                      category: 'Asset Management',
                      shortcuts: [
                        { keys: ['Space'], description: 'Preview asset' },
                        { keys: ['Enter'], description: 'Open asset detail' },
                        { keys: ['Cmd', 'A'], description: 'Select all' },
                        { keys: ['Cmd', 'D'], description: 'Duplicate' },
                        { keys: ['Del'], description: 'Delete selected' }
                      ]
                    }
                  ].map((category, categoryIndex) => (
                    <Card key={categoryIndex}>
                      <CardHeader>
                        <CardTitle className="text-base">{category.category}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {category.shortcuts.map((shortcut, shortcutIndex) => (
                            <div key={shortcutIndex} className="flex items-center justify-between p-3 border rounded">
                              <span className="text-sm">{shortcut.description}</span>
                              <div className="flex items-center space-x-1">
                                {shortcut.keys.map((key, keyIndex) => (
                                  <kbd key={keyIndex} className="px-2 py-1 bg-muted border rounded text-xs">
                                    {key}
                                  </kbd>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Privacy Section */}
            {activeSection === 'privacy' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>Control your privacy preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Usage analytics</Label>
                          <p className="text-sm text-muted-foreground">Help improve Filehunt by sharing usage data</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Crash reporting</Label>
                          <p className="text-sm text-muted-foreground">Automatically send crash reports</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* About Section */}
            {activeSection === 'about' && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-primary-foreground font-bold">F</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Filehunt</h3>
                  <p className="text-muted-foreground mb-4">Version 2.1.0</p>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    A modern Digital Asset Management platform designed for creative teams to organize,
                    collaborate, and manage their digital content efficiently.
                  </p>
                </div>

                <Separator />

                <Card>
                  <CardHeader>
                    <CardTitle>Resources</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Help Center
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      API Documentation
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
