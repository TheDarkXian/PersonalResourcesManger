
import React from 'react';
import { UI_ICONS } from '../icons/index';
import { LIBRARY_THEME } from '../styles/libraryTheme';
import { useCreateLibraryLogic } from '../hooks/useCreateLibraryLogic';

interface CreateLibraryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export const CreateLibraryDialog: React.FC<CreateLibraryDialogProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  const theme = LIBRARY_THEME.dialog;

  // 使用独立的逻辑脚本文件
  const {
    name,
    error,
    handleNameChange,
    handleSubmit
  } = useCreateLibraryLogic({ onCreate, onClose });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200" onMouseDown={onClose}>
      <div 
        className="w-full max-w-md rounded-[3rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in duration-300"
        style={{ backgroundColor: theme.bg }}
        onMouseDown={e => e.stopPropagation()}
      >
        <div className="p-10 space-y-8">
          <div className="text-center space-y-3">
            <div 
              className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: theme.iconBg, color: theme.iconColor }}
            >
              <i className="fa-solid fa-plus text-2xl"></i>
            </div>
            <h3 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">初始化新书库</h3>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">为您的资源建立独立存储节点</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 block ml-4">书库名称</label>
            <input 
              type="text" 
              autoFocus
              value={name}
              onChange={e => handleNameChange(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="例如: 个人项目库, 灵感素材包..."
              className={`w-full px-8 py-5 border-2 rounded-[2rem] text-sm font-bold outline-none transition-all ${
                error ? 'border-rose-400 bg-rose-50 placeholder-rose-300' : ''
              }`}
              style={{
                backgroundColor: error ? undefined : theme.inputBg,
                borderColor: error ? undefined : theme.inputBorder,
                color: '#000000' // 强制要求字体颜色为黑色
              }}
            />
            {error && (
              <p className="text-[10px] font-black uppercase text-rose-500 ml-4 animate-bounce">名称不能为空！</p>
            )}
          </div>

          <div className="flex flex-col space-y-3 pt-4">
            <button 
              onClick={handleSubmit}
              className="w-full py-5 rounded-[2rem] font-black text-[12px] uppercase tracking-widest shadow-2xl transition-all active:scale-[0.98]"
              style={{ backgroundColor: theme.primaryBtnBg, color: theme.primaryBtnText }}
            >
              立即创建
            </button>
            <button 
              onClick={onClose}
              className="w-full py-5 bg-white text-slate-400 rounded-[2rem] font-black text-[12px] uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              取消并返回
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
