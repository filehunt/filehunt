"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Badge } from "@/components/badge";
import { Folder, Plus, X } from "lucide-react";
import { Asset } from "@/types/assets";

interface UploadScreenProps {
  onUpload: (files: FileList) => void;
  onTagAdd?: (tag: string) => void;
  onFolderAdd?: (folder: string) => void;
}

export function UploadScreen({ onUpload, onTagAdd, onFolderAdd }: UploadScreenProps) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [newTag, setNewTag] = useState("");
  const [newFolder, setNewFolder] = useState("");

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleUpload = () => {
    if (files) {
      onUpload(files);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && onTagAdd) {
      onTagAdd(newTag.trim());
      setNewTag("");
    }
  };

  const handleAddFolder = () => {
    if (newFolder.trim() && onFolderAdd) {
      onFolderAdd(newFolder.trim());
      setNewFolder("");
    }
  };

  return (
    <div className="w-full p-6 bg-card border border-border rounded-lg">
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-white font-bold text-lg">Upload Files</h2>
        <input
          type="file"
          multiple
          onChange={handleFilesChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        <Button onClick={handleUpload} className="mt-4">
          Upload
        </Button>
      </div>

      <div className="pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold text-sm">Tags</h3>
          <div className="flex space-x-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add tag..."
              className="text-xs h-7"
            />
            <Button size="sm" onClick={handleAddTag} className="h-7 px-2">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold text-sm">Folders</h3>
          <div className="flex space-x-2">
            <Input
              value={newFolder}
              onChange={(e) => setNewFolder(e.target.value)}
              placeholder="Add folder..."
              className="text-xs h-7"
            />
            <Button size="sm" onClick={handleAddFolder} className="h-7 px-2">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
