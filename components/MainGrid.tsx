
import React from 'react';
import { Resource, Tag, UISettings } from '../types';
import { ResourceCard } from './ResourceCard';
import { getMainGridTheme } from '../styles/mainGridTheme';

interface MainGridProps {
  filteredList: Resource[];
  visibleLimit: number;
  currentCardWidth: number;
  currentFontSize: number;
  settings: UISettings;
  selectedIds: Set<string>;
  isBatchDeleteMode: boolean;
  toggleSelection: (id: string, shiftKey?: boolean) => void;
  openResource: (res: Resource) => void;
  tags: Tag[];
  observerTarget: React.RefObject<HTMLDivElement | null>;
  onPathAction: (action: 'copy' | 'open', res: Resource) => void;
  sessionFileMap: Map<string, File>;
  scrollRef?: React.RefObject<HTMLElement | null>;
  onScroll?: (e: React.UIEvent<HTMLElement>) => void;
  pingId?: string | null;
}

export const MainGrid: React.FC<MainGridProps> = ({
  filteredList,
  visibleLimit,
  currentCardWidth,
  currentFontSize,
  settings,
  selectedIds,
  isBatchDeleteMode,
  toggleSelection,
  openResource,
  tags,
  observerTarget,
  onPathAction,
  sessionFileMap,
  scrollRef,
  onScroll,
  pingId
}) => {
  const theme = getMainGridTheme(settings);

  return (
    <main 
      ref={scrollRef as any}
      onScroll={onScroll}
      className={`flex-1 overflow-y-auto custom-scrollbar relative scroll-smooth ${theme.container.padding}`}
      style={{ backgroundColor: settings.pageBg || theme.container.defaultBg }}
    >
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${currentCardWidth}px, 1fr))` }}>
        {filteredList.slice(0, visibleLimit).map(res => (
          <ResourceCard 
            key={res.id}
            res={res}
            isSelected={selectedIds.has(res.id)}
            isBatchDeleteMode={isBatchDeleteMode}
            settings={settings}
            currentFontSize={currentFontSize}
            toggleSelection={toggleSelection}
            openResource={openResource}
            tags={tags}
            onPathAction={onPathAction}
            localFile={sessionFileMap.get(res.id)}
            isPinged={res.id === pingId}
          />
        ))}
        
        {/* 加载更多状态 */}
        {visibleLimit < filteredList.length && (
          <div ref={observerTarget} className="col-span-full h-20 flex items-center justify-center">
            <div className="flex items-center space-x-2" style={{ color: theme.loading.textColor }}>
               <i className="fa-solid fa-spinner animate-spin" style={{ color: theme.loading.spinnerColor }}></i>
               <span className="text-[10px] font-black uppercase tracking-widest">正在加载更多节点...</span>
            </div>
          </div>
        )}
      </div>
      
      {/* 底部加载完成提示 */}
      {filteredList.length > 0 && visibleLimit >= filteredList.length && (
         <div className="w-full py-10 text-center opacity-40">
            <span className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: theme.footer.textColor }}>
              已加载全部 {filteredList.length} 个资源
            </span>
         </div>
      )}

      {/* 空状态 */}
      {filteredList.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center opacity-40">
          <i className="fa-solid fa-box-open text-6xl mb-4" style={{ color: theme.empty.iconColor }}></i>
          <p className="font-black uppercase tracking-widest" style={{ color: theme.empty.textColor }}>未发现匹配的资源项</p>
        </div>
      )}
    </main>
  );
};
