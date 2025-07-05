interface TimelineCommit {
  id: string;
  message: string;
  author: string;
  timestamp: string;
  version: string;
  type: 'commit' | 'merge' | 'branch';
  branch?: string;
}

export interface Branch {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'merged' | 'abandoned';
  baseBranch?: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
  commitCount: number;
  assetsCount: number;
  collaborators: User[];
  isPrimary?: boolean;
  isProtected?: boolean;
  lastCommit?: {
    id: string;
    message: string;
    author: string;
    timestamp: string;
  };
  mergeStatus?: 'can-merge' | 'conflicts' | 'behind' | 'up-to-date';
}

export interface Activity {
  id: string;
  type: 'asset_uploaded' | 'asset_updated' | 'asset_deleted' | 'branch_created' | 'branch_merged' | 'collection_created' | 'user_joined' | 'comment_added' | 'status_changed' | 'tag_added' | 'folder_created';
  title: string;
  description: string;
  user: {
    name: string;
    avatar: string;
  };
  timestamp: string;
  assetId?: string;
  branchId?: string;
  collectionId?: string;
  metadata?: {
    assetName?: string;
    assetType?: string;
    branchName?: string;
    collectionName?: string;
    oldStatus?: string;
    newStatus?: string;
    tagName?: string;
    folderName?: string;
    commentText?: string;
  };
  isRead?: boolean;
}

export interface SearchFilters {
  query?: string;
  type?: string[];
  tags?: string[];
  folders?: string[];
  status?: string[];
  uploader?: string;
  sortBy?: 'relevance' | 'date' | 'name' | 'size';
  sortOrder?: 'asc' | 'desc';
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  size: number;
  thumbnailUrl: string;
  originalUrl: string;
  mimeType: string;
  width?: number;
  height?: number;
  duration?: number; // for video/audio in seconds
  createdAt: string;
  updatedAt: string;
  uploadedBy: {
    name: string;
    avatar: string;
  };
  tags: string[];
  folders: string[];
  status: 'draft' | 'review' | 'approved' | 'rejected';
  version: string;
  fileExtension: string;
  metadata?: {
    camera?: string;
    iso?: string;
    aperture?: string;
    shutterSpeed?: string;
    focalLength?: string;
  };
  comments: number;
  likes: number;
  isLiked: boolean;
  isFavorited: boolean;
  lastModified: string;
  description?: string;
  altText?: string;
  timeline?: TimelineCommit[];
}

export interface Folder {
  id: string;
  name: string;
  description: string;
  parentFolder?: string;
  createdAt: string;
  createdBy: string;
  assetCount: number;
  isExpanded?: boolean;
  children?: Folder[];
}

