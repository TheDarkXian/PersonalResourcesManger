
import React from 'react';
import { UISettings } from '../types';

type SortOption = 'updatedAt' | 'title' | 'createdAt' | 'tagCount';

interface SortDropdownProps {
  sortBy: SortOption;
  setSortBy: (s: SortOption) => void;
  settings: UISettings;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ sortBy, setSortBy, settings }) => {
  const options: { label: string; value: SortOption; icon: string }[] = [
    { label: '最近更新', value: 'updatedAt', icon: 'fa-clock-rotate-left' },
    { label: '名称排序', value: 'title', icon: 'fa-arrow-down-a-z' },
    { label: '创建时间', value: 'createdAt', icon: 'fa-calendar-plus' },
    { label: '标签数量', value: 'tagCount', icon: 'fa-tags' }
  ];

  const currentOption = options.find(o => o.value === sortBy) || options[0];

  return (
    <div className="relative group">
      <div className="flex flex-col mb-0.5 ml-1">
        <span className="text-[7px] font-black uppercase tracking-[0.2em] opacity-50" style={{ color: settings.mutedFontColor }}>排序方式</span>
      </div>
      <div className="relative">
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="appearance-none border rounded-xl pl-8 pr-8 py-1.5 text-[9px] font-black uppercase tracking-wider outline-none focus:ring-4 focus:ring-blue-500/5 transition-all cursor-pointer shadow-sm w-full"
          style={{ 
            backgroundColor: settings.sortDropdownBg, 
            borderColor: settings.sortDropdownBorder,
            color: settings.sortDropdownText 
          }}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value} className="font-bold" style={{ backgroundColor: settings.sortDropdownBg, color: settings.sortDropdownText }}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" style={{ color: settings.sortDropdownText }}>
          <i className={`fa-solid ${currentOption.icon} text-[9px]`}></i>
        </div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-30" style={{ color: settings.sortDropdownText }}>
          <i className="fa-solid fa-chevron-down text-[7px]"></i>
        </div>
      </div>
    </div>
  );
};
