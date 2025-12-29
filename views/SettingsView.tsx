
import React from 'react';
import { UISettings, DialogState } from '../types';
import { UI_ICONS } from '../icons/index';

interface SettingsViewProps {
  settings: UISettings;
  setSettings: (s: UISettings) => void;
  onClose: () => void;
  exportToJSON: () => void;
  copyDataToClipboard: () => void;
  importFromJSON: (e: React.ChangeEvent<HTMLInputElement>) => void;
  importFromText: () => void;
  onReset: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  setSettings,
  onClose,
  exportToJSON,
  copyDataToClipboard,
  importFromJSON,
  importFromText,
  onReset
}) => {
  return (
    <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6" onKeyDown={(e) => e.key === 'Escape' && onClose()}>
      <div className="bg-white w-full max-w-2xl rounded overflow-hidden shadow-2xl animate-in zoom-in duration-200" role="dialog" aria-modal="true">
        <div className="p-6 border-b border-slate-100 flex items-center bg-slate-50">
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded transition-colors mr-4" aria-label="关闭设置"><i className={`fa-solid ${UI_ICONS.close} text-xl`}></i></button>
          <h2 className="text-xl font-black uppercase flex-1">Preferences</h2>
        </div>
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase block">全局字体: {settings.fontSize}%</label>
              <input type="range" min="50" max="250" value={settings.fontSize} onChange={e => setSettings({...settings, fontSize: parseInt(e.target.value)})} className="w-full accent-slate-900" />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase block">UI 界面比例: {settings.uiScale}%</label>
              <input type="range" min="50" max="200" value={settings.uiScale} onChange={e => setSettings({...settings, uiScale: parseInt(e.target.value)})} className="w-full accent-slate-900" />
            </div>
          </div>
          <div className="pt-6 border-t border-slate-100 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">数据持久化管理</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">备份与导出</label>
                <div className="flex flex-col gap-2">
                  <button onClick={exportToJSON} className="w-full text-left px-4 py-2 bg-slate-100 rounded text-[11px] font-bold hover:bg-slate-200 flex items-center justify-between"><span>下载 JSON 备份文件</span><i className="fa-solid fa-download"></i></button>
                  <button onClick={copyDataToClipboard} className="w-full text-left px-4 py-2 bg-slate-100 rounded text-[11px] font-bold hover:bg-slate-200 flex items-center justify-between"><span>复制 JSON 文本</span><i className={`fa-solid ${UI_ICONS.copy}`}></i></button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">恢复与导入</label>
                <div className="flex flex-col gap-2">
                  <label className="w-full text-left px-4 py-2 bg-slate-900 text-white rounded text-[11px] font-bold hover:bg-black flex items-center justify-between cursor-pointer"><span>从文件恢复数据</span><i className="fa-solid fa-upload"></i><input type="file" accept=".json" onChange={importFromJSON} hidden /></label>
                  <button onClick={importFromText} className="w-full text-left px-4 py-2 bg-white border border-slate-900 text-slate-900 rounded text-[11px] font-bold hover:bg-slate-50 flex items-center justify-between"><span>粘贴文本导入</span><i className="fa-solid fa-paste"></i></button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-4 pt-8 border-t border-slate-100">
            <button onClick={onReset} className="px-6 py-2 border border-rose-200 text-rose-500 rounded font-black text-[10px] uppercase">抹除数据库</button>
            <div className="flex-1"></div>
            <button onClick={onClose} className="px-10 py-2.5 bg-slate-900 text-white rounded font-black text-[11px] uppercase shadow-lg">关闭设置</button>
          </div>
        </div>
      </div>
    </div>
  );
};
