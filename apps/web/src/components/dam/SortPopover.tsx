import { useState } from 'react';

import { Image as ImageIcon, ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger, Button } from '@filehunt/shared-ts/ui';

interface SortSettings {
  field: 'date-uploaded' | 'name' | 'size' | 'type' | 'uploader' | 'comments';
  direction: 'asc' | 'desc';
}

interface SortPopoverProps {
  settings: SortSettings;
  onSettingsChange: (settings: SortSettings) => void;
}

export function SortPopover({ settings, onSettingsChange }: SortPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateSetting = <K extends keyof SortSettings>(
    key: K,
    value: SortSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const sortOptions = [
    { value: 'date-uploaded', label: 'Date Uploaded' },
    { value: 'name', label: 'Name' },
    { value: 'size', label: 'File Size' },
    { value: 'type', label: 'File Type' },
    { value: 'uploader', label: 'Uploader' },
    { value: 'comments', label: 'Comments' }
  ];

  const getFieldLabel = () => {
    return sortOptions.find(opt => opt.value === settings.field)?.label || 'Date Uploaded';
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-[#373a4b] px-3 py-2 h-8 flex items-center"
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">Sorted by</span>
          <span className="text-sm text-gray-400 ml-1">{getFieldLabel()}</span>
          <ChevronDown className="w-3 h-3 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-0 bg-[#2a2d3a] border-[#3a3d4a]"
        align="start"
        side="bottom"
        sideOffset={8}
      >
        <div className="p-4 space-y-4">
          <h4 className="text-white font-medium text-sm">Sort Assets</h4>

          {/* Sort Field Options */}
          <div className="space-y-1">
            {sortOptions.map((option) => (
              <Button
                key={option.value}
                variant="ghost"
                size="sm"
                onClick={() => updateSetting('field', option.value as SortSettings['field'])}
                className={`w-full justify-start h-8 px-3 flex items-center ${
                  settings.field === option.value
                    ? 'bg-blue-600/20 text-blue-300 hover:bg-blue-600/30'
                    : 'text-gray-300 hover:bg-[#3a3d4a] hover:text-white'
                }`}
              >
                <span className="text-sm flex-1 text-left">{option.label}</span>
                {settings.field === option.value && (
                  <div className="ml-2">
                    {settings.direction === 'asc' ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    )}
                  </div>
                )}
              </Button>
            ))}
          </div>

          {/* Sort Direction */}
          <div className="pt-3 border-t border-[#3a3d4a] space-y-3">
            <h5 className="text-white text-sm">Direction</h5>
            <div className="flex space-x-2">
              <Button
                variant={settings.direction === 'asc' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateSetting('direction', 'asc')}
                className={`flex-1 h-8 flex items-center justify-center ${
                  settings.direction === 'asc'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                    : 'bg-transparent border-[#3a3d4a] text-gray-300 hover:bg-[#3a3d4a] hover:text-white'
                }`}
              >
                <ArrowUp className="w-3 h-3 mr-1" />
                <span className="text-sm font-medium">Ascending</span>
              </Button>
              <Button
                variant={settings.direction === 'desc' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateSetting('direction', 'desc')}
                className={`flex-1 h-8 flex items-center justify-center ${
                  settings.direction === 'desc'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                    : 'bg-transparent border-[#3a3d4a] text-gray-300 hover:bg-[#3a3d4a] hover:text-white'
                }`}
              >
                <ArrowDown className="w-3 h-3 mr-1" />
                <span className="text-sm font-medium">Descending</span>
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
