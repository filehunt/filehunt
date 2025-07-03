"use client";

import { useState } from 'react';
import { LayoutGrid, ChevronDown, Info } from 'lucide-react';
import { Button } from '@/components/button';
import { Badge } from '@/components/badge';
import { Switch } from '@/components/switch';

interface AppearanceSettings {
  cardSize: 'S' | 'M' | 'L';
  aspectRatio: 'masonry' | '16:9' | '4:3' | '1:1';
  thumbnailScale: 'fit' | 'fill';
  showCardInfo: boolean;
}

interface AppearancePopoverProps {
  settings: AppearanceSettings;
  onSettingsChange: (settings: AppearanceSettings) => void;
}

export function AppearancePopover({ settings, onSettingsChange }: AppearancePopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateSetting = <K extends keyof AppearanceSettings>(
    key: K,
    value: AppearanceSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="text-white hover:bg-muted px-3 py-2 h-8 flex items-center"
      >
        <LayoutGrid className="w-4 h-4 mr-2" />
        <span className="text-sm font-medium">Appearance</span>
        <ChevronDown className={`w-3 h-3 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <>
          <div onClick={() => setIsOpen(false)} className="fixed inset-0 z-10" />
          <div className="absolute top-full right-0 mt-1 z-20 w-80 bg-card border border-border rounded-lg shadow-lg">
            <div className="p-4 space-y-6">
              {/* Visibility Notice */}
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Info className="w-4 h-4" />
                <span>Visible to only you</span>
              </div>

              {/* Card Size */}
              <div className="space-y-3">
                <h4 className="text-white font-medium text-sm">Card Size</h4>
                <div className="flex space-x-2">
                  {['S', 'M', 'L'].map((size) => (
                    <Button
                      key={size}
                      variant={settings.cardSize === size ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateSetting('cardSize', size as 'S' | 'M' | 'L')}
                      className={`w-12 h-8 flex items-center justify-center ${
                        settings.cardSize === size
                          ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                          : 'bg-transparent border-muted text-gray-300 hover:bg-muted hover:text-white'
                      }`}
                    >
                      <span className="text-sm font-medium">{size}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-3">
                <h4 className="text-white font-medium text-sm">Aspect Ratio</h4>
                <div className="flex space-x-2">
                  {[
                    { value: 'masonry', icon: '⬚', label: 'Masonry' },
                    { value: '16:9', icon: '▭', label: 'Wide' },
                    { value: '4:3', icon: '▬', label: 'Standard' },
                    { value: '1:1', icon: '◼', label: 'Square' }
                  ].map((ratio) => (
                    <Button
                      key={ratio.value}
                      variant={settings.aspectRatio === ratio.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateSetting('aspectRatio', ratio.value as 'masonry' | '16:9' | '4:3' | '1:1')}
                      className={`flex-1 h-12 flex flex-col items-center justify-center ${
                        settings.aspectRatio === ratio.value
                          ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                          : 'bg-transparent border-muted text-gray-300 hover:bg-muted hover:text-white'
                      }`}
                    >
                      <span className="text-lg leading-none mb-1">{ratio.icon}</span>
                      <span className="text-xs leading-none">{ratio.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Thumbnail Scale */}
              <div className="space-y-3">
                <h4 className="text-white font-medium text-sm">Thumbnail Scale</h4>
                <div className="flex space-x-2">
                  {['Fit', 'Fill'].map((scale) => (
                    <Button
                      key={scale}
                      variant={settings.thumbnailScale === scale.toLowerCase() ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateSetting('thumbnailScale', scale.toLowerCase() as 'fit' | 'fill')}
                      className={`flex-1 h-8 flex items-center justify-center ${
                        settings.thumbnailScale === scale.toLowerCase()
                          ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                          : 'bg-transparent border-muted text-gray-300 hover:bg-muted hover:text-white'
                      }`}
                    >
                      <span className="text-sm font-medium">{scale}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Show Card Info */}
              <div className="flex items-center justify-between py-1">
                <h4 className="text-white font-medium text-sm">Show Card Info</h4>
                <Switch
                  checked={settings.showCardInfo}
                  onCheckedChange={(checked) => updateSetting('showCardInfo', checked)}
                />
              </div>

              {/* Version Info */}
              <div className="pt-3 border-t border-border">
                <div className="text-xs text-gray-500 space-y-1">
                  <p>💡 <span className="text-blue-400">Tip:</span> These settings are saved per user</p>
                  <p>🎨 <span className="text-purple-400">Design:</span> Customize your viewing experience</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
