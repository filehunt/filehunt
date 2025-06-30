import { Upload, FolderOpen, Tag, Image, Video, Music, FileText, Layers } from 'lucide-react';
import { type UploadFile } from '@shared-ts/types';
import { Button } from '../shared'; //button';
import { Badge } from '../shared'; //badge';
import { Progress } from '../shared'; //progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../shared'; //select';

interface UploadLeftSidebarProps {
  uploadFiles: UploadFile[];
  onUploadFilesChange: (files: UploadFile[]) => void;
}

export function UploadLeftSidebar({ uploadFiles, onUploadFilesChange }: UploadLeftSidebarProps) {
  const metadataPresets = [
    { id: '1', name: 'Product Photography', description: 'Tags: product, brand, commercial', icon: Image },
    { id: '2', name: 'Marketing Campaign', description: 'Tags: marketing, campaign, social', icon: Tag },
    { id: '3', name: 'Brand Assets', description: 'Tags: brand, logo, identity', icon: Layers },
    { id: '4', name: 'Video Content', description: 'Tags: video, content, media', icon: Video },
  ];

  return (
    <div className="w-[240px] bg-[#292b36] border-r border-[#373a4b] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#373a4b]">
        <h2 className="text-white font-medium text-base flex items-center">
          <Upload className="w-4 h-4 mr-2" />
          Upload Center
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Organize and process your assets
        </p>
      </div>

      {/* Upload Progress */}
      {uploadFiles.length > 0 && (
        <div className="p-4 border-b border-[#373a4b]">
          <h3 className="text-white text-sm font-medium mb-3">Upload Progress</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Files</span>
              <span className="text-white">{uploadFiles.filter(f => f.status === 'completed').length}/{uploadFiles.length}</span>
            </div>
            <Progress
              value={(uploadFiles.filter(f => f.status === 'completed').length / uploadFiles.length) * 100}
              className="h-2"
            />
          </div>
        </div>
      )}

      {/* Metadata Presets */}
      <div className="p-4 border-b border-[#373a4b]">
        <h3 className="text-white text-sm font-medium mb-3 flex items-center">
          <Tag className="w-4 h-4 mr-2" />
          Metadata Presets
        </h3>
        <div className="space-y-2">
          {metadataPresets.map(preset => (
            <button
              key={preset.id}
              className="w-full text-left p-2 rounded hover:bg-[#373a4b] transition-colors group"
            >
              <div className="flex items-start space-x-2">
                <preset.icon className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-gray-300 text-sm font-medium">{preset.name}</div>
                  <div className="text-gray-500 text-xs truncate">{preset.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Upload Options */}
      <div className="p-4 border-b border-[#373a4b]">
        <h3 className="text-white text-sm font-medium mb-3">Upload Options</h3>
        <div className="space-y-3">
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Default Status</label>
            <Select defaultValue="needs-review">
              <SelectTrigger className="bg-[#373a4b] border-[#434656] text-white text-sm h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#373a4b] border-[#434656] text-white">
                <SelectItem value="needs-review">Needs Review</SelectItem>
                <SelectItem value="approved">Auto-Approve</SelectItem>
                <SelectItem value="needs-retouching">Needs Retouching</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1 block">Processing Quality</label>
            <Select defaultValue="high">
              <SelectTrigger className="bg-[#373a4b] border-[#434656] text-white text-sm h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#373a4b] border-[#434656] text-white">
                <SelectItem value="high">High Quality</SelectItem>
                <SelectItem value="medium">Medium Quality</SelectItem>
                <SelectItem value="low">Fast Processing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex-1 p-4">
        <h3 className="text-white text-sm font-medium mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-sm h-8 bg-[#373a4b] border-[#434656] text-gray-300 hover:text-white hover:bg-[#434656]"
          >
            <Upload className="w-3 h-3 mr-2" />
            Upload Files
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-sm h-8 bg-[#373a4b] border-[#434656] text-gray-300 hover:text-white hover:bg-[#434656]"
          >
            <FolderOpen className="w-3 h-3 mr-2" />
            Upload Folder
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-sm h-8 bg-[#373a4b] border-[#434656] text-gray-300 hover:text-white hover:bg-[#434656]"
          >
            <Tag className="w-3 h-3 mr-2" />
            Bulk Tag
          </Button>
        </div>
      </div>
    </div>
  );
}
