
import React from 'react';
import { Library, UISettings } from '../types';
import { AuditEntryItem } from '../components/AuditEntryItem';
import { platformAdapter } from '../utils/platformAdapter';

interface AuditTrailTabProps {
  activeLibrary?: Library;
  activeLibraryId?: string;
  settings: UISettings;
  clearHistory: (libId: string) => void;
  deleteHistoryEntry: (libId: string, entryId: string) => void;
}

export const AuditTrailTab: React.FC<AuditTrailTabProps> = ({
  activeLibrary,
  activeLibraryId,
  settings,
  clearHistory,
  deleteHistoryEntry
}) => {
  const handleExportHistory = async () => {
    if (!activeLibrary || !activeLibrary.history || activeLibrary.history.length === 0) return;
    const data = JSON.stringify(activeLibrary.history, null, 2);
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const safeLibName = (activeLibrary.name || 'Library').replace(/[\\/:*?"<>|]/g, '_');
    const filename = `Audit_Report_${safeLibName}_${dateStr}.json`;
    
    await platformAdapter.saveFile(data, filename);
  };

  return (
    <div className="space-y-16 animate-in slide-in-from-right duration-500">
      <div className="flex items-end justify-between border-b pb-10" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
        <div>
          <h3 className="text-5xl font-black italic tracking-tighter uppercase" style={{ color: settings.primaryFontColor }}>
            操作审计
          </h3>
          <p className="text-sm font-bold mt-4 tracking-wide" style={{ color: settings.secondaryFontColor }}>
            正在审计活跃节点: {activeLibrary?.name || '未知书库'}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleExportHistory}
            disabled={!activeLibrary || !activeLibrary.history || activeLibrary.history.length === 0}
            className="px-8 py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-sm border-2 disabled:opacity-30 disabled:grayscale"
            style={{ 
              backgroundColor: settings.auditBtnExportBg,
              borderColor: settings.auditBtnExportText,
              color: settings.auditBtnExportText
            }}
          >
            <i className="fa-solid fa-file-export mr-2"></i>
            导出审计报表
          </button>

          <button 
            onClick={() => activeLibraryId && clearHistory(activeLibraryId)} 
            className="px-10 py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-sm"
            style={{ 
              backgroundColor: settings.auditBtnClearBg, 
              color: settings.auditBtnClearText 
            }}
          >
            清空审计记录
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pb-20">
        {activeLibrary?.history && activeLibrary.history.length > 0 ? (
          activeLibrary.history.map(entry => (
            <AuditEntryItem 
              key={entry.id} 
              entry={entry} 
              onDelete={(id) => activeLibraryId && deleteHistoryEntry(activeLibraryId, id)} 
              settings={settings}
            />
          ))
        ) : (
          <div className="py-40 flex flex-col items-center justify-center opacity-40">
            <i className="fa-solid fa-clipboard-list text-8xl mb-8" style={{ color: settings.mutedFontColor }}></i>
            <p className="text base font-black uppercase tracking-[0.5em]" style={{ color: settings.mutedFontColor }}>
              审计轨迹已清空
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
