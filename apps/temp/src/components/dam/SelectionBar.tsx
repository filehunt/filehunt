import { X, MoreHorizontal, Move, Download, Share } from 'lucide-react';
import { Button } from '@filehunt/shared-ts/ui';
import { type Asset } from "@filehunt/shared-ts/types";

interface SelectionBarProps {
  selectedAssets: Asset[];
  onClearSelection: () => void;
}

export function SelectionBar({ selectedAssets, onClearSelection }: SelectionBarProps) {
  const totalSize = selectedAssets.reduce((acc, asset) => {
    const sizeNum = parseFloat(asset.size.split(' ')[0]);
    return acc + sizeNum;
  }, 0);

  return (
    <div className="bg-[#292b36] border-t border-[#373a4b] h-[60px] flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          <X className="w-4 h-4" />
        </Button>

        <div className="flex items-center space-x-2">
          <span className="text-white text-sm font-medium">
            {selectedAssets.length} Asset{selectedAssets.length !== 1 ? 's' : ''} selected
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-400 text-sm">{totalSize.toFixed(0)} MB</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="secondary" size="sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>

        <Button variant="secondary" size="sm">
          <Move className="w-4 h-4 mr-2" />
          Move to
        </Button>

        <Button variant="secondary" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>

        <Button className="bg-indigo-500 hover:bg-indigo-600" size="sm">
          <Share className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
}
