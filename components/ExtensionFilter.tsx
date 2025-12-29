
import React from 'react';
import { UISettings } from '../types';

interface ExtensionFilterProps {
  availableExtensions: string[];
  selectedExtensions: string[];
  setSelectedExtensions: React.Dispatch<React.SetStateAction<string[]>>;
  settings: UISettings;
}

export const ExtensionFilter: React.FC<ExtensionFilterProps> = ({
  availableExtensions,
  selectedExtensions,
  setSelectedExtensions,
  settings
}) => {
  if (availableExtensions.length === 0) return null;

  const toggleExtension = (ext: string) => {
    setSelectedExtensions(prev => 
      prev.includes(ext) ? prev.filter(e => e !== ext) : [...prev, ext]
    );
  };

  return (
    <div className="flex flex-wrap gap-2 items-center animate-in slide-in-from-left duration-300 py-1">
      <span className="text-[9px] font-black uppercase opacity-40 mr-2 flex items-center">
        <i className="fa-solid fa-filter-list mr-1.5"></i> 扩展名筛选:
      </span>
      <div className="flex flex-wrap gap-1.5">
        {availableExtensions.map(ext => {
          const isActive = selectedExtensions.includes(ext);
          return (
            <button
              key={ext}
              onClick={() => toggleExtension(ext)}
              className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border transition-all ${isActive ? 'shadow-sm' : ''}`}
              style={{
                backgroundColor: isActive ? settings.filterBadgeActiveBg : settings.filterBadgeInactiveBg,
                borderColor: isActive ? settings.filterBadgeActiveBg : 'rgba(0,0,0,0.1)',
                color: isActive ? settings.filterBadgeActiveText : settings.filterBadgeInactiveText
              }}
            >
              {ext}
            </button>
          );
        })}
      </div>
      {selectedExtensions.length > 0 && (
        <button 
          onClick={() => setSelectedExtensions([])}
          className="text-[9px] font-black uppercase text-rose-500 hover:underline ml-2"
        >
          清除
        </button>
      )}
    </div>
  );
};
