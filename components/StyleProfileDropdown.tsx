
import React, { useState, useEffect } from 'react';
import { StyleProfile, UISettings } from '../types';
import { styleProfileService } from '../utils/styleProfileService';
import { platformAdapter } from '../utils/platformAdapter';

interface StyleProfileDropdownProps {
  currentSettings: UISettings;
  onApply: (config: Partial<UISettings>) => void;
  showDialog: (config: any) => void;
}

export const StyleProfileDropdown: React.FC<StyleProfileDropdownProps> = ({ 
  currentSettings, 
  onApply,
  showDialog
}) => {
  const [profiles, setProfiles] = useState<StyleProfile[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');

  const refreshProfiles = () => {
    const allProfiles = styleProfileService.getProfiles();
    setProfiles(allProfiles);
    const activeId = styleProfileService.getActiveProfileId();
    if (allProfiles.some(p => p.id === activeId)) {
      setSelectedId(activeId);
    } else {
      const firstId = allProfiles[0].id;
      setSelectedId(firstId);
      styleProfileService.setActiveProfileId(firstId);
    }
  };

  useEffect(() => {
    refreshProfiles();
  }, []);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    styleProfileService.setActiveProfileId(id);
    const profile = profiles.find(p => p.id === id);
    if (profile) {
      onApply(profile.config);
    }
  };

  const handleSnapshot = () => {
    showDialog({
      type: 'prompt',
      title: '创建样式快照',
      message: '将当前所有颜色与布局设置保存为一个新样式：',
      placeholder: '例如：我的极简黑...',
      onConfirm: (name?: string) => {
        if (name?.trim()) {
          const newP = styleProfileService.addProfile(name.trim(), currentSettings);
          refreshProfiles();
          setSelectedId(newP.id);
          styleProfileService.setActiveProfileId(newP.id);
        }
      }
    });
  };

  const handleFileImport = async () => {
    const files = await platformAdapter.pickFile({ accept: '.json' });
    if (!files || files.length === 0) return;

    try {
      const content = await platformAdapter.readTextFile(files[0]);
      const imported = styleProfileService.importProfile(content);
      if (imported) {
        refreshProfiles();
        setSelectedId(imported.id);
        styleProfileService.setActiveProfileId(imported.id);
        onApply(imported.config);
      } else {
        alert('导入失败：无效的样式配置 JSON');
      }
    } catch (err) {
      alert('文件读取失败');
    }
  };

  const handleRename = () => {
    const profile = profiles.find(p => p.id === selectedId);
    if (!profile || profile.isSystem) return;

    showDialog({
      type: 'prompt',
      title: '重命名样式',
      message: `为 "${profile.name}" 输入一个新名称：`,
      placeholder: profile.name,
      onConfirm: (newName?: string) => {
        if (newName?.trim()) {
          styleProfileService.updateProfileName(selectedId, newName.trim());
          refreshProfiles();
        }
      }
    });
  };

  const handleExportFile = async () => {
    const profile = profiles.find(p => p.id === selectedId);
    if (!profile) return;
    
    const data = JSON.stringify(profile, null, 2);
    await platformAdapter.saveFile(data, `Style_${profile.name.replace(/\s+/g, '_')}.json`);
  };

  const handleDelete = () => {
    const profile = profiles.find(p => p.id === selectedId);
    if (!profile || profile.isSystem) return;

    showDialog({
      type: 'confirm',
      variant: 'danger',
      title: '删除视觉样式',
      message: `确定要永久移除样式 "${profile.name}" 吗？此操作不可撤销。`,
      onConfirm: () => {
        styleProfileService.deleteProfile(selectedId);
        refreshProfiles();
      }
    });
  };

  const currentProfile = profiles.find(p => p.id === selectedId);
  const isCurrentSystem = currentProfile?.isSystem;

  return (
    <div className="flex items-center space-x-2 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <span className="text-[9px] font-black uppercase text-slate-400 mb-1 ml-1 tracking-widest">视觉方案中心</span>
        <div 
          className="flex items-center border rounded-xl px-2 py-1 shadow-sm h-10 transition-all"
          style={{ 
            backgroundColor: currentSettings.widgetBg, 
            borderColor: currentSettings.widgetBorder 
          }}
        >
          <select 
            value={selectedId}
            onChange={(e) => handleSelect(e.target.value)}
            className="text-[11px] font-black uppercase outline-none min-w-[150px] cursor-pointer transition-all"
            style={{ 
              color: currentSettings.widgetText, 
              backgroundColor: currentSettings.widgetBg 
            }}
          >
            {profiles.map(p => (
              <option key={p.id} value={p.id} style={{ backgroundColor: currentSettings.widgetBg, color: currentSettings.widgetText }}>
                {p.name}
              </option>
            ))}
          </select>
          
          <div className="w-px h-4 mx-2 opacity-10" style={{ backgroundColor: currentSettings.widgetText }}></div>
          
          <div className="flex items-center space-x-0.5">
            <button 
              onClick={handleSnapshot}
              title="保存当前快照"
              className="w-8 h-8 flex items-center justify-center hover:bg-black/5 rounded-lg transition-all"
              style={{ color: currentSettings.widgetText }}
            >
              <i className="fa-solid fa-camera text-[10px]"></i>
            </button>
            
            <button 
              onClick={handleFileImport}
              title="从文件导入样式"
              className="w-8 h-8 flex items-center justify-center hover:bg-black/5 rounded-lg transition-all"
              style={{ color: currentSettings.widgetText }}
            >
              <i className="fa-solid fa-file-import text-[10px]"></i>
            </button>

            <button 
              onClick={handleExportFile}
              title="导出所选样式"
              className="w-8 h-8 flex items-center justify-center hover:bg-black/5 rounded-lg transition-all"
              style={{ color: currentSettings.widgetText }}
            >
              <i className="fa-solid fa-download text-[10px]"></i>
            </button>

            <button 
              onClick={handleRename}
              disabled={isCurrentSystem}
              title={isCurrentSystem ? "系统方案不可重命名" : "重命名"}
              className="w-8 h-8 flex items-center justify-center hover:bg-black/5 rounded-lg transition-all disabled:opacity-10"
              style={{ color: currentSettings.widgetText }}
            >
              <i className="fa-solid fa-pen text-[10px]"></i>
            </button>

            <button 
              onClick={handleDelete}
              disabled={isCurrentSystem}
              title={isCurrentSystem ? "系统方案不可删除" : "删除样式"}
              className="w-8 h-8 flex items-center justify-center hover:bg-black/5 rounded-lg transition-all disabled:opacity-10"
              style={{ color: currentSettings.widgetText }}
            >
              <i className="fa-solid fa-trash-can text-[10px]"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
