
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Resource, Tag, UISettings } from '../types';
import { UI_ICONS, TagIcon, getFileTypeInfo } from '../icons/index';
import { platformAdapter } from '../utils/platformAdapter';
import { formatDate } from '../utils/helpers';
import { SaveConfirmationDialog } from '../components/SaveConfirmationDialog';
import { EditModeExitDialog } from '../components/EditModeExitDialog';
import { LivePreview } from '../components/LivePreview';
import { getResourceEditTheme } from '../styles/resourceEditTheme';
import { ResourceEditHelpView } from './ResourceEditHelpView';

interface ResourceEditViewProps {
  editingResource: Resource;
  updateEditingResource: (updates: Partial<Resource>) => void;
  undoStack: Resource[];
  onUndo: () => void;
  onSave: () => void;
  onClose: () => void;
  tags: Tag[];
  tagSearch: string;
  setTagSearch: (s: string) => void;
  relocationFileRef: React.RefObject<HTMLInputElement>;
  relocationDirRef: React.RefObject<HTMLInputElement>;
  onRelocationSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPathAction: (action: 'copy' | 'open') => void;
  onCopyNotes: () => void;
  onOpenTagCenter: () => void; // 新增：跳转标签中心回调
  settings: UISettings;
  getContrastYIQ: (hex: string) => string;
  prevResource: Resource | null;
  nextResource: Resource | null;
  onNavigate: (res: Resource, direction: 'prev' | 'next') => void;
  navDirection: 'prev' | 'next' | 'none';
  sessionFileMap: Map<string, File>;
  isEditMode: boolean;
  setIsEditMode: (v: boolean) => void;
}

