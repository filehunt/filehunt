"use client";

import { useState } from 'react';
// import { motion } from 'framer-motion';
import {
  HelpCircle,
  Search,
  Book,
  MessageCircle,
  Video,
  FileText,
  Keyboard,
  Mail,
  ExternalLink,
  ChevronRight,
  Download,
  Star,
  Users,
  Zap,
  Shield,
  Settings,
  Upload,
  FolderOpen,
  Tag,
  Heart,
  Grid,
  Filter,
  Share2,
  Eye,
  Edit3,
  Trash2,
  Copy,
  Archive
} from 'lucide-react';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Badge } from '@/components/badge';
import { Separator } from '@/components/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs';
import { cn } from '@/lib/utils';

interface HelpItem {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: any;
  content?: string;
  videoUrl?: string;
  popular?: boolean;
}

interface ShortcutGroup {
  category: string;
  shortcuts: Array<{
    keys: string[];
    description: string;
  }>;
}

const helpItems: HelpItem[] = [
  {
    id: 'getting-started',
    title: 'Getting Started with Filehunt',
    description: 'Learn the basics of managing your digital assets',
    category: 'Basics',
    icon: Book,
    popular: true,
    content: 'Complete guide to getting started with Filehunt DAM...'
  },
  {
    id: 'uploading-assets',
    title: 'Uploading and Organizing Assets',
    description: 'How to upload files and organize them efficiently',
    category: 'Assets',
    icon: Upload,
    popular: true,
    content: 'Step-by-step guide for uploading and organizing assets...'
  },
  {
    id: 'collections',
    title: 'Creating and Managing Collections',
    description: 'Organize your assets into collections',
    category: 'Organization',
    icon: FolderOpen,
    content: 'Learn how to create smart and manual collections...'
  },
  {
    id: 'tagging',
    title: 'Tagging and Metadata',
    description: 'Add tags and metadata to improve discoverability',
    category: 'Organization',
    icon: Tag,
    popular: true,
    content: 'Best practices for tagging and metadata management...'
  },
  {
    id: 'search',
    title: 'Advanced Search and Filters',
    description: 'Find assets quickly with powerful search',
    category: 'Search',
    icon: Search,
    content: 'Master the search and filtering capabilities...'
  },
  {
    id: 'sharing',
    title: 'Sharing and Collaboration',
    description: 'Share assets with team members and external users',
    category: 'Collaboration',
    icon: Share2,
    content: 'Learn about sharing options and collaboration features...'
  },
  {
    id: 'permissions',
    title: 'User Permissions and Roles',
    description: 'Manage user access and permissions',
    category: 'Administration',
    icon: Shield,
    content: 'Understanding user roles and permission management...'
  },
  {
    id: 'api',
    title: 'API Documentation',
    description: 'Integrate Filehunt with your applications',
    category: 'Development',
    icon: FileText,
    content: 'Complete API reference and integration examples...'
  }
];

const shortcuts: ShortcutGroup[] = [
  {
    category: 'General',
    shortcuts: [
      { keys: ['Cmd', 'K'], description: 'Open command palette' },
      { keys: ['Cmd', 'N'], description: 'New asset' },
      { keys: ['Cmd', 'U'], description: 'Upload files' },
      { keys: ['Cmd', 'F'], description: 'Search' },
      { keys: ['Cmd', 'S'], description: 'Save current view' },
      { keys: ['Cmd', ','], description: 'Open settings' }
    ]
  },
  {
    category: 'Navigation',
    shortcuts: [
      { keys: ['G', 'A'], description: 'Go to Assets' },
      { keys: ['G', 'C'], description: 'Go to Collections' },
      { keys: ['G', 'F'], description: 'Go to Favorites' },
      { keys: ['G', 'U'], description: 'Go to Upload' },
      { keys: ['G', 'S'], description: 'Go to Search' },
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
      { keys: ['Del'], description: 'Delete selected' },
      { keys: ['H'], description: 'Toggle favorite' }
    ]
  },
  {
    category: 'View Controls',
    shortcuts: [
      { keys: ['1'], description: 'Grid view' },
      { keys: ['2'], description: 'List view' },
      { keys: ['3'], description: 'Masonry view' },
      { keys: ['Cmd', '+'], description: 'Increase card size' },
      { keys: ['Cmd', '-'], description: 'Decrease card size' }
    ]
  }
];

