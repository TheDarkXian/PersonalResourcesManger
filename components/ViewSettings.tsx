
import React from 'react';
import { UI_ICONS } from '../icons/index';

interface ViewSettingsProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isRegexEnabled: boolean;
  setIsRegexEnabled: (e: boolean) => void;
  isBatchDeleteMode: boolean;
  setIsBatchDeleteMode: (m: boolean) => void;
  sortBy: 'updatedAt' | 'title' | 'createdAt' | 'tagCount';
  setSortBy: (s: any) => void;
  totalCount: number;
  setSelectedIds: (s: Set<string>) => void;
  setVisibleLimit: (l: number) => void;
}

export const ViewSettings: React.FC<ViewSettingsProps> = ({
  searchQuery,
  setSearchQuery,
  isRegexEnabled,
  setIsRegexEnabled,
  isBatchDeleteMode,
  setIsBatchDeleteMode,
  sortBy,
  setSortBy,
  totalCount,
  setSelectedIds,
  setVisibleLimit
}) => {
  const sortOptions = [
    { label: '最近更新', value: 'updatedAt' },
    { label: '名称排序', value: 'title' },
    { label: '创建时间', value: 'createdAt' },
    { label: '标签数量', value: 'tagCount' }
  ];

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex-1 min-w-[300px] relative flex items-center space-x-2">
        <div className="relative flex-1">
          <i className={`fa-solid ${UI_ICONS.search} absolute left-4 top-1/2 -translate-y-1/2 opacity-20`}></i>
          <input 
            type="text" 
            placeholder={`在 ${totalCount} 个资源中穿梭...`} 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none transition-all" 
            value={searchQuery} 
            onChange={e => {setSearchQuery(e.target.value); setVisibleLimit(40);}} 
          />
        </div>
        <button 
          onClick={() => setIsRegexEnabled(!isRegexEnabled)} 
          title="正则搜索模式"
          className={`w-10 h-10 flex items-center justify-center rounded-xl text-[10px] font-black border transition-all ${isRegexEnabled ? 'bg-indigo-600 text-white border-indigo-700 shadow-lg' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'}`}
        >
          .*
        </button>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="flex items-center bg-slate-100 rounded-xl border border-slate-200 p-1">
          {sortOptions.map(opt => (
            <button 
              key={opt.value} 
              onClick={() => setSortBy(opt.value)} 
              className={`text-[9px] font-black uppercase px-3 py-2 rounded-lg transition-all ${sortBy === opt.value ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button 
          onClick={() => { setIsBatchDeleteMode(!isBatchDeleteMode); if (isBatchDeleteMode) setSelectedIds(new Set()); }} 
          className={`text-[10px] font-black uppercase h-10 px-5 rounded-xl transition-all flex items-center shadow-sm border ${isBatchDeleteMode ? 'bg-rose-500 text-white border-rose-600 shadow-rose-200' : 'bg-slate-900 text-white border-slate-900 hover:bg-black'}`}
        >
          <i className={`fa-solid ${isBatchDeleteMode ? UI_ICONS.close : UI_ICONS.mode} mr-2`}></i>
          {isBatchDeleteMode ? '退出批量' : '批量模式'}
        </button>
      </div>
    </div>
  );
};