export const ResourceEditView: React.FC<ResourceEditViewProps> = ({
  editingResource,
  updateEditingResource,
  undoStack,
  onUndo,
  onSave,
  onClose,
  tags,
  tagSearch,
  setTagSearch,
  relocationFileRef,
  relocationDirRef,
  onRelocationSelect,
  onPathAction,
  onCopyNotes,
  onOpenTagCenter,
  settings,
  getContrastYIQ,
  prevResource,
  nextResource,
  onNavigate,
  navDirection,
  sessionFileMap,
  isEditMode,
  setIsEditMode
}) => {
  const [textContent, setTextContent] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [showReturnConfirm, setShowReturnConfirm] = useState(false);
  const [showEditExitConfirm, setShowEditExitConfirm] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  const titleInputRef = useRef<HTMLInputElement>(null);
  const theme = getResourceEditTheme(settings);

  const initialStateSnapshot = useRef<string>(JSON.stringify(editingResource));

  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(editingResource) !== initialStateSnapshot.current;
  }, [editingResource]);

  const { isImage, isVideo, isText } = getFileTypeInfo(editingResource.pathOrUrl);

  const activeLocalFile = useMemo(() => sessionFileMap.get(editingResource.id), [editingResource.id, sessionFileMap]);

  const toggleEditMode = () => {
    if (isEditMode && hasUnsavedChanges) {
      setShowEditExitConfirm(true);
    } else {
      setIsEditMode(!isEditMode);
    }
  };

  const handleManualSave = () => {
    if (!isEditMode && !hasUnsavedChanges) return;
    onSave();
    initialStateSnapshot.current = JSON.stringify({ ...editingResource, updatedAt: Date.now() });
  };

  const handleAttemptClose = () => {
    if (hasUnsavedChanges) {
      setShowReturnConfirm(true);
    } else {
      onClose();
    }
  };

  const handleToggleTag = (tagId: string) => {
    if (!isEditMode) return; 

    const isActive = editingResource.tags?.includes(tagId);
    let nextTags: string[];
    
    if (isActive) {
      if ((editingResource.tags?.length || 0) <= 1) return; 
      nextTags = editingResource.tags.filter(id => id !== tagId);
    } else {
      nextTags = [...(editingResource.tags || []), tagId];
    }
    
    updateEditingResource({ tags: nextTags });
  };

  /**
   * 核心修改：移除双击控件限制，全域双击激活编辑模式
   */
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!isEditMode) {
       setIsEditMode(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showHelp) {
          setShowHelp(false);
        } else {
          handleAttemptClose();
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleManualSave();
        return;
      }

      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        toggleEditMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, hasUnsavedChanges, isEditMode, showHelp, editingResource]);

  useEffect(() => {
    setPreviewUrl(null);
    setTextContent(null);
    setLoadingText(false);

    const localFile = activeLocalFile;
    if ((isImage || isVideo)) {
      if (localFile) setPreviewUrl(platformAdapter.createPreviewUrl(localFile));
      else if (editingResource.pathOrUrl.startsWith('http')) setPreviewUrl(editingResource.pathOrUrl);
    }

    if (isText) {
      setLoadingText(true);
      if (localFile) {
        platformAdapter.readTextFile(localFile)
          .then(text => { setTextContent(text.slice(0, 20000)); setLoadingText(false); })
          .catch(() => { setTextContent("读取失败"); setLoadingText(false); });
      } else if (editingResource.pathOrUrl.startsWith('http')) {
        fetch(editingResource.pathOrUrl)
          .then(res => res.text())
          .then(text => { setTextContent(text.slice(0, 20000)); setLoadingText(false); })
          .catch(() => { setTextContent("无法加载"); setLoadingText(false); });
      } else {
        setTextContent("请重新关联物理文件以预览文本内容。");
        setLoadingText(false);
      }
    }

    return () => { if (previewUrl && previewUrl.startsWith('blob:')) platformAdapter.revokePreviewUrl(previewUrl); };
  }, [editingResource.id, isImage, isVideo, isText, editingResource.pathOrUrl, activeLocalFile]);

  const animationClass = navDirection === 'next' 
    ? 'animate-in slide-in-from-right-10 duration-300' 
    : navDirection === 'prev' 
    ? 'animate-in slide-in-from-left-10 duration-300' 
    : 'animate-in fade-in duration-300';

  const activeHeaderBg = editingResource.color && editingResource.color !== '#ffffff' ? editingResource.color : settings.detailsHeaderBg;
  const activeHeaderBorder = editingResource.color && editingResource.color !== '#ffffff' ? 'rgba(0,0,0,0.1)' : settings.detailsHeaderBorder;
  const activeHeaderTextColor = editingResource.titleColor && editingResource.titleColor !== '#000000' ? editingResource.titleColor : settings.primaryFontColor;

  return (
    <div 
      className={`fixed inset-0 z-[200] flex flex-col overflow-hidden ${animationClass}`}
      style={{ backgroundColor: theme.main.bg }}
      onDoubleClick={handleDoubleClick}
    >
      <header 
        className="px-8 py-3 border-b flex items-center justify-between z-20 transition-colors duration-300 shadow-sm"
        style={{ backgroundColor: activeHeaderBg, borderColor: activeHeaderBorder }}
      >
        <div className="flex items-center space-x-6">
          <button 
            onClick={handleAttemptClose} 
            className="p-2 rounded transition-all font-bold text-sm"
            style={{ color: activeHeaderTextColor }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <i className={`fa-solid ${UI_ICONS.arrowLeft} mr-2`}></i> 返回列表
          </button>
          
          <div className="h-8 w-px mx-1 bg-black/5"></div>
          
          <button 
            onClick={() => setShowHelp(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
            style={{ color: activeHeaderTextColor, opacity: 0.4 }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.4')}
            title="查看操作说明"
          >
            <i className="fa-solid fa-circle-question text-lg"></i>
          </button>

          {!isEditMode && (
            <>
              <div className="h-8 w-px mx-1" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}></div>
              <div className="flex items-center space-x-2">
                <button 
                  disabled={!prevResource}
                  onClick={() => prevResource && onNavigate(prevResource, 'prev')}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                  style={{ 
                    color: activeHeaderTextColor,
                    opacity: prevResource ? 1 : 0.2,
                    cursor: prevResource ? 'pointer' : 'not-allowed'
                  }}
                  onMouseEnter={(e) => prevResource && (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <i className="fa-solid fa-chevron-left text-xs"></i>
                </button>
                <button 
                  disabled={!nextResource}
                  onClick={() => nextResource && onNavigate(nextResource, 'next')}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                  style={{ 
                    color: activeHeaderTextColor,
                    opacity: nextResource ? 1 : 0.2,
                    cursor: nextResource ? 'pointer' : 'not-allowed'
                  }}
                  onMouseEnter={(e) => nextResource && (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <i className="fa-solid fa-chevron-right text-xs"></i>
                </button>
              </div>
            </>
          )}

          <div className="flex flex-col ml-4">
            <span className="text-[9px] font-black uppercase tracking-tighter" style={{ color: activeHeaderTextColor, opacity: 0.6 }}>资源状态</span>
            <div className="flex items-center space-x-4">
              <span className="text-[10px] font-bold" style={{ color: activeHeaderTextColor }}>ID: {editingResource.id.split('-')[0]}</span>
              <span className="text-[10px] font-bold" style={{ color: activeHeaderTextColor }}>VER: {formatDate(editingResource.updatedAt).split(' ')[1]}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
           {isEditMode && hasUnsavedChanges && (
             <div 
               className="text-[9px] font-black uppercase flex items-center animate-pulse mr-2"
               style={{ color: activeHeaderTextColor }}
             >
               <i className="fa-solid fa-circle-dot mr-1.5"></i> 已修改
             </div>
           )}

           <button 
             onClick={toggleEditMode}
             className="px-6 py-2.5 rounded font-black text-[11px] uppercase transition-all flex items-center space-x-2 border-2"
             style={isEditMode ? {
               backgroundColor: theme.buttons.editMode.active.bg,
               borderColor: theme.buttons.editMode.active.border,
               color: theme.buttons.editMode.active.text
             } : {
               backgroundColor: theme.buttons.editMode.inactive.bg,
               borderColor: theme.buttons.editMode.inactive.border,
               color: theme.buttons.editMode.inactive.text
             }}
           >
             <i className={`fa-solid ${isEditMode ? 'fa-lock-open' : 'fa-pen-to-square'}`}></i>
             <span>{isEditMode ? '锁定编辑' : '进入编辑模式'}</span>
           </button>

           <div className="h-8 w-px mx-1" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}></div>

           <button 
              onClick={handleManualSave} 
              disabled={!isEditMode && !hasUnsavedChanges}
              title="快捷键: Ctrl+S"
              className="px-8 py-2.5 rounded font-black text-[11px] uppercase transition-all flex items-center space-x-2 shadow-2xl disabled:shadow-none"
              style={ (isEditMode || hasUnsavedChanges) ? {
                backgroundColor: settings.accentColor,
                color: '#ffffff',
                cursor: 'pointer'
              } : {
                backgroundColor: 'rgba(0,0,0,0.05)',
                color: activeHeaderTextColor,
                opacity: 0.3,
                cursor: 'not-allowed'
              }}
            >
              <i className="fa-solid fa-cloud-arrow-up"></i>
              <span>立即同步</span>
            </button>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 max-w-7xl mx-auto w-full grid grid-cols-12 gap-8 relative z-10">
        <div className="col-span-7 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase block tracking-widest ml-1" style={{ color: theme.form.label }}>资源标题</label>
            <input 
              ref={titleInputRef}
              type="text" 
              readOnly={!isEditMode}
              value={editingResource.title} 
              placeholder="请输入标题..."
              onChange={e => updateEditingResource({title: e.target.value})} 
              className="w-full text-2xl font-bold px-4 py-2 rounded-xl outline-none transition-all"
              style={{
                backgroundColor: theme.form.input.bg,
                border: isEditMode ? `1px solid ${theme.form.input.focusBorder}` : '1px solid transparent',
                color: theme.form.input.readOnlyText,
                cursor: isEditMode ? 'text' : 'default'
              }}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase block tracking-widest ml-1" style={{ color: theme.form.label }}>资源类别</label>
              <select 
                disabled={!isEditMode}
                value={editingResource.type} 
                onChange={e => updateEditingResource({type: e.target.value as any})} 
                className="w-full p-2 border rounded-xl font-bold text-sm outline-none transition-all"
                style={{
                  backgroundColor: theme.form.input.bg,
                  borderColor: theme.form.input.border,
                  color: theme.form.input.readOnlyText,
                  opacity: isEditMode ? 1 : 0.8,
                  cursor: isEditMode ? 'pointer' : 'default'
                }}
              >
                <option value="url">🌐 网络访问链接</option>
                <option value="local-file">📄 本地单个文件</option>
                <option value="local-folder">📁 系统文件夹</option>
                <option value="text-note">📝 文本笔记</option>
                <option value="cloud">☁️ 云存档地址</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase block tracking-widest ml-1" style={{ color: theme.form.label }}>卡片主题色</label>
              <input 
                type="color" 
                disabled={!isEditMode}
                value={editingResource.color || '#ffffff'}
                onChange={e => updateEditingResource({color: e.target.value})} 
                className="w-full h-9 rounded-xl border p-1 transition-all"
                style={{
                  backgroundColor: theme.form.input.bg,
                  borderColor: theme.form.input.border,
                  cursor: isEditMode ? 'pointer' : 'not-allowed',
                  opacity: isEditMode ? 1 : 0.5
                }}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase block tracking-widest ml-1" style={{ color: theme.form.label }}>标题字体色</label>
              <input 
                type="color" 
                disabled={!isEditMode}
                value={editingResource.titleColor || '#000000'}
                onChange={e => updateEditingResource({titleColor: e.target.value})} 
                className="w-full h-9 rounded-xl border p-1 transition-all"
                style={{
                  backgroundColor: theme.form.input.bg,
                  borderColor: theme.form.input.border,
                  cursor: isEditMode ? 'pointer' : 'not-allowed',
                  opacity: isEditMode ? 1 : 0.5
                }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase block tracking-widest ml-1" style={{ color: theme.form.label }}>物理地址 / 链接 / 内容</label>
            <div className="flex space-x-2">
              <input 
                type="text" 
                readOnly={!isEditMode}
                value={editingResource.pathOrUrl} 
                onChange={e => updateEditingResource({pathOrUrl: e.target.value})} 
                className="flex-1 p-2 border rounded-xl font-mono text-xs outline-none transition-all"
                style={{
                  backgroundColor: theme.form.pathInput.bg,
                  borderColor: theme.form.pathInput.border,
                  color: theme.form.pathInput.text,
                  opacity: isEditMode ? 1 : 0.8
                }}
                placeholder="输入绝对路径、链接或笔记内容..." 
              />
              {(isEditMode && (editingResource.type === 'local-file' || editingResource.type === 'local-folder')) && (
                <>
                  <button 
                    onClick={() => editingResource.type === 'local-file' ? relocationFileRef.current?.click() : relocationDirRef.current?.click()} 
                    className="px-3 border rounded-xl font-bold text-[10px] flex items-center transition-all whitespace-nowrap"
                    style={{
                      backgroundColor: theme.form.actionBtn.bg,
                      borderColor: theme.form.actionBtn.border,
                      color: settings.accentColor
                    }}
                  >
                    <i className={`fa-solid ${UI_ICONS.relocation} mr-1`}></i>重选
                  </button>
                  <input type="file" ref={relocationFileRef} onChange={onRelocationSelect} hidden />
                  <input type="file" ref={relocationDirRef} onChange={onRelocationSelect} {...{webkitdirectory: "", directory: ""} as any} hidden />
                </>
              )}
              <button 
                onClick={() => onPathAction('copy')} 
                className="px-3 border rounded-xl transition-all"
                style={{
                  backgroundColor: theme.form.actionBtn.bg,
                  borderColor: theme.form.actionBtn.border,
                  color: theme.form.actionBtn.text
                }}
              >
                <i className={`fa-solid ${UI_ICONS.copy} text-xs`}></i>
              </button>
              <button 
                onClick={() => onPathAction('open')} 
                className="px-3 rounded-xl transition-all shadow-md"
                style={{
                  backgroundColor: settings.accentColor,
                  color: '#ffffff'
                }}
              >
                <i className={`fa-solid ${editingResource.pathOrUrl?.startsWith('http') ? UI_ICONS.external : UI_ICONS.folderOpen} text-xs`}></i>
              </button>
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
            headerLabel="内容实时预览"
            className="h-[400px] rounded-3xl"
            theme={{
              bg: '#0f172a',
              border: '#1e293b',
              headerBorder: 'rgba(255, 255, 255, 0.05)',
              emptyIcon: '#334155',
              emptyText: '#475569'
            }}
          />
        </div>

        <div className="col-span-5 space-y-4 h-full flex flex-col">
          <div 
            className="p-4 rounded-2xl border"
            style={{ backgroundColor: theme.tags.sectionBg, borderColor: theme.tags.sectionBorder }}
          >
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-black uppercase block tracking-widest ml-1" style={{ color: theme.tags.label }}>
                关联标签 <span className="text-[8px] opacity-60 normal-case">{isEditMode ? '(最少保留一个)' : '(预览模式不可选)'}</span>
              </label>
              <button 
                onClick={onOpenTagCenter}
                className="text-[9px] font-bold opacity-40 hover:opacity-100 hover:underline transition-all uppercase tracking-tighter"
                style={{ color: settings.accentColor }}
              >
                管理标签库 <i className="fa-solid fa-arrow-up-right-from-square ml-1 text-[7px]"></i>
              </button>
            </div>
            <div className={`grid grid-cols-2 gap-2 max-h-[25vh] overflow-y-auto pr-1 custom-scrollbar ${!isEditMode ? 'opacity-90' : ''}`}>
              {tags.map(t => {
                const active = editingResource.tags?.includes(t.id);
                const isOnlyTag = active && (editingResource.tags?.length || 0) === 1;
                
                return (
                  <button 
                    key={t.id} 
                    disabled={!isEditMode}
                    onClick={() => handleToggleTag(t.id)} 
                    className="p-2 rounded-xl text-[10px] font-bold border flex items-center justify-between transition-all" 
                    style={active 
                      ? { backgroundColor: t.color, color: getContrastYIQ(t.color), borderColor: t.color, opacity: isOnlyTag ? 0.6 : 1 } 
                      : { borderColor: t.color + '40', color: t.color, backgroundColor: theme.tags.item.bg, opacity: !isEditMode ? 0.4 : 1 }
                    }
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <TagIcon icon={t.icon} customIcon={t.customIcon} className="w-3 h-3" />
                      <span>{t.name}</span>
                    </div>
                    {active && <i className={`fa-solid ${UI_ICONS.check} text-[8px]`}></i>}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex-1 flex flex-col space-y-1">
            <div className="flex items-center justify-between ml-1 pr-1">
              <label className="text-[10px] font-black uppercase block tracking-widest" style={{ color: theme.form.label }}>详细笔记</label>
              <button 
                onClick={(e) => { e.stopPropagation(); onCopyNotes(); }}
                title="复制笔记内容"
                className="px-2 py-0.5 border rounded-lg transition-all flex items-center space-x-1.5 active:scale-95 shadow-sm"
                style={{
                  backgroundColor: theme.form.notesActionBtn.bg,
                  borderColor: theme.form.notesActionBtn.border,
                  color: theme.form.notesActionBtn.text
                }}
              >
                <i className={`fa-solid ${UI_ICONS.copy} text-[8px]`}></i>
                <span className="text-[8px] font-black uppercase tracking-widest">复制</span>
              </button>
            </div>
            <textarea 
              readOnly={!isEditMode}
              value={editingResource.notes} 
              onChange={e => updateEditingResource({notes: e.target.value})} 
              className="flex-1 w-full p-4 border rounded-2xl resize-none text-xs outline-none transition-all"
              style={{
                backgroundColor: theme.form.input.bg,
                borderColor: theme.form.input.border,
                color: theme.form.input.readOnlyText,
                opacity: isEditMode ? 1 : 0.8
              }}
              placeholder={isEditMode ? "记下点什么..." : "暂无笔记内容"} 
            />
          </div>
        </div>
      </div>

      <SaveConfirmationDialog 
        isOpen={showReturnConfirm} 
        onCancel={() => setShowReturnConfirm(false)}
        onDiscard={onClose}
        onSave={() => {
          onSave(); 
          onClose(); 
        }}
        settings={settings}
      />

      <EditModeExitDialog
        isOpen={showEditExitConfirm}
        onCancel={() => setShowEditExitConfirm(false)}
        onDiscard={() => {
          const original = JSON.parse(initialStateSnapshot.current);
          updateEditingResource(original);
          setIsEditMode(false);
          setShowEditExitConfirm(false);
        }}
        onSave={() => {
          onSave(); 
          initialStateSnapshot.current = JSON.stringify({ ...editingResource, updatedAt: Date.now() });
          setIsEditMode(false);
          setShowEditExitConfirm(false);
        }}
        settings={settings}
      />

      {showHelp && (
        <ResourceEditHelpView 
          onClose={() => setShowHelp(false)} 
          settings={settings} 
        />
      )}
    </div>
  );
};
