import { useState, useEffect, useMemo } from 'react';

import { Sparkles, Hash, Loader2, Check, Plus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger, Button, Input, Badge } from '@filehunt/shared-ts/ui';
import { type Asset } from "@filehunt/shared-ts/types";

interface TagSuggestionPopoverProps {
  asset: Asset;
  onTagAdd: (tag: string) => void;
  trigger: React.ReactNode;
  existingTags: string[];
}

export function TagSuggestionPopover({ asset, onTagAdd, trigger, existingTags }: TagSuggestionPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [isAutoTagging, setIsAutoTagging] = useState(false);

  // Memoize suggestions to prevent infinite re-renders
  const suggestions = useMemo(() => {
    const baseSuggestions = {
      image: ['photo', 'visual', 'graphic', 'design', 'artwork', 'picture', 'visual-content'],
      video: ['video', 'motion', 'animation', 'clip', 'footage', 'multimedia', 'moving-image'],
      audio: ['audio', 'sound', 'music', 'voice', 'recording', 'soundtrack', 'sound-design'],
      document: ['document', 'text', 'report', 'file', 'written', 'content', 'documentation']
    };

    const contentSuggestions = [
      'brand', 'marketing', 'social-media', 'campaign', 'product', 'hero', 'banner',
      'logo', 'identity', 'corporate', 'promotional', 'announcement', 'event',
      'web', 'mobile', 'print', 'digital', 'final', 'draft', 'approved',
      'high-quality', 'professional', 'creative', 'artistic', 'commercial'
    ];

    const typeSuggestions = baseSuggestions[asset.type] || [];

    // Add suggestions based on asset name
    const nameSuggestions: string[] = [];
    const name = asset.name.toLowerCase();
    if (name.includes('logo')) nameSuggestions.push('logo', 'branding', 'identity');
    if (name.includes('hero')) nameSuggestions.push('hero', 'banner', 'featured');
    if (name.includes('social')) nameSuggestions.push('social-media', 'social', 'platform');
    if (name.includes('campaign')) nameSuggestions.push('campaign', 'marketing', 'promotional');
    if (name.includes('product')) nameSuggestions.push('product', 'catalog', 'showcase');

    return [...new Set([...typeSuggestions, ...nameSuggestions, ...contentSuggestions])]
      .filter(tag => !existingTags.includes(tag))
      .slice(0, 12);
  }, [asset.type, asset.name, existingTags]);

  // Memoize filtered suggestions to prevent unnecessary re-renders
  const filteredSuggestions = useMemo(() => {
    if (newTag.trim()) {
      return suggestions.filter(tag =>
        tag.toLowerCase().includes(newTag.toLowerCase()) &&
        !existingTags.includes(tag)
      );
    }
    return suggestions;
  }, [newTag, suggestions, existingTags]);

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !existingTags.includes(tag.trim())) {
      onTagAdd(tag.trim());
      setNewTag('');
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      handleAddTag(newTag);
    }
  };

  const handleAutoTag = async () => {
    setIsAutoTagging(true);

    // Mock AI auto-tagging with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock AI suggested tags based on asset analysis
    const aiSuggestions = [
      'ai-generated',
      'high-resolution',
      'professional',
      asset.type === 'image' ? 'photography' : `${asset.type}-content`,
      'ready-to-use'
    ].filter(tag => !existingTags.includes(tag));

    // Add AI suggested tags
    aiSuggestions.forEach((tag, index) => {
      setTimeout(() => onTagAdd(tag), index * 200);
    });

    setIsAutoTagging(false);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-[#2a2d3a] border-[#3a3d4a]" align="start">
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Hash className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-white font-medium">Add Tags</span>
            </div>
            <Button
              onClick={handleAutoTag}
              disabled={isAutoTagging}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5 h-auto"
            >
              {isAutoTagging ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  AI Tagging...
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 mr-1" />
                  Auto Tag
                </>
              )}
            </Button>
          </div>

          {/* Input */}
          <div className="space-y-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a new tag..."
              className="bg-[#1a1d29] border-[#373a4b] text-white placeholder-gray-400 text-sm"
              autoFocus
            />
            {newTag.trim() && (
              <Button
                onClick={() => handleAddTag(newTag)}
                size="sm"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 h-auto"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add "{newTag}"
              </Button>
            )}
          </div>

          {/* Suggested Tags */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Suggested for this {asset.type}</span>
              <span className="text-xs text-gray-500">{filteredSuggestions.length} suggestions</span>
            </div>

            {filteredSuggestions.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {filteredSuggestions.map((tag) => (
                  <Button
                    key={tag}
                    onClick={() => handleAddTag(tag)}
                    variant="ghost"
                    size="sm"
                    className="text-left justify-start p-2 h-auto text-xs text-gray-300 hover:text-white hover:bg-[#3a3d4a] border border-transparent hover:border-[#4a4d5a]"
                  >
                    <div className="flex items-center space-x-2 w-full">
                      <Hash className="w-3 h-3 text-gray-500 flex-shrink-0" />
                      <span className="truncate">{tag}</span>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <span className="text-xs text-gray-500">No suggestions available</span>
              </div>
            )}
          </div>

          {/* Popular Tags */}
          <div className="space-y-2 border-t border-[#373a4b] pt-3">
            <span className="text-xs text-gray-400">Popular tags</span>
            <div className="flex flex-wrap gap-1">
              {['approved', 'final', 'ready', 'high-quality', 'featured'].map((tag) => (
                !existingTags.includes(tag) && (
                  <Badge
                    key={tag}
                    onClick={() => handleAddTag(tag)}
                    className="bg-[#373a4b] text-gray-300 hover:bg-[#4a4d5a] hover:text-white cursor-pointer text-xs px-2 py-1 border border-transparent hover:border-[#5a5d6a]"
                  >
                    {tag}
                  </Badge>
                )
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="text-xs text-gray-500 space-y-1 border-t border-[#373a4b] pt-3">
            <p>💡 <strong>Tip:</strong> Use descriptive tags to make assets easier to find</p>
            <p>🤖 <strong>AI:</strong> Auto Tag analyzes your asset to suggest relevant tags</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
