
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Resource, Tag, UISettings } from '../types';
import { UI_ICONS, TagIcon, getFileTypeInfo } from '../icons/index';
import { platformAdapter } from '../utils/platformAdapter';
import { getContrastYIQ } from '../utils/helpers';
import { getResourceCreateTheme } from '../styles/resourceCreateTheme';
import { LivePreview } from '../components/LivePreview';

interface ResourceCreateViewProps {
  onClose: () => void;
  onCreate: (res: Resource) => void;
  onOpenTagCenter: () => void; // 新增：跳转标签中心回调
  tags: Tag[];
  settings: UISettings;
  defaultTagId: string;
  sessionFileMap: Map<string, File>;
  updateSessionFileMap: (id: string, file: File) => void;
}

export const ResourceCreateView: React.FC<ResourceCreateViewProps> = ({
  onClose,
  onCreate,
  onOpenTagCenter,
  tags,
  settings,
  defaultTagId,
  sessionFileMap,
  updateSessionFileMap
}) => {
  const theme = getResourceCreateTheme(settings);
  
  const [newRes, setNewRes] = useState<Resource>({
    id: crypto.randomUUID(),
    title: '',
    type: 'url',
    pathOrUrl: '',
    tags: [defaultTagId],
    color: '#ffffff',
    titleColor: '#000000',
    notes: '',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    lastAccessedAt: 0
  });

  const [textContent, setTextContent] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const relocationFileRef = useRef<HTMLInputElement>(null);
  const relocationDirRef = useRef<HTMLInputElement>(null);

  const { isImage, isVideo, isText } = getFileTypeInfo(newRes.pathOrUrl);

  // Added useMemo to the React imports to resolve the undefined reference
  const activeLocalFile = useMemo(() => sessionFileMap.get(newRes.id), [newRes.id, sessionFileMap]);

  const updateNewRes = (updates: Partial<Resource>) => {
    setNewRes(prev => ({ ...prev, ...updates }));
  };

  const handleToggleTag = (tagId: string) => {
    const active = newRes.tags.includes(tagId);
    let nextTags: string[];
    if (active) {
      if (newRes.tags.length <= 1) return;
      nextTags = newRes.tags.filter(id => id !== tagId);
    } else {
      nextTags = [...newRes.tags, tagId];
    }
    updateNewRes({ tags: nextTags });
  };

  const handleSubmit = () => {
    if (!newRes.title.trim()) return;
    onCreate({ ...newRes, updatedAt: Date.now() });
    onClose();
  };

  const handleRelocationSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const path = platformAdapter.getFilePath(f);
      updateNewRes({ pathOrUrl: path });
      updateSessionFileMap(newRes.id, f);
    }
  };

  useEffect(() => {
    const localFile = activeLocalFile;
    setPreviewUrl(null);
    setTextContent(null);
    setLoadingText(false);

    if (isImage || isVideo) {
      if (localFile) setPreviewUrl(platformAdapter.createPreviewUrl(localFile));
      else if (newRes.pathOrUrl.startsWith('http')) setPreviewUrl(newRes.pathOrUrl);
    }

    if (isText) {
      setLoadingText(true);
      if (localFile) {
        platformAdapter.readTextFile(localFile)
          .then(text => { setTextContent(text.slice(0, 10000)); setLoadingText(false); })
          .catch(() => { setTextContent("预览读取失败"); setLoadingText(false); });
      } else if (newRes.pathOrUrl.startsWith('http')) {
        fetch(newRes.pathOrUrl).then(r => r.text()).then(t => { setTextContent(t.slice(0, 10000)); setLoadingText(false); }).catch(() => setLoadingText(false));
      } else {
        setLoadingText(false);
      }
    }

    return () => { if (previewUrl && previewUrl.startsWith('blob:')) platformAdapter.revokePreviewUrl(previewUrl); };
  }, [newRes.id, newRes.pathOrUrl, isImage, isVideo, isText, activeLocalFile]);

  return (
    <div className="fixed inset-0 z-[400] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-500" style={{ backgroundColor: theme.container.bg }}>
      <header className="px-8 py-4 border-b flex items-center justify-between" style={{ backgroundColor: theme.header.bg, borderColor: theme.header.border }}>
        <div className="flex items-center space-x-5">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-900">
            <i className={`fa-solid ${UI_ICONS.close} text-lg`}></i>
          </button>
          <div className="flex flex-col">
            <h2 className="text-xl font-black italic tracking-tighter uppercase leading-none" style={{ color: theme.header.titleColor }}>初始化新资源</h2>
            <span className="text-[8px] font-black uppercase tracking-[0.2em] mt-1" style={{ color: theme.header.subtitleColor }}>Resource Node Initialization</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-black text-[10px] uppercase transition-all" style={{ color: theme.footer.cancelBtnText }}>
            取消
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!newRes.title.trim()}
            className="px-8 py-2.5 rounded-xl font-black text-[10px] uppercase text-white shadow-xl transition-all active:scale-95 disabled:opacity-30"
            style={{ backgroundColor: theme.footer.createBtnBg, boxShadow: `0 10px 20px -5px ${theme.footer.createBtnShadow}` }}
          >
            立即入库
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8">
          <div className="col-span-7 space-y-5">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest ml-1" style={{ color: theme.form.labelColor }}>资源标题</label>
              <input 
                type="text" 
                autoFocus
                value={newRes.title}
                onChange={e => updateNewRes({ title: e.target.value })}
                placeholder="在此输入显示名称..."
                className="w-full text-2xl font-black px-4 py-3 border rounded-2xl outline-none transition-all shadow-inner"
                style={{ backgroundColor: theme.form.inputBg, borderColor: theme.form.inputBorder, color: settings.primaryFontColor }}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest ml-1" style={{ color: theme.form.labelColor }}>寻址协议</label>
                <select 
                  value={newRes.type}
                  onChange={e => updateNewRes({ type: e.target.value as any })}
                  className="w-full p-3 border rounded-xl font-bold text-xs appearance-none cursor-pointer outline-none"
                  style={{ backgroundColor: theme.form.inputBg, borderColor: theme.form.inputBorder, color: settings.primaryFontColor }}
                >
                  <option value="url">🌐 网络访问链接</option>
                  <option value="local-file">📄 本地单个文件</option>
                  <option value="local-folder">📁 系统文件夹</option>
                  <option value="text-note">📝 文本笔记</option>
                  <option value="cloud">☁️ 云存档地址</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest ml-1" style={{ color: theme.form.labelColor }}>主题色</label>
                <input 
                  type="color" 
                  value={newRes.color || '#ffffff'}
                  onChange={e => updateNewRes({ color: e.target.value })}
                  className="w-full h-10 rounded-xl p-1 bg-white border cursor-pointer"
                  style={{ borderColor: theme.form.inputBorder }}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest ml-1" style={{ color: theme.form.labelColor }}>字体色</label>
                <input 
                  type="color" 
                  value={newRes.titleColor || '#000000'}
                  onChange={e => updateNewRes({ titleColor: e.target.value })}
                  className="w-full h-10 rounded-xl p-1 bg-white border cursor-pointer"
                  style={{ borderColor: theme.form.inputBorder }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest ml-1" style={{ color: theme.form.labelColor }}>物理寻址 / 内容</label>
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  value={newRes.pathOrUrl}
                  onChange={e => updateNewRes({ pathOrUrl: e.target.value })}
                  placeholder="输入绝对路径、Web 网址或笔记内容..."
                  className="flex-1 p-3 border rounded-xl font-mono text-[10px] outline-none shadow-inner"
                  style={{ backgroundColor: theme.form.inputBg, borderColor: theme.form.inputBorder, color: settings.secondaryFontColor }}
                />
                {(newRes.type === 'local-file' || newRes.type === 'local-folder') && (
                  <>
                    <button 
                      onClick={() => newRes.type === 'local-file' ? relocationFileRef.current?.click() : relocationDirRef.current?.click()}
                      className="px-4 border rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all"
                      style={{ borderColor: theme.form.inputBorder, color: settings.accentColor }}
                    >
                      <i className="fa-solid fa-folder-open mr-1"></i>浏览
                    </button>
                    <input type="file" ref={relocationFileRef} onChange={handleRelocationSelect} hidden />
                    <input type="file" ref={relocationDirRef} onChange={handleRelocationSelect} {...{webkitdirectory: "", directory: ""} as any} hidden />
                  </>
                )}
              </div>
            </div>

            <LivePreview 
              previewUrl={previewUrl}
              textContent={textContent}
              loadingText={loadingText}
              isImage={isImage}
              isVideo={isVideo}
              isText={isText}
              file={activeLocalFile} 
              headerLabel="引擎预览实时流"
              className="h-64 rounded-3xl"
              theme={{
                bg: theme.preview.bg,
                border: theme.preview.border,
                emptyIcon: theme.preview.emptyIcon,
                emptyText: theme.preview.emptyText,
              }}
            />
          </div>

          <div className="col-span-5 flex flex-col space-y-6">
            <div className="p-6 rounded-3xl border" style={{ backgroundColor: theme.sidebar.sectionBg, borderColor: theme.sidebar.sectionBorder }}>
               <div className="flex items-center justify-between mb-4">
                  <label className="text-[9px] font-black uppercase tracking-widest block" style={{ color: theme.sidebar.tagLabel }}>多维标签关联</label>
                  <button 
                    onClick={onOpenTagCenter}
                    className="text-[8px] font-bold opacity-40 hover:opacity-100 hover:underline transition-all uppercase tracking-tighter"
                    style={{ color: settings.accentColor }}
                  >
                    管理标签库 <i className="fa-solid fa-arrow-up-right-from-square ml-1 text-[6px]"></i>
                  </button>
               </div>
               <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                 {tags.map(t => {
                   const isActive = newRes.tags.includes(t.id);
                   return (
                     <button 
                       key={t.id} 
                       onClick={() => handleToggleTag(t.id)}
                       className={`p-2 rounded-xl text-[9px] font-black border transition-all flex items-center justify-between ${isActive ? 'shadow-sm' : 'opacity-60'}`}
                       style={isActive ? { backgroundColor: t.color, color: getContrastYIQ(t.color), borderColor: t.color } : { borderColor: t.color + '40', color: t.color, backgroundColor: 'white' }}
                     >
                       <div className="flex items-center space-x-2 truncate">
                         <TagIcon icon={t.icon} customIcon={t.customIcon} className="w-2.5 h-2.5" />
                         <span>{t.name}</span>
                       </div>
                       {isActive && <i className="fa-solid fa-check text-[7px]"></i>}
                     </button>
                   );
                 })}
               </div>
            </div>

            <div className="flex-1 flex flex-col space-y-1">
               <label className="text-[9px] font-black uppercase tracking-widest ml-1" style={{ color: theme.form.labelColor }}>资源备忘</label>
               <textarea 
                 value={newRes.notes}
                 onChange={e => updateNewRes({ notes: e.target.value })}
                 placeholder="记下关于此资源的背景信息..."
                 className="flex-1 w-full p-5 border rounded-3xl outline-none resize-none transition-all shadow-inner text-xs"
                 style={{ backgroundColor: theme.form.inputBg, borderColor: theme.form.inputBorder, color: settings.primaryFontColor }}
               />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
