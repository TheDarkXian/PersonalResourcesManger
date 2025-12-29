
import React from 'react';
import { Tag, UISettings } from '../types';
import { UI_ICONS, TagIcon } from '../icons/index';
import { getBatchTagTheme } from '../styles/batchTagTheme';

interface BatchTagViewProps {
  selectedCount: number;
  tags: Tag[];
  batchTagsSelected: string[];
  setBatchTagsSelected: React.Dispatch<React.SetStateAction<string[]>>;
  onClose: () => void;
  onRemoveBatchTags: () => void;
  onApplyBatchTags: () => void;
  getContrastYIQ: (hex: string) => string;
  settings: UISettings;
}

export const BatchTagView: React.FC<BatchTagViewProps> = ({
  selectedCount,
  tags,
  batchTagsSelected,
  setBatchTagsSelected,
  onClose,
  onRemoveBatchTags,
  onApplyBatchTags,
  getContrastYIQ,
  settings
}) => {
  const theme = getBatchTagTheme(settings);

  return (
    <div 
      className="fixed inset-0 z-[400] flex flex-col animate-in fade-in duration-300" 
      style={{ backgroundColor: theme.container.bg }}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <header 
        className="p-8 border-b flex items-center justify-between" 
        style={{ backgroundColor: theme.header.bg, borderColor: theme.header.border }}
      >
        <div className="flex items-center space-x-6">
           <button 
             onClick={onClose} 
             className="p-4 rounded-full transition-colors mr-2" 
             style={{ color: theme.header.closeBtnColor }}
             onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.header.closeBtnHoverBg)}
             onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
             aria-label="关闭批量标签"
           >
             <i className={`fa-solid ${UI_ICONS.close} text-2xl`}></i>
           </button>
           <h1 className="text-3xl font-black italic tracking-tighter" style={{ color: theme.header.titleColor }}>BATCH TAGS</h1>
           <div 
             className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
             style={{ backgroundColor: theme.infoBadge.bg, color: theme.infoBadge.text }}
           >
             选中了 {selectedCount} 个资源项目
           </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-12" style={{ backgroundColor: theme.main.bg }}>
        <div className="max-w-5xl mx-auto space-y-10">
            <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest block" style={{ color: theme.label.text }}>选择要应用的标签库</label>
                <div className="flex flex-wrap gap-3">
                    {tags.map(t => {
                        const active = batchTagsSelected.includes(t.id);
                        return (
                            <button 
                                key={t.id} 
                                tabIndex={0}
                                onClick={() => setBatchTagsSelected(p => p.includes(t.id) ? p.filter(id => id !== t.id) : [...p, t.id])}
                                className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-3 shadow-sm outline-none focus-visible:ring-2`}
                                style={active 
                                  ? { backgroundColor: t.color, color: getContrastYIQ(t.color), borderColor: t.color, "--tw-ring-color": theme.tagItem.focusRing } as any
                                  : { borderColor: t.color, color: t.color, backgroundColor: theme.tagItem.bg, "--tw-ring-color": theme.tagItem.focusRing } as any
                                }
                            >
                                <TagIcon icon={t.icon} customIcon={t.customIcon} className="w-4 h-4" />
                                <span>{t.name}</span>{active && <i className={`fa-solid ${UI_ICONS.check}`}></i>}
                            </button>
                        );
                    })}
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 pt-10 border-t" style={{ borderColor: theme.main.divider }}>
                <button 
                  onClick={onRemoveBatchTags}
                  className="p-8 rounded-3xl border shadow-xl space-y-4 text-center group transition-all outline-none focus-visible:ring-4"
                  style={{ 
                    backgroundColor: theme.cardRemove.bg, 
                    borderColor: theme.cardRemove.border,
                    "--tw-ring-color": theme.cardRemove.focusRing
                  } as any}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = theme.cardRemove.hoverBorder)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = theme.cardRemove.border)}
                >
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: theme.cardRemove.iconBg, color: theme.cardRemove.iconColor }}
                    >
                      <i className={`fa-solid ${UI_ICONS.minus} text-2xl`}></i>
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-tighter" style={{ color: theme.cardRemove.titleColor }}>从批次中移除</h3>
                    <p className="text-xs font-medium" style={{ color: theme.cardRemove.descColor }}>批量抹除已选标签关联</p>
                </button>

                <button 
                  onClick={onApplyBatchTags}
                  className="p-8 rounded-3xl shadow-2xl space-y-4 text-center group transition-all outline-none focus-visible:ring-4"
                  style={{ 
                    backgroundColor: theme.cardAdd.bg,
                    "--tw-ring-color": theme.cardAdd.focusRing,
                    color: theme.cardAdd.titleColor
                  } as any}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.cardAdd.hoverBg)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme.cardAdd.bg)}
                >
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: theme.cardAdd.iconBg, color: theme.cardAdd.iconColor }}
                    >
                      <i className={`fa-solid ${UI_ICONS.plus} text-2xl`}></i>
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-tighter">添加到此批次</h3>
                    <p className="text-xs font-medium" style={{ color: theme.cardAdd.descColor }}>一键注入所选标签标记</p>
                </button>
            </div>
        </div>
      </main>
    </div>
  );
};
