import { useState } from 'react';

import {
User, CreditCard, Users, Palette, Zap, Keyboard,
  Bell, Shield, Info, ChevronRight, Check, Moon, Sun,
  Monitor, Save, X, Plus, Trash2, Edit3, Eye, EyeOff,
  Mail, Smartphone, Globe, Lock, Key, Download,
  HelpCircle, ExternalLink
} from 'lucide-react';
import { Button, Input, Switch, Badge, Separator, Avatar, AvatarFallback, Card, CardContent, CardDescription, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@filehunt/shared-ts/ui';

type SettingsSection = 'account' | 'billing' | 'teams' | 'appearance' | 'features' | 'shortcuts' | 'notifications' | 'privacy' | 'about';

export function SettingsScreen() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('account');
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [showEmail, setShowEmail] = useState(false);

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

  const keyboardShortcuts = [
    { category: 'General', shortcuts: [
      { keys: ['Cmd', 'K'], description: 'Open command palette' },
      { keys: ['Cmd', 'N'], description: 'New asset' },
      { keys: ['Cmd', 'U'], description: 'Upload files' },
      { keys: ['Cmd', 'F'], description: 'Search' },
      { keys: ['Cmd', 'S'], description: 'Save current view' }
    ]},
    { category: 'Navigation', shortcuts: [
      { keys: ['G', 'A'], description: 'Go to Assets' },
      { keys: ['G', 'C'], description: 'Go to Collections' },
      { keys: ['G', 'B'], description: 'Go to Branches' },
      { keys: ['G', 'F'], description: 'Go to Favorites' },
      { keys: ['Esc'], description: 'Close panel/modal' }
    ]},
    { category: 'Asset Management', shortcuts: [
      { keys: ['Space'], description: 'Preview asset' },
      { keys: ['Enter'], description: 'Open asset detail' },
      { keys: ['Cmd', 'A'], description: 'Select all' },
      { keys: ['Cmd', 'D'], description: 'Duplicate' },
      { keys: ['Del'], description: 'Delete selected' }
    ]}
  ];

  const renderAccountSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg text-white mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-full flex items-center space-x-4 mb-6">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-blue-500 text-white text-xl">JD</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm" className="mb-2">
                <Edit3 className="w-4 h-4 mr-2" />
                Change Avatar
              </Button>
              <p className="text-sm text-gray-400">JPG, PNG or GIF. Max size 10MB.</p>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Full Name</label>
            <Input
              defaultValue="John Doe"
              className="bg-[#2a2d3a] border-[#373a4b] text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Username</label>
            <Input
              defaultValue="john.doe"
              className="bg-[#2a2d3a] border-[#373a4b] text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Email</label>
            <div className="relative">
              <Input
                type={showEmail ? "text" : "password"}
                defaultValue="john.doe@company.com"
                className="bg-[#2a2d3a] border-[#373a4b] text-white pr-10"
              />
              <button
                onClick={() => setShowEmail(!showEmail)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showEmail ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Role</label>
            <Select defaultValue="admin">
              <SelectTrigger className="bg-[#2a2d3a] border-[#373a4b] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator className="bg-[#373a4b]" />

      <div>
        <h3 className="text-lg text-white mb-4">Security</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Two-factor authentication</p>
              <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
            </div>
            <Button variant="outline" size="sm">
              <Shield className="w-4 h-4 mr-2" />
              Enable 2FA
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Password</p>
              <p className="text-sm text-gray-400">Last changed 3 months ago</p>
            </div>
            <Button variant="outline" size="sm">
              <Key className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );

  const renderBillingSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg text-white mb-4">Current Plan</h3>
        <Card className="bg-[#2a2d3a] border-[#373a4b]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Pro Plan</CardTitle>
                <CardDescription className="text-gray-400">
                  Perfect for growing teams
                </CardDescription>
              </div>
              <Badge className="bg-green-500/20 text-green-300">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2 mb-4">
              <span className="text-3xl text-white">$29</span>
              <span className="text-gray-400">/month</span>
            </div>
            <ul className="space-y-2 text-sm text-gray-300 mb-6">
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-400 mr-2" />
                100GB storage
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-400 mr-2" />
                Up to 10 team members
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-400 mr-2" />
                Advanced version control
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-400 mr-2" />
                Priority support
              </li>
            </ul>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Upgrade Plan</Button>
              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                Cancel Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg text-white mb-4">Billing History</h3>
        <div className="space-y-3">
          {[
            { date: 'Dec 1, 2024', amount: '$29.00', status: 'Paid', invoice: 'INV-001' },
            { date: 'Nov 1, 2024', amount: '$29.00', status: 'Paid', invoice: 'INV-002' },
            { date: 'Oct 1, 2024', amount: '$29.00', status: 'Paid', invoice: 'INV-003' }
          ].map((payment, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-[#2a2d3a] rounded-lg border border-[#373a4b]">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-white">{payment.date}</p>
                  <p className="text-sm text-gray-400">{payment.invoice}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                  {payment.status}
                </Badge>
                <span className="text-white">{payment.amount}</span>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTeamsSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg text-white">Team Members</h3>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      <div className="space-y-3">
        {[
          { name: 'John Doe', email: 'john.doe@company.com', role: 'Administrator', status: 'Active', avatar: 'JD' },
          { name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'Editor', status: 'Active', avatar: 'SC' },
          { name: 'Mike Johnson', email: 'mike.johnson@company.com', role: 'Viewer', status: 'Pending', avatar: 'MJ' },
          { name: 'Lisa Wong', email: 'lisa.wong@company.com', role: 'Editor', status: 'Active', avatar: 'LW' }
        ].map((member, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-[#2a2d3a] rounded-lg border border-[#373a4b]">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarFallback className="bg-blue-500 text-white">{member.avatar}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white">{member.name}</p>
                <p className="text-sm text-gray-400">{member.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={member.status === 'Active' ? 'secondary' : 'outline'}
                     className={member.status === 'Active' ? 'bg-green-500/20 text-green-300' : 'text-orange-300'}>
                {member.status}
              </Badge>
              <Select defaultValue={member.role.toLowerCase()}>
                <SelectTrigger className="w-32 bg-[#1f2029] border-[#373a4b] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="administrator">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg text-white mb-4">Theme</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: 'light', name: 'Light', icon: Sun },
            { value: 'dark', name: 'Dark', icon: Moon },
            { value: 'system', name: 'System', icon: Monitor }
          ].map((themeOption) => {
            const IconComponent = themeOption.icon;
            return (
              <button
                key={themeOption.value}
                onClick={() => setTheme(themeOption.value as 'dark' | 'light' | 'system')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  theme === themeOption.value
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-[#373a4b] bg-[#2a2d3a] hover:border-gray-500'
                }`}
              >
                <IconComponent className="w-6 h-6 text-white mx-auto mb-2" />
                <p className="text-sm text-white">{themeOption.name}</p>
              </button>
            );
          })}
        </div>
      </div>

      <Separator className="bg-[#373a4b]" />

      <div>
        <h3 className="text-lg text-white mb-4">Display Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Compact mode</p>
              <p className="text-sm text-gray-400">Show more content in less space</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Show file extensions</p>
              <p className="text-sm text-gray-400">Display file extensions in asset names</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">High contrast</p>
              <p className="text-sm text-gray-400">Increase contrast for better visibility</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeaturesSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg text-white mb-4">AI Features</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Auto-tagging</p>
              <p className="text-sm text-gray-400">Automatically tag assets using AI</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Duplicate detection</p>
              <p className="text-sm text-gray-400">Find and manage duplicate assets</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Smart collections</p>
              <p className="text-sm text-gray-400">Create collections based on content analysis</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      <Separator className="bg-[#373a4b]" />

      <div>
        <h3 className="text-lg text-white mb-4">Workflow Features</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Approval workflows</p>
              <p className="text-sm text-gray-400">Enable approval processes for assets</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Version control</p>
              <p className="text-sm text-gray-400">Track changes and versions</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Real-time collaboration</p>
              <p className="text-sm text-gray-400">See who's viewing and editing assets</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );

  const renderShortcutsSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg text-white">Keyboard Shortcuts</h3>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export Shortcuts
        </Button>
      </div>

      <div className="space-y-6">
        {keyboardShortcuts.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <h4 className="text-base text-white mb-3">{category.category}</h4>
            <div className="space-y-2">
              {category.shortcuts.map((shortcut, shortcutIndex) => (
                <div key={shortcutIndex} className="flex items-center justify-between p-3 bg-[#2a2d3a] rounded border border-[#373a4b]">
                  <span className="text-gray-300">{shortcut.description}</span>
                  <div className="flex items-center space-x-1">
                    {shortcut.keys.map((key, keyIndex) => (
                      <kbd key={keyIndex} className="px-2 py-1 bg-[#1f2029] border border-[#373a4b] rounded text-xs text-white">
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg text-white mb-4">Email Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">New assets uploaded</p>
              <p className="text-sm text-gray-400">Get notified when new assets are added</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Comments and mentions</p>
              <p className="text-sm text-gray-400">When someone comments or mentions you</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Approval requests</p>
              <p className="text-sm text-gray-400">When assets need your approval</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Weekly summary</p>
              <p className="text-sm text-gray-400">Weekly digest of activity</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      <Separator className="bg-[#373a4b]" />

      <div>
        <h3 className="text-lg text-white mb-4">Push Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Browser notifications</p>
              <p className="text-sm text-gray-400">Show notifications in your browser</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Sound alerts</p>
              <p className="text-sm text-gray-400">Play sound for important notifications</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg text-white mb-4">Data & Privacy</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Usage analytics</p>
              <p className="text-sm text-gray-400">Help improve Filehunt by sharing usage data</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Crash reporting</p>
              <p className="text-sm text-gray-400">Automatically send crash reports</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Marketing emails</p>
              <p className="text-sm text-gray-400">Receive updates and promotional content</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      <Separator className="bg-[#373a4b]" />

      <div>
        <h3 className="text-lg text-white mb-4">Data Management</h3>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Download className="w-4 h-4 mr-2" />
            Export my data
          </Button>
          <Button variant="outline" className="w-full justify-start text-red-400 hover:text-red-300 border-red-400/30">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete my account
          </Button>
        </div>
      </div>
    </div>
  );

  const renderAboutSection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl text-white">F</span>
        </div>
        <h3 className="text-xl text-white mb-2">Filehunt</h3>
        <p className="text-gray-400 mb-4">Version 2.1.0</p>
        <p className="text-sm text-gray-400 max-w-md mx-auto">
          A modern Digital Asset Management platform designed for creative teams to organize,
          collaborate, and manage their digital content efficiently.
        </p>
      </div>

      <Separator className="bg-[#373a4b]" />

      <div>
        <h4 className="text-base text-white mb-3">Resources</h4>
        <div className="space-y-2">
          <button className="flex items-center justify-between w-full p-3 bg-[#2a2d3a] rounded border border-[#373a4b] text-left hover:bg-[#353847] transition-colors">
            <div className="flex items-center">
              <HelpCircle className="w-4 h-4 text-gray-400 mr-3" />
              <span className="text-gray-300">Help Center</span>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </button>

          <button className="flex items-center justify-between w-full p-3 bg-[#2a2d3a] rounded border border-[#373a4b] text-left hover:bg-[#353847] transition-colors">
            <div className="flex items-center">
              <Globe className="w-4 h-4 text-gray-400 mr-3" />
              <span className="text-gray-300">API Documentation</span>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </button>

          <button className="flex items-center justify-between w-full p-3 bg-[#2a2d3a] rounded border border-[#373a4b] text-left hover:bg-[#353847] transition-colors">
            <div className="flex items-center">
              <Mail className="w-4 h-4 text-gray-400 mr-3" />
              <span className="text-gray-300">Contact Support</span>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-base text-white mb-3">Legal</h4>
        <div className="space-y-2 text-sm">
          <button className="text-gray-400 hover:text-white transition-colors">Privacy Policy</button>
          <span className="text-gray-600 mx-2">•</span>
          <button className="text-gray-400 hover:text-white transition-colors">Terms of Service</button>
          <span className="text-gray-600 mx-2">•</span>
          <button className="text-gray-400 hover:text-white transition-colors">Cookie Policy</button>
        </div>
      </div>

      <div className="text-center pt-4">
        <p className="text-xs text-gray-500">
          © 2024 Filehunt. All rights reserved.
        </p>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'account': return renderAccountSection();
      case 'billing': return renderBillingSection();
      case 'teams': return renderTeamsSection();
      case 'appearance': return renderAppearanceSection();
      case 'features': return renderFeaturesSection();
      case 'shortcuts': return renderShortcutsSection();
      case 'notifications': return renderNotificationsSection();
      case 'privacy': return renderPrivacySection();
      case 'about': return renderAboutSection();
    }
  };

  return (
    <div className="flex-1 bg-[#1a1d29] flex">
      {/* Settings Navigation */}
      <div className="w-64 bg-[#1f2029] border-r border-[#373a4b] p-4">
        <h2 className="text-lg text-white mb-6">Settings</h2>
        <nav className="space-y-1">
          {settingsSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-[#2a2d3a] hover:text-white'
                }`}
              >
                <IconComponent className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{section.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-2xl text-white mb-2">
              {settingsSections.find(s => s.id === activeSection)?.name}
            </h1>
            <p className="text-gray-400">
              {activeSection === 'account' && 'Manage your account information and preferences'}
              {activeSection === 'billing' && 'View and manage your subscription and billing details'}
              {activeSection === 'teams' && 'Manage team members and their permissions'}
              {activeSection === 'appearance' && 'Customize the look and feel of your workspace'}
              {activeSection === 'features' && 'Enable or disable advanced features'}
              {activeSection === 'shortcuts' && 'View and customize keyboard shortcuts'}
              {activeSection === 'notifications' && 'Control how and when you receive notifications'}
              {activeSection === 'privacy' && 'Manage your privacy and data preferences'}
              {activeSection === 'about' && 'Information about Filehunt and resources'}
            </p>
          </div>

          {renderSectionContent()}
        </div>
      </div>
    </div>
  );
}
