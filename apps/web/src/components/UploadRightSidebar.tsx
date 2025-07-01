import { CheckCircle, AlertCircle, Clock, Upload, X, FileType, Image, Video, Music, FileText, TrendingUp, Users, Tag } from 'lucide-react';
import { type UploadFile } from "@filehunt/shared-ts/types";
import { Card, CardContent, CardHeader, CardTitle } from '@filehunt/shared-ts/ui'; //card';
import { Badge } from '@filehunt/shared-ts/ui'; //badge';
import { Button } from '@filehunt/shared-ts/ui'; //button';
import { Progress } from '@filehunt/shared-ts/ui'; //progress';

interface UploadRightSidebarProps {
  uploadFiles: UploadFile[];
  uploadProgress: Record<string, number>;
  onUploadFilesChange: (files: UploadFile[]) => void;
}
export function UploadRightSidebar({ uploadFiles, uploadProgress }: UploadRightSidebarProps) {
  const pendingFiles = uploadFiles.filter(f => f.status === 'pending');
  const uploadingFiles = uploadFiles.filter(f => f.status === 'uploading');
  const completedFiles = uploadFiles.filter(f => f.status === 'completed');
  const errorFiles = uploadFiles.filter(f => f.status === 'error');

  const totalSize = uploadFiles.reduce((acc, file) => acc + (file.file?.size || 0), 0);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension || '')) {
      return <Image className="w-3 h-3" />;
    }
    if (['mp4', 'mov', 'avi', 'mkv'].includes(extension || '')) {
      return <Video className="w-3 h-3" />;
    }
    if (['mp3', 'wav', 'flac'].includes(extension || '')) {
      return <Music className="w-3 h-3" />;
    }
    return <FileType className="w-3 h-3" />;
  };

  // Mock data for DAM statistics
  const fileTypeStats = [
    { type: 'Images', count: 156, icon: Image, size: '2.4 GB' },
    { type: 'Videos', count: 23, icon: Video, size: '8.1 GB' },
    { type: 'Audio', count: 12, icon: Music, size: '345 MB' },
    { type: 'Documents', count: 45, icon: FileText, size: '123 MB' },
  ];

  const uploadHistory = [
    { name: 'product-hero-banner.jpg', time: '2 hours ago', status: 'completed', size: '2.4 MB' },
    { name: 'brand-video-v2.mp4', time: '1 day ago', status: 'completed', size: '45.2 MB' },
    { name: 'social-campaign-assets.zip', time: '2 days ago', status: 'completed', size: '12.8 MB' },
    { name: 'logo-variations.ai', time: '3 days ago', status: 'completed', size: '5.6 MB' },
  ];

  return (
    <div className="w-80 bg-[#292b36] border-l border-[#373a4b] flex flex-col">
      {/* Upload Status */}
      <div className="p-4 border-b border-[#373a4b]">
        <h3 className="text-white font-medium text-base mb-4 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2" />
          Upload Statistics
        </h3>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-[#373a4b] rounded-lg p-3 text-center">
            <div className="text-xl font-medium text-yellow-400">{pendingFiles.length}</div>
            <div className="text-xs text-gray-400">Pending</div>
          </div>
          <div className="bg-[#373a4b] rounded-lg p-3 text-center">
            <div className="text-xl font-medium text-blue-400">{uploadingFiles.length}</div>
            <div className="text-xs text-gray-400">Uploading</div>
          </div>
          <div className="bg-[#373a4b] rounded-lg p-3 text-center">
            <div className="text-xl font-medium text-green-400">{completedFiles.length}</div>
            <div className="text-xs text-gray-400">Completed</div>
          </div>
          <div className="bg-[#373a4b] rounded-lg p-3 text-center">
            <div className="text-xl font-medium text-red-400">{errorFiles.length}</div>
            <div className="text-xs text-gray-400">Failed</div>
          </div>
        </div>

        {/* Overall Progress */}
        {uploadFiles.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Overall Progress</span>
              <span className="text-white">
                {Math.round((completedFiles.length / uploadFiles.length) * 100)}%
              </span>
            </div>
            <Progress
              value={(completedFiles.length / uploadFiles.length) * 100}
              className="h-2"
            />
            <div className="text-xs text-gray-400">
              Total size: {formatFileSize(totalSize)}
            </div>
          </div>
        )}
      </div>

      {/* File Type Statistics */}
      <div className="p-4 border-b border-[#373a4b]">
        <h4 className="text-white text-sm font-medium mb-3 flex items-center">
          <FileType className="w-4 h-4 mr-2" />
          File Types
        </h4>
        <div className="space-y-2">
          {fileTypeStats.map(stat => (
            <div key={stat.type} className="flex items-center justify-between bg-[#373a4b] rounded p-2">
              <div className="flex items-center space-x-2">
                <stat.icon className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">{stat.type}</span>
              </div>
              <div className="text-right">
                <div className="text-white text-sm">{stat.count}</div>
                <div className="text-gray-400 text-xs">{stat.size}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* File Queue */}
      <div className="flex-1 overflow-auto">
        {uploadFiles.length > 0 ? (
          <div className="p-4">
            <h4 className="text-white text-sm font-medium mb-3 flex items-center">
              <Upload className="w-4 h-4 mr-2" />
              Upload Queue
            </h4>
            <div className="space-y-3">
              {uploadFiles.map((file, index) => (
                <div key={file.id || index} className="bg-[#373a4b] rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start space-x-2 flex-1 min-w-0">
                      {getFileIcon(file.file?.name || file.name)}
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-xs font-medium truncate">
                          {file.file?.name || file.name}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {formatFileSize(file.file?.size || 0)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      {file.status === 'completed' && (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      )}
                      {file.status === 'error' && (
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      )}
                      {file.status === 'pending' && (
                        <Clock className="w-4 h-4 text-yellow-400" />
                      )}
                      {file.status === 'uploading' && (
                        <Upload className="w-4 h-4 text-blue-400 animate-pulse" />
                      )}
                    </div>
                  </div>

                  {/* Progress bar for uploading files */}
                  {file.status === 'uploading' && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Uploading...</span>
                        <span className="text-blue-400">{Math.round(file.progress || 0)}%</span>
                      </div>
                      <Progress value={file.progress || 0} className="h-1" />
                    </div>
                  )}

                  {/* Tags preview */}
                  {file.tags && file.tags.length > 0 && (
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {file.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                          <Badge key={tagIndex} variant="secondary" className="bg-blue-500/20 text-blue-300 text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {file.tags.length > 3 && (
                          <Badge variant="secondary" className="bg-gray-500/20 text-gray-300 text-xs">
                            +{file.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Error message */}
                  {file.status === 'error' && (
                    <div className="mt-2 text-red-400 text-xs">
                      Upload failed. Please try again.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4">
            <h4 className="text-white text-sm font-medium mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Recent Uploads
            </h4>
            <div className="space-y-2">
              {uploadHistory.map((item, index) => (
                <div key={index} className="bg-[#373a4b] rounded p-2">
                  <div className="text-gray-300 text-xs font-medium truncate">{item.name}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-gray-500 text-xs">{item.time}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400 text-xs">{item.size}</span>
                      <Badge
                        variant="secondary"
                        className="bg-green-500/20 text-green-400 text-xs h-4 px-1"
                      >
                        ✓
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-[#373a4b]">
        {uploadFiles.length > 0 ? (
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-[#434656] text-gray-300 hover:text-white text-sm hover:bg-[#434656]"
            >
              Clear Completed
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-[#434656] text-gray-300 hover:text-white text-sm hover:bg-[#434656]"
            >
              Retry Failed
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-[#434656] text-gray-300 hover:text-white text-sm hover:bg-[#434656]"
            >
              <Tag className="w-3 h-3 mr-2" />
              View All Assets
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-[#434656] text-gray-300 hover:text-white text-sm hover:bg-[#434656]"
            >
              <Users className="w-3 h-3 mr-2" />
              Team Activity
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
