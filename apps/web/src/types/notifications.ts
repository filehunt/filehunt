export interface Notification {
  id: string;
  type: 'upload' | 'comment' | 'mention' | 'approval' | 'share' | 'favorite' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  assetId?: string;
  assetName?: string;
  assetThumbnail?: string;
  actionUrl?: string;
  priority: 'low' | 'normal' | 'high';
}

export interface NotificationSettings {
  emailNotifications: {
    uploads: boolean;
    comments: boolean;
    mentions: boolean;
    approvals: boolean;
    weeklyDigest: boolean;
  };
  pushNotifications: {
    browser: boolean;
    desktop: boolean;
    mobile: boolean;
    soundAlerts: boolean;
  };
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'upload',
    title: 'New assets uploaded',
    message: 'Sarah Chen uploaded 5 new images to Marketing folder',
    isRead: false,
    createdAt: '2024-01-25T14:30:00Z',
    userId: 'user-1',
    userName: 'Sarah Chen',
    userAvatar: '/avatars/sarah.png',
    priority: 'normal'
  },
  {
    id: 'notif-2',
    type: 'comment',
    title: 'New comment on your asset',
    message: 'Mike Johnson commented on "Brand Guidelines 2024"',
    isRead: false,
    createdAt: '2024-01-25T13:45:00Z',
    userId: 'user-2',
    userName: 'Mike Johnson',
    userAvatar: '/avatars/mike.png',
    assetId: 'asset-1',
    assetName: 'Brand Guidelines 2024',
    assetThumbnail: '/placeholder-doc.jpg',
    priority: 'normal'
  },
  {
    id: 'notif-3',
    type: 'mention',
    title: 'You were mentioned',
    message: 'Lisa Wong mentioned you in a comment on "Product Demo Video"',
    isRead: false,
    createdAt: '2024-01-25T12:20:00Z',
    userId: 'user-3',
    userName: 'Lisa Wong',
    userAvatar: '/avatars/lisa.png',
    assetId: 'asset-2',
    assetName: 'Product Demo Video',
    assetThumbnail: '/placeholder-video.jpg',
    priority: 'high'
  },
  {
    id: 'notif-4',
    type: 'approval',
    title: 'Approval request',
    message: 'Alex Rivera requested approval for "UI Kit Components"',
    isRead: true,
    createdAt: '2024-01-25T11:10:00Z',
    userId: 'user-4',
    userName: 'Alex Rivera',
    userAvatar: '/avatars/alex.png',
    assetId: 'asset-3',
    assetName: 'UI Kit Components',
    assetThumbnail: '/placeholder-design.jpg',
    priority: 'high'
  },
  {
    id: 'notif-5',
    type: 'share',
    title: 'Assets shared with you',
    message: 'Team Design shared a collection "Brand Assets" with you',
    isRead: true,
    createdAt: '2024-01-25T10:30:00Z',
    userId: 'team-1',
    userName: 'Team Design',
    userAvatar: '/avatars/team.png',
    priority: 'normal'
  },
  {
    id: 'notif-6',
    type: 'favorite',
    title: 'Asset favorited',
    message: 'John Doe added your asset "Logo Variations" to favorites',
    isRead: true,
    createdAt: '2024-01-25T09:15:00Z',
    userId: 'user-5',
    userName: 'John Doe',
    userAvatar: '/avatars/john.png',
    assetId: 'asset-4',
    assetName: 'Logo Variations',
    assetThumbnail: '/placeholder-image.jpg',
    priority: 'low'
  },
  {
    id: 'notif-7',
    type: 'system',
    title: 'Storage quota warning',
    message: 'Your workspace is approaching its storage limit (85% used)',
    isRead: false,
    createdAt: '2024-01-25T08:00:00Z',
    priority: 'high'
  }
];

export const defaultNotificationSettings: NotificationSettings = {
  emailNotifications: {
    uploads: true,
    comments: true,
    mentions: true,
    approvals: true,
    weeklyDigest: false
  },
  pushNotifications: {
    browser: true,
    desktop: false,
    mobile: true,
    soundAlerts: false
  },
  quietHours: {
    enabled: false,
    startTime: '22:00',
    endTime: '08:00'
  }
};
