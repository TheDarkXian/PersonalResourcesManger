
import React from 'react';
import { Library, DialogState, UISettings } from '../types';
import { LIBRARY_THEME } from '../styles/libraryTheme';
import { useLibraryBatchActions } from '../hooks/useLibraryBatchActions';

interface LibraryManagementTabProps {
  libraries: Library[];
  setLibraries: React.Dispatch<React.SetStateAction<Library[]>>;
  activeLibraryId?: string;
  onSwitch: (id: string) => void;
  onCreate: () => void;
  onRenameLibrary: (libId: string, newName: string) => void;
  onDeleteLibrary: (libId: string) => void;
  showDialog: (config: Partial<DialogState>) => void;
  settings: UISettings;
}

export const LibraryManagementTab: React.FC<LibraryManagementTabProps> = ({
  libraries,
  activeLibraryId,
  onSwitch,
  onCreate,
  onRenameLibrary,
  onDeleteLibrary,
  showDialog,
  settings
}) => {
  const theme = LIBRARY_THEME;

  const {
    isManagementMode,
    selectedIds,
    toggleManagementMode,
    toggleSelection,
    executeBatchDelete
  } = useLibraryBatchActions({
    activeLibraryId,
    onDeleteLibrary,
    showDialog
  });

  const triggerRename = (e: React.MouseEvent, libId: string, currentName: string) => {
    e.stopPropagation();
    showDialog({
      type: 'prompt',
      title: '重命名书库',
      message: `请为书库 "${currentName}" 输入新名称：`,
      placeholder: currentName,
      onConfirm: (val) => {
        if (val && val.trim() && val !== currentName) {
          onRenameLibrary(libId, val.trim());
        }
      }
    });
  };

  const triggerDelete = (e: React.MouseEvent, libId: string, name: string) => {
    e.stopPropagation();
    showDialog({
      type: 'confirm',
      variant: 'danger',
      title: '单库销毁确认',
      message: `确定要永久删除书库 "${name}" 吗？如果这是最后的书库，资源浏览功能将被锁定。此操作不可恢复。`,
      onConfirm: () => onDeleteLibrary(libId)
    });
  };

  return (
    <div className="space-y-16 animate-in slide-in-from-right duration-500" style={{ backgroundColor: settings.pageBg }}>
      <div 
        className="flex items-center justify-between border-b pb-12"
        style={{ borderColor: 'rgba(0,0,0,0.05)' }}
      >
        <div>
          <h3 
            className="text-5xl font-black italic tracking-tighter uppercase"
            style={{ color: settings.primaryFontColor }}
          >
            书库管理
          </h3>
          <p 
            className="text-sm font-bold mt-4 tracking-wide"
            style={{ color: settings.secondaryFontColor }}
          >
            管理您的全量资源节点。支持完全移除所有库条目以清空工作区。
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleManagementMode}
            className={`px-8 py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all flex items-center border-2`}
            style={{ 
              backgroundColor: isManagementMode ? settings.sidebarActiveBg : 'transparent',
              color: isManagementMode ? settings.sidebarActiveTextColor : settings.mutedFontColor,
              borderColor: isManagementMode ? settings.sidebarActiveBg : 'rgba(0,0,0,0.1)'
            }}
          >
            <i className={`fa-solid ${isManagementMode ? 'fa-xmark' : 'fa-list-check'} mr-2`}></i>
            {isManagementMode ? '退出管理模式' : '开启批量管理'}
          </button>

          {isManagementMode && selectedIds.size > 0 && (
            <button 
              onClick={executeBatchDelete}
              className="px-8 py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all flex items-center animate-in slide-in-from-right bg-rose-600 text-white shadow-xl shadow-rose-200 hover:bg-rose-700"
            >
              <i className="fa-solid fa-trash-can mr-2"></i>
              批量删除 ({selectedIds.size})
            </button>
          )}

          <button 
            onClick={onCreate}
            className="px-10 py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center shadow-2xl"
            style={{ 
              backgroundColor: settings.accentColor, 
              color: '#ffffff',
              boxShadow: `0 20px 40px -10px ${settings.accentColor}40`
            }}
          >
            <i className="fa-solid fa-plus mr-3"></i>
            初始化新书库
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {libraries.map(lib => {
          const isActive = activeLibraryId === lib.id;
          const isSelected = selectedIds.has(lib.id);
          
          return (
            <div 
              key={lib.id}
              onClick={() => {
                if (isManagementMode) {
                  toggleSelection(lib.id);
                } else if (!isActive) {
                  onSwitch(lib.id);
                }
              }}
              className={`p-10 rounded-[3rem] transition-all border-4 flex flex-col group relative overflow-hidden cursor-pointer ${
                isActive && !isManagementMode ? 'cursor-default ring-4 ring-offset-4 ring-blue-500/20' : ''
              }`}
              style={{ 
                backgroundColor: settings.cardBg,
                borderColor: isActive ? settings.accentColor : isSelected ? '#e11d48' : 'rgba(0,0,0,0.05)',
                color: settings.textColor,
                transform: isActive ? 'scale(1.02)' : isSelected ? 'scale(0.98)' : 'none'
              }}
            >
              {isManagementMode && (
                <div 
                  className={`absolute top-6 left-6 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all z-10`}
                  style={{ 
                    backgroundColor: isSelected ? '#e11d48' : settings.cardBg,
                    borderColor: isSelected ? '#e11d48' : 'rgba(0,0,0,0.1)',
                    color: isSelected ? '#ffffff' : 'transparent'
                  }}
                >
                  <i className="fa-solid fa-check"></i>
                </div>
              )}

              {!isManagementMode && (
                <div className="absolute top-6 right-6 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => triggerRename(e, lib.id, lib.name)}
                    className="w-10 h-10 border rounded-full flex items-center justify-center transition-all shadow-sm"
                    style={{ backgroundColor: settings.cardBg, borderColor: 'rgba(0,0,0,0.1)', color: settings.mutedFontColor }}
                    title="重命名"
                  >
                    <i className="fa-solid fa-pen-to-square text-xs"></i>
                  </button>
                  <button 
                    onClick={(e) => triggerDelete(e, lib.id, lib.name)}
                    className="w-10 h-10 border rounded-full flex items-center justify-center transition-all shadow-sm hover:text-rose-500"
                    style={{ backgroundColor: settings.cardBg, borderColor: 'rgba(0,0,0,0.1)', color: settings.mutedFontColor }}
                    title="删除此库"
                  >
                    <i className="fa-solid fa-trash-can text-xs"></i>
                  </button>
                </div>
              )}

              <div className="flex flex-col mt-4">
                <span 
                  className="text-2xl font-black uppercase tracking-tight"
                  style={{ color: isActive ? settings.accentColor : settings.primaryFontColor }}
                >
                  {lib.name}
                </span>
                <span 
                  className="text-[10px] font-bold mt-2 uppercase tracking-widest"
                  style={{ color: settings.mutedFontColor }}
                >
                  节点标识: {lib.id.split('-')[0]}
                </span>
              </div>
              
              <div 
                className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t"
                style={{ borderColor: 'rgba(0,0,0,0.05)' }}
              >
                <div className="flex flex-col">
                   <span className="text-4xl font-black leading-none" style={{ color: settings.primaryFontColor }}>{lib.resources.length}</span>
                   <span className="text-[9px] font-black uppercase mt-3 tracking-widest" style={{ color: settings.mutedFontColor }}>资源项目</span>
                </div>
                <div className="flex flex-col">
                   <span className="text-4xl font-black leading-none" style={{ color: settings.primaryFontColor }}>{lib.history.length}</span>
                   <span className="text-[9px] font-black uppercase mt-3 tracking-widest" style={{ color: settings.mutedFontColor }}>审计条目</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
