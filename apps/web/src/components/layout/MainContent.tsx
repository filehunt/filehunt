import { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Button } from '@filehunt/shared-ts/ui';
import { AssetCard } from '../dam/AssetCard';
import { AppearancePopover } from '../dam/AppearancePopover';
import { SortPopover } from '../dam/SortPopover';
import { type Asset } from "@filehunt/shared-ts/types";

interface MainContentProps {
  selectedAssets: Asset[];
  onAssetSelect: (asset: Asset, isSelected: boolean) => void;
  onAssetPreview: (asset: Asset) => void;
  onAssetDetail: (asset: Asset) => void;
  viewMode: 'grid' | 'list' | 'gallery';
  onViewModeChange: (mode: 'grid' | 'list' | 'gallery') => void;
}

interface AppearanceSettings {
  cardSize: 'S' | 'M' | 'L';
  aspectRatio: '16:9' | '4:3' | '1:1';
  thumbnailScale: 'fit' | 'fill';
  showCardInfo: boolean;
}

interface SortSettings {
  field: 'date-uploaded' | 'name' | 'size' | 'type' | 'uploader' | 'comments';
  direction: 'asc' | 'desc';
}

const mockAssets: Asset[] = [
  // Videos (existing)
  {
    id: '1',
    name: 'DRP_B004_081606_V1_0099.mov',
    type: 'video',
    duration: '00:10',
    comments: 2,
    size: '120 MB',
    uploadDate: 'Oct 14th, 2024',
    uploader: 'Alissa Morris',
    tags: [],
    folders: ['Episodes', 'Key Scenes'],
    thumbnail: 'https://picsum.photos/seed/landscape1/800/450', // 16:9 landscape
    status: 'needs-review',
    timeline: [
      { id: 't1', message: 'Initial upload', author: 'Alissa Morris', timestamp: '2h ago', version: 'V1.0', type: 'commit' },
      { id: 't2', message: 'Color correction updates', author: 'Alex Chen', timestamp: '4h ago', version: 'V1.1', type: 'commit' },
      { id: 't3', message: 'Merged feature branch', author: 'Sarah Kim', timestamp: '1d ago', version: 'V1.2', type: 'merge', branch: 'feature/effects' }
    ]
  },
  {
    id: '2',
    name: 'DRP_A015_08150F_V1_0023.mov',
    type: 'video',
    duration: '00:30',
    comments: 1,
    size: '95 MB',
    uploadDate: 'Oct 14th, 2024',
    uploader: 'Alissa Morris',
    tags: ['Coloring'],
    folders: ['Episodes'],
    thumbnail: 'https://picsum.photos/seed/portrait1/450/800', // Portrait
    timeline: [
      { id: 't4', message: 'Color grading completed', author: 'Alex Chen', timestamp: '1h ago', version: 'V1.0', type: 'commit' },
      { id: 't5', message: 'Initial asset creation', author: 'Alissa Morris', timestamp: '3h ago', version: 'V0.9', type: 'commit' }
    ]
  },
  {
    id: '3',
    name: 'DRP_B004_081606_V1_0099.mov',
    type: 'video',
    duration: '00:05',
    comments: 0,
    size: '88 MB',
    uploadDate: 'Oct 14th, 2024',
    uploader: 'Alissa Morris',
    tags: [],
    folders: ['Talent'],
    thumbnail: 'https://picsum.photos/seed/square1/600/600', // Square
    version: 'V2',
    timeline: [
      { id: 't6', message: 'Version 2 release', author: 'Sarah Kim', timestamp: '30m ago', version: 'V2.0', type: 'commit' },
      { id: 't7', message: 'Merged talent updates', author: 'Mike Johnson', timestamp: '2h ago', version: 'V1.8', type: 'merge', branch: 'feature/talent' },
      { id: 't8', message: 'Audio sync fixes', author: 'Alissa Morris', timestamp: '5h ago', version: 'V1.7', type: 'commit' }
    ]
  },
  {
    id: '4',
    name: 'DRP_B005_0815SV_V1_0029.mov',
    type: 'video',
    duration: '00:09',
    comments: 2,
    size: '110 MB',
    uploadDate: 'Oct 14th, 2024',
    uploader: 'Alissa Morris',
    tags: ['Social'],
    folders: ['Location'],
    thumbnail: 'https://picsum.photos/seed/landscape2/800/450' // 16:9 landscape
  },
  {
    id: '5',
    name: 'DRP_A002_0816PS_V1_0080.mov',
    type: 'video',
    duration: '00:11',
    comments: 6,
    size: '145 MB',
    uploadDate: 'Oct 14th, 2024',
    uploader: 'Alissa Morris',
    tags: ['Retouching'],
    folders: ['Episodes', 'Talent'],
    thumbnail: 'https://picsum.photos/seed/portrait2/450/800' // Portrait
  },
  {
    id: '6',
    name: 'DRP_B027_0815Y6_V1_0049.mov',
    type: 'video',
    duration: '00:21',
    comments: 12,
    size: '200 MB',
    uploadDate: 'Oct 14th, 2024',
    uploader: 'Alissa Morris',
    tags: ['Coloring'],
    folders: ['Key Scenes'],
    thumbnail: 'https://picsum.photos/seed/landscape3/800/600' // 4:3 landscape
  },
  {
    id: '7',
    name: 'DRP_B026_0815HR_V1_0047.mov',
    type: 'video',
    duration: '00:32',
    comments: 3,
    size: '175 MB',
    uploadDate: 'Oct 14th, 2024',
    uploader: 'Alissa Morris',
    tags: ['Retouching', 'Social', 'Coloring'],
    folders: ['Episodes', 'Key Scenes', 'Location'],
    thumbnail: 'https://picsum.photos/seed/square2/600/600' // Square
  },
  {
    id: '8',
    name: 'DRP_B014_08155T_V1_0039.mov',
    type: 'video',
    duration: '00:03',
    comments: 5,
    size: '85 MB',
    uploadDate: 'Oct 14th, 2024',
    uploader: 'Alissa Morris',
    tags: [],
    folders: ['Talent', 'Location'],
    thumbnail: 'https://picsum.photos/seed/portrait3/600/800' // Portrait
  },
  {
    id: '9',
    name: 'DRP_C001_0820XY_V1_0012.mov',
    type: 'video',
    duration: '00:15',
    comments: 0,
    size: '95 MB',
    uploadDate: 'Oct 15th, 2024',
    uploader: 'Alissa Morris',
    tags: ['Social'],
    folders: ['Episodes'],
    thumbnail: 'https://picsum.photos/seed/landscape4/800/450' // 16:9 landscape
  },
  {
    id: '10',
    name: 'DRP_A030_0821MN_V1_0067.mov',
    type: 'video',
    duration: '00:08',
    comments: 4,
    size: '78 MB',
    uploadDate: 'Oct 15th, 2024',
    uploader: 'Alissa Morris',
    tags: ['Coloring', 'Retouching'],
    folders: ['Key Scenes', 'Talent'],
    thumbnail: 'https://picsum.photos/seed/portrait4/450/800' // Portrait
  },
  {
    id: '11',
    name: 'DRP_D005_0822PQ_V1_0089.mov',
    type: 'video',
    duration: '00:25',
    comments: 8,
    size: '180 MB',
    uploadDate: 'Oct 15th, 2024',
    uploader: 'Alissa Morris',
    tags: ['Social', 'Coloring'],
    folders: ['Location', 'Episodes'],
    thumbnail: 'https://picsum.photos/seed/square3/600/600' // Square
  },
  {
    id: '12',
    name: 'DRP_B009_0823RS_V1_0045.mov',
    type: 'video',
    duration: '00:12',
    comments: 1,
    size: '102 MB',
    uploadDate: 'Oct 15th, 2024',
    uploader: 'Alissa Morris',
    tags: [],
    folders: ['Talent'],
    thumbnail: 'https://picsum.photos/seed/landscape5/800/600' // 4:3 landscape
  },

  // Images
  {
    id: '13',
    name: 'DRP_Hero_Shot_001.jpg',
    type: 'image',
    comments: 3,
    size: '8.2 MB',
    uploadDate: 'Oct 15th, 2024',
    uploader: 'Sarah Kim',
    tags: ['Hero', 'Marketing'],
    folders: ['Marketing', 'Key Scenes'],
    thumbnail: 'https://picsum.photos/seed/hero1/800/450',
    status: 'approved'
  },
  {
    id: '14',
    name: 'DRP_Portrait_Talent_A.jpg',
    type: 'image',
    comments: 1,
    size: '12.5 MB',
    uploadDate: 'Oct 15th, 2024',
    uploader: 'Alex Chen',
    tags: ['Portrait', 'Talent'],
    folders: ['Talent', 'Portraits'],
    thumbnail: 'https://picsum.photos/seed/portrait5/600/800'
  },
  {
    id: '15',
    name: 'DRP_Logo_Concept_V3.png',
    type: 'image',
    comments: 7,
    size: '2.1 MB',
    uploadDate: 'Oct 16th, 2024',
    uploader: 'Maria Rodriguez',
    tags: ['Logo', 'Branding'],
    folders: ['Branding', 'Graphics'],
    thumbnail: 'https://picsum.photos/seed/logo1/600/600',
    version: 'V3'
  },
  {
    id: '16',
    name: 'DRP_BTS_Setup_001.jpg',
    type: 'image',
    comments: 0,
    size: '15.8 MB',
    uploadDate: 'Oct 16th, 2024',
    uploader: 'Mike Johnson',
    tags: ['BTS', 'Setup'],
    folders: ['Behind the Scenes', 'Location'],
    thumbnail: 'https://picsum.photos/seed/bts1/800/600'
  },
  {
    id: '17',
    name: 'DRP_Product_Hero_Final.jpg',
    type: 'image',
    comments: 2,
    size: '9.7 MB',
    uploadDate: 'Oct 17th, 2024',
    uploader: 'Sarah Kim',
    tags: ['Product', 'Final'],
    folders: ['Marketing', 'Final Assets'],
    thumbnail: 'https://picsum.photos/seed/product1/800/450',
    status: 'approved'
  },
  {
    id: '18',
    name: 'DRP_Mood_Board_Concept.jpg',
    type: 'image',
    comments: 5,
    size: '6.3 MB',
    uploadDate: 'Oct 17th, 2024',
    uploader: 'Emma Wilson',
    tags: ['Mood Board', 'Concept'],
    folders: ['Pre-Production', 'Concepts'],
    thumbnail: 'https://picsum.photos/seed/mood1/800/600'
  },

  // Audio
  {
    id: '19',
    name: 'DRP_Soundtrack_Main_Theme.wav',
    type: 'audio',
    duration: '03:24',
    comments: 4,
    size: '38.2 MB',
    uploadDate: 'Oct 17th, 2024',
    uploader: 'David Park',
    tags: ['Soundtrack', 'Theme'],
    folders: ['Audio', 'Music'],
    thumbnail: 'https://picsum.photos/seed/audio1/600/600'
  },
  {
    id: '20',
    name: 'DRP_Voiceover_Narrator_V2.mp3',
    type: 'audio',
    duration: '01:47',
    comments: 2,
    size: '4.1 MB',
    uploadDate: 'Oct 18th, 2024',
    uploader: 'Jennifer Lee',
    tags: ['Voiceover', 'Narrator'],
    folders: ['Audio', 'Voice'],
    thumbnail: 'https://picsum.photos/seed/audio2/600/600',
    version: 'V2'
  },
  {
    id: '21',
    name: 'DRP_SFX_Transition_Pack.wav',
    type: 'audio',
    duration: '00:32',
    comments: 1,
    size: '8.9 MB',
    uploadDate: 'Oct 18th, 2024',
    uploader: 'Ryan Martinez',
    tags: ['SFX', 'Transitions'],
    folders: ['Audio', 'Sound Effects'],
    thumbnail: 'https://picsum.photos/seed/audio3/600/600'
  },
  {
    id: '22',
    name: 'DRP_Ambient_Background.mp3',
    type: 'audio',
    duration: '05:12',
    comments: 0,
    size: '11.7 MB',
    uploadDate: 'Oct 19th, 2024',
    uploader: 'Lisa Chang',
    tags: ['Ambient', 'Background'],
    folders: ['Audio', 'Ambient'],
    thumbnail: 'https://picsum.photos/seed/audio4/600/600'
  },
  {
    id: '23',
    name: 'DRP_Dialogue_Take_05.wav',
    type: 'audio',
    duration: '02:18',
    comments: 3,
    size: '25.4 MB',
    uploadDate: 'Oct 19th, 2024',
    uploader: 'Thomas Brown',
    tags: ['Dialogue', 'Take 5'],
    folders: ['Audio', 'Dialogue'],
    thumbnail: 'https://picsum.photos/seed/audio5/600/600',
    status: 'needs-review'
  },

  // Documents
  {
    id: '24',
    name: 'DRP_Script_Final_Draft.pdf',
    type: 'document',
    comments: 8,
    size: '1.2 MB',
    uploadDate: 'Oct 19th, 2024',
    uploader: 'Amanda Foster',
    tags: ['Script', 'Final Draft'],
    folders: ['Scripts', 'Final'],
    thumbnail: 'https://picsum.photos/seed/doc1/600/800',
    status: 'approved'
  },
  {
    id: '25',
    name: 'DRP_Shot_List_Episode_01.xlsx',
    type: 'document',
    comments: 2,
    size: '0.8 MB',
    uploadDate: 'Oct 20th, 2024',
    uploader: 'Kevin Zhang',
    tags: ['Shot List', 'Episode 1'],
    folders: ['Pre-Production', 'Planning'],
    thumbnail: 'https://picsum.photos/seed/doc2/600/800'
  },
  {
    id: '26',
    name: 'DRP_Budget_Breakdown_Q4.pdf',
    type: 'document',
    comments: 5,
    size: '0.5 MB',
    uploadDate: 'Oct 20th, 2024',
    uploader: 'Rachel Green',
    tags: ['Budget', 'Q4'],
    folders: ['Finance', 'Planning'],
    thumbnail: 'https://picsum.photos/seed/doc3/600/800'
  },
  {
    id: '27',
    name: 'DRP_Release_Notes_V2.1.md',
    type: 'document',
    comments: 1,
    size: '0.3 MB',
    uploadDate: 'Oct 21st, 2024',
    uploader: 'Jason Liu',
    tags: ['Release Notes', 'V2.1'],
    folders: ['Documentation', 'Release'],
    thumbnail: 'https://picsum.photos/seed/doc4/600/800',
    version: 'V2.1'
  },
  {
    id: '28',
    name: 'DRP_Creative_Brief_Campaign.docx',
    type: 'document',
    comments: 6,
    size: '1.8 MB',
    uploadDate: 'Oct 21st, 2024',
    uploader: 'Sophie Turner',
    tags: ['Creative Brief', 'Campaign'],
    folders: ['Marketing', 'Strategy'],
    thumbnail: 'https://picsum.photos/seed/doc5/600/800',
    status: 'needs-review'
  },
  {
    id: '29',
    name: 'DRP_Tech_Specs_Equipment.pdf',
    type: 'document',
    comments: 0,
    size: '2.1 MB',
    uploadDate: 'Oct 22nd, 2024',
    uploader: 'Mark Davis',
    tags: ['Tech Specs', 'Equipment'],
    folders: ['Technical', 'Equipment'],
    thumbnail: 'https://picsum.photos/seed/doc6/600/800'
  }
];

