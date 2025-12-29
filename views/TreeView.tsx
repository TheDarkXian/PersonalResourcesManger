
import React, { useState, useMemo } from 'react';
import { Resource, UISettings } from '../types';
import { ResourceIcon } from '../icons/index';

interface TreeViewProps {
  resources: Resource[];
  onOpen: (res: Resource) => void;
  settings: UISettings;
}

interface TreeNode {
  name: string;
  path: string;
  children: Map<string, TreeNode>;
  resources: Resource[];
}

export const TreeView: React.FC<TreeViewProps> = ({ resources, onOpen, settings }) => {
  const tree = useMemo(() => {
    const root: TreeNode = { name: 'Root', path: '', children: new Map(), resources: [] };
    
    resources.forEach(res => {
      const parts = res.pathOrUrl.split(/[\\/]/).filter(Boolean);
      let current = root;
      
      if (parts.length > 1) {
        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i];
          if (!current.children.has(part)) {
            current.children.set(part, {
              name: part,
              path: parts.slice(0, i + 1).join('/'),
              children: new Map(),
              resources: []
            });
          }
          current = current.children.get(part)!;
        }
      }
      current.resources.push(res);
    });
    
    return root;
  }, [resources]);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-slate-50/50">
      <div className="max-w-4xl mx-auto space-y-2">
        {/* Fix: Explicitly type node as TreeNode to ensure correct property access like 'path' */}
        {Array.from(tree.children.values()).map((node: TreeNode) => (
          <TreeFolder key={node.path} node={node} onOpen={onOpen} depth={0} />
        ))}
        {/* Fix: Explicitly type res as Resource to avoid assignment errors */}
        {tree.resources.map((res: Resource) => (
          <TreeFile key={res.id} res={res} onOpen={onOpen} depth={0} />
        ))}
        {resources.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <i className="fa-solid fa-folder-open text-4xl mb-4 opacity-20"></i>
            <p className="text-xs font-black uppercase tracking-widest">没有匹配的目录结构</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface TreeFolderProps {
  node: TreeNode;
  onOpen: (res: Resource) => void;
  depth: number;
}

// Fix: Use React.FC to handle standard React props like 'key' correctly in JSX
const TreeFolder: React.FC<TreeFolderProps> = ({ node, onOpen, depth }) => {
  const [isOpen, setIsOpen] = useState(depth < 1);
  const children = Array.from(node.children.values());

  return (
    <div className="select-none">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center py-1.5 px-3 hover:bg-white hover:shadow-sm rounded-lg cursor-pointer group transition-all"
        style={{ marginLeft: `${depth * 20}px` }}
      >
        <i className={`fa-solid ${isOpen ? 'fa-chevron-down' : 'fa-chevron-right'} text-[10px] text-slate-300 mr-3 w-3 group-hover:text-slate-500`}></i>
        <i className={`fa-solid ${isOpen ? 'fa-folder-open' : 'fa-folder'} text-slate-400 mr-3`}></i>
        <span className="text-[11px] font-bold text-slate-600 truncate">{node.name}</span>
        <span className="ml-auto text-[9px] font-black text-slate-300 opacity-0 group-hover:opacity-100 bg-slate-100 px-1.5 rounded uppercase">Folder</span>
      </div>
      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
          {/* Fix: Explicitly type 'child' as 'TreeNode' to avoid 'unknown' type error when accessing 'path' */}
          {children.map((child: TreeNode) => (
            <TreeFolder key={child.path} node={child} onOpen={onOpen} depth={depth + 1} />
          ))}
          {node.resources.map(res => (
            <TreeFile key={res.id} res={res} onOpen={onOpen} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

interface TreeFileProps {
  res: Resource;
  onOpen: (res: Resource) => void;
  depth: number;
}

// Fix: Use React.FC to handle standard React props like 'key' correctly in JSX
const TreeFile: React.FC<TreeFileProps> = ({ res, onOpen, depth }) => {
  return (
    <div 
      onClick={() => onOpen(res)}
      className="flex items-center py-1.5 px-3 hover:bg-white hover:shadow-md rounded-lg cursor-pointer group transition-all border border-transparent hover:border-slate-100"
      style={{ marginLeft: `${depth * 20 + 24}px` }}
    >
      <ResourceIcon type={res.type} path={res.pathOrUrl} className="text-slate-400 mr-3 text-sm" />
      <span className="text-[11px] font-medium text-slate-800 truncate">{res.title || '未命名'}</span>
      <div className="ml-auto flex space-x-1">
        {res.tags.slice(0, 1).map(tid => (
          <div key={tid} className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
        ))}
      </div>
    </div>
  );
};
