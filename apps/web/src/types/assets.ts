interface TimelineCommit {
  id: string;
  message: string;
  author: string;
  timestamp: string;
  version: string;
  type: 'commit' | 'merge' | 'branch';
  branch?: string;
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
    isFavorited: false,
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
    isFavorited: false,
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
    isFavorited: false,
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
