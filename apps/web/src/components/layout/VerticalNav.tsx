import {
  LayoutGrid, Search, Upload, FolderOpen, GitBranch, Star,
  Settings, HelpCircle, Activity
} from 'lucide-react';

interface VerticalNavProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function VerticalNav({ currentView, onViewChange }: VerticalNavProps) {
  const navItems = [
    { id: 'main', icon: LayoutGrid, label: 'Assets' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'upload', icon: Upload, label: 'Upload' },
    { id: 'collections', icon: FolderOpen, label: 'Collections' },
    { id: 'branches', icon: GitBranch, label: 'Branches' },
    { id: 'activities', icon: Activity, label: 'Activities' },
    { id: 'favorites', icon: Star, label: 'Favorites' },
  ];

  const bottomNavItems = [
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'help', icon: HelpCircle, label: 'Help & Support' },
  ];

  return (
    <div className="w-14 bg-[#1a1d29] border-r border-[#373a4b] flex flex-col justify-between py-4 flex-shrink-0">
      {/* Main Navigation Items */}
      <div className="flex flex-col space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-10 h-10 mx-auto flex items-center justify-center rounded-lg transition-colors group relative ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-[#2a2d3a]'
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5" />

              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Navigation Items */}
      <div className="flex flex-col space-y-2">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-10 h-10 mx-auto flex items-center justify-center rounded-lg transition-colors group relative ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-[#2a2d3a]'
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5" />

              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
