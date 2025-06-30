import { useState } from 'react';

import { FolderPlus, Folder } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, Button, Input, Label, Textarea } from '../../shared';

interface NewFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFolder: (folderData: { name: string; description: string; parentFolder?: string }) => void;
}

export function NewFolderDialog({ isOpen, onClose, onCreateFolder }: NewFolderDialogProps) {
  const [folderName, setFolderName] = useState('');
  const [description, setDescription] = useState('');
  const [parentFolder, setParentFolder] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      onCreateFolder({
        name: folderName.trim(),
        description: description.trim(),
        parentFolder: parentFolder || undefined
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setFolderName('');
    setDescription('');
    setParentFolder('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#1f2029] border-[#2a2d3a] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <FolderPlus className="w-5 h-5 mr-2 text-green-400" />
            Create New Folder
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a new folder to organize your assets. You can optionally specify a parent folder.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="folderName" className="text-white">
              Folder Name
            </Label>
            <Input
              id="folderName"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name..."
              className="bg-[#2a2d3a] border-[#3a3d4a] text-white placeholder-gray-400"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this folder will contain..."
              className="bg-[#2a2d3a] border-[#3a3d4a] text-white placeholder-gray-400 resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentFolder" className="text-white">
              Parent Folder (Optional)
            </Label>
            <div className="relative">
              <Folder className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="parentFolder"
                value={parentFolder}
                onChange={(e) => setParentFolder(e.target.value)}
                placeholder="Choose parent folder..."
                className="bg-[#2a2d3a] border-[#3a3d4a] text-white placeholder-gray-400 pl-10"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-[#3a3d4a] text-gray-300 hover:text-white hover:bg-[#2a2d3a]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!folderName.trim()}
              className="bg-green-600 hover:bg-green-700 text-white flex-1"
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              Create Folder
            </Button>
          </div>
        </form>

        {/* Quick Tips */}
        <div className="mt-4 p-3 bg-[#2a2d3a] rounded-md border border-[#3a3d4a]">
          <div className="text-xs text-gray-400 space-y-1">
            <p><span className="text-green-400">📁 Organize:</span> Use folders to group related assets</p>
            <p><span className="text-blue-400">🏷️ Naming:</span> Use descriptive names like "Product Photos 2024"</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
