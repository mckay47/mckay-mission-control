import { useState } from 'react';
import { FolderOpen, FolderClosed, File, ChevronRight, ChevronDown } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { folderTree } from '../../data/dummy';
import type { FolderNode } from '../../data/types';

interface TreeNodeProps {
  node: FolderNode;
  depth: number;
}

function TreeNode({ node, depth }: TreeNodeProps) {
  const [isOpen, setIsOpen] = useState(depth < 2);

  const isFolder = node.type === 'folder';
  const hasChildren = isFolder && node.children && node.children.length > 0;

  return (
    <div>
      <button
        onClick={() => isFolder && setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 w-full text-left py-1 px-1.5 rounded hover:bg-white/5 transition-colors ${
          isFolder ? 'cursor-pointer' : 'cursor-default'
        }`}
        style={{ paddingLeft: `${depth * 16 + 4}px` }}
      >
        {/* Expand/collapse chevron */}
        {hasChildren ? (
          isOpen ? (
            <ChevronDown className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
          )
        ) : (
          <span className="w-3.5 flex-shrink-0" />
        )}

        {/* Icon */}
        {isFolder ? (
          isOpen ? (
            <FolderOpen className="w-4 h-4 text-neon-cyan flex-shrink-0" />
          ) : (
            <FolderClosed className="w-4 h-4 text-neon-cyan/60 flex-shrink-0" />
          )
        ) : (
          <File className="w-4 h-4 text-text-muted flex-shrink-0" />
        )}

        {/* Name */}
        <span
          className={`text-sm ${
            isFolder ? 'text-text-primary font-medium' : 'text-text-secondary'
          }`}
        >
          {node.name}
        </span>
      </button>

      {/* Children */}
      {isOpen && hasChildren && (
        <div>
          {node.children!.map((child, i) => (
            <TreeNode key={`${child.name}-${i}`} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function FolderTree() {
  return (
    <GlassCard>
      <div className="flex items-center gap-2.5 mb-4">
        <FolderOpen className="w-5 h-5 text-neon-cyan" />
        <h2 className="text-base font-semibold text-text-primary">MCKAY OS Structure</h2>
      </div>

      <div className="font-mono text-sm">
        <TreeNode node={folderTree} depth={0} />
      </div>
    </GlassCard>
  );
}
