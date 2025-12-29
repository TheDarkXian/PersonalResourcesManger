
import React from 'react';
import { Tag, UISettings } from '../types';
import { UI_ICONS, TagIcon } from '../icons/index';
import { getTagTheme } from '../styles/tagTheme';

interface TagCardProps {
  tag: Tag;
  isSelected: boolean;
  isBatchMode: boolean;
  onToggleSelection: () => void;
  onUpdate: (updates: Partial<Tag>) => void;
  onIconUpload: (file: File) => void;
  settings: UISettings;
}

export const TagCard: React.FC<TagCardProps> = ({
  tag,
  isSelected,
  isBatchMode,
  onToggleSelection,
  onUpdate,
  onIconUpload,
  settings
}) => {
  const theme = getTagTheme(settings).card;
  const isLocked = tag.isDefault;

  return (
    <div 
      onClick={() => isBatchMode && onToggleSelection()}
      className={`p-5 rounded-2xl border transition-all relative group cursor-default shadow-sm ${
        isBatchMode ? 'cursor-pointer hover:shadow-lg active:scale-[0.98]' : 'hover:border-slate-300'
      }`}
      style={{
        backgroundColor: theme.bg,
        borderColor: isSelected ? 'transparent' : theme.border,
        boxShadow: isSelected ? `0 0 0 4px ${theme.selectedRing}` : 'none',
        opacity: isBatchMode && isLocked ? 0.3 : 1
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.borderColor = theme.hoverBorder;
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.borderColor = theme.border;
      }}
    >
      {/* 选中状态指示器 */}
      {(isBatchMode || isSelected) && (
        <div 
          className={`absolute top-4 right-4 w-6 h-6 rounded-full border flex items-center justify-center transition-all`}
          style={{
            backgroundColor: isSelected ? settings.accentColor : '#ffffff',
            borderColor: isSelected ? settings.accentColor : '#cbd5e1',
            color: isSelected ? '#ffffff' : 'transparent'
          }}
        >
          <i className="fa-solid fa-check text-[10px]"></i>
        </div>
      )}

      {/* 锁定标识 */}
      {isLocked && (
        <div 
          className="absolute top-4 right-4 text-slate-300"
          title="内置标签不可修改"
        >
          <i className="fa-solid fa-lock text-[10px]"></i>
        </div>
      )}

      <div className="flex items-center space-x-3 mb-4 pr-8">
        {!isBatchMode && (
          <input 
            type="checkbox" 
            disabled={isLocked} 
            checked={isSelected} 
            onChange={(e) => { e.stopPropagation(); onToggleSelection(); }} 
            className={`w-4 h-4 rounded cursor-pointer accent-blue-600 ${isLocked ? 'opacity-20 cursor-not-allowed' : ''}`} 
          />
        )}
        <input 
          type="text" 
          value={tag.name} 
          disabled={isBatchMode || isLocked}
          onChange={e => onUpdate({ name: e.target.value })} 
          onClick={e => e.stopPropagation()}
          className={`font-black border-b-2 border-transparent hover:border-slate-200 focus:border-blue-500 outline-none flex-1 bg-transparent text-lg py-0.5 transition-all ${isLocked ? 'cursor-not-allowed opacity-60' : 'disabled:hover:border-transparent'}`} 
          style={{ color: theme.inputTextColor }}
        />
      </div>

      <div className={`space-y-4 transition-opacity duration-300 ${isBatchMode ? 'opacity-40' : 'opacity-100'}`}>
        <div className="flex space-x-3 items-end">
          <div className="flex-1">
            <label className="text-[9px] font-black uppercase block mb-1.5 ml-1 tracking-widest" style={{ color: theme.labelColor }}>标签色</label>
            <input 
              type="color" 
              value={tag.color} 
              disabled={isBatchMode || isLocked}
              onChange={e => onUpdate({ color: e.target.value })} 
              onClick={e => e.stopPropagation()}
              className={`w-full h-9 rounded-xl border-none shadow-inner p-1 ${isLocked ? 'cursor-not-allowed grayscale' : 'cursor-pointer'}`} 
              style={{ backgroundColor: theme.inputBg }}
            />
          </div>
          <div className="flex-1">
            <label className="text-[9px] font-black uppercase block mb-1.5 ml-1 tracking-widest" style={{ color: theme.labelColor }}>显示模式</label>
            <select 
              value={tag.displayMode} 
              disabled={isBatchMode || isLocked}
              onChange={e => onUpdate({ displayMode: e.target.value as any })} 
              onClick={e => e.stopPropagation()}
              className={`w-full h-9 border border-slate-200 rounded-xl text-[10px] font-black uppercase shadow-md px-2 outline-none transition-all ${isLocked ? 'cursor-not-allowed bg-slate-50' : 'cursor-pointer hover:border-blue-300'}`}
              style={{ backgroundColor: '#ffffff', color: '#000000' }}
            >
              <option value="all" style={{ backgroundColor: '#ffffff', color: '#000000' }}>完整显示</option>
              <option value="icon-only" style={{ backgroundColor: '#ffffff', color: '#000000' }}>仅显示图标</option>
              <option value="text-only" style={{ backgroundColor: '#ffffff', color: '#000000' }}>仅文字</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between ml-1">
            <label className="text-[9px] font-black uppercase tracking-widest" style={{ color: theme.labelColor }}>自定义图标标识</label>
            <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">Image takes priority</span>
          </div>
          <div className="flex items-center space-x-3">
            <label 
              title="点击上传小尺寸图片 (优先显示)"
              className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-dashed overflow-hidden transition-colors ${isBatchMode || isLocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-blue-500'}`}
              style={{ backgroundColor: theme.inputBg, borderColor: 'rgba(0,0,0,0.05)' }}
            >
              <TagIcon icon={tag.icon} customIcon={tag.customIcon} className="w-full h-full p-2" />
              {!isLocked && (
                <input 
                  type="file" 
                  hidden 
                  disabled={isBatchMode}
                  accept="image/*" 
                  onChange={e => e.target.files?.[0] && onIconUpload(e.target.files[0])} 
                />
              )}
            </label>
            <div className={`flex-1 rounded-2xl px-4 py-2 shadow-inner ${isLocked ? 'opacity-50' : ''}`} style={{ backgroundColor: theme.inputBg }}>
               <input 
                type="text" 
                value={tag.icon || ''} 
                disabled={isBatchMode || isLocked}
                placeholder={isLocked ? "不可修改" : "输入 FA 图标类名"} 
                onChange={e => onUpdate({ icon: e.target.value, customIcon: undefined })} 
                onClick={e => e.stopPropagation()}
                className={`w-full bg-transparent text-[10px] font-mono border-none focus:ring-0 ${isLocked ? 'cursor-not-allowed' : ''}`} 
                style={{ color: theme.inputTextColor }}
              />
            </div>
          </div>
          <p className="text-[7px] font-medium leading-tight opacity-40 ml-1" style={{ color: theme.labelColor }}>
            * 提示：输入如 "fa-ghost" 使用矢量图标，或点击左侧方框上传图片。
          </p>
        </div>
      </div>
    </div>
  );
};
