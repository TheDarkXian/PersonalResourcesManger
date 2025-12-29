
import React, { useMemo } from 'react';
import { ResourceIcon, TagIcon } from '../icons/index';
import { UISettings, ResourceType, Tag, Resource } from '../types';
import { getContrastYIQ } from '../utils/helpers';
import { ExtensionFilter } from './ExtensionFilter';
import { SearchAndSort } from './SearchAndSort';

interface FilterBarProps {
  settings: UISettings;
  setSettings: (s: UISettings) => void;
  isFiltered: boolean;
  filteredCount: number;
  totalCount: number;
  resources: Resource[]; 
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isRegexEnabled: boolean;
  setIsRegexEnabled: (e: boolean) => void;
  sortBy: 'updatedAt' | 'title' | 'createdAt' | 'tagCount';
  setSortBy: (s: 'updatedAt' | 'title' | 'createdAt' | 'tagCount') => void;
  selectedTypes: ResourceType[];
  setSelectedTypes: React.Dispatch<React.SetStateAction<ResourceType[]>>;
  availableExtensions: string[];
  selectedExtensions: string[];
  setSelectedExtensions: React.Dispatch<React.SetStateAction<string[]>>;
  tags: Tag[];
  selectedTagIds: string[];
  setSelectedTagIds: React.Dispatch<React.SetStateAction<string[]>>;
  setVisibleLimit: (l: number) => void;
  onOpenSettings: () => void;
  isOutlineOpen: boolean;
  setIsOutlineOpen: (open: boolean) => void;
}

export const FilterBar: React.FC<FilterBarProps> = (props) => {
  const showExtensionFilter = props.selectedTypes.includes('local-file');

  // 计算各类型的数量统计
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'local-file': 0,
      'local-folder': 0,
      'url': 0,
      'cloud': 0
    };
    props.resources.forEach(r => {
      if (counts[r.type] !== undefined) counts[r.type]++;
    });
    return counts;
  }, [props.resources]);

  // 计算各标签的数量统计
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    props.resources.forEach(r => {
      r.tags?.forEach(tid => {
        counts[tid] = (counts[tid] || 0) + 1;
      });
    });
    return counts;
  }, [props.resources]);

  return (
    <div className="p-6 border-b space-y-6" style={{ backgroundColor: props.settings.headerBg, borderColor: 'rgba(0,0,0,0.08)' }}>
      <SearchAndSort 
        searchQuery={props.searchQuery}
        setSearchQuery={props.setSearchQuery}
        isRegexEnabled={props.isRegexEnabled}
        setIsRegexEnabled={props.setIsRegexEnabled}
        onOpenSettings={props.onOpenSettings} 
        sortBy={props.sortBy}
        setSortBy={props.setSortBy}
        totalCount={props.totalCount}
        filteredCount={props.filteredCount}
        isFiltered={props.isFiltered}
        setVisibleLimit={props.setVisibleLimit}
        settings={props.settings}
        isOutlineOpen={props.isOutlineOpen}
        setIsOutlineOpen={props.setIsOutlineOpen}
      />

      <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'rgba(0,0,0,0.03)' }}>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[9px] font-black uppercase opacity-40 mr-3 flex items-center shrink-0">
            <i className="fa-solid fa-layer-group mr-2"></i> 资源类型:
          </span>
          <div className="flex flex-wrap gap-2">
            {['local-file', 'local-folder', 'url', 'cloud'].map(type => {
              const isActive = props.selectedTypes.includes(type as any);
              const count = typeCounts[type] || 0;
              return (
                <button 
                  key={type} 
                  type="button"
                  onClick={() => props.setSelectedTypes(p => p.includes(type as any) ? p.filter(t => t !== type) : [...p, type as any])} 
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold border transition-all flex items-center space-x-2.5 ${isActive ? 'shadow-md scale-[1.02]' : ''}`}
                  style={{
                    backgroundColor: isActive ? props.settings.filterBadgeActiveBg : props.settings.filterBadgeInactiveBg,
                    borderColor: isActive ? props.settings.filterBadgeActiveBg : props.settings.filterBadgeInactiveBg === '#ffffff' ? 'rgba(0,0,0,0.1)' : props.settings.filterBadgeInactiveBg,
                    color: isActive ? props.settings.filterBadgeActiveText : props.settings.filterBadgeInactiveText
                  }}
                >
                  <ResourceIcon type={type as any} path="" showFavicon={false} />
                  <div className="flex items-center space-x-1.5">
                    <span>{type === 'local-file' ? '文件' : type === 'local-folder' ? '文件夹' : type === 'url' ? '链接' : '云盘'}</span>
                    {props.settings.filterShowCounts && (
                      <span className="opacity-40 font-black tabular-nums">({count})</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {showExtensionFilter && (
          <ExtensionFilter 
            availableExtensions={props.availableExtensions}
            selectedExtensions={props.selectedExtensions}
            setSelectedExtensions={props.setSelectedExtensions}
            settings={props.settings}
          />
        )}

        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center mt-3 space-y-2 shrink-0">
            <span className="text-[9px] font-black uppercase opacity-40 flex items-center">
              <i className="fa-solid fa-tags mr-2"></i> 标签筛选:
            </span>
          </div>
          <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto custom-scrollbar flex-1 pr-2 py-1">
            {props.tags.map(t => {
              const isActive = props.selectedTagIds.includes(t.id);
              const count = tagCounts[t.id] || 0;
              const textColor = isActive ? getContrastYIQ(t.color) : t.color;
              
              return (
                <button 
                  key={t.id} 
                  type="button"
                  onClick={() => props.setSelectedTagIds(p => p.includes(t.id) ? p.filter(id => id !== t.id) : [...p, t.id])} 
                  className="px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all flex items-center space-x-2.5" 
                  style={isActive 
                    ? { backgroundColor: t.color, color: textColor, borderColor: t.color, boxShadow: `0 6px 12px ${t.color}30`, transform: 'scale(1.02)' } 
                    : { 
                      borderColor: t.color + '40', 
                      color: textColor, 
                      backgroundColor: props.settings.filterBadgeInactiveBg 
                    }
                  }
                >
                  <TagIcon icon={t.icon} customIcon={t.customIcon} />
                  <div className="flex items-center space-x-1.5">
                    <span>{t.name}</span>
                    {props.settings.filterShowCounts && (
                      <span className="opacity-50 font-black tabular-nums">({count})</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