// Mock data
export const mockAssets: Asset[] = [
  {
    id: '1',
    name: 'product-hero-shot.jpg',
    type: 'image',
    size: 2847293,
    thumbnailUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop',
    originalUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop',
    mimeType: 'image/jpeg',
    width: 1920,
    height: 1080,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    uploadedBy: {
      name: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
    },
    tags: ['product', 'photography', 'hero'],
    folders: ['Products', 'Hero Images'],
    status: 'approved',
    version: '1.0',
    fileExtension: 'jpg',
    metadata: {
      camera: 'Canon EOS R5',
      iso: '100',
      aperture: 'f/8',
      shutterSpeed: '1/60s',
      focalLength: '85mm'
    },
    comments: 3,
    likes: 12,
    isLiked: false,
    isFavorited: true,
    lastModified: '2024-01-15T10:30:00Z',
    description: 'Hero shot for the new product line',
    altText: 'Professional product photography showing the main product',
    timeline: [
      {
        id: '1',
        message: 'Initial upload and processing',
        author: 'John Smith',
        timestamp: '2h ago',
        version: 'v1.0',
        type: 'commit'
      },
      {
        id: '2',
        message: 'Color correction and enhancement',
        author: 'Sarah Kim',
        timestamp: '4h ago',
        version: 'v0.9',
        type: 'commit'
      }
    ]
  },
  {
    id: '2',
    name: 'team-meeting-video.mp4',
    type: 'video',
    size: 45672890,
    thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
    originalUrl: 'https://sample-videos.com/zip/10/mp4/720/mp4-sample.mp4',
    mimeType: 'video/mp4',
    width: 1280,
    height: 720,
    duration: 95,
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-14T14:20:00Z',
    uploadedBy: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=32&h=32&fit=crop&crop=face'
    },
    tags: ['team', 'meeting', 'internal'],
    folders: ['Videos', 'Team Content'],
    status: 'review',
    version: '1.0',
    fileExtension: 'mp4',
    comments: 1,
    likes: 5,
    isLiked: true,
    isFavorited: true,
    lastModified: '2024-01-14T14:20:00Z',
    description: 'Team meeting discussing Q1 goals',
    timeline: [
      {
        id: '3',
        message: 'Video uploaded and transcoded',
        author: 'Sarah Johnson',
        timestamp: '1d ago',
        version: 'v1.0',
        type: 'commit'
      }
    ]
  },
  {
    id: '3',
    name: 'brand-guidelines.pdf',
    type: 'document',
    size: 1234567,
    thumbnailUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=400&h=520&fit=crop',
    originalUrl: '/documents/brand-guidelines.pdf',
    mimeType: 'application/pdf',
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z',
    uploadedBy: {
      name: 'Design Team',
      avatar: 'https://images.unsplash.com/photo-1533601017-dc61895e03c0?w=32&h=32&fit=crop&crop=face'
    },
    tags: ['brand', 'guidelines', 'design'],
    folders: ['Documents', 'Brand'],
    status: 'approved',
    version: '2.1',
    fileExtension: 'pdf',
    comments: 8,
    likes: 23,
    isLiked: false,
    isFavorited: true,
    lastModified: '2024-01-13T09:15:00Z',
    description: 'Complete brand guidelines including logo usage, colors, and typography'
  },
  {
    id: '4',
    name: 'background-music.mp3',
    type: 'audio',
    size: 3456789,
    thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    originalUrl: '/audio/background-music.mp3',
    mimeType: 'audio/mpeg',
    duration: 180,
    createdAt: '2024-01-12T16:45:00Z',
    updatedAt: '2024-01-12T16:45:00Z',
    uploadedBy: {
      name: 'Audio Team',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    },
    tags: ['music', 'background', 'ambient'],
    folders: ['Audio', 'Background Music'],
    status: 'approved',
    version: '1.0',
    fileExtension: 'mp3',
    comments: 2,
    likes: 7,
    isLiked: false,
    isFavorited: true,
    lastModified: '2024-01-12T16:45:00Z',
    description: 'Ambient background music for video projects'
  },
  {
    id: '5',
    name: 'lifestyle-shot-01.jpg',
    type: 'image',
    size: 1928374,
    thumbnailUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=500&fit=crop',
    originalUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1920&h=1080&fit=crop',
    mimeType: 'image/jpeg',
    width: 1920,
    height: 1280,
    createdAt: '2024-01-11T11:20:00Z',
    updatedAt: '2024-01-11T11:20:00Z',
    uploadedBy: {
      name: 'Photography Team',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face'
    },
    tags: ['lifestyle', 'photography', 'candid'],
    folders: ['Photos', 'Lifestyle'],
    status: 'draft',
    version: '1.0',
    fileExtension: 'jpg',
    metadata: {
      camera: 'Sony A7R IV',
      iso: '200',
      aperture: 'f/5.6',
      shutterSpeed: '1/125s',
      focalLength: '50mm'
    },
    comments: 0,
    likes: 3,
    isLiked: false,
    isFavorited: false,
    lastModified: '2024-01-11T11:20:00Z',
    description: 'Lifestyle photography session - candid moments'
  },
  {
    id: '6',
    name: 'tutorial-video-final.mp4',
    type: 'video',
    size: 67891234,
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop',
    originalUrl: '/videos/tutorial-final.mp4',
    mimeType: 'video/mp4',
    width: 1920,
    height: 1080,
    duration: 245,
    createdAt: '2024-01-10T13:30:00Z',
    updatedAt: '2024-01-10T13:30:00Z',
    uploadedBy: {
      name: 'Content Team',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=32&h=32&fit=crop&crop=face'
    },
    tags: ['tutorial', 'video', 'education'],
    folders: ['Videos', 'Tutorials'],
    status: 'approved',
    version: '1.3',
    fileExtension: 'mp4',
    comments: 15,
    likes: 34,
    isLiked: true,
    isFavorited: true,
    lastModified: '2024-01-10T13:30:00Z',
    description: 'Complete tutorial video covering the basics'
  },
  {
    id: '7',
    name: 'architecture-sketch.jpg',
    type: 'image',
    size: 2156789,
    thumbnailUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=550&fit=crop',
    originalUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1920&h=1080&fit=crop',
    mimeType: 'image/jpeg',
    width: 1920,
    height: 1280,
    createdAt: '2024-01-09T08:15:00Z',
    updatedAt: '2024-01-09T08:15:00Z',
    uploadedBy: {
      name: 'Design Team',
      avatar: 'https://images.unsplash.com/photo-1533601017-dc61895e03c0?w=32&h=32&fit=crop&crop=face'
    },
    tags: ['architecture', 'sketch', 'concept'],
    folders: ['Designs', 'Architecture'],
    status: 'draft',
    version: '1.0',
    fileExtension: 'jpg',
    comments: 2,
    likes: 8,
    isLiked: false,
    isFavorited: false,
    lastModified: '2024-01-09T08:15:00Z',
    description: 'Architectural concept sketch'
  },
  {
    id: '8',
    name: 'nature-soundscape.wav',
    type: 'audio',
    size: 5234567,
    thumbnailUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
    originalUrl: '/audio/nature-soundscape.wav',
    mimeType: 'audio/wav',
    duration: 320,
    createdAt: '2024-01-08T12:30:00Z',
    updatedAt: '2024-01-08T12:30:00Z',
    uploadedBy: {
      name: 'Audio Team',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    },
    tags: ['nature', 'ambient', 'soundscape'],
    folders: ['Audio', 'Nature'],
    status: 'approved',
    version: '1.0',
    fileExtension: 'wav',
    comments: 1,
    likes: 12,
    isLiked: true,
    isFavorited: true,
    lastModified: '2024-01-08T12:30:00Z',
    description: 'Forest nature soundscape recording'
  },
  {
    id: '9',
    name: 'presentation-slides.pptx',
    type: 'document',
    size: 8765432,
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    originalUrl: '/documents/presentation-slides.pptx',
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    createdAt: '2024-01-07T15:45:00Z',
    updatedAt: '2024-01-07T15:45:00Z',
    uploadedBy: {
      name: 'Content Team',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=32&h=32&fit=crop&crop=face'
    },
    tags: ['presentation', 'slides', 'business'],
    folders: ['Documents', 'Presentations'],
    status: 'review',
    version: '1.2',
    fileExtension: 'pptx',
    comments: 6,
    likes: 15,
    isLiked: false,
    isFavorited: true,
    lastModified: '2024-01-07T15:45:00Z',
    description: 'Q1 business presentation slides'
  },
  {
    id: '10',
    name: 'portrait-session-01.jpg',
    type: 'image',
    size: 3421876,
    thumbnailUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=600&fit=crop',
    originalUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=1920&h=1080&fit=crop',
    mimeType: 'image/jpeg',
    width: 1920,
    height: 2880,
    createdAt: '2024-01-06T10:20:00Z',
    updatedAt: '2024-01-06T10:20:00Z',
    uploadedBy: {
      name: 'Photography Team',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face'
    },
    tags: ['portrait', 'photography', 'professional'],
    folders: ['Photos', 'Portraits'],
    status: 'approved',
    version: '1.0',
    fileExtension: 'jpg',
    comments: 4,
    likes: 18,
    isLiked: true,
    isFavorited: true,
    lastModified: '2024-01-06T10:20:00Z',
    description: 'Professional portrait session'
  },
  {
    id: '11',
    name: 'motion-graphics.mp4',
    type: 'video',
    size: 12345678,
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=225&fit=crop',
    originalUrl: '/videos/motion-graphics.mp4',
    mimeType: 'video/mp4',
    width: 1920,
    height: 1080,
    duration: 45,
    createdAt: '2024-01-05T14:10:00Z',
    updatedAt: '2024-01-05T14:10:00Z',
    uploadedBy: {
      name: 'Motion Team',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
    },
    tags: ['motion', 'graphics', 'animation'],
    folders: ['Videos', 'Motion Graphics'],
    status: 'approved',
    version: '1.1',
    fileExtension: 'mp4',
    comments: 8,
    likes: 25,
    isLiked: false,
    isFavorited: true,
    lastModified: '2024-01-05T14:10:00Z',
    description: 'Animated motion graphics sequence'
  },
  {
    id: '12',
    name: 'ui-mockups.fig',
    type: 'document',
    size: 4567890,
    thumbnailUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=500&fit=crop',
    originalUrl: '/documents/ui-mockups.fig',
    mimeType: 'application/figma',
    createdAt: '2024-01-04T09:30:00Z',
    updatedAt: '2024-01-04T09:30:00Z',
    uploadedBy: {
      name: 'UI Designer',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face'
    },
    tags: ['ui', 'design', 'mockup'],
    folders: ['Designs', 'UI'],
    status: 'review',
    version: '2.0',
    fileExtension: 'fig',
    comments: 12,
    likes: 30,
    isLiked: true,
    isFavorited: true,
    lastModified: '2024-01-04T09:30:00Z',
    description: 'User interface design mockups'
  },
  {
    id: '13',
    name: 'landscape-drone.jpg',
    type: 'image',
    size: 5432109,
    thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
    originalUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
    mimeType: 'image/jpeg',
    width: 1920,
    height: 1200,
    createdAt: '2024-01-03T16:45:00Z',
    updatedAt: '2024-01-03T16:45:00Z',
    uploadedBy: {
      name: 'Drone Pilot',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face'
    },
    tags: ['landscape', 'drone', 'aerial'],
    folders: ['Photos', 'Aerial'],
    status: 'approved',
    version: '1.0',
    fileExtension: 'jpg',
    comments: 7,
    likes: 22,
    isLiked: false,
    isFavorited: false,
    lastModified: '2024-01-03T16:45:00Z',
    description: 'Aerial landscape photography'
  },
  {
    id: '14',
    name: 'podcast-episode-01.mp3',
    type: 'audio',
    size: 6789123,
    thumbnailUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop',
    originalUrl: '/audio/podcast-episode-01.mp3',
    mimeType: 'audio/mpeg',
    duration: 1800,
    createdAt: '2024-01-02T11:15:00Z',
    updatedAt: '2024-01-02T11:15:00Z',
    uploadedBy: {
      name: 'Podcast Team',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=32&h=32&fit=crop&crop=face'
    },
    tags: ['podcast', 'audio', 'interview'],
    folders: ['Audio', 'Podcasts'],
    status: 'approved',
    version: '1.0',
    fileExtension: 'mp3',
    comments: 15,
    likes: 45,
    isLiked: true,
    isFavorited: true,
    lastModified: '2024-01-02T11:15:00Z',
    description: 'First episode of the company podcast'
  },
  {
    id: '15',
    name: 'street-photography.jpg',
    type: 'image',
    size: 2987654,
    thumbnailUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=600&fit=crop',
    originalUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&h=1080&fit=crop',
    mimeType: 'image/jpeg',
    width: 1920,
    height: 2880,
    createdAt: '2024-01-01T18:30:00Z',
    updatedAt: '2024-01-01T18:30:00Z',
    uploadedBy: {
      name: 'Street Photographer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    },
    tags: ['street', 'photography', 'urban'],
    folders: ['Photos', 'Street'],
    status: 'draft',
    version: '1.0',
    fileExtension: 'jpg',
    comments: 3,
    likes: 11,
    isLiked: false,
    isFavorited: false,
    lastModified: '2024-01-01T18:30:00Z',
    description: 'Urban street photography collection'
  },
  {
    id: '16',
    name: 'company-logo-final.svg',
    type: 'image',
    size: 45678,
    thumbnailUrl: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400&h=400&fit=crop',
    originalUrl: '/images/company-logo-final.svg',
    mimeType: 'image/svg+xml',
    width: 512,
    height: 512,
    createdAt: '2024-01-16T14:00:00Z',
    updatedAt: '2024-01-16T14:00:00Z',
    uploadedBy: {
      name: 'Brand Team',
      avatar: 'https://images.unsplash.com/photo-1533601017-dc61895e03c0?w=32&h=32&fit=crop&crop=face'
    },
    tags: ['logo', 'brand', 'vector'],
    folders: ['Brand', 'Logos'],
    status: 'approved',
    version: '3.0',
    fileExtension: 'svg',
    comments: 5,
    likes: 28,
    isLiked: true,
    isFavorited: true,
    lastModified: '2024-01-16T14:00:00Z',
    description: 'Final version of the company logo in vector format'
  },
  {
    id: '17',
    name: 'marketing-presentation.pptx',
    type: 'document',
    size: 8912345,
    thumbnailUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
    originalUrl: '/documents/marketing-presentation.pptx',
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    createdAt: '2024-01-17T09:30:00Z',
    updatedAt: '2024-01-17T09:30:00Z',
    uploadedBy: {
      name: 'Marketing Team',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=32&h=32&fit=crop&crop=face'
    },
    tags: ['presentation', 'marketing', 'strategy'],
    folders: ['Documents', 'Presentations'],
    status: 'approved',
    version: '2.0',
    fileExtension: 'pptx',
    comments: 12,
    likes: 19,
    isLiked: false,
    isFavorited: true,
    lastModified: '2024-01-17T09:30:00Z',
    description: 'Q1 marketing strategy presentation'
  }
];

