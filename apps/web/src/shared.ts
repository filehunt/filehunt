// Re-export shared components using @shared-ts alias for cleaner imports
// This allows local components to import UI components with shorter paths

// UI Components
export { Alert, AlertDescription, AlertTitle } from '@filehunt/shared-ts';
export { Button } from '@filehunt/shared-ts';
export { Badge } from '@filehunt/shared-ts';
export { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@filehunt/shared-ts';
export { Input } from '@filehunt/shared-ts';
export { Label } from '@filehunt/shared-ts';
export { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@filehunt/shared-ts';
export { Popover, PopoverContent, PopoverTrigger } from '@filehunt/shared-ts';
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@filehunt/shared-ts';
export { Tabs, TabsContent, TabsList, TabsTrigger } from '@filehunt/shared-ts';
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@filehunt/shared-ts';
export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@filehunt/shared-ts';
export { Avatar, AvatarFallback, AvatarImage } from '@filehunt/shared-ts';
export { Switch } from '@filehunt/shared-ts';
export { Slider } from '@filehunt/shared-ts';
export { Progress } from '@filehunt/shared-ts';
export { Separator } from '@filehunt/shared-ts';
export { ScrollArea } from '@filehunt/shared-ts';
export { Checkbox } from '@filehunt/shared-ts';
export { RadioGroup, RadioGroupItem } from '@filehunt/shared-ts';
export { Textarea } from '@filehunt/shared-ts';
export { Toggle } from '@filehunt/shared-ts';
export { ToggleGroup, ToggleGroupItem } from '@filehunt/shared-ts';
export { DatePickerWithRange } from '@filehunt/shared-ts';

// Local components - import from local paths since they were moved to apps/web
export { AssetCard } from './components/dam/AssetCard';
export { AppearancePopover } from './components/dam/AppearancePopover';
export { SortPopover } from './components/dam/SortPopover';
export { FieldsPopover } from './components/dam/FieldsPopover';
export { NewFolderDialog } from './components/dam/NewFolderDialog';
export { SelectionBar } from './components/dam/SelectionBar';
export { TagSuggestionPopover } from './components/dam/TagSuggestionPopover';
export { AssetDetailSidebar } from './components/AssetDetailSidebar';

// Common components from shared-ts
export { ImageWithFallback } from '@filehunt/shared-ts';

// Types
export type { Asset, Collection, Branch, User, Tag, TimelineCommit, UploadFile, SearchFilters } from '@filehunt/shared-ts/types';

// Hooks and Utils
export * from '@filehunt/shared-ts/hooks';
export * from '@filehunt/shared-ts/utils';
