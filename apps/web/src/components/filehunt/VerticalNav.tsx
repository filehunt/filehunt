"use client";

import {
  LayoutGrid,
  Search,
  Upload,
  FolderOpen,
  GitBranch,
  Star,
  Settings,
  HelpCircle,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/button';

export type AppView = 'main' | 'upload' | 'search' | 'collections' | 'branches' | 'favorites' | 'settings' | 'help' | 'activities' | 'asset-detail';

interface VerticalNavProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
}

export function VerticalNav({ currentView, onViewChange }: VerticalNavProps) {
  const navItems = [
    { id: 'main' as AppView, icon: LayoutGrid, label: 'Assets' },
    { id: 'search' as AppView, icon: Search, label: 'Search' },
    { id: 'upload' as AppView, icon: Upload, label: 'Upload' },
    { id: 'collections' as AppView, icon: FolderOpen, label: 'Collections' },
    { id: 'branches' as AppView, icon: GitBranch, label: 'Branches' },
    { id: 'activities' as AppView, icon: Activity, label: 'Activities' },
    { id: 'favorites' as AppView, icon: Star, label: 'Favorites' },
  ];

  const bottomNavItems = [
    { id: 'settings' as AppView, icon: Settings, label: 'Settings' },
    { id: 'help' as AppView, icon: HelpCircle, label: 'Help & Support' },
  ];

  const NavButton = ({ item }: { item: typeof navItems[0] }) => {
    const Icon = item.icon;
    const isActive = currentView === item.id;

    return (
      <div className="relative group">
        <Button
          variant={isActive ? "default" : "ghost"}
          size="icon"
          onClick={() => onViewChange(item.id)}
          className={cn(
            "w-10 h-10 transition-all duration-200",
            isActive
              ? "bg-primary text-primary-foreground shadow-lg"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
        >
          <Icon className="w-5 h-5" />
        </Button>

        {/* Tooltip */}
        <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[99999]">
          {item.label}
          <div className="absolute left-[-4px] top-1/2 transform -translate-y-1/2 w-2 h-2 bg-popover rotate-45" />
        </div>
      </div>
    );
  };

  return (
    <div className="w-14 flex flex-col justify-between pt-3 pb-4 flex-shrink-0 relative z-[200]" style={{ backgroundColor: 'transparent' }}>
      {/* Main Navigation Items */}
      <div className="flex flex-col space-y-2 items-center">
        {navItems.map((item) => (
          <NavButton key={item.id} item={item} />
        ))}
      </div>

      {/* Bottom Navigation Items */}
      <div className="flex flex-col space-y-2 items-center">
        {bottomNavItems.map((item) => (
          <NavButton key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
