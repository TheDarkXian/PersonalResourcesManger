
import React, { useState } from 'react';
import { Library, HistoryEntry } from '../types';
import { UI_ICONS } from '../icons/index';
import { formatDate } from '../utils/helpers';

interface LibraryManagerViewProps {
  libraries: Library[];
  setLibraries: React.Dispatch<React.SetStateAction<Library[]>>;
  activeLibraryId?: string;
  onSwitch: (id: string) => void;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export const LibraryManagerView: React.FC<LibraryManagerViewProps> = ({
  libraries,
  setLibraries,
  activeLibraryId,
  onSwitch,
  onClose,
  onCreate
}) => {
  const [newLibName, setNewLibName] = useState('');
  const [showHistoryId, setShowHistoryId] = useState<string | null>(null);

  const deleteHistoryEntry = (libId: string, entryId: string) => {
    setLibraries(prev => prev.map(lib => {
      if (lib.id !== libId) return lib;
      return { ...lib, history: lib.history.filter(h => h.id !== entryId) };
    }));
  };

  const clearHistory = (libId: string) => {
    setLibraries(prev => prev.map(lib => {
      if (lib.id !== libId) return lib;
      return { ...lib, history: [] };
    }));
  };

  return (
    <div className="fixed inset-0 z-[500] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl h-[80vh] rounded-[2rem] shadow-2xl overflow-hidden flex animate-in zoom-in duration-300">
        
        {/* 左侧：库列表 */}
        <div className="w-1/3 border-r border-slate-100 flex flex-col bg-slate-50/50">
          <div className="p-8 border-b border-slate-100">
            <h2 className="text-xl font-black uppercase tracking-tight italic text-slate-900 mb-6">库管理器</h2>
            <div className="space-y-3">
              <input 
                type="text" 
                value={newLibName}
                onChange={e => setNewLibName(e.target.value)}
                placeholder="新库名称..."
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-blue-500"
              />
              <button 
                onClick={() => { if(newLibName.trim()) { onCreate(newLibName); setNewLibName(''); } }}
                className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
              >
                + 创建新库
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
            {libraries.map(lib => (
              <div 
                key={lib.id}
                onClick={() => onSwitch(lib.id)}
                className={`p-5 rounded-2xl cursor-pointer transition-all border group relative ${activeLibraryId === lib.id ? 'bg-white border-blue-500 shadow-lg' : 'bg-transparent border-transparent hover:bg-white hover:shadow-md'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-black uppercase ${activeLibraryId === lib.id ? 'text-blue-600' : 'text-slate-700'}`}>{lib.name}</span>
                  {activeLibraryId === lib.id && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>}
                </div>
                <div className="flex items-center justify-between text-[9px] font-bold text-slate-400">
                  <span>项目: {lib.resources.length}</span>
                  <span>修改: {formatDate(lib.updatedAt).split(' ')[0]}</span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowHistoryId(lib.id); }}
                  className="absolute bottom-4 right-4 text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 text-blue-400 hover:text-blue-600 transition-all"
                >
                  查看历史
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧：详情与历史 */}
        <div className="flex-1 flex flex-col relative bg-white">
          <button onClick={onClose} className="absolute top-8 right-8 p-3 text-slate-400 hover:text-slate-900 transition-all">
            <i className={`fa-solid ${UI_ICONS.close} text-xl`}></i>
          </button>

          {showHistoryId ? (
            <div className="p-12 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                    库历史日志: {libraries.find(l => l.id === showHistoryId)?.name}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">记录了该库的所有关键变动</p>
                </div>
                <div className="flex space-x-4">
                   <button onClick={() => clearHistory(showHistoryId)} className="text-[10px] font-black uppercase text-rose-500 hover:text-rose-700">清空历史</button>
                   <button onClick={() => setShowHistoryId(null)} className="text-[10px] font-black uppercase text-slate-500">返回</button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-4">
                {libraries.find(l => l.id === showHistoryId)?.history.map(entry => (
                  <div key={entry.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between group hover:bg-white hover:shadow-md transition-all">
                    <div className="flex items-center space-x-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-900 uppercase">{entry.action}</span>
                        <span className="text-[11px] font-medium text-slate-500">{entry.details}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <span className="text-[9px] font-mono font-bold text-slate-300">{formatDate(entry.timestamp)}</span>
                      <button 
                        onClick={() => deleteHistoryEntry(showHistoryId, entry.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-rose-300 hover:text-rose-500 transition-all"
                      >
                        <i className="fa-solid fa-trash-can text-xs"></i>
                      </button>
                    </div>
                  </div>
                ))}
                {libraries.find(l => l.id === showHistoryId)?.history.length === 0 && (
                   <div className="h-full flex flex-col items-center justify-center opacity-20">
                      <i className="fa-solid fa-clipboard-list text-6xl mb-4"></i>
                      <span className="text-xs font-black uppercase">暂无操作历史</span>
                   </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-16 flex flex-col items-center justify-center h-full text-center space-y-6">
               <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-layer-group text-5xl text-slate-200"></i>
               </div>
               <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase italic">选择或创建一个书库</h3>
                  <p className="text-sm text-slate-400 font-medium max-w-sm">多库系统允许您将不同的工作流隔离，并保持每个库的独立历史记录。</p>
               </div>
               <div className="pt-8 grid grid-cols-2 gap-4 w-full max-w-md">
                  <div className="p-6 bg-slate-50 rounded-3xl text-center">
                     <span className="block text-2xl font-black text-slate-900">{libraries.length}</span>
                     <span className="text-[9px] font-black uppercase text-slate-400">库总数</span>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-3xl text-center">
                     <span className="block text-2xl font-black text-slate-900">{libraries.reduce((acc, l) => acc + l.resources.length, 0)}</span>
                     <span className="text-[9px] font-black uppercase text-slate-400">资源总计</span>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
