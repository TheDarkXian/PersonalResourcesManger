
import React from 'react';
import { Library, UISettings } from '../types';
import { UI_ICONS } from '../icons/index';

interface MaintenanceTabProps {
  activeLibrary?: Library;
  exportToJSON: () => Promise<void>;
  copyDataToClipboard: () => void;
  importFromJSON: () => Promise<void>;
  importFromText: () => void;
  onReset: () => void;
  settings: UISettings;
}

export const MaintenanceTab: React.FC<MaintenanceTabProps> = ({
  activeLibrary,
  exportToJSON,
  copyDataToClipboard,
  importFromJSON,
  importFromText,
  onReset,
  settings
}) => {
  return (
    <div className="space-y-20 animate-in slide-in-from-right duration-500" style={{ backgroundColor: settings.pageBg }}>
      <div className="border-b pb-10" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
         <h3 className="text-5xl font-black italic tracking-tighter uppercase" style={{ color: settings.primaryFontColor }}>数据安全</h3>
         <p className="text-sm font-bold mt-4 tracking-wide" style={{ color: settings.mutedFontColor }}>管理数据离线镜像与手动注入，支持活跃书库的精准同步。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div 
          className="space-y-8 p-12 rounded-[4rem] border shadow-inner"
          style={{ backgroundColor: 'rgba(0,0,0,0.01)', borderColor: 'rgba(0,0,0,0.05)' }}
        >
          <div className="flex items-center space-x-4 mb-4">
             <div className="w-2.5 h-2.5 rounded-full shadow-lg" style={{ backgroundColor: settings.accentColor }}></div>
             <h5 className="text-[14px] font-black uppercase tracking-widest" style={{ color: settings.primaryFontColor }}>导出离线备份 (活跃库)</h5>
          </div>
          <div className="space-y-5">
             <button 
               onClick={exportToJSON} 
               className="w-full flex items-center justify-between px-10 py-7 rounded-[2.5rem] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all group"
               style={{ backgroundColor: settings.cardBg }}
             >
                <div className="flex items-center space-x-6">
                   <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                      <i className="fa-solid fa-download text-xl"></i>
                   </div>
                   <div className="flex flex-col items-start">
                      <span className="font-black text-base tracking-tight" style={{ color: settings.primaryFontColor }}>导出 "{activeLibrary?.name}"</span>
                      <span className="text-[10px] font-bold mt-1 uppercase tracking-widest" style={{ color: settings.mutedFontColor }}>Full JSON Snapshot</span>
                   </div>
                </div>
             </button>
             <button 
               onClick={copyDataToClipboard} 
               className="w-full flex items-center justify-between px-10 py-7 rounded-[2.5rem] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all group"
               style={{ backgroundColor: settings.cardBg }}
             >
                <div className="flex items-center space-x-6">
                   <div className="w-14 h-14 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                      <i className={`fa-solid ${UI_ICONS.copy} text-xl`}></i>
                   </div>
                   <div className="flex flex-col items-start">
                      <span className="font-black text-base tracking-tight" style={{ color: settings.primaryFontColor }}>复制书库数据码</span>
                      <span className="text-[10px] font-bold mt-1 uppercase tracking-widest" style={{ color: settings.mutedFontColor }}>Copy to Clipboard</span>
                   </div>
                </div>
             </button>
          </div>
        </div>

        <div 
          className="space-y-8 p-12 rounded-[4rem] border shadow-inner"
          style={{ backgroundColor: 'rgba(0,0,0,0.01)', borderColor: 'rgba(0,0,0,0.05)' }}
        >
          <div className="flex items-center space-x-4 mb-4">
             <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-lg shadow-emerald-200"></div>
             <h5 className="text-[14px] font-black uppercase tracking-widest" style={{ color: settings.primaryFontColor }}>恢复与数据注入</h5>
          </div>
          <div className="space-y-5">
             <button 
               onClick={importFromJSON}
               className="w-full flex items-center justify-between px-10 py-7 rounded-[2.5rem] shadow-2xl hover:scale-[1.02] transition-all cursor-pointer group" 
               style={{ backgroundColor: settings.restoreBtnBg, color: settings.restoreBtnText }}
             >
                <div className="flex items-center space-x-6">
                   <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <i className="fa-solid fa-upload text-xl"></i>
                   </div>
                   <div className="flex flex-col items-start text-left">
                      <span className="font-black text-base">恢复特定库数据</span>
                      <span className="text-[10px] font-bold opacity-40 mt-1 uppercase tracking-widest">Import from JSON File</span>
                   </div>
                </div>
             </button>
             <button 
               onClick={importFromText} 
               className="w-full flex items-center justify-between px-10 py-7 border-2 rounded-[2.5rem] hover:shadow-2xl hover:-translate-y-1 transition-all group"
               style={{ backgroundColor: settings.cardBg, borderColor: settings.primaryFontColor, color: settings.primaryFontColor }}
             >
                <div className="flex items-center space-x-6 text-left">
                   <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                      <i className="fa-solid fa-paste text-xl"></i>
                   </div>
                   <div className="flex flex-col items-start">
                      <span className="font-black text-base tracking-tight" style={{ color: settings.primaryFontColor }}>手动粘贴注入</span>
                      <span className="text-[10px] font-bold mt-1 uppercase tracking-widest" style={{ color: settings.mutedFontColor }}>Manual Text Stream</span>
                   </div>
                </div>
             </button>
          </div>
        </div>
      </div>

      <div 
        className="p-16 rounded-[4rem] border flex items-center justify-between shadow-[0_20px_50px_-20px_rgba(225,29,72,0.1)]"
        style={{ backgroundColor: 'rgba(225,29,72,0.05)', borderColor: 'rgba(225,29,72,0.1)' }}
      >
         <div className="space-y-5 max-w-2xl">
            <div className="flex items-center space-x-5 text-rose-600">
               <i className="fa-solid fa-fire text-2xl"></i>
               <span className="text-lg font-black uppercase tracking-[0.3em]">全域数据销毁协议</span>
            </div>
            <p className="text-sm font-bold text-rose-500/80 leading-relaxed">该操作将永久清空本地 IndexedDB 与 LocalStorage 中的所有书库镜像、操作审计与全局偏好。资源一旦焚毁将无法找回。</p>
         </div>
         <button 
           onClick={onReset} 
           className="px-12 py-6 bg-rose-600 text-white rounded-[2rem] font-black text-[13px] uppercase tracking-widest shadow-2xl shadow-rose-200 hover:bg-rose-700 active:scale-95 transition-all flex items-center space-x-4"
         >
           <span>立即执行冷重置</span>
           <i className="fa-solid fa-skull-crossbones"></i>
         </button>
      </div>
    </div>
  );
};
