
import React, { useState } from 'react';
import { Tag, UISettings } from '../types';
import { UI_ICONS } from '../icons/index';
import { TagCard } from '../components/TagCard';
import { getTagTheme } from '../styles/tagTheme';
import { TagCenterHelpView } from './TagCenterHelpView';

interface TagCenterViewProps {
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  selectedTagManageIds: Set<string>;
  setSelectedTagManageIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  onClose: () => void;
  onBatchDelete: () => void;
  onAddTag: () => void;
  onIconUpload: (tagId: string, file: File) => void;
  settings: UISettings;
}

export const TagCenterView: React.FC<TagCenterViewProps> = ({
  tags,
  setTags,
  selectedTagManageIds,
  setSelectedTagManageIds,
  onClose,
  onBatchDelete,
  onAddTag,
  onIconUpload,
  settings
}) => {
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const theme = getTagTheme(settings);

  return (
    <div 
      className="fixed inset-0 z-[200] flex flex-col animate-in fade-in zoom-in duration-300" 
      style={{ backgroundColor: theme.main.bg }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          if (showHelp) setShowHelp(false);
          else onClose();
        }
      }}
    >
      <header 
        className="px-10 py-6 flex items-center justify-between border-b" 
        style={{ backgroundColor: theme.header.bg, borderColor: theme.header.border }}
      >
        <div className="flex items-center space-x-8">
          <button 
            onClick={onClose} 
            className="p-4 hover:shadow-md rounded-full transition-all text-slate-400 hover:text-slate-900" 
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.header.closeBtnHoverBg)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            aria-label="关闭标签管理"
          >
            <i className={`fa-solid ${UI_ICONS.close} text-xl`}></i>
          </button>
          <div className="flex items-center space-x-4">
            <div className="space-y-0.5">
              <h1 className="text-3xl font-black italic tracking-tighter uppercase" style={{ color: theme.header.titleColor }}>标签中控室</h1>
              <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: theme.header.subtitleColor }}>全局标签管理与批量操作</p>
            </div>
            <button 
              onClick={() => setShowHelp(true)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:text-slate-900 hover:bg-slate-100 transition-all active:scale-90"
              title="标签管理说明"
            >
              <i className="fa-solid fa-circle-question text-xl"></i>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={() => { setIsBatchMode(!isBatchMode); setSelectedTagManageIds(new Set()); }} 
            className={`px-6 py-2.5 rounded-full font-black text-[10px] uppercase transition-all shadow-sm border`}
            style={{
              backgroundColor: isBatchMode ? theme.buttons.batchMode.activeBg : theme.buttons.batchMode.inactiveBg,
              color: isBatchMode ? theme.buttons.batchMode.activeText : theme.buttons.batchMode.inactiveText,
              borderColor: isBatchMode ? 'transparent' : theme.buttons.batchMode.border
            }}
          >
            {isBatchMode ? <i className="fa-solid fa-xmark mr-2"></i> : <i className="fa-solid fa-list-check mr-2"></i>}
            {isBatchMode ? '退出批量删除' : '开启批量模式'}
          </button>

          {isBatchMode && selectedTagManageIds.size > 0 && (
            <button 
              onClick={onBatchDelete} 
              className="px-8 py-2.5 rounded-full font-black text-[10px] uppercase transition-all flex items-center animate-in slide-in-from-top duration-300"
              style={{
                backgroundColor: theme.buttons.batchDelete.bg,
                color: theme.buttons.batchDelete.text,
                boxShadow: theme.buttons.batchDelete.shadow
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.buttons.batchDelete.hoverBg)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme.buttons.batchDelete.bg)}
            >
              <i className={`fa-solid ${UI_ICONS.delete} mr-2`}></i> 
              删除选中的 {selectedTagManageIds.size} 个标签
            </button>
          )}

          {!isBatchMode && (
            <button 
              onClick={onAddTag} 
              className="px-8 py-2.5 rounded-full font-black text-[10px] uppercase active:scale-95 transition-all"
              style={{
                backgroundColor: theme.buttons.addNew.bg,
                color: theme.buttons.addNew.text,
                boxShadow: theme.buttons.addNew.shadow
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.buttons.addNew.hoverBg)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme.buttons.addNew.bg)}
            >
              + 新建标签
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-12" style={{ backgroundColor: theme.main.bg }}>
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {tags.map(tag => (
            <TagCard 
              key={tag.id}
              tag={tag}
              isBatchMode={isBatchMode}
              isSelected={selectedTagManageIds.has(tag.id)}
              onToggleSelection={() => {
                if (tag.isDefault) return;
                setSelectedTagManageIds(p => {
                  const n = new Set(p);
                  n.has(tag.id) ? n.delete(tag.id) : n.add(tag.id);
                  return n;
                });
              }}
              onUpdate={(updates) => {
                setTags(p => p.map(t => t.id === tag.id ? { ...t, ...updates } : t));
              }}
              onIconUpload={(file) => onIconUpload(tag.id, file)}
              settings={settings}
            />
          ))}
        </div>
        {tags.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20 py-32">
            <i className="fa-solid fa-tags text-8xl mb-6" style={{ color: theme.main.emptyIconColor }}></i>
            <span className="font-black uppercase tracking-[0.3em] text-sm" style={{ color: theme.main.emptyTextColor }}>暂无标签库数据</span>
          </div>
        )}
      </main>

      {showHelp && (
        <TagCenterHelpView 
          onClose={() => setShowHelp(false)} 
          settings={settings} 
        />
      )}
    </div>
  );
};
