
import React from 'react';
import { UI_ICONS } from '../icons/index';

interface BatchControlsProps {
  isBatchDeleteMode: boolean;
  setIsBatchDeleteMode: (m: boolean) => void;
  selectedCount: number;
  setSelectedIds: (s: Set<string>) => void;
  onBatchTag: () => void;
  onBatchDelete: () => void;
}

export const BatchControls: React.FC<BatchControlsProps> = ({
  isBatchDeleteMode,
  setIsBatchDeleteMode,
  selectedCount,
  setSelectedIds,
  onBatchTag,
  onBatchDelete
}) => {
  return (
    <div className="flex items-center space-x-3">
      {/* 批量操作工具条 - 仅在有选中项时显示 */}
      {selectedCount > 0 && (
        <div className="flex items-center space-x-2 animate-in slide-in-from-right fade-in duration-300">
          <button 
            onClick={onBatchTag}
            className="flex items-center bg-blue-600 text-white pl-4 pr-1 py-1 rounded-full shadow-xl hover:bg-blue-700 transition-all active:scale-95 group"
          >
            <span className="text-[10px] font-black uppercase tracking-widest mr-3">批量标签 ({selectedCount})</span>
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
              <i className={`fa-solid ${UI_ICONS.batch} text-xs`}></i>
            </div>
          </button>
          
          <button 
            onClick={onBatchDelete}
            className="flex items-center bg-rose-600 text-white pl-4 pr-1 py-1 rounded-full shadow-xl hover:bg-rose-700 transition-all active:scale-95 group"
          >
            <span className="text-[10px] font-black uppercase tracking-widest mr-3">批量删除 ({selectedCount})</span>
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
              <i className={`fa-solid ${UI_ICONS.delete} text-xs`}></i>
            </div>
          </button>
          
          <div className="w-px h-6 bg-slate-200 mx-1"></div>
        </div>
      )}

      {/* 批量模式开关 */}
      <button 
        onClick={() => { 
          const nextMode = !isBatchDeleteMode;
          setIsBatchDeleteMode(nextMode); 
          if (!nextMode) setSelectedIds(new Set()); 
        }} 
        className={`h-11 px-6 rounded-2xl text-[10px] font-black uppercase flex items-center shadow-sm border transition-all ${
          isBatchDeleteMode 
            ? 'bg-rose-50 text-rose-600 border-rose-200' 
            : 'bg-slate-900 text-white border-slate-900 hover:bg-black'
        }`}
      >
        <i className={`fa-solid ${isBatchDeleteMode ? UI_ICONS.close : UI_ICONS.mode} mr-2.5`}></i>
        {isBatchDeleteMode ? '关闭批量选择' : '开启批量模式'}
      </button>
    </div>
  );
};
