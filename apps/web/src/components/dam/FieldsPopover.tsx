import { useState } from 'react';

import { Star, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger, Button, Switch } from '../../shared';

interface FieldsSettings {
  view: 'compact' | 'detailed' | 'minimal';
  showTags: boolean;
  showUploader: boolean;
  showSize: boolean;
  showDate: boolean;
  showDuration: boolean;
  showComments: boolean;
}

interface FieldsPopoverProps {
  settings: FieldsSettings;
  onSettingsChange: (settings: FieldsSettings) => void;
}

export function FieldsPopover({ settings, onSettingsChange }: FieldsPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateSetting = <K extends keyof FieldsSettings>(
    key: K,
    value: FieldsSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const viewOptions = [
    { value: 'minimal', label: 'Minimal' },
    { value: 'compact', label: 'Compact' },
    { value: 'detailed', label: 'Detailed' }
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-[#373a4b] px-3 py-2 h-8 flex items-center"
        >
          <Star className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">Fields</span>
          <span className="text-sm text-gray-400 ml-1">{settings.view}</span>
          <ChevronDown className="w-3 h-3 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 p-0 bg-[#2a2d3a] border-[#3a3d4a]"
        align="start"
        side="bottom"
        sideOffset={8}
      >
        <div className="p-4 space-y-5">
          <h4 className="text-white font-medium text-sm">Field Settings</h4>

          {/* View Mode */}
          <div className="space-y-3">
            <h5 className="text-white text-sm">View Mode</h5>
            <div className="flex space-x-2">
              {viewOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={settings.view === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateSetting('view', option.value as FieldsSettings['view'])}
                  className={`flex-1 h-8 flex items-center justify-center ${
                    settings.view === option.value
                      ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                      : 'bg-transparent border-[#3a3d4a] text-gray-300 hover:bg-[#3a3d4a] hover:text-white'
                  }`}
                >
                  <span className="text-sm font-medium">{option.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Field Visibility */}
          <div className="space-y-3">
            <h5 className="text-white text-sm">Visible Fields</h5>

            <div className="space-y-3">
              {[
                { key: 'showTags', label: 'Tags' },
                { key: 'showUploader', label: 'Uploader' },
                { key: 'showSize', label: 'File Size' },
                { key: 'showDate', label: 'Upload Date' },
                { key: 'showDuration', label: 'Duration' },
                { key: 'showComments', label: 'Comments' }
              ].map((field) => (
                <div key={field.key} className="flex items-center justify-between py-1">
                  <label className="text-white text-sm">{field.label}</label>
                  <Switch
                    checked={settings[field.key as keyof FieldsSettings] as boolean}
                    onCheckedChange={(checked) => updateSetting(field.key as keyof FieldsSettings, checked)}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Presets */}
          <div className="pt-3 border-t border-[#3a3d4a] space-y-3">
            <h5 className="text-white text-sm">Quick Presets</h5>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSettingsChange({
                  view: 'minimal',
                  showTags: false,
                  showUploader: false,
                  showSize: false,
                  showDate: false,
                  showDuration: true,
                  showComments: true
                })}
                className="w-full bg-transparent border-[#3a3d4a] text-gray-300 hover:bg-[#3a3d4a] hover:text-white h-8 flex items-center justify-center"
              >
                <span className="text-sm font-medium">Clean View</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSettingsChange({
                  view: 'detailed',
                  showTags: true,
                  showUploader: true,
                  showSize: true,
                  showDate: true,
                  showDuration: true,
                  showComments: true
                })}
                className="w-full bg-transparent border-[#3a3d4a] text-gray-300 hover:bg-[#3a3d4a] hover:text-white h-8 flex items-center justify-center"
              >
                <span className="text-sm font-medium">Show All</span>
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
