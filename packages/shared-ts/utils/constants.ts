export const SUPPORTED_FILE_TYPES = {
  image: ['jpg', 'jpeg', 'png', 'gif', 'svg'],
  video: ['mp4', 'mov', 'avi', 'mkv'],
  audio: ['mp3', 'wav', 'flac'],
  document: ['pdf', 'doc', 'docx', 'txt', 'xlsx']
};

export const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB

export const DEFAULT_APPEARANCE_SETTINGS = {
  cardSize: 'L' as const,
  aspectRatio: '16:9' as const,
  thumbnailScale: 'fill' as const,
  showCardInfo: false
};

export const DEFAULT_SORT_SETTINGS = {
  field: 'date-uploaded' as const,
  direction: 'desc' as const
};

export const UPLOAD_GUIDELINES = [
  'Supported file types: images (JPG, PNG), documents (PDF, DOCX, XLSX), videos (MP4, MOV)',
  'Maximum file size: 2 GB per file',
  'Ensure stable internet connection for large uploads',
  'Check file names for special characters to avoid upload issues'
];

export const KEY_FEATURES = [
  'Automatic version detection and conflict resolution',
  'Git-style staging and approval workflow',
  'Support for all media and document types',
  'Batch metadata management and tagging'
];