export const mockFolders: Folder[] = [
  {
    id: '1',
    name: 'All Assets',
    description: 'All uploaded assets',
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'System',
    assetCount: 156,
    isExpanded: true,
    children: [
      {
        id: '2',
        name: 'Products',
        description: 'Product photography and assets',
        parentFolder: '1',
        createdAt: '2024-01-01T00:00:00Z',
        createdBy: 'John Smith',
        assetCount: 45,
        isExpanded: false
      },
      {
        id: '3',
        name: 'Videos',
        description: 'Video content',
        parentFolder: '1',
        createdAt: '2024-01-01T00:00:00Z',
        createdBy: 'Sarah Johnson',
        assetCount: 23,
        isExpanded: true,
        children: [
          {
            id: '4',
            name: 'Tutorials',
            description: 'Educational video content',
            parentFolder: '3',
            createdAt: '2024-01-01T00:00:00Z',
            createdBy: 'Content Team',
            assetCount: 12
          },
          {
            id: '5',
            name: 'Team Content',
            description: 'Internal team videos',
            parentFolder: '3',
            createdAt: '2024-01-01T00:00:00Z',
            createdBy: 'HR Team',
            assetCount: 8
          }
        ]
      },
      {
        id: '6',
        name: 'Documents',
        description: 'Documentation and files',
        parentFolder: '1',
        createdAt: '2024-01-01T00:00:00Z',
        createdBy: 'Admin',
        assetCount: 67,
        isExpanded: false
      },
      {
        id: '7',
        name: 'Audio',
        description: 'Audio files and music',
        parentFolder: '1',
        createdAt: '2024-01-01T00:00:00Z',
        createdBy: 'Audio Team',
        assetCount: 21,
        isExpanded: false
      }
    ]
  }
];

