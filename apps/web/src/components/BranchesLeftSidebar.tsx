import { GitBranch, GitCommit, Plus, Search, Filter, Tag, User, Calendar } from 'lucide-react';
import { Input, Button, Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../shared';
import { type Branch } from '@shared-ts/types';

interface BranchesLeftSidebarProps {
  branches: Branch[];
  selectedBranch: Branch;
  onBranchSelect: (branch: Branch) => void;
}

export function BranchesLeftSidebar({ branches, selectedBranch, onBranchSelect }: BranchesLeftSidebarProps) {
  const branchTypes = [
    { name: 'All Branches', count: branches.length, filter: 'all' },
    { name: 'Main', count: branches.filter(b => b.name === 'main').length, filter: 'main' },
    { name: 'Feature', count: branches.filter(b => b.name.startsWith('feature/')).length, filter: 'feature' },
    { name: 'Hotfix', count: branches.filter(b => b.name.startsWith('hotfix/')).length, filter: 'hotfix' },
    { name: 'Release', count: branches.filter(b => b.name.startsWith('release/')).length, filter: 'release' },
  ];

  const recentBranches = branches.slice(0, 5);

  const getBranchTypeColor = (name: string) => {
    if (name === 'main') return 'bg-green-500/20 text-green-300';
    if (name.startsWith('feature/')) return 'bg-blue-500/20 text-blue-300';
    if (name.startsWith('hotfix/')) return 'bg-red-500/20 text-red-300';
    if (name.startsWith('release/')) return 'bg-purple-500/20 text-purple-300';
    return 'bg-gray-500/20 text-gray-300';
  };

  return (
    <div className="w-[240px] bg-[#292b36] border-r border-[#373a4b] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#373a4b]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-medium flex items-center">
            <GitBranch className="w-4 h-4 mr-2" />
            Branches
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white h-6 w-6 p-0"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search branches..."
            className="bg-[#373a4b] border-[#434656] text-white pl-10 text-sm"
          />
        </div>
      </div>

      {/* Branch Types */}
      <div className="p-4 border-b border-[#373a4b]">
        <h3 className="text-white text-sm font-medium mb-3">Branch Types</h3>
        <div className="space-y-1">
          {branchTypes.map(type => (
            <button
              key={type.filter}
              className="w-full flex items-center justify-between text-left p-2 rounded hover:bg-[#373a4b] transition-colors"
            >
              <div className="flex items-center space-x-2">
                <GitBranch className="w-3 h-3 text-gray-400" />
                <span className="text-gray-300 text-sm">{type.name}</span>
              </div>
              <Badge variant="secondary" className="bg-[#373a4b] text-gray-400 text-xs">
                {type.count}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Branches */}
      <div className="p-4 border-b border-[#373a4b]">
        <h3 className="text-white text-sm font-medium mb-3">Recent</h3>
        <div className="space-y-1">
          {recentBranches.map(branch => (
            <button
              key={branch.id}
              onClick={() => onBranchSelect(branch)}
              className={`w-full text-left p-2 rounded transition-colors ${
                selectedBranch?.id === branch.id
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'hover:bg-[#373a4b] text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <GitBranch className="w-3 h-3" />
                <span className="text-sm truncate">{branch.name}</span>
                {branch.isDefault && (
                  <Badge variant="secondary" className="bg-green-500/20 text-green-300 text-xs h-3 px-1">
                    default
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{branch.assetCount} assets</span>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  {branch.commitsAhead > 0 && (
                    <span className="text-green-400">+{branch.commitsAhead}</span>
                  )}
                  {branch.commitsBehind > 0 && (
                    <span className="text-red-400">-{branch.commitsBehind}</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-[#373a4b]">
        <h3 className="text-white text-sm font-medium mb-3 flex items-center">
          <Filter className="w-3 h-3 mr-2" />
          Filters
        </h3>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Author</label>
            <Select>
              <SelectTrigger className="bg-[#373a4b] border-[#434656] text-white text-xs">
                <SelectValue placeholder="All authors" />
              </SelectTrigger>
              <SelectContent className="bg-[#373a4b] border-[#434656] text-white">
                <SelectItem value="all">All authors</SelectItem>
                <SelectItem value="me">My branches</SelectItem>
                <SelectItem value="john">John Smith</SelectItem>
                <SelectItem value="sarah">Sarah Wilson</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Status</label>
            <Select>
              <SelectTrigger className="bg-[#373a4b] border-[#434656] text-white text-xs">
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent className="bg-[#373a4b] border-[#434656] text-white">
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="merged">Merged</SelectItem>
                <SelectItem value="stale">Stale</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4">
        <h3 className="text-white text-sm font-medium mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#373a4b] text-sm"
          >
            <Plus className="w-3 h-3 mr-2" />
            New Branch
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#373a4b] text-sm"
          >
            <GitCommit className="w-3 h-3 mr-2" />
            View Commits
          </Button>
        </div>
      </div>
    </div>
  );
}