const faqItems = [
  {
    question: "How do I upload multiple files at once?",
    answer: "You can upload multiple files by dragging and dropping them into the upload area, or by clicking the upload button and selecting multiple files. Filehunt supports batch uploads of up to 100 files at once."
  },
  {
    question: "What file formats are supported?",
    answer: "Filehunt supports all major file formats including images (JPG, PNG, GIF, SVG, WebP), videos (MP4, MOV, AVI, WebM), documents (PDF, DOC, DOCX, PPT, PPTX), and design files (PSD, AI, SKETCH, FIG)."
  },
  {
    question: "How do I share assets with external users?",
    answer: "You can share assets by selecting them and clicking the share button. You can generate secure links with expiration dates, password protection, and download permissions."
  },
  {
    question: "Can I organize assets into folders?",
    answer: "Yes, Filehunt uses both folders and collections. Folders work like traditional file system folders, while collections are more flexible and can contain assets from multiple folders."
  },
  {
    question: "How do I set up automatic tagging?",
    answer: "Automatic tagging is available in the Features section of Settings. Enable AI-powered auto-tagging to automatically tag your assets based on their content."
  }
];

export function HelpScreen() {
  const [activeTab, setActiveTab] = useState('guide');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(helpItems.map(item => item.category))];
  
  const filteredHelpItems = helpItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularItems = helpItems.filter(item => item.popular);

  return (
    <div className="flex-1 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-6 max-w-6xl mx-auto w-full">
          {/* Quick Actions Bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline" size="sm">
                <Video className="w-4 h-4 mr-2" />
                Video Tutorials
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download Guide
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              📧 support@filehunt.com • 💬 Live chat • 🕒 Mon-Fri, 9AM-6PM PST
            </div>
          </div>
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Help Center</h1>
            <p className="text-muted-foreground">Find answers, learn new features, and get the most out of Filehunt</p>
          </div>

          <div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="guide">User Guide</TabsTrigger>
              <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            {/* User Guide Tab */}
            <TabsContent value="guide" className="mt-6">
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </Badge>
                ))}
              </div>

              {/* Help Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHelpItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={item.id}
                    >
                      <div className="cursor-pointer hover:bg-muted/10 transition-colors p-4 rounded-lg">
                        <div className="pb-3">
                          <div className="flex items-start justify-between">
                            <IconComponent className="w-8 h-8 text-blue-500" />
                            {item.popular && (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                Popular
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-medium">{item.title}</h3>
                          <p className="text-muted-foreground text-sm">{item.description}</p>
                        </div>
                        <div className="pt-0">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{item.category}</Badge>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Shortcuts Tab */}
            <TabsContent value="shortcuts" className="mt-6">
              <div className="space-y-6">
                {shortcuts.map((group, index) => (
                  <div
                    key={group.category}
                  >
                  <div className="space-y-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium">{group.category}</h3>
                    </div>
                    <div>
                      <div className="space-y-3">
                        {group.shortcuts.map((shortcut, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded">
                            <span className="text-sm">{shortcut.description}</span>
                            <div className="flex items-center space-x-1">
                              {shortcut.keys.map((key, keyIndex) => (
                                <kbd key={keyIndex} className="px-2 py-1 bg-muted border rounded text-xs font-mono">
                                  {key}
                                </kbd>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="mt-6">
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <div
                    key={index}
                  >
                  <div className="space-y-4">
                    <div className="mb-2">
                      <h3 className="text-lg font-medium">{item.question}</h3>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{item.answer}</p>
                    </div>
                  </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Email Support',
                    description: 'Get help via email',
                    content: 'Send us an email and we\'ll get back to you within 24 hours.',
                    icon: Mail,
                    action: 'Send Email'
                  },
                  {
                    title: 'Live Chat',
                    description: 'Chat with our support team',
                    content: 'Available Monday-Friday, 9AM-6PM PST',
                    icon: MessageCircle,
                    action: 'Start Chat'
                  },
                  {
                    title: 'Video Tutorials',
                    description: 'Learn with video guides',
                    content: 'Watch step-by-step tutorials on our YouTube channel.',
                    icon: Video,
                    action: 'Watch Videos',
                    variant: 'outline'
                  },
                  {
                    title: 'Community',
                    description: 'Join our user community',
                    content: 'Connect with other users and share tips and tricks.',
                    icon: Users,
                    action: 'Join Community',
                    variant: 'outline'
                  }
                ].map((contact, index) => {
                  const IconComponent = contact.icon;
                  return (
                    <div
                      key={index}
                    >
                      <div className="space-y-4 p-4 hover:bg-muted/10 transition-colors rounded-lg">
                        <div className="mb-4">
                          <h3 className="flex items-center space-x-2 font-medium text-lg">
                            <IconComponent className="w-5 h-5" />
                            <span>{contact.title}</span>
                          </h3>
                          <p className="text-muted-foreground text-sm">{contact.description}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-4">
                            {contact.content}
                          </p>
                          <Button 
                            variant={contact.variant as any || "default"} 
                            className="w-full"
                          >
                            <IconComponent className="w-4 h-4 mr-2" />
                            {contact.action}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
