import { useState, useRef } from 'react';
import { Upload, X, File, Image, Video, Music, FileText, Plus, Check, AlertCircle, GitBranch, Eye, Clock, RefreshCw, GitCommit } from 'lucide-react';
import { Button, Input, Textarea, Badge, Card, CardContent, CardHeader, CardTitle, Progress, Alert, AlertDescription, Separator } from '@filehunt/shared-ts/ui';

interface UploadFile {
  id: string;
  file: File;
  preview?: string;
  progress: number;
  status: 'staged' | 'uploading' | 'completed' | 'error';
  tags: string[];
  folders: string[];
  isNewVersion?: boolean;
  existingAssetId?: string;
  existingVersion?: string;
  newVersion?: string;
  changeType: 'new' | 'version-update' | 'metadata-update';
  isApproved: boolean;
}

export function UploadScreen() {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentTags, setCurrentTags] = useState('');
  const [currentFolders, setCurrentFolders] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  const [commitBranch, setCommitBranch] = useState('main');
  const [showCommitDialog, setShowCommitDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock existing assets for version detection
  const existingAssets = [
    { id: '1', name: 'logo.png', version: 'v1.2' },
    { id: '2', name: 'hero-video.mp4', version: 'v2.1' },
    { id: '3', name: 'product-sheet.pdf', version: 'v1.0' },
    { id: '4', name: 'banner.jpg', version: 'v3.0' }
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const detectFileChanges = (file: File): {
    isNewVersion: boolean;
    existingAssetId?: string;
    existingVersion?: string;
    newVersion?: string;
    changeType: UploadFile['changeType']
  } => {
    const existing = existingAssets.find(asset => asset.name === file.name);
    if (existing) {
      const currentVersionNumber = parseFloat(existing.version.replace('v', ''));
      const newVersionNumber = (currentVersionNumber + 0.1).toFixed(1);
      return {
        isNewVersion: true,
        existingAssetId: existing.id,
        existingVersion: existing.version,
        newVersion: `v${newVersionNumber}`,
        changeType: 'version-update'
      };
    }
    return {
      isNewVersion: false,
      newVersion: 'v1.0',
      changeType: 'new'
    };
  };

  const processFiles = (files: File[]) => {
    const newFiles: UploadFile[] = files.map(file => {
      const changeDetection = detectFileChanges(file);
      return {
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        progress: 0,
        status: 'staged',
        tags: [],
        folders: [],
        ...changeDetection,
        isApproved: false // By default, files need to be reviewed
      };
    });

    setUploadFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id));
  };

  const updateFileMetadata = (id: string, field: keyof UploadFile, value: unknown) => {
    setUploadFiles(prev => prev.map(f =>
      f.id === id ? { ...f, [field]: value } : f
    ));
  };

  const toggleFileApproval = (fileId: string) => {
    const file = uploadFiles.find(f => f.id === fileId);
    if (file) {
      updateFileMetadata(fileId, 'isApproved', !file.isApproved);
    }
  };

  const approveAllFiles = () => {
    setUploadFiles(prev => prev.map(f => ({ ...f, isApproved: true })));
  };

  const rejectAllFiles = () => {
    setUploadFiles(prev => prev.map(f => ({ ...f, isApproved: false })));
  };

  const addTagToFile = (fileId: string, tag: string) => {
    if (!tag.trim()) return;
    updateFileMetadata(fileId, 'tags', uploadFiles.find(f => f.id === fileId)?.tags.concat(tag) || [tag]);
  };

  const removeTagFromFile = (fileId: string, tagToRemove: string) => {
    const file = uploadFiles.find(f => f.id === fileId);
    if (file) {
      updateFileMetadata(fileId, 'tags', file.tags.filter(t => t !== tagToRemove));
    }
  };

  const addFolderToFile = (fileId: string, folder: string) => {
    if (!folder.trim()) return;
    updateFileMetadata(fileId, 'folders', uploadFiles.find(f => f.id === fileId)?.folders.concat(folder) || [folder]);
  };

  const removeFolderFromFile = (fileId: string, folderToRemove: string) => {
    const file = uploadFiles.find(f => f.id === fileId);
    if (file) {
      updateFileMetadata(fileId, 'folders', file.folders.filter(f => f !== folderToRemove));
    }
  };

  const applyMetadataToAll = () => {
    const tags = currentTags.split(',').map(t => t.trim()).filter(t => t);
    const folders = currentFolders.split(',').map(f => f.trim()).filter(f => f);

    setUploadFiles(prev => prev.map(file => ({
      ...file,
      tags: [...new Set([...file.tags, ...tags])],
      folders: [...new Set([...file.folders, ...folders])]
    })));

    setCurrentTags('');
    setCurrentFolders('');
  };

  const proceedToCommit = () => {
    const approvedFiles = uploadFiles.filter(f => f.isApproved);
    if (approvedFiles.length === 0) {
      alert('Please approve at least one file to publish.');
      return;
    }
    setShowCommitDialog(true);
  };

  const commitAndPush = () => {
    const approvedFiles = uploadFiles.filter(f => f.isApproved);

    // Start upload process for approved files
    approvedFiles.forEach(file => {
      updateFileMetadata(file.id, 'status', 'uploading');

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 25;
        if (progress >= 100) {
          progress = 100;
          updateFileMetadata(file.id, 'progress', 100);
          updateFileMetadata(file.id, 'status', 'completed');
          clearInterval(interval);
        } else {
          updateFileMetadata(file.id, 'progress', progress);
        }
      }, 150);
    });

    setShowCommitDialog(false);

    // Clean up completed files after a short delay
    setTimeout(() => {
      setUploadFiles(prev => prev.filter(f => !approvedFiles.includes(f)));
      setCommitMessage('');
    }, 3000);

    // Here you would typically call your API to commit the changes
    console.log('Publishing assets:', {
      message: commitMessage,
      branch: commitBranch,
      files: approvedFiles
    });
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (file.type.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (file.type.startsWith('audio/')) return <Music className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getChangeTypeColor = (changeType: UploadFile['changeType']) => {
    switch (changeType) {
      case 'new': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'version-update': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'metadata-update': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    }
  };

  const getChangeTypeLabel = (changeType: UploadFile['changeType']) => {
    switch (changeType) {
      case 'new': return 'New File';
      case 'version-update': return 'Version Update';
      case 'metadata-update': return 'Metadata Update';
    }
  };

  const stagedFiles = uploadFiles.filter(f => f.status === 'staged');
  const approvedFiles = uploadFiles.filter(f => f.isApproved);
  const newFiles = uploadFiles.filter(f => f.changeType === 'new');
  const versionUpdates = uploadFiles.filter(f => f.changeType === 'version-update');
  const uploadingFiles = uploadFiles.filter(f => f.status === 'uploading');
  const completedFiles = uploadFiles.filter(f => f.status === 'completed');

  return (
    <div className="flex-1 bg-[#1a1d29] overflow-auto">
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <div className="space-y-6">
              <div className="space-y-3">
                <h1 className="text-white text-2xl tracking-tight">Upload Assets</h1>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Add files to staging area for review and commit
                </p>
              </div>

              {/* Features and Guidelines Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Features */}
                <div>
                  <h3 className="text-white text-lg mb-4">Key Features</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2.5 flex-shrink-0"></div>
                      <span className="text-gray-300 leading-6">Automatic version detection and conflict resolution</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2.5 flex-shrink-0"></div>
                      <span className="text-gray-300 leading-6">Git-style staging and approval workflow</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2.5 flex-shrink-0"></div>
                      <span className="text-gray-300 leading-6">Support for all media and document types</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2.5 flex-shrink-0"></div>
                      <span className="text-gray-300 leading-6">Batch metadata management and tagging</span>
                    </div>
                  </div>
                </div>

                {/* Right: Upload Guidelines */}
                <div>
                  <h3 className="text-white text-lg mb-4">Upload Guidelines</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2.5 flex-shrink-0"></div>
                      <span className="text-gray-300 leading-6">Supported file types: images (JPG, PNG), documents (PDF, DOCX, XLSX), videos (MP4, MOV)</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2.5 flex-shrink-0"></div>
                      <span className="text-gray-300 leading-6">Maximum file size: 2 GB per file</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2.5 flex-shrink-0"></div>
                      <span className="text-gray-300 leading-6">Ensure stable internet connection for large uploads</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2.5 flex-shrink-0"></div>
                      <span className="text-gray-300 leading-6">Check file names for special characters to avoid upload issues</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Zone */}
          <Card className="bg-[#1f2029]/50 border-[#2a2d3a] backdrop-blur-sm mb-8">
            <CardContent className="p-8">
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  isDragging
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-[#2a2d3a] hover:border-[#3a3d4a]'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-white text-lg mb-2">Drop files here or click to browse</h3>
                <p className="text-gray-400 mb-2">
                  Files will be automatically analyzed for version conflicts
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  Supports JPG, PNG, GIF, MP4, MOV, MP3, WAV, PDF, and more
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Select Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                />
              </div>
            </CardContent>
          </Card>

          {/* Status Overview */}
          {uploadFiles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-[#1f2029]/50 border-[#2a2d3a]">
                <CardContent className="p-4 text-center">
                  <div className="text-xl font-medium text-blue-400">{newFiles.length}</div>
                  <div className="text-sm text-gray-400">New Files</div>
                </CardContent>
              </Card>
              <Card className="bg-[#1f2029]/50 border-[#2a2d3a]">
                <CardContent className="p-4 text-center">
                  <div className="text-xl font-medium text-orange-400">{versionUpdates.length}</div>
                  <div className="text-sm text-gray-400">Version Updates</div>
                </CardContent>
              </Card>
              <Card className="bg-[#1f2029]/50 border-[#2a2d3a]">
                <CardContent className="p-4 text-center">
                  <div className="text-xl font-medium text-green-400">{approvedFiles.length}</div>
                  <div className="text-sm text-gray-400">Approved</div>
                </CardContent>
              </Card>
              <Card className="bg-[#1f2029]/50 border-[#2a2d3a]">
                <CardContent className="p-4 text-center">
                  <div className="text-xl font-medium text-purple-400">{completedFiles.length}</div>
                  <div className="text-sm text-gray-400">Published</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Global Metadata */}
          {uploadFiles.length > 0 && (
            <Card className="bg-[#1f2029]/50 border-[#2a2d3a] backdrop-blur-sm mb-6">
              <CardHeader>
                <CardTitle className="text-white text-lg">Apply to All Files</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Tags (comma separated)</label>
                    <Input
                      value={currentTags}
                      onChange={(e) => setCurrentTags(e.target.value)}
                      placeholder="tag1, tag2, tag3"
                      className="bg-[#2a2d3a] border-[#3a3d4a] text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Folders (comma separated)</label>
                    <Input
                      value={currentFolders}
                      onChange={(e) => setCurrentFolders(e.target.value)}
                      placeholder="folder1, folder2, folder3"
                      className="bg-[#2a2d3a] border-[#3a3d4a] text-white"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={applyMetadataToAll} variant="outline" size="sm">
                    Apply to All Files
                  </Button>
                  <Button onClick={approveAllFiles} variant="outline" size="sm" className="text-green-400 border-green-500/30 hover:bg-green-500/10">
                    <Check className="w-3 h-3 mr-1" />
                    Approve All
                  </Button>
                  <Button onClick={rejectAllFiles} variant="outline" size="sm" className="text-red-400 border-red-500/30 hover:bg-red-500/10">
                    <X className="w-3 h-3 mr-1" />
                    Reject All
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          {uploadFiles.length > 0 && (
            <div className="mb-6 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                  <GitBranch className="w-3 h-3 mr-1" />
                  {commitBranch}
                </Badge>
                <Badge variant="outline" className="border-gray-500/30 text-gray-300">
                  {stagedFiles.length} ready
                </Badge>
              </div>

              <div className="flex space-x-2">
                {approvedFiles.length > 0 && (
                  <Button
                    onClick={proceedToCommit}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Publish Assets ({approvedFiles.length} files)
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Commit Dialog */}
          {showCommitDialog && (
            <Card className="bg-[#1f2029]/50 border-[#2a2d3a] backdrop-blur-sm mb-6">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Publish Assets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Collection</label>
                    <Input
                      value={commitBranch}
                      onChange={(e) => setCommitBranch(e.target.value)}
                      className="bg-[#2a2d3a] border-[#3a3d4a] text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Update Type</label>
                    <select className="w-full bg-[#2a2d3a] border border-[#3a3d4a] text-white rounded-md px-3 py-2">
                      <option value="new">New Content</option>
                      <option value="update">Content Update</option>
                      <option value="revision">Revision</option>
                      <option value="archive">Archive Update</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Description *</label>
                  <Textarea
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    placeholder="Describe what you're adding or updating..."
                    className="bg-[#2a2d3a] border-[#3a3d4a] text-white"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    onClick={commitAndPush}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={!commitMessage.trim()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Publish to Library
                  </Button>
                  <Button
                    onClick={() => setShowCommitDialog(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* File List */}
          {uploadFiles.length > 0 && (
            <div className="space-y-4">
              {uploadFiles.map((uploadFile) => (
                <Card key={uploadFile.id} className="bg-[#1f2029]/50 border-[#2a2d3a] backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      {/* Approval checkbox */}
                      <div className="flex-shrink-0 mt-2">
                        <button
                          onClick={() => toggleFileApproval(uploadFile.id)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            uploadFile.isApproved
                              ? 'bg-green-600 border-green-600'
                              : 'border-gray-400 hover:border-gray-300'
                          }`}
                        >
                          {uploadFile.isApproved && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </button>
                      </div>

                      {/* File Preview/Icon */}
                      <div className="flex-shrink-0">
                        {uploadFile.preview ? (
                          <img
                            src={uploadFile.preview}
                            alt={uploadFile.file.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-[#2a2d3a] rounded flex items-center justify-center">
                            {getFileIcon(uploadFile.file)}
                          </div>
                        )}
                      </div>

                      {/* File Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div>
                              <h4 className="text-white font-medium truncate">{uploadFile.file.name}</h4>
                              <p className="text-sm text-gray-400">
                                {formatFileSize(uploadFile.file.size)} • {uploadFile.file.type}
                              </p>
                            </div>

                            {/* Change type badge */}
                            <Badge className={`text-xs border ${getChangeTypeColor(uploadFile.changeType)}`}>
                              {getChangeTypeLabel(uploadFile.changeType)}
                            </Badge>

                            {/* Version info for updates */}
                            {uploadFile.isNewVersion && (
                              <div className="flex items-center space-x-1 text-xs text-gray-400">
                                <RefreshCw className="w-3 h-3" />
                                <span>{uploadFile.existingVersion} → {uploadFile.newVersion}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            {uploadFile.status === 'completed' && (
                              <Check className="w-5 h-5 text-green-400" />
                            )}
                            {uploadFile.status === 'error' && (
                              <AlertCircle className="w-5 h-5 text-red-400" />
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(uploadFile.id)}
                              className="text-gray-400 hover:text-red-400"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Version conflict warning */}
                        {uploadFile.isNewVersion && (
                          <Alert className="mb-3 bg-orange-500/10 border-orange-500/30">
                            <Clock className="w-4 h-4" />
                            <AlertDescription className="text-orange-300">
                              This will create version {uploadFile.newVersion}. Existing version {uploadFile.existingVersion} will be preserved in the timeline.
                            </AlertDescription>
                          </Alert>
                        )}

                        {/* Progress Bar */}
                        {uploadFile.status === 'uploading' && (
                          <div className="mb-3">
                            <Progress value={uploadFile.progress} className="h-2" />
                            <p className="text-xs text-gray-400 mt-1">
                              {Math.round(uploadFile.progress)}% uploading...
                            </p>
                          </div>
                        )}

                        {/* Metadata */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Tags */}
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Tags</label>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {uploadFile.tags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="bg-blue-500/20 text-blue-300 cursor-pointer group text-xs"
                                  onClick={() => removeTagFromFile(uploadFile.id, tag)}
                                >
                                  {tag}
                                  <span className="ml-1 opacity-0 group-hover:opacity-100">×</span>
                                </Badge>
                              ))}
                            </div>
                            <Input
                              placeholder="Add tag..."
                              className="bg-[#2a2d3a] border-[#3a3d4a] text-white text-xs h-8"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  addTagToFile(uploadFile.id, e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                          </div>

                          {/* Folders */}
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Folders</label>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {uploadFile.folders.map((folder, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="bg-purple-500/20 text-purple-300 cursor-pointer group text-xs"
                                  onClick={() => removeFolderFromFile(uploadFile.id, folder)}
                                >
                                  {folder}
                                  <span className="ml-1 opacity-0 group-hover:opacity-100">×</span>
                                </Badge>
                              ))}
                            </div>
                            <Input
                              placeholder="Add folder..."
                              className="bg-[#2a2d3a] border-[#3a3d4a] text-white text-xs h-8"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  addFolderToFile(uploadFile.id, e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
