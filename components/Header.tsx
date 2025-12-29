
import React from 'react';
import { UI_ICONS } from '../icons/index';
import { UISettings } from '../types';
import { UI_CLASSES } from '../styles/ui-constants';
import { BatchControls } from './BatchControls';

interface HeaderProps {
  settings: UISettings;
  activeModal: string | null;
  setActiveModal: (modal: any) => void;
  selectedIds: Set<string>;
  setSelectedIds: (s: Set<string>) => void;
  isBatchDeleteMode: boolean;
  setIsBatchDeleteMode: (m: boolean) => void;
  openNewResource: () => void;
  onBatchDelete: () => void;
  activeLibraryName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  setActiveModal,
  selectedIds,
  setSelectedIds,
  isBatchDeleteMode,
  setIsBatchDeleteMode,
  openNewResource,
  onBatchDelete,
  activeLibraryName
}) => {
  return (
    <header className="sticky top-0 z-[100] shadow-sm flex items-center justify-between px-6 py-3 border-b border-slate-200" style={{ backgroundColor: settings.headerBg }}>
      <div className="flex items-center space-x-6">
        <div className="flex flex-col">
           <div className={UI_CLASSES.titleMain} style={{ color: settings.accentColor }}>NAV-PRO</div>
           <button 
             onClick={() => setActiveModal('library')}
             className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 flex items-center transition-colors"
           >
             <i className="fa-solid fa-database mr-1"></i> {activeLibraryName || '未命名书库'} <i className="fa-solid fa-chevron-down ml-1 text-[7px]"></i>
           </button>
        </div>
        
        <div className="h-8 w-px bg-slate-100 mx-2"></div>

        <button onClick={() => setActiveModal('tag-center')} className={UI_CLASSES.btnOutline}>
          <i className={`fa-solid ${UI_ICONS.tags} mr-2`}></i>标签管理
        </button>
        <button onClick={() => setActiveModal('dir-import')} className={UI_CLASSES.btnOutline}>
          <i className={`fa-solid ${UI_ICONS.import} mr-2`}></i>一键导入
        </button>
      </div>

      <div className="flex items-center space-x-5">
        {/* 批量控制组件 - 承载所有批量逻辑 */}
        <BatchControls 
          isBatchDeleteMode={isBatchDeleteMode}
          setIsBatchDeleteMode={setIsBatchDeleteMode}
          selectedCount={selectedIds.size}
          setSelectedIds={setSelectedIds}
          onBatchTag={() => setActiveModal('batch-tag')}
          onBatchDelete={onBatchDelete}
        />

        <div className="h-8 w-px bg-slate-100"></div>

        <button 
          onClick={openNewResource} 
          className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95"
          style={{ backgroundColor: settings.accentColor }}
        >
          + 新建项目
        </button>
        
        <button 
          onClick={() => setActiveModal('settings')} 
          className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all"
        >
          <i className={`fa-solid ${UI_ICONS.settings} text-lg`}></i>
        </button>
      </div>
    </header>
  );
};
