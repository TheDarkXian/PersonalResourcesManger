
import React from 'react';
import { UISettings } from '../types';
import { UI_ICONS } from '../icons/index';

interface ResourceEditHelpViewProps {
  onClose: () => void;
  settings: UISettings;
}

export const ResourceEditHelpView: React.FC<ResourceEditHelpViewProps> = ({ onClose, settings }) => {
  const shortcutGroups = [
    {
      title: '核心操作',
      items: [
        { keys: ['Ctrl', 'S'], desc: '立即保存当前所有修改 (立即同步)' },
        { keys: ['Ctrl', 'E'], desc: '进入 / 退出编辑模式 (开关切换)' },
        { keys: ['Esc'], desc: '返回资源列表 (若有未保存内容会提示)' },
      ]
    },
    {
      title: '快捷导航',
      items: [
        { keys: ['←'], desc: '切换至上一个资源项目 (预览模式下有效)' },
        { keys: ['→'], desc: '切换至下一个资源项目 (预览模式下有效)' },
      ]
    },
    {
      title: '鼠标交互',
      items: [
        { keys: ['Double Click'], desc: '在面板任意空白处双击可快速触发“编辑模式”' },
      ]
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-[700] bg-slate-900/95 backdrop-blur-3xl flex flex-col animate-in fade-in duration-300 text-white"
    >
      <header className="px-12 py-10 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-8">
           <button 
             onClick={onClose}
             className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90"
           >
             <i className={`fa-solid ${UI_ICONS.arrowLeft} text-xl text-white`}></i>
           </button>
           <div>
              <h2 className="text-4xl font-black italic tracking-tighter uppercase">细节面板操作指南</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mt-1">Resource Details Command Center Guide</p>
           </div>
        </div>
        <div className="w-16 h-16 rounded-[2rem] bg-white text-slate-900 flex items-center justify-center shadow-2xl rotate-12">
           <i className="fa-solid fa-keyboard text-2xl"></i>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-12 lg:p-24 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-16">
          {shortcutGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-8">
               <div className="flex items-center space-x-4">
                  <div className="h-px flex-1 bg-white/10"></div>
                  <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">{group.title}</h4>
                  <div className="h-px flex-1 bg-white/10"></div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {group.items.map((item, iIdx) => (
                    <div key={iIdx} className="p-8 rounded-[2rem] border border-white/5 bg-white/5 flex flex-col space-y-4 group hover:bg-white/10 transition-all">
                       <div className="flex items-center space-x-2">
                          {item.keys.map((key, kIdx) => (
                            <React.Fragment key={kIdx}>
                              <kbd className="px-3 py-1.5 rounded-lg bg-white text-slate-900 font-black text-xs shadow-lg">{key}</kbd>
                              {kIdx < item.keys.length - 1 && <span className="text-white/20 font-bold">+</span>}
                            </React.Fragment>
                          ))}
                       </div>
                       <p className="text-sm font-bold text-white/80 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
               </div>
            </div>
          ))}

          <div className="pt-12 text-center opacity-30">
             <i className="fa-solid fa-microchip text-4xl mb-4"></i>
             <p className="text-[9px] font-black uppercase tracking-[0.5em]">Nav-Pro Productivity Engine v10.0</p>
          </div>
        </div>
      </main>
    </div>
  );
};
