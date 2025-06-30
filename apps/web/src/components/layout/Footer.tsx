import { Star, Download, Share, Copy, Trash2, Move, MoreHorizontal, X } from 'lucide-react';
import { Button } from '../../shared';
import { type Asset } from '@shared-ts/types';

interface FooterProps {
  selectedAssets: Asset[];
  previewAsset: Asset | null;
  onClearSelection: () => void;
}

export function Footer({ selectedAssets, previewAsset, onClearSelection }: FooterProps) {
  const totalSize = selectedAssets.reduce((acc, asset) => {
    const sizeNum = parseFloat(asset.size.split(' ')[0]);
    return acc + sizeNum;
  }, 0);

  return (
    <div className="bg-[#292b36] border-t border-[#373a4b] h-[60px] flex items-center justify-between px-4">
      {/* Left side - Selection/Preview info */}
      <div className="flex items-center space-x-4">
        {selectedAssets.length > 0 && (
          <>
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
          </>
        )}

        {!selectedAssets.length && previewAsset && (
          <div className="flex items-center space-x-2">
            <span className="text-white text-sm font-medium">Previewing:</span>
            <span className="text-gray-400 text-sm">{previewAsset.name}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-400 text-sm">{previewAsset.size}</span>
          </div>
        )}

        {!selectedAssets.length && !previewAsset && (
          <div className="text-gray-400 text-sm">
            Select assets or preview a file to see actions
          </div>
        )}
      </div>

      {/* Right side - Action buttons */}
      <div className="flex items-center space-x-2">
        {selectedAssets.length > 0 ? (
          // Selection actions
          <>
            <Button variant="secondary" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>

            <Button variant="secondary" size="sm">
              <Star className="w-4 h-4 mr-2" />
              Favorite
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
          </>
        ) : previewAsset ? (
          // Preview actions
          <>
            <Button variant="secondary" size="sm">
              <Star className="w-4 h-4 mr-2" />
              Favorite
            </Button>

            <Button variant="secondary" size="sm">
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>

            <Button variant="secondary" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>

            <Button className="bg-indigo-500 hover:bg-indigo-600" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>

            <Button variant="outline" size="sm" className="text-red-400 border-red-400 hover:bg-red-500/10">
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
}