// Mock Branches Data
export const mockBranches: Branch[] = [
  {
    id: '1',
    name: 'main',
    description: 'Main production branch',
    status: 'active',
    author: {
      name: 'System',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    commitCount: 156,
    assetsCount: 234,
    collaborators: [
      {
        id: '1',
        name: 'John Smith',
        email: 'john@company.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@company.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=32&h=32&fit=crop&crop=face'
      }
    ],
    isPrimary: true,
    isProtected: true,
    lastCommit: {
      id: 'abc123',
      message: 'Update brand guidelines and product photos',
      author: 'John Smith',
      timestamp: '2h ago'
    },
    mergeStatus: 'up-to-date'
  },
  {
    id: '2',
    name: 'feature/new-product-line',
    description: 'Assets for the upcoming product line launch',
    status: 'active',
    baseBranch: 'main',
    author: {
      name: 'Design Team',
      avatar: 'https://images.unsplash.com/photo-1533601017-dc61895e03c0?w=32&h=32&fit=crop&crop=face'
    },
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    commitCount: 23,
    assetsCount: 67,
    collaborators: [
      {
        id: '3',
        name: 'Design Team',
        email: 'design@company.com',
        avatar: 'https://images.unsplash.com/photo-1533601017-dc61895e03c0?w=32&h=32&fit=crop&crop=face'
      },
      {
        id: '4',
        name: 'Product Team',
        email: 'product@company.com',
        avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=32&h=32&fit=crop&crop=face'
      }
    ],
    isPrimary: false,
    isProtected: false,
    lastCommit: {
      id: 'def456',
      message: 'Add new product photography and update color palette',
      author: 'Design Team',
      timestamp: '4h ago'
    },
    mergeStatus: 'can-merge'
  },
  {
    id: '3',
    name: 'hotfix/urgent-brand-update',
    description: 'Critical brand asset updates',
    status: 'active',
    baseBranch: 'main',
    author: {
      name: 'Marketing Team',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face'
    },
    createdAt: '2024-01-14T16:30:00Z',
    updatedAt: '2024-01-15T09:45:00Z',
    commitCount: 5,
    assetsCount: 12,
    collaborators: [
      {
        id: '5',
        name: 'Marketing Team',
        email: 'marketing@company.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face'
      }
    ],
    isPrimary: false,
    isProtected: false,
    lastCommit: {
      id: 'ghi789',
      message: 'Fix logo inconsistencies across assets',
      author: 'Marketing Team',
      timestamp: '1d ago'
    },
    mergeStatus: 'conflicts'
  },
  {
    id: '4',
    name: 'develop/video-content',
    description: 'Video content development and editing',
    status: 'active',
    baseBranch: 'main',
    author: {
      name: 'Content Team',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=32&h=32&fit=crop&crop=face'
    },
    createdAt: '2024-01-08T11:20:00Z',
    updatedAt: '2024-01-14T17:30:00Z',
    commitCount: 34,
    assetsCount: 89,
    collaborators: [
      {
        id: '6',
        name: 'Content Team',
        email: 'content@company.com',
        avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=32&h=32&fit=crop&crop=face'
      },
      {
        id: '7',
        name: 'Video Editor',
        email: 'video@company.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
      }
    ],
    isPrimary: false,
    isProtected: false,
    lastCommit: {
      id: 'jkl012',
      message: 'Add tutorial videos and promotional content',
      author: 'Content Team',
      timestamp: '3d ago'
    },
    mergeStatus: 'behind'
  },
  {
    id: '5',
    name: 'archive/old-campaign',
    description: 'Previous marketing campaign assets - archived',
    status: 'merged',
    baseBranch: 'main',
    author: {
      name: 'Marketing Team',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face'
    },
    createdAt: '2023-12-01T10:00:00Z',
    updatedAt: '2024-01-05T15:30:00Z',
    commitCount: 78,
    assetsCount: 145,
    collaborators: [
      {
        id: '8',
        name: 'Marketing Team',
        email: 'marketing@company.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face'
      }
    ],
    isPrimary: false,
    isProtected: false,
    lastCommit: {
      id: 'mno345',
      message: 'Final campaign assets before archiving',
      author: 'Marketing Team',
      timestamp: '10d ago'
    },
    mergeStatus: 'up-to-date'
  }
];

// Mock Activities Data
export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'asset_uploaded',
    title: 'New product images uploaded',
    description: 'Added 12 high-resolution product photos to the main collection',
    user: {
      name: 'Photography Team',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face'
    },
    timestamp: '2024-01-15T10:30:00Z',
    assetId: '1',
    metadata: {
      assetName: 'product-hero-shot.jpg',
      assetType: 'image'
    },
    isRead: false
  },
  {
    id: '2',
    type: 'branch_created',
    title: 'New branch created',
    description: 'Created feature branch for new product line development',
    user: {
      name: 'Design Team',
      avatar: 'https://images.unsplash.com/photo-1533601017-dc61895e03c0?w=32&h=32&fit=crop&crop=face'
    },
    timestamp: '2024-01-15T09:15:00Z',
    branchId: '2',
    metadata: {
      branchName: 'feature/new-product-line'
    },
    isRead: false
  },
  {
    id: '3',
    type: 'status_changed',
    title: 'Asset status updated',
    description: 'Video content moved from review to approved status',
    user: {
      name: 'Content Manager',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=32&h=32&fit=crop&crop=face'
    },
    timestamp: '2024-01-15T08:45:00Z',
    assetId: '2',
    metadata: {
      assetName: 'team-meeting-video.mp4',
      assetType: 'video',
      oldStatus: 'review',
      newStatus: 'approved'
    },
    isRead: true
  },
  {
    id: '4',
    type: 'collection_created',
    title: 'New collection created',
    description: 'Created "Q1 Marketing Campaign" collection with smart rules',
    user: {
      name: 'Marketing Team',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face'
    },
    timestamp: '2024-01-14T16:20:00Z',
    collectionId: '4',
    metadata: {
      collectionName: 'Q1 Marketing Campaign'
    },
    isRead: true
  },
  {
    id: '5',
    type: 'comment_added',
    title: 'New comment added',
    description: 'Added feedback on brand guidelines document',
    user: {
      name: 'Brand Manager',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
    },
    timestamp: '2024-01-14T14:30:00Z',
    assetId: '3',
    metadata: {
      assetName: 'brand-guidelines.pdf',
      assetType: 'document',
      commentText: 'Please update the color specifications for better print quality'
    },
    isRead: true
  },
  {
    id: '6',
    type: 'user_joined',
    title: 'New team member joined',
    description: 'Alex Chen joined the design team workspace',
    user: {
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face'
    },
    timestamp: '2024-01-14T11:15:00Z',
    isRead: true
  },
  {
    id: '7',
    type: 'branch_merged',
    title: 'Branch merged successfully',
    description: 'Merged hotfix/urgent-brand-update into main branch',
    user: {
      name: 'Lead Developer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    },
    timestamp: '2024-01-13T17:45:00Z',
    branchId: '3',
    metadata: {
      branchName: 'hotfix/urgent-brand-update'
    },
    isRead: true
  },
  {
    id: '8',
    type: 'tag_added',
    title: 'Tags added to assets',
    description: 'Added "social-media" and "instagram" tags to 15 images',
    user: {
      name: 'Social Media Manager',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face'
    },
    timestamp: '2024-01-13T15:20:00Z',
    metadata: {
      tagName: 'social-media'
    },
    isRead: true
  },
  {
    id: '9',
    type: 'folder_created',
    title: 'New folder structure',
    description: 'Created "2024 Campaigns" folder with subfolders for Q1-Q4',
    user: {
      name: 'Project Manager',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=32&h=32&fit=crop&crop=face'
    },
    timestamp: '2024-01-12T13:30:00Z',
    metadata: {
      folderName: '2024 Campaigns'
    },
    isRead: true
  },
  {
    id: '10',
    type: 'asset_updated',
    title: 'Asset metadata updated',
    description: 'Updated camera settings and location data for landscape photos',
    user: {
      name: 'Metadata Specialist',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face'
    },
    timestamp: '2024-01-12T10:45:00Z',
    assetId: '13',
    metadata: {
      assetName: 'landscape-drone.jpg',
      assetType: 'image'
    },
    isRead: true
  }
];

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface SmartRule {
  id: string;
  field: 'tags' | 'name' | 'type' | 'size' | 'createdAt' | 'uploadedBy' | 'folder' | 'status';
  operator: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'in' | 'notIn';
  value: string | number | string[];
  logic?: 'AND' | 'OR';
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  thumbnailUrl: string;
  assetCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  tags: string[];
  type: 'manual' | 'smart';
  smartRules?: SmartRule[];
  parentId?: string;
  children?: Collection[];
  size: number; // total size of assets in bytes
  isPublic: boolean;
  collaborators: User[];
  color?: string;
  icon?: string;
}

