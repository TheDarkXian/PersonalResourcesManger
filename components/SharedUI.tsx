
import React, { useEffect } from 'react';
import { DialogState } from '../types';
import { UI_ICONS } from '../icons/index';

export const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error' | 'info', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  const colors = { success: 'bg-emerald-600', error: 'bg-rose-600', info: 'bg-sky-600' };
  const iconClass = type === 'success' ? UI_ICONS.success : type === 'error' ? UI_ICONS.warning : UI_ICONS.info;

  return (
    <div className={`${colors[type]} text-white px-5 py-2.5 rounded shadow-2xl z-[350] flex items-center space-x-3 animate-in fade-in slide-in-from-right pointer-events-auto`}>
      <i className={`fa-solid ${iconClass}`}></i>
      <span className="font-bold text-xs whitespace-nowrap">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 transition-opacity"><i className={`fa-solid ${UI_ICONS.close}`}></i></button>
    </div>
  );
};

export const CustomDialog = ({ state, onClose, setDialogState }: { state: DialogState, onClose: () => void, setDialogState: any }) => {
  if (!state.isOpen) return null;

  const isDanger = state.variant === 'danger';
  
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" onMouseDown={onClose}>
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in duration-200"
        onMouseDown={e => e.stopPropagation()}
      >
        <div className={`p-6 border-b border-slate-100 flex items-center justify-between ${isDanger ? 'bg-rose-50' : 'bg-slate-50'}`}>
          <div className="flex items-center space-x-3">
            {isDanger && <i className="fa-solid fa-triangle-exclamation text-rose-500"></i>}
            <h3 className={`font-black text-[10px] uppercase tracking-[0.2em] ${isDanger ? 'text-rose-500' : 'text-slate-400'}`}>
              {state.title}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors"><i className={`fa-solid ${UI_ICONS.close}`}></i></button>
        </div>
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <p className="text-base font-bold text-slate-800 leading-relaxed">{state.message}</p>
          </div>
          
          {state.type === 'prompt' && (
            <div className="space-y-2">
              <textarea
                className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-mono focus:bg-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all resize-none shadow-inner"
                placeholder={state.placeholder || "在此粘贴 JSON 文本内容..."}
                autoFocus
                value={state.inputValue || ''}
                onChange={(e) => setDialogState({ ...state, inputValue: e.target.value })}
              />
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">请确保 JSON 格式正确且符合规范</p>
            </div>
          )}

          <div className="flex space-x-3 pt-2">
            {state.type !== 'alert' && (
              <button 
                onClick={onClose}
                className="flex-1 py-4 text-[11px] font-black uppercase text-slate-400 hover:bg-slate-50 rounded-2xl transition-all"
              >
                取消操作
              </button>
            )}
            <button 
              onClick={() => { state.onConfirm(state.inputValue); onClose(); }}
              className={`flex-1 py-4 text-[11px] font-black uppercase rounded-2xl shadow-xl transition-all active:scale-95 ${
                isDanger 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200' 
                  : 'bg-slate-900 hover:bg-black text-white'
              }`}
            >
              {state.type === 'alert' ? '明白了' : isDanger ? '确认执行危险操作' : '确认并继续'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
