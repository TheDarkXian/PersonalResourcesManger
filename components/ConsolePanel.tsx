
import React, { useState, useEffect, useRef } from 'react';
import { formatDate } from '../utils/helpers';
import { UI_ICONS } from '../icons/index';

export interface LogEntry {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  timestamp: number;
}

interface ConsolePanelProps {
  logs: LogEntry[];
  onClear: () => void;
}

export const ConsolePanel: React.FC<ConsolePanelProps> = ({ logs, onClear }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [autoVisible, setAutoVisible] = useState(false);
  const hideTimerRef = useRef<number | null>(null);
  const prevLogsLength = useRef(logs.length);

  const latestLog = logs[0];

  const colors = {
    success: 'text-emerald-500',
    error: 'text-rose-500',
    info: 'text-sky-500',
  };

  const bgColors = {
    success: 'bg-emerald-50',
    error: 'bg-rose-50',
    info: 'bg-sky-50',
  };

  const borderColors = {
    success: 'border-emerald-100',
    error: 'border-rose-100',
    info: 'border-sky-100',
  };

  // 监听日志变化，自动弹出
  useEffect(() => {
    if (logs.length > prevLogsLength.current) {
      // 只有在非手动展开状态下才触发自动显示
      if (!isExpanded) {
        setAutoVisible(true);
        
        // 清除之前的定时器
        if (hideTimerRef.current) {
          window.clearTimeout(hideTimerRef.current);
        }

        // 4秒后自动收回
        hideTimerRef.current = window.setTimeout(() => {
          setAutoVisible(false);
          hideTimerRef.current = null;
        }, 4000);
      }
    }
    prevLogsLength.current = logs.length;
  }, [logs.length, isExpanded]);

  // 手动切换逻辑：如果手动展开，关闭自动显示定时器
  const toggleManual = () => {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setIsExpanded(!isExpanded);
    setAutoVisible(false);
  };

  // 是否处于某种“可见”状态
  const isAnyVisible = isExpanded || autoVisible;

  return (
    <div 
      className={`fixed bottom-6 right-0 z-[1000] flex flex-col items-end transition-all duration-500 ease-in-out px-4 pointer-events-none ${
        isExpanded ? 'w-[400px] h-[500px]' : autoVisible ? 'w-[350px] h-auto' : 'w-12 h-auto'
      }`}
    >
      {/* 展开的列表内容 */}
      {(isAnyVisible) && (
        <div className={`w-full bg-white/90 backdrop-blur-xl border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-3xl mb-3 flex flex-col pointer-events-auto overflow-hidden transition-all duration-300 ${
          autoVisible && !isExpanded ? 'animate-in slide-in-from-right-full' : 'animate-in fade-in zoom-in-95'
        } ${isExpanded ? 'flex-1' : 'max-h-[120px]'}`}>
          
          <div className="px-5 py-3.5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Logs</span>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={onClear} 
                className="text-[9px] font-black uppercase text-slate-400 hover:text-rose-500 transition-colors"
                title="清空日志"
              >
                Clear
              </button>
              <button 
                onClick={() => { setIsExpanded(false); setAutoVisible(false); }} 
                className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-200"
              >
                <i className={`fa-solid ${UI_ICONS.close} text-xs`}></i>
              </button>
            </div>
          </div>

          <div className={`flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar ${autoVisible && !isExpanded ? 'overflow-hidden' : ''}`}>
            {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center space-y-2 py-8 opacity-30">
                <i className="fa-solid fa-terminal text-2xl"></i>
                <span className="text-[9px] font-black uppercase tracking-widest italic">Terminal Ready</span>
              </div>
            ) : (
              logs.map(log => (
                <div 
                  key={log.id} 
                  className={`p-3 rounded-2xl border ${bgColors[log.type]} ${borderColors[log.type]} flex flex-col space-y-1.5 animate-in slide-in-from-right-4 duration-300`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[8px] font-black uppercase tracking-tighter ${colors[log.type]}`}>
                      ● {log.type}
                    </span>
                    <span className="text-[8px] font-mono font-bold text-slate-300">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-700 leading-snug">
                    {log.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 侧边收缩/切换按钮 */}
      <div 
        onClick={toggleManual}
        className={`pointer-events-auto cursor-pointer flex items-center bg-white border border-slate-200 shadow-2xl transition-all duration-300 active:scale-90 group ${
          isAnyVisible 
            ? 'rounded-full px-5 py-2.5 translate-x-0' 
            : 'rounded-l-2xl py-6 px-3 translate-x-2 hover:translate-x-0'
        }`}
      >
        <div className={`flex items-center transition-all ${isAnyVisible ? 'space-x-3' : 'flex-col space-y-3'}`}>
          <div className="relative">
             <i className={`fa-solid ${isExpanded ? 'fa-chevron-down' : 'fa-terminal'} text-[13px] ${latestLog ? colors[latestLog.type] : 'text-slate-400'} group-hover:scale-110 transition-transform`}></i>
             {logs.length > 0 && !isAnyVisible && (
               <div className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></div>
             )}
          </div>
          
          {isAnyVisible ? (
            <span className="text-[11px] font-black text-slate-700 truncate max-w-[120px]">
              {latestLog ? latestLog.message : '终端已就绪'}
            </span>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-black text-slate-400 rotate-90 origin-center whitespace-nowrap">LOGS</span>
            </div>
          )}

          {isAnyVisible && (
             <>
               <div className="h-4 w-px bg-slate-100"></div>
               <span className="text-[9px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {logs.length}
               </span>
             </>
          )}
        </div>
      </div>
    </div>
  );
};