// Function to get collections with dynamic favorite count
export const getCollectionsWithFavoriteCount = (assets: Asset[]): Collection[] => {
  const favoriteAssets = assets.filter(asset => asset.isFavorited);
  const favoriteCollectionSize = favoriteAssets.reduce((total, asset) => total + asset.size, 0);
  
  return [
    {
      id: '0',
      name: 'Favoris',
      description: 'Vos assets favoris pour un accès rapide',
      thumbnailUrl: favoriteAssets.length > 0 
        ? favoriteAssets[0].thumbnailUrl 
        : 'https://images.unsplash.com/photo-1572205148653-b1b4cc2b8c83?w=400&h=300&fit=crop',
      assetCount: favoriteAssets.length,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
      createdBy: {
        id: 'system',
        name: 'System',
        email: 'system@filehunt.com',
        avatar: 'https://images.unsplash.com/photo-1533601017-dc61895e03c0?w=32&h=32&fit=crop&crop=face'
      },
      tags: ['favoris', 'starred', 'bookmarked'],
      type: 'smart',
      smartRules: [
        {
          id: 'fav-1',
          field: 'tags',
          operator: 'contains',
          value: 'isFavorited',
          logic: 'OR'
        }
      ],
      size: favoriteCollectionSize,
      isPublic: false,
      collaborators: [],
      color: '#EF4444',
      icon: 'heart'
    },
    ...mockCollections
  ];
};

