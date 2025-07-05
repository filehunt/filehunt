export interface Branch {
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

export const mockBranches: Branch[] = [
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
  },
  {
    id: '5',
    name: 'feature/mobile-app-icons',
    description: 'New mobile app icons and splash screens',
    purpose: 'feature',
    creator: {
      id: 'emma',
      name: 'Emma Chen',
      avatar: '/avatars/emma.png',
      role: 'UI Designer'
    },
    collaborators: [
      { id: 'emma', name: 'Emma Chen', avatar: '/avatars/emma.png' },
      { id: 'sarah', name: 'Sarah Chen', avatar: '/avatars/sarah.png' }
    ],
    createdAt: '2024-01-11T10:15:00Z',
    lastActivity: '4 hours ago',
    assetsCount: 32,
    changesCount: 15,
    status: 'active',
    isProtected: false,
    readyForMerge: false
  },
  {
    id: '6',
    name: 'hotfix/logo-alignment',
    description: 'Quick fix for logo alignment issues in presentations',
    purpose: 'hotfix',
    creator: {
      id: 'david',
      name: 'David Kim',
      avatar: '/avatars/david.png',
      role: 'Brand Designer'
    },
    collaborators: [
      { id: 'david', name: 'David Kim', avatar: '/avatars/david.png' }
    ],
    createdAt: '2024-01-14T18:30:00Z',
    lastActivity: '30 minutes ago',
    assetsCount: 8,
    changesCount: 2,
    status: 'ready_for_review',
    isProtected: false,
    readyForMerge: true
  },
  {
    id: '7',
    name: 'campaign/spring-launch-2024',
    description: 'Complete asset package for Spring 2024 product launch',
    purpose: 'campaign',
    creator: {
      id: 'lisa',
      name: 'Lisa Wong',
      avatar: '/avatars/lisa.png',
      role: 'Campaign Manager'
    },
    collaborators: [
      { id: 'lisa', name: 'Lisa Wong', avatar: '/avatars/lisa.png' },
      { id: 'mike', name: 'Mike Johnson', avatar: '/avatars/mike.png' },
      { id: 'emma', name: 'Emma Chen', avatar: '/avatars/emma.png' }
    ],
    createdAt: '2024-01-09T14:20:00Z',
    lastActivity: '1 day ago',
    assetsCount: 67,
    changesCount: 23,
    status: 'active',
    isProtected: false,
    readyForMerge: false
  },
  {
    id: '8',
    name: 'experiment/ai-generated-backgrounds',
    description: 'Testing AI-generated background assets for product photos',
    purpose: 'experiment',
    creator: {
      id: 'tom',
      name: 'Tom Rodriguez',
      avatar: '/avatars/tom.png',
      role: 'Creative Technologist'
    },
    collaborators: [
      { id: 'tom', name: 'Tom Rodriguez', avatar: '/avatars/tom.png' },
      { id: 'mike', name: 'Mike Johnson', avatar: '/avatars/mike.png' }
    ],
    createdAt: '2024-01-05T09:45:00Z',
    lastActivity: '2 days ago',
    assetsCount: 24,
    changesCount: 7,
    status: 'active',
    isProtected: false,
    readyForMerge: false
  },
  {
    id: '9',
    name: 'archive/legacy-brand-assets',
    description: 'Archived brand assets from previous identity',
    purpose: 'feature',
    creator: {
      id: 'system',
      name: 'System',
      avatar: '/avatars/system.png',
      role: 'System'
    },
    collaborators: [
      { id: 'sarah', name: 'Sarah Chen', avatar: '/avatars/sarah.png' }
    ],
    createdAt: '2023-12-20T16:00:00Z',
    lastActivity: '2 weeks ago',
    assetsCount: 156,
    changesCount: 0,
    status: 'archived',
    isProtected: true,
    readyForMerge: false
  }
];
