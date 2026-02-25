
import React, { useState } from 'react';
import { UI_ICONS } from '../icons/index';
import { UISettings, Library, Tag } from '../types';
import { auditService } from '../utils/auditService';
import { platformAdapter } from '../utils/platformAdapter';

interface CreateLibraryPanelViewProps {
  onClose: () => void;
  onCreate: (lib: Library) => void;
  settings: UISettings;
  addLog: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const SYSTEM_DEFAULT_TAG: Tag = { 
  id: 'system-default-tag', 
  name: '默认', 
  color: '#94a3b8', 
  displayMode: 'all', 
  icon: 'fa-folder', 
  isDefault: true 
};

export const CreateLibraryPanelView: React.FC<CreateLibraryPanelViewProps> = ({
  onClose,
  onCreate,
  settings,
  addLog
}) => {
  const [activeTab, setActiveTab] = useState<'empty' | 'file' | 'text'>('empty');
  const [name, setName] = useState('');
  const [jsonText, setJsonText] = useState('');

  const handleEmptyCreate = () => {
    if (!name.trim()) return;
    const newLib: Library = {
      id: crypto.randomUUID(),
      name: name.trim(),
      resources: [],
      tags: [], // 不存储默认标签对象，由系统硬编码动态注入
      createdAt: Date.now(),
      updatedAt: Date.now(),
      history: [auditService.createEntry('库创建', `库 "${name}" 手动空创建`)]
    };
    onCreate(newLib);
  };

  const sanitizeLibraryData = (data: any): Library => {
    let sanitizedTags = Array.isArray(data.tags) ? data.tags : [];
    // 核心增强：剥离导入数据中可能存在的系统默认标签对象
    sanitizedTags = sanitizedTags.filter((t: Tag) => t.id !== SYSTEM_DEFAULT_TAG.id);

    return {
      id: data.id || crypto.randomUUID(),
      name: data.name || '未命名书库',
      resources: Array.isArray(data.resources) ? data.resources : [],
      tags: sanitizedTags,
      createdAt: data.createdAt || Date.now(),
      updatedAt: data.updatedAt || Date.now(),
      history: Array.isArray(data.history) ? [auditService.createEntry('库导入', '数据已恢复'), ...data.history] : [auditService.createEntry('库导入', '数据已恢复')]
    };
  };

  const handleFileImportClick = async () => {
    const files = await platformAdapter.pickFile({ accept: '.json' });
    if (!files || files.length === 0) return;
    
    try {
      const content = await platformAdapter.readTextFile(files[0]);
      const p = JSON.parse(content);
      const newLib = sanitizeLibraryData(p);
      onCreate(newLib);
    } catch (err) {
      addLog('文件解析失败：非法的书库 JSON 数据', 'error');
    }
  };

  const handleTextImport = () => {
    if (!jsonText.trim()) return;
    try {
      const p = JSON.parse(jsonText);
      const newLib = sanitizeLibraryData(p);
      onCreate(newLib);
    } catch (err) {
      addLog('文本解析错误：非法的 JSON 数据', 'error');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[1000] flex flex-col animate-in slide-in-from-bottom duration-500"
      style={{ backgroundColor: settings.pageBg, color: settings.textColor }}
    >
      <header className="px-12 py-8 border-b flex items-center justify-between" style={{ borderColor: 'rgba(0,0,0,0.05)', backgroundColor: settings.headerBg }}>
        <div className="flex items-center space-x-8">
           <button onClick={onClose} className="w-12 h-12 rounded-full hover:bg-black/5 flex items-center justify-center transition-all">
              <i className="fa-solid fa-arrow-left text-xl"></i>
           </button>
           <div className="flex flex-col">
              <h2 className="text-3xl font-black italic tracking-tighter uppercase" style={{ color: settings.primaryFontColor }}>初始化存储节点</h2>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Create New Storage Library</span>
           </div>
        </div>
        <div className="flex p-1 rounded-2xl" style={{ backgroundColor: settings.createTabBg }}>
          {[
            { id: 'empty', label: '空库创建', icon: 'fa-plus' },
            { id: 'file', label: '文件导入', icon: 'fa-file-import' },
            { id: 'text', label: '数据流注入', icon: 'fa-terminal' },
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center space-x-2 ${isActive ? 'shadow-sm' : ''}`}
                style={{ 
                  backgroundColor: isActive ? settings.createTabActiveBg : 'transparent', 
                  color: isActive ? settings.createTabActiveText : settings.createTabInactiveText 
                }}
              >
                <i className={`fa-solid ${tab.icon}`}></i>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-12 overflow-y-auto">
        <div className="max-w-xl w-full">
          {activeTab === 'empty' && (
            <div className="space-y-10 animate-in fade-in zoom-in duration-300">
               <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                     <i className="fa-solid fa-database text-3xl"></i>
                  </div>
                  <p className="text-sm font-bold opacity-60">请为您的新书库指定一个唯一的标识名称。</p>
               </div>
               <div className="space-y-4">
                  <input 
                    type="text" 
                    autoFocus
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="例如：灵感素材库 / 个人项目归档"
                    className="w-full px-8 py-5 border-2 rounded-[2rem] text-lg font-black outline-none transition-all shadow-inner focus:border-blue-500"
                    style={{ backgroundColor: settings.cardBg, borderColor: 'rgba(0,0,0,0.05)' }}
                  />
                  <button 
                    onClick={handleEmptyCreate}
                    disabled={!name.trim()}
                    className="w-full py-6 rounded-[2rem] font-black text-[13px] uppercase tracking-widest transition-all shadow-2xl disabled:opacity-30"
                    style={{ backgroundColor: settings.accentColor, color: '#ffffff' }}
                  >
                    立即初始化
                  </button>
               </div>
            </div>
          )}

          {activeTab === 'file' && (
            <div className="space-y-10 animate-in fade-in zoom-in duration-300">
               <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                     <i className="fa-solid fa-file-import text-3xl"></i>
                  </div>
                  <p className="text-sm font-bold opacity-60">选择先前导出的 JSON 书库镜像文件进行快速恢复。</p>
               </div>
               <button 
                 onClick={handleFileImportClick}
                 className="w-full py-16 border-4 border-dashed rounded-[3rem] flex flex-col items-center justify-center space-y-4 group transition-all"
                 style={{ borderColor: 'rgba(0,0,0,0.05)', backgroundColor: 'rgba(0,0,0,0.01)' }}
               >
                  <i className="fa-solid fa-cloud-arrow-up text-4xl opacity-20 group-hover:scale-110 transition-transform"></i>
                  <span className="text-xs font-black uppercase tracking-widest opacity-40">点击此处选择文件</span>
               </button>
            </div>
          )}

          {activeTab === 'text' && (
            <div className="space-y-10 animate-in fade-in zoom-in duration-300">
               <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                     <i className="fa-solid fa-terminal text-3xl"></i>
                  </div>
                  <p className="text-sm font-bold opacity-60">粘贴书库 JSON 代码流以实现跨端快速数据注入。</p>
               </div>
               <div className="space-y-4">
                  <textarea 
                    value={jsonText}
                    onChange={e => setJsonText(e.target.value)}
                    placeholder='{"name": "我的书库", "resources": [...]}'
                    className="w-full h-64 px-6 py-5 border-2 rounded-[2rem] font-mono text-[10px] outline-none transition-all shadow-inner focus:border-blue-500"
                    style={{ backgroundColor: settings.cardBg, borderColor: 'rgba(0,0,0,0.05)' }}
                  />
                  <button 
                    onClick={handleTextImport}
                    disabled={!jsonText.trim()}
                    className="w-full py-6 rounded-[2rem] font-black text-[13px] uppercase tracking-widest transition-all shadow-2xl disabled:opacity-30"
                    style={{ backgroundColor: settings.accentColor, color: '#ffffff' }}
                  >
                    确认注入数据
                  </button>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