// Mock Collections Data
export const mockCollections: Collection[] = [
  {
    id: '1',
    name: 'Brand Assets',
    description: 'All brand-related assets including logos, guidelines, and templates',
    thumbnailUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    assetCount: 45,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    createdBy: {
      id: '1',
      name: 'Design Team',
      email: 'design@company.com',
      avatar: 'https://images.unsplash.com/photo-1533601017-dc61895e03c0?w=32&h=32&fit=crop&crop=face'
    },
    tags: ['brand', 'marketing', 'identity'],
    type: 'manual',
    size: 125000000,
    isPublic: true,
    collaborators: [
      {
        id: '2',
        name: 'John Smith',
        email: 'john@company.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
      }
    ],
    color: '#3B82F6',
    icon: 'palette'
  },
  {
    id: '2',
    name: 'Product Photography',
    description: 'High-quality product shots for e-commerce and marketing',
    thumbnailUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    assetCount: 128,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-14T14:20:00Z',
    createdBy: {
      id: '3',
      name: 'Photography Team',
      email: 'photo@company.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face'
    },
    tags: ['product', 'photography', 'e-commerce'],
    type: 'smart',
    smartRules: [
      {
        id: '1',
        field: 'tags',
        operator: 'contains',
        value: 'product',
        logic: 'AND'
      },
      {
        id: '2',
        field: 'type',
        operator: 'equals',
        value: 'image'
      }
    ],
    size: 456000000,
    isPublic: false,
    collaborators: [],
    color: '#10B981',
    icon: 'camera'
  },
  {
    id: '3',
    name: 'Video Content',
    description: 'All video assets including tutorials, promotional content, and interviews',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
    assetCount: 34,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-10T13:30:00Z',
    createdBy: {
      id: '4',
      name: 'Content Team',
      email: 'content@company.com',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=32&h=32&fit=crop&crop=face'
    },
    tags: ['video', 'content', 'media'],
    type: 'smart',
    smartRules: [
      {
        id: '3',
        field: 'type',
        operator: 'equals',
        value: 'video'
      }
    ],
    size: 2340000000,
    isPublic: true,
    collaborators: [
      {
        id: '5',
        name: 'Sarah Johnson',
        email: 'sarah@company.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=32&h=32&fit=crop&crop=face'
      }
    ],
    color: '#8B5CF6',
    icon: 'video'
  },
  {
    id: '4',
    name: 'Marketing Campaign Q1',
    description: 'Assets for the Q1 marketing campaign including social media, print, and digital',
    thumbnailUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=300&fit=crop',
    assetCount: 67,
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-12T16:45:00Z',
    createdBy: {
      id: '6',
      name: 'Marketing Team',
      email: 'marketing@company.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face'
    },
    tags: ['marketing', 'campaign', 'q1'],
    type: 'manual',
    size: 789000000,
    isPublic: false,
    collaborators: [
      {
        id: '7',
        name: 'Alex Chen',
        email: 'alex@company.com',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face'
      },
      {
        id: '8',
        name: 'Maria Garcia',
        email: 'maria@company.com',
        avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=32&h=32&fit=crop&crop=face'
      }
    ],
    color: '#F59E0B',
    icon: 'megaphone'
  },
  {
    id: '5',
    name: 'Audio Library',
    description: 'Music, sound effects, and audio content for various projects',
    thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    assetCount: 23,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-08T12:30:00Z',
    createdBy: {
      id: '9',
      name: 'Audio Team',
      email: 'audio@company.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    },
    tags: ['audio', 'music', 'sound'],
    type: 'smart',
    smartRules: [
      {
        id: '4',
        field: 'type',
        operator: 'equals',
        value: 'audio'
      }
    ],
    size: 156000000,
    isPublic: true,
    collaborators: [],
    color: '#EC4899',
    icon: 'music'
  },
  {
    id: '6',
    name: 'Approved Content',
    description: 'All content that has been approved for public use',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    assetCount: 89,
    createdAt: '2024-01-06T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    createdBy: {
      id: '10',
      name: 'Admin',
      email: 'admin@company.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
    },
    tags: ['approved', 'published', 'ready'],
    type: 'smart',
    smartRules: [
      {
        id: '5',
        field: 'status',
        operator: 'equals',
        value: 'approved'
      }
    ],
    size: 234000000,
    isPublic: true,
    collaborators: [
      {
        id: '11',
        name: 'Quality Team',
        email: 'quality@company.com',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=32&h=32&fit=crop&crop=face'
      }
    ],
    color: '#059669',
    icon: 'check-circle'
  },
  {
    id: '7',
    name: 'Social Media Assets',
    description: 'Content optimized for social media platforms',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
    assetCount: 67,
    createdAt: '2024-01-07T00:00:00Z',
    updatedAt: '2024-01-14T09:15:00Z',
    createdBy: {
      id: '12',
      name: 'Social Team',
      email: 'social@company.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face'
    },
    tags: ['social', 'instagram', 'facebook'],
    type: 'manual',
    size: 89000000,
    isPublic: false,
    collaborators: [],
    color: '#EF4444',
    icon: 'megaphone'
  },
  {
    id: '8',
    name: 'Print Materials',
    description: 'High-resolution assets for print advertising and brochures',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
    assetCount: 34,
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-13T16:45:00Z',
    createdBy: {
      id: '13',
      name: 'Print Team',
      email: 'print@company.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    },
    tags: ['print', 'brochure', 'flyer'],
    type: 'smart',
    smartRules: [
      {
        id: '6',
        field: 'tags',
        operator: 'contains',
        value: 'print',
        logic: 'AND'
      },
      {
        id: '7',
        field: 'size',
        operator: 'greaterThan',
        value: 5000000
      }
    ],
    size: 156000000,
    isPublic: true,
    collaborators: [],
    color: '#8B5CF6',
    icon: 'palette'
  },
  {
    id: '9',
    name: 'Team Photos',
    description: 'Professional headshots and team photography',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
    assetCount: 89,
    createdAt: '2024-01-09T00:00:00Z',
    updatedAt: '2024-01-12T11:30:00Z',
    createdBy: {
      id: '14',
      name: 'HR Team',
      email: 'hr@company.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=32&h=32&fit=crop&crop=face'
    },
    tags: ['team', 'headshots', 'corporate'],
    type: 'manual',
    size: 234000000,
    isPublic: false,
    collaborators: [
      {
        id: '15',
        name: 'Photo Team',
        email: 'photo@company.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face'
      }
    ],
    color: '#06B6D4',
    icon: 'camera'
  },
  {
    id: '10',
    name: 'Event Coverage',
    description: 'Photos and videos from company events and conferences',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop',
    assetCount: 156,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-11T14:20:00Z',
    createdBy: {
      id: '16',
      name: 'Events Team',
      email: 'events@company.com',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=32&h=32&fit=crop&crop=face'
    },
    tags: ['events', 'conference', 'coverage'],
    type: 'smart',
    smartRules: [
      {
        id: '8',
        field: 'tags',
        operator: 'contains',
        value: 'event'
      }
    ],
    size: 567000000,
    isPublic: true,
    collaborators: [],
    color: '#F97316',
    icon: 'video'
  },
  {
    id: '11',
    name: 'UI Design System',
    description: 'Design components, icons, and interface elements',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop',
    assetCount: 234,
    createdAt: '2024-01-11T00:00:00Z',
    updatedAt: '2024-01-15T08:45:00Z',
    createdBy: {
      id: '17',
      name: 'UX Team',
      email: 'ux@company.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face'
    },
    tags: ['ui', 'design', 'components'],
    type: 'manual',
    size: 78000000,
    isPublic: false,
    collaborators: [
      {
        id: '18',
        name: 'Design Lead',
        email: 'lead@company.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
      }
    ],
    color: '#EC4899',
    icon: 'palette'
  },
  {
    id: '12',
    name: 'Product Demos',
    description: 'Video demonstrations and product walkthroughs',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    assetCount: 45,
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-14T17:30:00Z',
    createdBy: {
      id: '19',
      name: 'Product Team',
      email: 'product@company.com',
      avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=32&h=32&fit=crop&crop=face'
    },
    tags: ['demo', 'product', 'tutorial'],
    type: 'smart',
    smartRules: [
      {
        id: '9',
        field: 'type',
        operator: 'equals',
        value: 'video',
        logic: 'AND'
      },
      {
        id: '10',
        field: 'tags',
        operator: 'contains',
        value: 'demo'
      }
    ],
    size: 890000000,
    isPublic: true,
    collaborators: [],
    color: '#22C55E',
    icon: 'video'
  },
  {
    id: '13',
    name: 'Client Presentations',
    description: 'Pitch decks and client presentation materials',
    thumbnailUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=300&fit=crop',
    assetCount: 67,
    createdAt: '2024-01-13T00:00:00Z',
    updatedAt: '2024-01-15T12:15:00Z',
    createdBy: {
      id: '20',
      name: 'Sales Team',
      email: 'sales@company.com',
      avatar: 'https://images.unsplash.com/photo-1533601017-dc61895e03c0?w=32&h=32&fit=crop&crop=face'
    },
    tags: ['presentation', 'client', 'pitch'],
    type: 'manual',
    size: 145000000,
    isPublic: false,
    collaborators: [
      {
        id: '21',
        name: 'Account Manager',
        email: 'account@company.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face'
      }
    ],
    color: '#3B82F6',
    icon: 'megaphone'
  },
  {
    id: '14',
    name: 'Stock Photography',
    description: 'Licensed stock photos for various marketing needs',
    thumbnailUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    assetCount: 123,
    createdAt: '2024-01-14T00:00:00Z',
    updatedAt: '2024-01-15T15:45:00Z',
    createdBy: {
      id: '22',
      name: 'Content Team',
      email: 'content@company.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    },
    tags: ['stock', 'licensed', 'photography'],
    type: 'smart',
    smartRules: [
      {
        id: '11',
        field: 'tags',
        operator: 'contains',
        value: 'stock'
      }
    ],
    size: 456000000,
    isPublic: true,
    collaborators: [],
    color: '#F59E0B',
    icon: 'camera'
  }
];
