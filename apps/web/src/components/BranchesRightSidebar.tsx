import { GitBranch, GitCommit, GitMerge, User, Calendar, Tag, Eye, Download, Share2 } from 'lucide-react';
import { Badge, Button, Avatar, AvatarImage, AvatarFallback } from '../shared';
import { type Branch } from '@shared-ts/types';

interface BranchesRightSidebarProps {
  selectedBranch: Branch | null;
}

export function BranchesRightSidebar({ selectedBranch }: BranchesRightSidebarProps) {
  if (!selectedBranch) {
    return (
      <div className="w-80 bg-[#292b36] border-l border-[#373a4b] flex items-center justify-center">
        <div className="text-center p-4">
          <GitBranch className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <div className="text-gray-400 text-sm">Select a branch to view details</div>
        </div>
      </div>
    );
  }

  const getBranchTypeColor = (name: string) => {
    if (name === 'main') return 'bg-green-500/20 text-green-300';
    if (name.startsWith('feature/')) return 'bg-blue-500/20 text-blue-300';
    if (name.startsWith('hotfix/')) return 'bg-red-500/20 text-red-300';
    if (name.startsWith('release/')) return 'bg-purple-500/20 text-purple-300';
    return 'bg-gray-500/20 text-gray-300';
  };

  const getBranchType = (name: string) => {
    if (name === 'main') return 'main';
    if (name.startsWith('feature/')) return 'feature';
    if (name.startsWith('hotfix/')) return 'hotfix';
    if (name.startsWith('release/')) return 'release';
    return 'branch';
  };

  const recentCommits = [
    {
      id: '1',
      hash: 'a1b2c3d',
      message: 'Update hero banner with new design',
      author: 'Sarah Wilson',
      timestamp: '2 hours ago',
      changes: { added: 3, modified: 1, deleted: 0 }
    },
    {
      id: '2',
      hash: 'e4f5g6h',
      message: 'Fix alignment issues in mobile view',
      author: 'Mike Chen',
      timestamp: '1 day ago',
      changes: { added: 0, modified: 2, deleted: 1 }
    },
    {
      id: '3',
      hash: 'i7j8k9l',
      message: 'Add social media templates',
      author: 'John Smith',
      timestamp: '2 days ago',
      changes: { added: 5, modified: 0, deleted: 0 }
    }
  ];

  return (
    <div className="w-80 bg-[#292b36] border-l border-[#373a4b] flex flex-col">
      {/* Branch Header */}
      <div className="p-4 border-b border-[#373a4b]">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <GitBranch className="w-4 h-4 text-gray-400" />
              <h3 className="text-white font-medium">{selectedBranch.name}</h3>
            </div>

            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="secondary" className={`${getBranchTypeColor(selectedBranch.name)} text-xs`}>
                {getBranchType(selectedBranch.name)}
              </Badge>
              {selectedBranch.isDefault && (
                <Badge variant="secondary" className="bg-green-500/20 text-green-300 text-xs">
                  default
                </Badge>
              )}
              {selectedBranch.isProtected && (
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 text-xs">
                  protected
                </Badge>
              )}
            </div>
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-3">
          {selectedBranch.description || 'No description available'}
        </p>

        <div className="flex items-center space-x-4 text-xs text-gray-400">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Created {selectedBranch.createdAt}</span>
          </div>
        </div>
      </div>

      {/* Branch Stats */}
      <div className="p-4 border-b border-[#373a4b]">
        <h4 className="text-white text-sm font-medium mb-3">Statistics</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#373a4b] rounded-lg p-3 text-center">
            <div className="text-lg font-medium text-white">{selectedBranch.assetCount}</div>
            <div className="text-xs text-gray-400">Assets</div>
          </div>
          <div className="bg-[#373a4b] rounded-lg p-3 text-center">
            <div className="text-lg font-medium text-blue-400">{selectedBranch.commitsAhead}</div>
            <div className="text-xs text-gray-400">Ahead</div>
          </div>
        </div>

        {!selectedBranch.isDefault && (
          <div className="mt-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Compared to main:</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              {selectedBranch.commitsAhead > 0 && (
                <span className="text-green-400 text-xs">+{selectedBranch.commitsAhead} commits</span>
              )}
              {selectedBranch.commitsBehind > 0 && (
                <span className="text-red-400 text-xs">-{selectedBranch.commitsBehind} behind</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Creator */}
      <div className="p-4 border-b border-[#373a4b]">
        <h4 className="text-white text-sm font-medium mb-3">Created By</h4>
        <div className="flex items-center space-x-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={selectedBranch.createdBy?.avatar} />
            <AvatarFallback className="bg-blue-500 text-white text-xs">
              {selectedBranch.createdBy?.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="text-white text-sm">{selectedBranch.createdBy?.name}</div>
            <div className="text-gray-400 text-xs">{selectedBranch.createdAt}</div>
          </div>
        </div>
      </div>

      {/* Last Commit */}
      <div className="p-4 border-b border-[#373a4b]">
        <h4 className="text-white text-sm font-medium mb-3">Last Commit</h4>
        <div className="bg-[#373a4b] rounded-lg p-3">
          <div className="flex items-start space-x-2 mb-2">
            <GitCommit className="w-3 h-3 text-gray-400 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm">{selectedBranch.lastCommit?.message}</div>
              <div className="flex items-center space-x-2 mt-1">
                <span className="font-mono text-xs bg-[#292b36] px-1.5 py-0.5 rounded text-gray-300">
                  {selectedBranch.lastCommit?.hash}
                </span>
                <span className="text-gray-400 text-xs">{selectedBranch.lastCommit?.timestamp}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Avatar className="w-4 h-4">
              <AvatarImage src={selectedBranch.lastCommit?.author.avatar} />
              <AvatarFallback className="bg-green-500 text-white text-xs">
                {selectedBranch.lastCommit?.author.name.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-gray-300 text-xs">{selectedBranch.lastCommit?.author.name}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-b border-[#373a4b]">
        <h4 className="text-white text-sm font-medium mb-3">Actions</h4>
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#373a4b] text-sm"
          >
            <Eye className="w-3 h-3 mr-2" />
            View Assets
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#373a4b] text-sm"
          >
            <GitCommit className="w-3 h-3 mr-2" />
            View Commits
          </Button>
          {!selectedBranch.isDefault && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#373a4b] text-sm"
            >
              <GitMerge className="w-3 h-3 mr-2" />
              Merge to Main
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#373a4b] text-sm"
          >
            <Download className="w-3 h-3 mr-2" />
            Download Branch
          </Button>
        </div>
      </div>

      {/* Recent Commits */}
      <div className="flex-1 p-4">
        <h4 className="text-white text-sm font-medium mb-3">Recent Commits</h4>
        <div className="space-y-3">
          {recentCommits.map((commit) => (
            <div key={commit.id} className="bg-[#373a4b] rounded-lg p-2">
              <div className="text-white text-xs mb-1">{commit.message}</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <span className="font-mono text-xs text-gray-400">{commit.hash}</span>
                  <span className="text-gray-400 text-xs">•</span>
                  <span className="text-gray-400 text-xs">{commit.author}</span>
                </div>
                <span className="text-gray-500 text-xs">{commit.timestamp}</span>
              </div>
              <div className="flex items-center space-x-2 mt-1 text-xs">
                {commit.changes.added > 0 && (
                  <span className="text-green-400">+{commit.changes.added}</span>
                )}
                {commit.changes.modified > 0 && (
                  <span className="text-yellow-400">~{commit.changes.modified}</span>
                )}
                {commit.changes.deleted > 0 && (
                  <span className="text-red-400">-{commit.changes.deleted}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
