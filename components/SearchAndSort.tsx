
import React from 'react';
import { UI_ICONS } from '../icons/index';
import { ResourceCountDisplay } from './ResourceCountDisplay';
import { SortDropdown } from './SortDropdown';
import { UISettings } from '../types';

interface SearchAndSortProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isRegexEnabled: boolean;
  setIsRegexEnabled: (e: boolean) => void;
  onOpenSettings: () => void; 
  sortBy: 'updatedAt' | 'title' | 'createdAt' | 'tagCount';
  setSortBy: (s: any) => void;
  totalCount: number;
  filteredCount: number;
  isFiltered: boolean;
  setVisibleLimit: (l: number) => void;
  settings: UISettings;
  isOutlineOpen: boolean;
  setIsOutlineOpen: (open: boolean) => void;
}

export const SearchAndSort: React.FC<SearchAndSortProps> = ({
  searchQuery,
  setSearchQuery,
  isRegexEnabled,
  setIsRegexEnabled,
  onOpenSettings,
  sortBy,
  setSortBy,
  totalCount,
  filteredCount,
  isFiltered,
  setVisibleLimit,
  settings,
  isOutlineOpen,
  setIsOutlineOpen
}) => {
  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        
        <div className="flex-1 min-w-[300px] space-y-1">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] ml-1" style={{ color: settings.mutedFontColor }}>内容全域搜索</span>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 group">
              <i 
                className={`fa-solid ${UI_ICONS.search} absolute left-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-50 transition-opacity`}
                style={{ color: settings.primaryFontColor }}
              ></i>
              <input 
                type="text" 
                placeholder={`在 ${totalCount} 个资源中穿梭...`} 
                className="w-full pl-11 pr-4 py-3 border rounded-2xl text-sm font-medium outline-none transition-all shadow-inner" 
                style={{ 
                  backgroundColor: settings.searchBarBg, 
                  borderColor: settings.searchBarBorder,
                  color: settings.primaryFontColor
                }}
                value={searchQuery} 
                onChange={e => {setSearchQuery(e.target.value); setVisibleLimit(40);}} 
              />
            </div>
            
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => setIsRegexEnabled(!isRegexEnabled)} 
                type="button"
                title="正则搜索模式"
                className={`w-12 h-12 flex items-center justify-center rounded-2xl text-[10px] font-black border transition-all ${isRegexEnabled ? 'shadow-lg scale-105' : ''}`}
                style={{
                  backgroundColor: isRegexEnabled ? settings.accentColor : settings.searchBarBg,
                  borderColor: isRegexEnabled ? settings.accentColor : settings.searchBarBorder,
                  color: isRegexEnabled ? '#ffffff' : settings.mutedFontColor
                }}
              >
                .*
              </button>
              
              <button 
                onClick={onOpenSettings}
                type="button"
                title="高级筛选配置"
                className="w-12 h-12 flex items-center justify-center rounded-2xl text-[10px] font-black border transition-all hover:bg-slate-50 active:scale-95"
                style={{
                  backgroundColor: settings.searchBarBg,
                  borderColor: settings.searchBarBorder,
                  color: settings.mutedFontColor
                }}
              >
                <i className="fa-solid fa-sliders"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-6 shrink-0">
          <div className="pt-6">
            <ResourceCountDisplay 
              isFiltered={isFiltered}
              filteredCount={filteredCount}
              totalCount={totalCount}
              settings={settings}
            />
          </div>
          
          <div className="w-px h-16 mx-1 opacity-20 self-center" style={{ backgroundColor: settings.primaryFontColor }}></div>
          
          <div className="flex flex-col space-y-2 min-w-[140px]">
            <button 
              onClick={(e) => { e.preventDefault(); setIsOutlineOpen(!isOutlineOpen); }}
              type="button"
              className={`w-full py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 transition-all flex items-center justify-center space-x-2 ${
                isOutlineOpen ? 'shadow-inner' : 'shadow-sm'
              }`}
              style={{
                backgroundColor: isOutlineOpen ? settings.sidebarActiveBg : 'transparent',
                borderColor: isOutlineOpen ? settings.sidebarActiveBg : 'rgba(0,0,0,0.1)',
                color: isOutlineOpen ? settings.sidebarActiveTextColor : settings.mutedFontColor
              }}
            >
              <i className={`fa-solid ${UI_ICONS.outline} text-[10px]`}></i>
              <span>{isOutlineOpen ? '关闭导航树' : '开启导航树'}</span>
            </button>

            <SortDropdown 
              sortBy={sortBy}
              setSortBy={setSortBy}
              settings={settings}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
