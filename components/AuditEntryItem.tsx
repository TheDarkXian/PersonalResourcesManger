
import React from 'react';
import { HistoryEntry, UISettings } from '../types';
import { formatDate } from '../utils/helpers';
import { auditService } from '../utils/auditService';

interface AuditEntryItemProps {
  entry: HistoryEntry;
  onDelete: (id: string) => void;
  settings: UISettings;
}

export const AuditEntryItem: React.FC<AuditEntryItemProps> = ({ entry, onDelete, settings }) => {
  const info = auditService.getFriendlyAction(entry.action);
  const m = entry.metadata;

  return (
    <div 
      className="p-8 border rounded-[2.5rem] flex flex-col space-y-4 group hover:shadow-2xl transition-all"
      style={{ 
        backgroundColor: settings.auditEntryBg, 
        borderColor: settings.auditEntryBorder,
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div 
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-inner ${info.color}`}
            style={{ backgroundColor: settings.pageBg }}
          >
            <i className={`fa-solid ${info.icon}`}></i>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-3">
              <span className="text-[12px] font-black uppercase tracking-widest" style={{ color: settings.primaryFontColor }}>{info.label}</span>
              <span 
                className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: settings.pageBg, color: settings.mutedFontColor }}
              >
                {entry.id.split('-')[0]}
              </span>
            </div>
            <span className="text-base font-bold mt-1" style={{ color: settings.secondaryFontColor }}>{entry.details}</span>
          </div>
        </div>
        <div className="flex items-center space-x-8">
          <div className="text-right flex flex-col">
            <span className="text-[10px] font-black uppercase" style={{ color: settings.primaryFontColor }}>{formatDate(entry.timestamp).split(' ')[1]}</span>
            <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: settings.mutedFontColor }}>{formatDate(entry.timestamp).split(' ')[0]}</span>
          </div>
          <button 
            onClick={() => onDelete(entry.id)}
            className="opacity-0 group-hover:opacity-100 w-10 h-10 rounded-full flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
          >
            <i className="fa-solid fa-trash-can text-sm"></i>
          </button>
        </div>
      </div>

      {m && (
        <div className="grid grid-cols-12 gap-4 pt-4 border-t" style={{ borderColor: 'rgba(0,0,0,0.03)' }}>
          {m.count !== undefined && (
            <div className="col-span-2">
              <div className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: settings.mutedFontColor }}>受影响数量</div>
              <div className="text-lg font-black" style={{ color: settings.primaryFontColor }}>
                {m.count} <span className="text-[10px] opacity-60">Items</span>
              </div>
            </div>
          )}
          
          {m.types && (
            <div className="col-span-4 flex flex-wrap gap-2 items-start">
              <div className="w-full text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: settings.mutedFontColor }}>构成类型</div>
              {Object.entries(m.types).map(([type, count]) => (
                <div 
                  key={type} 
                  className="px-2 py-1 rounded-lg text-[10px] font-bold border"
                  style={{ backgroundColor: settings.pageBg, borderColor: 'rgba(0,0,0,0.05)', color: settings.secondaryFontColor }}
                >
                  {type}: {count}
                </div>
              ))}
            </div>
          )}

          {m.filenames && m.filenames.length > 0 && (
            <div className="col-span-6">
              <div className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: settings.mutedFontColor }}>处理文件</div>
              <div className="flex flex-wrap gap-1">
                {m.filenames.map((name, i) => (
                  <span 
                    key={i} 
                    className="text-[10px] px-1.5 rounded truncate max-w-[120px]" 
                    style={{ backgroundColor: settings.pageBg, color: settings.secondaryFontColor }}
                    title={name}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
