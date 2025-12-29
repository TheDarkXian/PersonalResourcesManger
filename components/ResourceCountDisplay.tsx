
import React from 'react';
import { UISettings } from '../types';

interface ResourceCountDisplayProps {
  isFiltered: boolean;
  filteredCount: number;
  totalCount: number;
  settings: UISettings;
}

export const ResourceCountDisplay: React.FC<ResourceCountDisplayProps> = ({
  isFiltered,
  filteredCount,
  totalCount,
  settings
}) => {
  return (
    <div className="flex items-center space-x-2 animate-in fade-in slide-in-from-right duration-500">
      <div 
        className="flex items-center border rounded-xl px-4 py-2.5 shadow-inner transition-colors duration-300"
        style={{ 
          backgroundColor: settings.countBadgeBg, 
          borderColor: settings.countBadgeBorder 
        }}
      >
        <div 
          className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
          style={{ color: settings.countBadgeText }}
        >
          {isFiltered ? (
            <span className="flex items-center">
              <i className="fa-solid fa-filter mr-2 text-blue-500"></i>
              匹配核心: <span className="mx-1.5 text-blue-600 tabular-nums">{filteredCount}</span> 
              <span className="opacity-30 mx-1">/</span> {totalCount}
            </span>
          ) : (
            <span className="flex items-center">
              <i className="fa-solid fa-database mr-2 text-slate-300"></i>
              全量节点: <span className="ml-1.5 tabular-nums" style={{ color: settings.primaryFontColor }}>{totalCount}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