export function MainContent({
  selectedAssets,
  onAssetSelect,
  onAssetPreview,
  onAssetDetail,
  viewMode,
  onViewModeChange
}: MainContentProps) {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>({
    cardSize: 'L',
    aspectRatio: '16:9',
    thumbnailScale: 'fill',
    showCardInfo: false
  });
  const [sortSettings, setSortSettings] = useState<SortSettings>({
    field: 'date-uploaded',
    direction: 'desc'
  });

  // Sort assets based on settings
  const sortedAssets = useMemo(() => {
    const sorted = [...assets].sort((a, b) => {
      let aValue: string | number | Date, bValue: string | number | Date;

      switch (sortSettings.field) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'size':
          aValue = parseFloat(a.size.split(' ')[0]);
          bValue = parseFloat(b.size.split(' ')[0]);
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'uploader':
          aValue = a.uploader.toLowerCase();
          bValue = b.uploader.toLowerCase();
          break;
        case 'comments':
          aValue = a.comments;
          bValue = b.comments;
          break;
        case 'date-uploaded':
        default:
          aValue = new Date(a.uploadDate).getTime();
          bValue = new Date(b.uploadDate).getTime();
          break;
      }

      if (aValue < bValue) return sortSettings.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortSettings.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [assets, sortSettings]);

  // Create a more controlled pattern of row spans for subtle variation
  const rowSpans = useMemo(() => {
    // Adjust pattern based on aspect ratio
    const basePatterns = {
      '16:9': [1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1], // Wide format - more single height
      '4:3': [1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1],   // Standard - balanced
      '1:1': [2, 1, 2, 2, 1, 2, 1, 2, 2, 1, 2, 1]    // Square - more double height
    };

    const pattern = basePatterns[appearanceSettings.aspectRatio];
    return sortedAssets.map((_, index) => pattern[index % pattern.length]);
  }, [sortedAssets, appearanceSettings.aspectRatio]);

  // Calculate grid columns based on card size, aspect ratio, and view mode
  const getGridColumns = () => {
    if (viewMode === 'gallery') {
      // Gallery mode uses masonry layout with more columns
      const galleryColumns = {
        'S': 'columns-4 xl:columns-6 2xl:columns-8',
        'M': 'columns-3 xl:columns-4 2xl:columns-5',
        'L': 'columns-2 xl:columns-3 2xl:columns-4'
      };
      return galleryColumns[appearanceSettings.cardSize];
    }

    if (viewMode === 'list') {
      return 'grid-cols-1'; // Single column for list view
    }

    // Grid mode
    const baseColumns = {
      'S': { '16:9': 'grid-cols-5 xl:grid-cols-7 2xl:grid-cols-9', '4:3': 'grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8', '1:1': 'grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8' },
      'M': { '16:9': 'grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5', '4:3': 'grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5', '1:1': 'grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6' },
      'L': { '16:9': 'grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4', '4:3': 'grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4', '1:1': 'grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' }
    };

    return baseColumns[appearanceSettings.cardSize][appearanceSettings.aspectRatio];
  };

  // Calculate row height based on card size and aspect ratio
  const getRowHeight = () => {
    const baseHeights = {
      'S': { '16:9': 'auto-rows-[100px]', '4:3': 'auto-rows-[120px]', '1:1': 'auto-rows-[140px]' },
      'M': { '16:9': 'auto-rows-[140px]', '4:3': 'auto-rows-[160px]', '1:1': 'auto-rows-[180px]' },
      'L': { '16:9': 'auto-rows-[200px]', '4:3': 'auto-rows-[220px]', '1:1': 'auto-rows-[240px]' }
    };

    return baseHeights[appearanceSettings.cardSize][appearanceSettings.aspectRatio];
  };

  const totalSize = sortedAssets.reduce((acc, asset) => {
    const sizeNum = parseFloat(asset.size.split(' ')[0]);
    return acc + sizeNum;
  }, 0);

  return (
    <div className="flex-1 bg-[#1f2029] flex flex-col">
      {/* Controls Bar */}
      <div className="bg-[#1f2029] px-6 py-4 border-b border-[#373a4b]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1">
              {/* Appearance Popover */}
              <AppearancePopover
                settings={appearanceSettings}
                onSettingsChange={setAppearanceSettings}
              />

              {/* Sort Popover */}
              <SortPopover
                settings={sortSettings}
                onSettingsChange={setSortSettings}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search in Key Scenes"
                className="bg-[#292b36] rounded-md pl-10 pr-4 py-2 text-sm text-gray-300 placeholder-gray-400 border border-[#373a4b] focus:ring-2 focus:ring-blue-500 w-60"
              />
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 bg-gray-300 rounded-full border-2 border-[#1f2029]"></div>
                <div className="w-7 h-7 bg-gray-300 rounded-full border-2 border-[#1f2029]"></div>
                <div className="w-7 h-7 bg-gray-300 rounded-full border-2 border-[#1f2029]"></div>
              </div>
              <div className="bg-indigo-500 rounded-full w-7 h-7 flex items-center justify-center text-white text-xs font-medium">
                36
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 mt-4">
          <ChevronDown className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-white">{sortedAssets.length} Assets</span>
          <span className="text-sm text-gray-400">•</span>
          <span className="text-sm text-gray-400">{totalSize.toFixed(0)} GB</span>
        </div>
      </div>

      {/* Dynamic Grid/List/Gallery */}
      <div className="flex-1 p-4 overflow-y-auto">
        {viewMode === 'gallery' ? (
          // Masonry Gallery Layout
          <div className={`${getGridColumns()} gap-3`}>
            {sortedAssets.map((asset) => (
              <div key={asset.id} className="break-inside-avoid mb-3">
                <AssetCard
                  asset={asset}
                  isSelected={selectedAssets.some(a => a.id === asset.id)}
                  onSelect={(isSelected) => onAssetSelect(asset, isSelected)}
                  onPreview={() => onAssetPreview(asset)}
                  onDetail={() => onAssetDetail(asset)}
                  appearanceSettings={appearanceSettings}
                />
              </div>
            ))}
          </div>
        ) : viewMode === 'list' ? (
          // List Layout
          <div className="space-y-2">
            {sortedAssets.map((asset) => (
              <div key={asset.id} className="bg-[#292b36] rounded-lg p-4 border border-[#373a4b]">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={asset.thumbnail}
                      alt={asset.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-white truncate">{asset.name}</h3>
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        {asset.duration && <span>{asset.duration}</span>}
                        <span>{asset.size}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{asset.type}</span>
                      <span>{asset.uploader}</span>
                      <span>{asset.uploadDate}</span>
                      {asset.comments > 0 && <span>{asset.comments} comments</span>}
                    </div>
                    {asset.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {asset.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedAssets.some(a => a.id === asset.id)}
                      onChange={(e) => onAssetSelect(asset, e.target.checked)}
                      className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Grid Layout
          <div className={`grid ${getGridColumns()} ${getRowHeight()} gap-3`}>
            {sortedAssets.map((asset, index) => (
              <div
                key={asset.id}
                className={`row-span-${rowSpans[index]}`}
                style={{ gridRowEnd: `span ${rowSpans[index]}` }}
              >
                <AssetCard
                  asset={asset}
                  isSelected={selectedAssets.some(a => a.id === asset.id)}
                  onSelect={(isSelected) => onAssetSelect(asset, isSelected)}
                  onPreview={() => onAssetPreview(asset)}
                  onDetail={() => onAssetDetail(asset)}
                  appearanceSettings={appearanceSettings}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
