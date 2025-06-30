export const getFileIcon = (file: File | { type: string } | { name: string }) => {
  if ('type' in file) {
    if (file.type.startsWith('image/')) return 'Image';
    if (file.type.startsWith('video/')) return 'Video';
    if (file.type.startsWith('audio/')) return 'Music';
    return 'FileText';
  }

  if ('name' in file) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension || '')) return 'Image';
    if (['mp4', 'mov', 'avi', 'mkv'].includes(extension || '')) return 'Video';
    if (['mp3', 'wav', 'flac'].includes(extension || '')) return 'Music';
    return 'FileText';
  }

  return 'FileText';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
