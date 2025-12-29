
import React from 'react';
import { UISettings } from '../types';

interface EditModeExitDialogProps {
  isOpen: boolean;
  onCancel: () => void; // 继续编辑
  onDiscard: () => void; // 丢弃并预览
  onSave: () => void; // 保存并预览
  settings: UISettings;
}

export const EditModeExitDialog: React.FC<EditModeExitDialogProps> = ({
  isOpen,
  onCancel,
  onDiscard,
  onSave,
  settings
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200" onMouseDown={onCancel}>
      <div 
        className="w-full max-w-md rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in duration-300"
        style={{ backgroundColor: settings.detailsDialogBg }}
        onMouseDown={e => e.stopPropagation()}
      >
        <div className="p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto ring-8 ring-blue-50/50">
            <i className="fa-solid fa-pen-nib text-3xl text-blue-500"></i>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter" style={{ color: settings.detailsDialogText }}>
              正在退出编辑状态
            </h3>
            <p className="text-sm font-medium px-4 opacity-60" style={{ color: settings.detailsDialogText }}>
              检测到未同步的修改内容。您希望在切换回预览模式前保留这些改动吗？
            </p>
          </div>

          <div className="flex flex-col space-y-3 pt-4">
            <button 
              onClick={onSave}
              className="w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-[0.98]"
              style={{ backgroundColor: settings.detailsDialogConfirmBg, color: settings.detailsDialogConfirmText }}
            >
              保存并进入预览
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={onDiscard}
                className="py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-[0.98]"
                style={{ backgroundColor: 'rgba(0,0,0,0.05)', color: settings.detailsDialogText }}
              >
                放弃修改
              </button>
              <button 
                onClick={onCancel}
                className="py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-[0.98]"
                style={{ backgroundColor: 'transparent', color: settings.detailsDialogText, opacity: 0.4 }}
              >
                留在编辑页
              </button>
            </div>
          </div>
        </div>
        
        <div className="py-4 text-center border-t" style={{ backgroundColor: 'rgba(0,0,0,0.02)', borderColor: 'rgba(0,0,0,0.05)' }}>
          <span className="text-[9px] font-black uppercase tracking-widest opacity-30" style={{ color: settings.detailsDialogText }}>
            模式切换安全校验
          </span>
        </div>
      </div>
    </div>
  );
};
