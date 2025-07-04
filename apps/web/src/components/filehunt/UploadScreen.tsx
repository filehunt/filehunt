"use client";

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image, Video, Music, FileText, ArrowLeft, GitCommit, Check, AlertCircle, Tag, Folder, Plus, GitBranch, FolderOpen, Settings, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Badge } from "@/components/badge";
import { Textarea } from "@/components/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";

interface UploadFile {
  id: string;
  file: File;
  preview?: string;
  status: 'new' | 'modified' | 'staged';
  action: 'add' | 'update' | 'replace';
  tags: string[];
  folders: string[];
}

interface UploadScreenProps {
  onUpload?: (files: UploadFile[], commitMessage: string) => void;
  onBack?: () => void;
}

export function UploadScreen({ onUpload, onBack }: UploadScreenProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');
  const [isCommitting, setIsCommitting] = useState(false);
  const [batchTags, setBatchTags] = useState('');
  const [batchFolder, setBatchFolder] = useState('');
  const [currentCollection, setCurrentCollection] = useState('main');
  const [showBranchConfirm, setShowBranchConfirm] = useState<string | null>(null);
  const [watchedRepos, setWatchedRepos] = useState<Array<{id: string, path: string, name: string, watching: boolean}>>([{
    id: '1',
    path: '/Users/workspace/project-assets',
    name: 'project-assets',
    watching: true
  }]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock existing assets for conflict detection
  const existingAssets = [
    { name: 'logo.png', version: 'v1.2' },
    { name: 'hero-video.mp4', version: 'v2.1' },
    { name: 'product-sheet.pdf', version: 'v1.0' },
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
    action: 'add' | 'update' | 'replace';
    status: 'new' | 'modified' | 'staged';
    existingVersion?: string;
  } => {
    const existing = existingAssets.find(asset => asset.name === file.name);
    if (existing) {
      return {
        action: 'update',
        status: 'modified',
        existingVersion: existing.version
      };
    }
    return {
      action: 'add',
      status: 'new'
    };
  };

  const processFiles = (files: File[]) => {
    const newFiles: UploadFile[] = files.map(file => {
      const isExisting = existingAssets.some(asset => asset.name === file.name);
      return {
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        status: 'staged',
        action: isExisting ? 'update' : 'add',
        tags: [],
        folders: []
      };
    });

    setUploadFiles(prev => [...prev, ...newFiles]);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (file.type.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (file.type.startsWith('audio/')) return <Music className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const removeFile = (id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id));
  };

  const updateFileTag = (id: string, tags: string) => {
    setUploadFiles(prev => prev.map(f =>
      f.id === id ? { ...f, tags: tags.split(',').map(t => t.trim()).filter(t => t) } : f
    ));
  };

  const updateFileFolders = (id: string, folders: string) => {
    const folderArray = folders.split(',').map(f => f.trim()).filter(f => f);
    setUploadFiles(prev => prev.map(f =>
      f.id === id ? { ...f, folders: folderArray } : f
    ));
  };

  const applyBatchMetadata = () => {
    const tags = batchTags.split(',').map(t => t.trim()).filter(t => t);
    const folders = batchFolder.split(',').map(f => f.trim()).filter(f => f);

    setUploadFiles(prev => prev.map(file => ({
      ...file,
      tags: tags.length > 0 ? [...new Set([...file.tags, ...tags])] : file.tags,
      folders: folders.length > 0 ? [...new Set([...file.folders, ...folders])] : file.folders
    })));

    setBatchTags('');
    setBatchFolder('');
  };

  const commitFiles = async () => {
    if (!commitMessage.trim() || uploadFiles.length === 0) return;

    setIsCommitting(true);

    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (onUpload) {
      onUpload(uploadFiles, commitMessage);
    }

    // Reset
    setUploadFiles([]);
    setCommitMessage('');
    setBatchTags('');
    setBatchFolder('');
    setIsCommitting(false);
  };

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'draft':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'featured':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'new':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const newFiles = uploadFiles.filter(f => f.action === 'add').length;
  const updateFiles = uploadFiles.filter(f => f.action === 'update').length;

  return (
    <motion.div 
      className="flex flex-1 text-foreground overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Left Sidebar - Project Collections */}
      <motion.div 
        className="w-80 flex flex-col"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      >
        <div className="p-4">
          <h2 className="text-white font-semibold text-sm mb-4">Projects & Branches</h2>

          {/* Current Collection */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Current Branch</label>
              <div className="flex items-center space-x-2 p-2 bg-background/50 rounded">
                <GitCommit className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-foreground">{currentCollection}</span>
              </div>
            </div>

            {/* Git Branch Tree */}
            <div className="space-y-3">
              <label className="text-xs font-medium text-muted-foreground">Git Branches</label>
              
              {/* Branch Tree Structure */}
              <div className="pl-2 space-y-1">
                {/* Main Branch */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-0.5 bg-muted"></div>
                    <GitBranch className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <button 
                    onClick={() => currentCollection !== 'main' ? setShowBranchConfirm('main') : null}
                    className={`flex-1 flex items-center justify-between p-1.5 rounded text-left transition-colors ${
                      currentCollection === 'main' 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                        : 'hover:bg-background/30 text-muted-foreground'
                    }`}
                  >
                    <span className="text-xs font-mono">main</span>
                    <span className="text-xs opacity-70">247</span>
                  </button>
                </div>
                
                {/* Develop Branch */}
                <div className="flex items-center space-x-2 ml-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-0.5 bg-muted"></div>
                    <div className="w-0.5 h-4 bg-muted"></div>
                    <div className="w-2 h-0.5 bg-muted"></div>
                    <GitBranch className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <button 
                    onClick={() => currentCollection !== 'develop' ? setShowBranchConfirm('develop') : null}
                    className={`flex-1 flex items-center justify-between p-1.5 rounded text-left transition-colors ${
                      currentCollection === 'develop' 
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                        : 'hover:bg-background/30 text-muted-foreground'
                    }`}
                  >
                    <span className="text-xs font-mono">develop</span>
                    <span className="text-xs opacity-70">+3</span>
                  </button>
                </div>
                
                {/* Feature Branches */}
                <div className="ml-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-1 h-0.5 bg-muted"></div>
                      <div className="w-0.5 h-4 bg-muted"></div>
                      <div className="w-1 h-0.5 bg-muted"></div>
                      <GitBranch className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <button 
                      onClick={() => currentCollection !== 'feature/summer-campaign' ? setShowBranchConfirm('feature/summer-campaign') : null}
                      className={`flex-1 flex items-center justify-between p-1.5 rounded text-left transition-colors ${
                        currentCollection === 'feature/summer-campaign' 
                          ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' 
                          : 'hover:bg-background/30 text-muted-foreground'
                      }`}
                    >
                      <span className="text-xs font-mono truncate">feature/summer-campaign</span>
                      <span className="text-xs opacity-70">+12</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-1">
                      <div className="w-1 h-0.5 bg-muted"></div>
                      <div className="w-0.5 h-4 bg-muted"></div>
                      <div className="w-1 h-0.5 bg-muted"></div>
                      <GitBranch className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <button 
                      onClick={() => currentCollection !== 'feature/product-launch' ? setShowBranchConfirm('feature/product-launch') : null}
                      className={`flex-1 flex items-center justify-between p-1.5 rounded text-left transition-colors ${
                        currentCollection === 'feature/product-launch' 
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                          : 'hover:bg-background/30 text-muted-foreground'
                      }`}
                    >
                      <span className="text-xs font-mono truncate">feature/product-launch</span>
                      <span className="text-xs opacity-70">+8</span>
                    </button>
                  </div>
                </div>
                
                {/* Release Branch */}
                <div className="flex items-center space-x-2 ml-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-0.5 bg-muted"></div>
                    <div className="w-0.5 h-4 bg-muted"></div>
                    <div className="w-2 h-0.5 bg-muted"></div>
                    <GitBranch className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <button 
                    onClick={() => currentCollection !== 'release/v2.1' ? setShowBranchConfirm('release/v2.1') : null}
                    className={`flex-1 flex items-center justify-between p-1.5 rounded text-left transition-colors ${
                      currentCollection === 'release/v2.1' 
                        ? 'bg-gray-500/20 text-gray-300 border border-gray-500/30' 
                        : 'hover:bg-background/30 text-muted-foreground'
                    }`}
                  >
                    <span className="text-xs font-mono">release/v2.1</span>
                    <span className="text-xs opacity-70">+1</span>
                  </button>
                </div>
              </div>
              
              {/* Branch Switch Confirmation */}
              {showBranchConfirm && (
                <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      <span className="text-xs font-medium text-orange-300">Switch Branch</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Switch to <span className="font-mono text-foreground">{showBranchConfirm}</span>? 
                      Uncommitted changes will be lost.
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setCurrentCollection(showBranchConfirm);
                          setShowBranchConfirm(null);
                          setUploadFiles([]);
                        }}
                        className="h-6 text-xs px-2 bg-orange-500/20 border-orange-500/30 text-orange-300"
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowBranchConfirm(null)}
                        className="h-6 text-xs px-2"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Batch Metadata Section */}
            <div className="space-y-3">
              <h3 className="text-white font-semibold text-sm">Apply to All Files</h3>
              
              {/* Tags Section */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <h4 className="text-white font-semibold text-xs">Tags</h4>
                </div>
                <div className="space-y-2">
                  <Input
                    value={batchTags}
                    onChange={(e) => setBatchTags(e.target.value)}
                    placeholder="Add tags (comma separated)"
                    className="text-xs bg-card border-border"
                  />
                  <Button
                    onClick={() => {
                      if (batchTags.trim()) {
                        applyBatchMetadata();
                      }
                    }}
                    disabled={!batchTags.trim()}
                    variant="outline"
                    size="sm"
                    className="w-full h-7"
                  >
                    <Plus className="w-3 h-3 mr-2" />
                    Apply Tags
                  </Button>
                </div>
              </div>

              {/* Folders Section */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Folder className="w-4 h-4 text-muted-foreground" />
                  <h4 className="text-white font-semibold text-xs">Folders</h4>
                </div>
                <div className="space-y-2">
                  <Input
                    value={batchFolder}
                    onChange={(e) => setBatchFolder(e.target.value)}
                    placeholder="Add folder"
                    className="text-xs bg-card border-border"
                  />
                  <Button
                    onClick={() => {
                      if (batchFolder.trim()) {
                        applyBatchMetadata();
                      }
                    }}
                    disabled={!batchFolder.trim()}
                    variant="outline"
                    size="sm"
                    className="w-full h-7"
                  >
                    <Plus className="w-3 h-3 mr-2" />
                    Apply Folder
                  </Button>
                </div>
              </div>
            </div>

            {/* Repository Status */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-muted-foreground">Repository Status</label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
                >
                  <RefreshCw className="w-3 h-3" />
                </Button>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Tracked Files:</span>
                  <span className="text-foreground font-medium">247</span>
                </div>
                <div className="flex justify-between">
                  <span>Staged Changes:</span>
                  <span className="text-green-400 font-medium">{uploadFiles.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Sync:</span>
                  <span className="text-foreground font-medium">2h ago</span>
                </div>
                <div className="flex justify-between">
                  <span>Auto-watch:</span>
                  <span className="text-green-400 font-medium">
                    {watchedRepos.filter(r => r.watching).length} active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="flex-1 overflow-y-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      >
        <div className="p-6">
          <motion.div 
            className="max-w-4xl mx-auto space-y-6"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Upload Assets</h1>
              <p className="text-muted-foreground">Stage files, add metadata, and commit to library</p>
            </div>
            {onBack && (
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
          </div>

          {/* Git-style Status */}
          {uploadFiles.length > 0 && (
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">{newFiles} new</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-sm font-medium">{updateFiles} modified</span>
                  </div>
                </div>
                <Badge variant="outline">{uploadFiles.length} files staged</Badge>
              </div>
            </div>
          )}


          {/* Drop Zone */}
          <div className="p-8">
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragging
                  ? 'border-primary bg-primary/10'
                  : 'border-muted hover:border-primary/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Drop files here or click to browse
                </h3>
                <p className="text-muted-foreground mb-4">
                  Files will be staged for commit. Existing files will be updated automatically.
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  size="lg"
                >
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
          </div>

          {/* Staged Files */}
          <AnimatePresence>
            {uploadFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="p-4 pb-2">
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <GitCommit className="w-5 h-5" />
                    Staged Changes ({uploadFiles.length})
                  </h3>
                </div>
                <div className="px-4 pb-4 space-y-4">
                  <AnimatePresence>
                    {uploadFiles.map((uploadFile, index) => (
                      <motion.div 
                        key={uploadFile.id} 
                        className="flex items-center space-x-4 p-4 rounded-lg bg-muted/30"
                        initial={{ opacity: 0, x: -20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        layout
                      >
                    {/* Status Indicator */}
                    <div className={`w-3 h-3 rounded-full ${
                      uploadFile.action === 'add' ? 'bg-green-500' : 'bg-orange-500'
                    }`}></div>

                    {/* File Preview/Icon */}
                    <div className="flex-shrink-0">
                      {uploadFile.preview ? (
                        <img
                          src={uploadFile.preview}
                          alt={uploadFile.file.name}
                          className="w-12 h-12 object-cover rounded border"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                          {getFileIcon(uploadFile.file)}
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium truncate">{uploadFile.file.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(uploadFile.file.size)} • {uploadFile.action}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(uploadFile.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Quick Metadata */}
                      <div className="space-y-3">
                        {/* Tags Display */}
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Tag className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground">Tags:</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {uploadFile.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                className={`text-xs cursor-pointer group ${getTagColor(tag)}`}
                                onClick={() => {
                                  const newTags = uploadFile.tags.filter(t => t !== tag);
                                  setUploadFiles(prev => prev.map(f =>
                                    f.id === uploadFile.id ? { ...f, tags: newTags } : f
                                  ));
                                }}
                              >
                                {tag}
                                <X className="w-2 h-2 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Badge>
                            ))}
                          </div>
                          <Input
                            placeholder="Add tags (comma separated)"
                            className="text-xs h-7"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const newTags = e.currentTarget.value.split(',').map(t => t.trim()).filter(t => t);
                                if (newTags.length > 0) {
                                  setUploadFiles(prev => prev.map(f =>
                                    f.id === uploadFile.id ? { ...f, tags: [...new Set([...f.tags, ...newTags])] } : f
                                  ));
                                  e.currentTarget.value = '';
                                }
                              }
                            }}
                          />
                        </div>

                        {/* Folders Display */}
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Folder className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground">Folders:</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {uploadFile.folders.map((folder, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs cursor-pointer group bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
                                onClick={() => {
                                  const newFolders = uploadFile.folders.filter(f => f !== folder);
                                  setUploadFiles(prev => prev.map(f =>
                                    f.id === uploadFile.id ? { ...f, folders: newFolders } : f
                                  ));
                                }}
                              >
                                {folder}
                                <X className="w-2 h-2 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Badge>
                            ))}
                          </div>
                          <Input
                            placeholder="Add folders (comma separated)"
                            className="text-xs h-7"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const newFolders = e.currentTarget.value.split(',').map(f => f.trim()).filter(f => f);
                                if (newFolders.length > 0) {
                                  setUploadFiles(prev => prev.map(f =>
                                    f.id === uploadFile.id ? { ...f, folders: [...new Set([...f.folders, ...newFolders])] } : f
                                  ));
                                  e.currentTarget.value = '';
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Help Text */}
          {uploadFiles.length === 0 && (
            <div>
              <div className="p-4 pb-2">
                <h3 className="text-lg font-semibold">Smart Asset Management</h3>
              </div>
              <div className="px-4 pb-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-muted-foreground">
                    New assets are automatically detected and prepared for upload
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-sm text-muted-foreground">
                    Files with existing names will create new versions
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-muted-foreground">
                    Add tags and organize with a descriptive update message
                  </span>
                </div>
              </div>
            </div>
          )}
          </motion.div>
        </div>
      </motion.div>

      {/* Right Sidebar */}
      <motion.div 
        className="w-80 flex flex-col"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="p-4">
          <h2 className="text-white font-semibold text-sm">Upload Information</h2>
        </div>

        {/* Upload Statistics */}
        <div className="p-4 space-y-4">
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm">Statistics</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-background/50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-green-500">{newFiles}</div>
                <div className="text-xs text-muted-foreground">New Files</div>
              </div>
              <div className="bg-background/50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-orange-500">{updateFiles}</div>
                <div className="text-xs text-muted-foreground">Updates</div>
              </div>
            </div>

            <div className="bg-background/50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-blue-500">
                {uploadFiles.reduce((total, file) => total + file.file.size, 0) > 0 ?
                  formatFileSize(uploadFiles.reduce((total, file) => total + file.file.size, 0)) : '0 Bytes'
                }
              </div>
              <div className="text-xs text-muted-foreground">Total Size</div>
            </div>
          </div>

          {/* File Types Distribution */}
          {uploadFiles.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-white font-semibold text-sm">File Types</h3>
              <div className="space-y-2">
                {Object.entries(
                  uploadFiles.reduce((acc, file) => {
                    const type = file.file.type.split('/')[0] || 'other';
                    acc[type] = (acc[type] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {type === 'image' && <Image className="w-4 h-4 text-green-500" />}
                      {type === 'video' && <Video className="w-4 h-4 text-blue-500" />}
                      {type === 'audio' && <Music className="w-4 h-4 text-purple-500" />}
                      {!['image', 'video', 'audio'].includes(type) && <FileText className="w-4 h-4 text-gray-500" />}
                      <span className="text-sm text-foreground capitalize">{type}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">{count}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags Summary */}
          {uploadFiles.some(f => f.tags.length > 0) && (
            <div className="space-y-3">
              <h3 className="text-white font-semibold text-sm">Tags Used</h3>
              <div className="flex flex-wrap gap-1">
                {Array.from(new Set(uploadFiles.flatMap(f => f.tags))).map(tag => (
                  <Badge key={tag} className={`text-xs ${getTagColor(tag)}`}>
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Folders Summary */}
          {uploadFiles.some(f => f.folders.length > 0) && (
            <div className="space-y-3">
              <h3 className="text-white font-semibold text-sm">Folders</h3>
              <div className="flex flex-wrap gap-1">
                {Array.from(new Set(uploadFiles.flatMap(f => f.folders))).map(folder => (
                  <Badge key={folder} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
                    {folder}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Commit Section */}
          <AnimatePresence>
            {uploadFiles.length > 0 && (
              <motion.div 
                className="space-y-3 pt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
              <h3 className="text-primary font-semibold text-sm flex items-center gap-2">
                <GitCommit className="w-4 h-4 animate-pulse" />
                Ready to Commit
              </h3>

              <div className="space-y-3">
                <div>
                  <Textarea
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    placeholder="Describe what you're adding or updating..."
                    rows={3}
                    className="text-sm resize-none"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{uploadFiles.length} files staged</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUploadFiles([])}
                    className="text-xs h-6 px-2"
                  >
                    Clear All
                  </Button>
                </div>

                <Button
                  onClick={commitFiles}
                  disabled={!commitMessage.trim() || isCommitting}
                  className="w-full"
                  size="sm"
                >
                  {isCommitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Committing...
                    </>
                  ) : (
                    <>
                      <GitCommit className="w-4 h-4 mr-2" />
                      Commit & Push
                    </>
                  )}
                </Button>
              </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Tips */}
          <div className="space-y-3 pt-4">
            <h3 className="text-white font-semibold text-sm">Quick Tips</h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                <span>Use batch metadata to apply tags/folders to all files at once</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                <span>Files with same names will create new versions automatically</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                <span>Use descriptive commit messages for better version tracking</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
}
