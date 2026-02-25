
import React, { useState } from 'react';
import { Library, UISettings, HistoryEntry, DialogState } from '../types';
import { UI_ICONS } from '../icons/index';
import { LibraryManagementTab } from './LibraryManagementTab';
import { UICustomizationTab } from './UICustomizationTab';
import { MaintenanceTab } from './MaintenanceTab';
import { AuditTrailTab } from './AuditTrailTab';

interface SystemPreferencesViewProps {
  libraries: Library[];
  setLibraries: React.Dispatch<React.SetStateAction<Library[]>>;
  activeLibraryId?: string;
  onSwitch: (id: string) => void;
  onCreate: () => void; 
  onRenameLibrary: (libId: string, newName: string) => void;
  onDeleteLibrary: (libId: string) => void;
  settings: UISettings;
  setSettings: (s: UISettings) => void;
  onClose: () => void;
  exportToJSON: () => Promise<void>;
  copyDataToClipboard: () => void;
  importFromJSON: () => Promise<void>;
  importFromText: () => void;
  onReset: () => void;
  showDialog: (config: Partial<DialogState>) => void;
  onResetVisuals: () => void;
  addLog: (m: string, t?: any) => void;
}

type TabType = 'libraries' | 'history' | 'ui' | 'maintenance';

export const SystemPreferencesView: React.FC<SystemPreferencesViewProps> = ({
  libraries,
  setLibraries,
  activeLibraryId,
  onSwitch,
  onCreate,
  onRenameLibrary,
  onDeleteLibrary,
  settings,
  setSettings,
  onClose,
  exportToJSON,
  copyDataToClipboard,
  importFromJSON,
  importFromText,
  onReset,
  showDialog,
  onResetVisuals,
  addLog
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('libraries');
  const activeLibrary = libraries.find(l => l.id === activeLibraryId);

  const deleteHistoryEntry = (libId: string, entryId: string) => {
    setLibraries(prev => prev.map(lib => {
      if (lib.id !== libId) return lib;
      return { ...lib, history: lib.history.filter(h => h.id !== entryId) };
    }));
  };

  const clearHistory = (libId: string) => {
    setLibraries(prev => prev.map(lib => {
      if (lib.id !== libId) return lib;
      return { ...lib, history: [] };
    }));
  };

  const tabs = [
    { id: 'libraries', label: '书库管理', icon: 'fa-database' },
    { id: 'history', label: '操作审计', icon: 'fa-clock-rotate-left' },
    { id: 'ui', label: '界面定制', icon: 'fa-palette' },
    { id: 'maintenance', label: '数据安全', icon: 'fa-screwdriver-wrench' },
  ];

  return (
    <div className="fixed inset-0 z-[500] flex animate-in fade-in duration-500" style={{ fontSize: `${settings.fontSize}%`, backgroundColor: settings.pageBg, color: settings.textColor }}>
      
      <div 
        className="w-80 border-r flex flex-col backdrop-blur-xl"
        style={{ backgroundColor: settings.sidebarBg, borderColor: 'rgba(0,0,0,0.05)' }}
      >
        <div className="p-12">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-2xl rotate-3"
            style={{ backgroundColor: settings.accentColor }}
          >
             <i className="fa-solid fa-microchip text-white text-2xl"></i>
          </div>
          <h2 
            className="text-3xl font-black uppercase tracking-tighter italic"
            style={{ color: settings.primaryFontColor }}
          >
            系统中心
          </h2>
          <p 
            className="text-[10px] font-black uppercase tracking-[0.3em] mt-3"
            style={{ color: settings.mutedFontColor }}
          >
            Control Panel v10.0
          </p>
        </div>
        
        <nav className="flex-1 px-6 space-y-4">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`w-full flex items-center space-x-6 px-8 py-5 rounded-[2rem] transition-all font-black text-[12px] uppercase tracking-widest group ${
                  isActive 
                    ? 'shadow-2xl -translate-y-0.5' 
                    : 'hover:shadow-xl'
                }`}
                style={isActive ? {
                  backgroundColor: settings.sidebarActiveBg,
                  color: settings.sidebarActiveTextColor
                } : {
                  color: settings.sidebarTextColor,
                  backgroundColor: 'transparent'
                }}
              >
                <i className={`fa-solid ${tab.icon} w-6 text-lg group-hover:scale-110 transition-transform`}></i>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-12 border-t" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
          <div className="flex items-center space-x-5">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
              style={{ backgroundColor: settings.accentColor, boxShadow: `0 8px 16px -4px ${settings.accentColor}40` }}
            >
              <i className="fa-solid fa-database text-sm"></i>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: settings.mutedFontColor }}>当前活跃节点</span>
              <span className="text-sm font-black uppercase truncate" style={{ color: settings.primaryFontColor }}>{activeLibrary?.name || '未加载'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative" style={{ backgroundColor: settings.pageBg }}>
        
        <button 
          onClick={onClose}
          className="absolute top-12 right-12 w-16 h-16 border rounded-full flex items-center justify-center transition-all z-50 group active:scale-90"
          style={{ backgroundColor: settings.cardBg, borderColor: 'rgba(0,0,0,0.05)', color: settings.mutedFontColor }}
        >
          <i className={`fa-solid ${UI_ICONS.close} text-2xl group-hover:rotate-90 transition-transform`}></i>
        </button>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-16 lg:p-24 lg:pt-20">
          <div className="max-w-6xl mx-auto">
            
            {activeTab === 'libraries' && (
              <LibraryManagementTab 
                libraries={libraries}
                setLibraries={setLibraries}
                activeLibraryId={activeLibraryId}
                onSwitch={onSwitch}
                onCreate={onCreate}
                onRenameLibrary={onRenameLibrary}
                onDeleteLibrary={onDeleteLibrary}
                showDialog={showDialog}
                settings={settings}
              />
            )}

            {activeTab === 'history' && (
              <AuditTrailTab 
                activeLibrary={activeLibrary}
                activeLibraryId={activeLibraryId}
                settings={settings}
                clearHistory={clearHistory}
                deleteHistoryEntry={deleteHistoryEntry}
              />
            )}

            {activeTab === 'ui' && (
              <UICustomizationTab settings={settings} setSettings={setSettings} showDialog={showDialog} onResetVisuals={onResetVisuals} addLog={addLog} />
            )}

            {activeTab === 'maintenance' && (
              <MaintenanceTab 
                activeLibrary={activeLibrary}
                exportToJSON={exportToJSON}
                copyDataToClipboard={copyDataToClipboard}
                importFromJSON={importFromJSON}
                importFromText={importFromText}
                onReset={onReset}
                settings={settings}
              />
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
