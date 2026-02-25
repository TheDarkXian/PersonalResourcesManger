
import React, { useState, useEffect } from 'react';
import { StyleProfile, UISettings } from '../types';
import { styleProfileService } from '../utils/styleProfileService';
import { platformAdapter } from '../utils/platformAdapter';

interface StyleProfileDropdownProps {
  currentSettings: UISettings;
  onApply: (config: Partial<UISettings>) => void;
  showDialog: (config: any) => void;
  addLog: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const StyleProfileDropdown: React.FC<StyleProfileDropdownProps> = ({ 
  currentSettings, 
  onApply,
  showDialog,
  addLog
}) => {
  const [profiles, setProfiles] = useState<StyleProfile[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');

  const refreshProfiles = async () => {
    const allProfiles = await styleProfileService.getProfiles();
    setProfiles(allProfiles);
    const activeId = await styleProfileService.getActiveProfileId();
    if (allProfiles.some(p => p.id === activeId)) {
      setSelectedId(activeId);
    } else {
      const firstId = allProfiles[0].id;
      setSelectedId(firstId);
      await styleProfileService.setActiveProfileId(firstId);
    }
  };

  useEffect(() => {
    refreshProfiles();
  }, []);

  const handleSelect = async (id: string) => {
    setSelectedId(id);
    await styleProfileService.setActiveProfileId(id);
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
      onConfirm: async (name?: string) => {
        if (name?.trim()) {
          const newP = await styleProfileService.addProfile(name.trim(), currentSettings);
          await refreshProfiles();
          setSelectedId(newP.id);
          await styleProfileService.setActiveProfileId(newP.id);
        }
      }
    });
  };

  const handleFileImport = async () => {
    const files = await platformAdapter.pickFile({ accept: '.json' });
    if (!files || files.length === 0) return;

    try {
      const content = await platformAdapter.readTextFile(files[0]);
      const imported = await styleProfileService.importProfile(content);
      if (imported) {
        await refreshProfiles();
        setSelectedId(imported.id);
        await styleProfileService.setActiveProfileId(imported.id);
        onApply(imported.config);
        addLog(`成功导入视觉方案: ${imported.name}`, 'success');
      } else {
        addLog('导入失败：无效的样式配置 JSON', 'error');
      }
    } catch (err) {
      addLog('文件读取失败', 'error');
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
      onConfirm: async (newName?: string) => {
        if (newName?.trim()) {
          await styleProfileService.updateProfileName(selectedId, newName.trim());
          await refreshProfiles();
        }
      }
    });
  };

  const handleExportFile = async () => {
    const profile = profiles.find(p => p.id === selectedId);
    if (!profile) return;
    
    const data = JSON.stringify(profile, null, 2);
    await platformAdapter.saveFile(data, `Style_${profile.name.replace(/\s+/g, '_')}.json`);
    addLog(`视觉方案 "${profile.name}" 已导出`, 'success');
  };

  const handleDelete = () => {
    const profile = profiles.find(p => p.id === selectedId);
    if (!profile || profile.isSystem) return;

    showDialog({
      type: 'confirm',
      variant: 'danger',
      title: '删除视觉样式',
      message: `确定要永久移除样式 "${profile.name}" 吗？此操作不可撤销。`,
      onConfirm: async () => {
        await styleProfileService.deleteProfile(selectedId);
        await refreshProfiles();
        addLog(`视觉方案 "${profile.name}" 已移除`, 'info');
      }
    });
  };

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
            <button onClick={handleSnapshot} title="保存当前快照" className="w-8 h-8 flex items-center justify-center hover:bg-black/5 rounded-lg transition-all" style={{ color: currentSettings.widgetText }}>
              <i className="fa-solid fa-camera text-[10px]"></i>
            </button>
            <button onClick={handleFileImport} title="从文件导入样式" className="w-8 h-8 flex items-center justify-center hover:bg-black/5 rounded-lg transition-all" style={{ color: currentSettings.widgetText }}>
              <i className="fa-solid fa-file-import text-[10px]"></i>
            </button>
            <button onClick={handleExportFile} title="导出所选样式" className="w-8 h-8 flex items-center justify-center hover:bg-black/5 rounded-lg transition-all" style={{ color: currentSettings.widgetText }}>
              <i className="fa-solid fa-download text-[10px]"></i>
            </button>
            <button onClick={handleRename} disabled={!selectedId || profiles.find(p => p.id === selectedId)?.isSystem} className="w-8 h-8 flex items-center justify-center hover:bg-black/5 rounded-lg transition-all disabled:opacity-10" style={{ color: currentSettings.widgetText }}>
              <i className="fa-solid fa-pen text-[10px]"></i>
            </button>
            <button onClick={handleDelete} disabled={!selectedId || profiles.find(p => p.id === selectedId)?.isSystem} className="w-8 h-8 flex items-center justify-center hover:bg-black/5 rounded-lg transition-all disabled:opacity-10" style={{ color: currentSettings.widgetText }}>
              <i className="fa-solid fa-trash-can text-[10px]"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
