
import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Resource, UISettings } from '../types';
import { UI_ICONS, ResourceIcon } from '../icons/index';
import { NavTreeNode } from '../types/navigation';
import { buildResourceTree } from '../utils/treeBuilder';
import { getOutlineTheme } from '../styles/outlineTheme';

interface OutlineSidebarProps {
  filteredList: Resource[];
  onClose: () => void;
  locateResource: (id: string) => void;
  settings: UISettings;
}

const MemoizedTreeNode = React.memo(({ 
  node, 
  expandedKeys, 
  toggleFolder, 
  locateResource,
  theme
}: { 
  node: NavTreeNode; 
  expandedKeys: Set<string>; 
  toggleFolder: (id: string) => void; 
  locateResource: (id: string) => void; 
  theme: any;
}) => {
  const isExpanded = expandedKeys.has(node.id);

  if (node.type === 'folder') {
    return (
      <div className="flex flex-col">
        <div 
          onClick={() => toggleFolder(node.id)}
          className="group flex items-center py-1 px-3 cursor-pointer transition-colors rounded-md"
          style={{ 
            paddingLeft: `${node.depth * 10 + 8}px`,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.folder.hoverBg)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <i 
            className={`fa-solid ${isExpanded ? 'fa-chevron-down' : 'fa-chevron-right'} text-[7px] mr-2 w-2.5 transition-transform`}
            style={{ color: theme.folder.expandedIcon }}
          ></i>
          <i 
            className={`fa-solid ${isExpanded ? 'fa-folder-open' : 'fa-folder'} mr-2 text-[13px]`}
            style={{ color: theme.folder.icon }}
          ></i>
          <span 
            className="text-[10px] font-bold truncate flex-1 uppercase tracking-tight"
            style={{ color: theme.folder.text }}
          >
            {node.name}
          </span>
          <span 
            className="text-[8px] font-black opacity-0 group-hover:opacity-100 px-1 py-0.5 rounded border transition-opacity"
            style={{ 
              backgroundColor: theme.folder.badgeBg, 
              color: theme.folder.badgeText,
              borderColor: theme.sidebar.border
            }}
          >
            {node.children.length}
          </span>
        </div>
        {isExpanded && (
          <div className="flex flex-col animate-in fade-in slide-in-from-top-1 duration-200">
            {node.children.map(child => (
              <MemoizedTreeNode 
                key={child.id} 
                node={child} 
                expandedKeys={expandedKeys} 
                toggleFolder={toggleFolder} 
                locateResource={locateResource} 
                theme={theme}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      onClick={() => locateResource(node.id)}
      className="group flex items-center py-1 px-3 cursor-pointer transition-colors rounded-md border border-transparent"
      style={{ 
        paddingLeft: `${node.depth * 10 + 22}px`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = theme.file.hoverBg;
        e.currentTarget.style.borderColor = theme.file.hoverBorder;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.borderColor = 'transparent';
      }}
    >
      <ResourceIcon 
        type={node.resource?.type || 'other'} 
        path={node.resource?.pathOrUrl || ""} 
        className="mr-2 text-[11px] opacity-70 group-hover:opacity-100 transition-opacity" 
        style={{ color: theme.file.icon }}
      />
      <span 
        className="text-[10px] font-medium truncate flex-1"
        style={{ color: theme.file.text }}
      >
        {node.name}
      </span>
    </div>
  );
});

export const OutlineSidebar: React.FC<OutlineSidebarProps> = ({
  filteredList,
  onClose,
  locateResource,
  settings
}) => {
  const [width, setWidth] = useState(300);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const isResizing = useRef(false);
  const theme = getOutlineTheme(settings);

  const treeData = useMemo(() => buildResourceTree(filteredList), [filteredList]);

  const startResizing = useCallback((e: React.MouseEvent) => {
    isResizing.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResizing);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth >= 240 && newWidth <= 600) {
      setWidth(newWidth);
    }
  }, []);

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResizing);
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  }, []);

  const toggleFolder = useCallback((id: string) => {
    setExpandedKeys(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <aside 
      className="relative h-full border-l animate-in slide-in-from-right duration-300 z-10 shrink-0 flex flex-col"
      style={{ 
        width: `${width}px`, 
        backgroundColor: theme.sidebar.bg, 
        borderColor: theme.sidebar.border 
      }}
    >
      <div 
        onMouseDown={startResizing}
        className="absolute top-0 left-0 bottom-0 w-1 cursor-col-resize transition-colors z-20 group hover:bg-blue-500/20"
      >
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full"
          style={{ backgroundColor: theme.resizeHandle.idle }}
        ></div>
      </div>

      <div 
        className="p-4 border-b flex items-center justify-between"
        style={{ backgroundColor: theme.sidebar.headerBg, borderColor: theme.sidebar.border }}
      >
        <div className="flex flex-col">
          <span 
            className="text-[8px] font-black uppercase tracking-[0.2em]"
            style={{ color: theme.header.subtitle }}
          >
            结构树
          </span>
          <div className="flex items-center space-x-2">
             <span className="text-[11px] font-black italic" style={{ color: theme.header.title }}>TREE VIEW</span>
             <span 
               className="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
               style={{ backgroundColor: theme.header.countBg, color: theme.header.countText }}
             >
               {filteredList.length}
             </span>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="w-7 h-7 flex items-center justify-center hover:bg-black/5 rounded-full transition-colors"
          style={{ color: theme.header.subtitle }}
        >
          <i className={`fa-solid ${UI_ICONS.close} text-sm`}></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-px">
        {treeData.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30 text-center px-6">
            <i 
              className="fa-solid fa-folder-tree text-3xl mb-3"
              style={{ color: theme.empty.icon }}
            ></i>
            <p 
              className="text-[9px] font-black uppercase tracking-widest leading-loose"
              style={{ color: theme.empty.text }}
            >
              未发现匹配节点
            </p>
          </div>
        ) : (
          treeData.map(node => (
            <MemoizedTreeNode 
              key={node.id} 
              node={node} 
              expandedKeys={expandedKeys} 
              toggleFolder={toggleFolder} 
              locateResource={locateResource} 
              theme={theme}
            />
          ))
        )}
      </div>

      <div 
        className="px-4 py-3 border-t flex items-center justify-between"
        style={{ backgroundColor: theme.sidebar.footerBg, borderColor: theme.sidebar.border }}
      >
        <span 
          className="text-[8px] font-black uppercase tracking-widest"
          style={{ color: theme.footer.label }}
        >
          {Math.round(width)} PX
        </span>
        <button 
          onClick={() => setExpandedKeys(new Set())}
          className="text-[8px] font-black uppercase tracking-tighter"
          style={{ color: theme.footer.actionText }}
        >
          收起
        </button>
      </div>
    </aside>
  );
};
