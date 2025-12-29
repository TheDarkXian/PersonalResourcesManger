
import React from 'react';
import { UserPreferences, UISettings, DialogState } from '../types';
import { getPreferencesTheme } from '../styles/preferencesTheme';
import { platformAdapter } from '../utils/platformAdapter';

interface PreferencesTabProps {
  userPreferences: UserPreferences;
  setUserPreferences: (p: UserPreferences) => void;
  settings: UISettings;
  showDialog: (config: Partial<DialogState>) => void;
  addLog: (m: string, t?: any) => void;
}

export const PreferencesTab: React.FC<PreferencesTabProps> = ({
  userPreferences,
  setUserPreferences,
  settings,
  showDialog,
  addLog
}) => {
  const theme = getPreferencesTheme(settings);

  const togglePreference = (key: keyof UserPreferences) => {
    setUserPreferences({
      ...userPreferences,
      [key]: !userPreferences[key]
    });
  };

  const exportPreferences = async () => {
    const data = JSON.stringify(userPreferences, null, 2);
    const filename = `User_Preferences_${Date.now()}.json`;
    await platformAdapter.saveFile(data, filename);
    addLog('功能偏好设置已导出', 'success');
  };

  const importPreferences = async () => {
    const files = await platformAdapter.pickFile({ accept: '.json' });
    if (!files || files.length === 0) return;
    
    try {
      const content = await platformAdapter.readTextFile(files[0]);
      const parsed = JSON.parse(content);
      setUserPreferences({ ...userPreferences, ...parsed });
      addLog('功能偏好设置已更新', 'success');
    } catch (err) {
      addLog('解析偏好设置失败：JSON 格式无效', 'error');
    }
  };

  const Switch = ({ isOn, onClick }: { isOn: boolean; onClick: () => void }) => (
    <button 
      onClick={onClick}
      className="w-14 h-8 rounded-full relative transition-all duration-300 shadow-inner"
      style={{ backgroundColor: isOn ? theme.switch.on : theme.switch.off }}
    >
      <div 
        className="absolute top-1 w-6 h-6 rounded-full shadow-md transition-all duration-300 transform"
        style={{ 
          backgroundColor: theme.switch.thumb,
          left: isOn ? '1.5rem' : '0.25rem'
        }}
      />
    </button>
  );

  return (
    <div className={theme.container.spacing + ' ' + theme.container.padding}>
      <div className="border-b pb-10" style={{ borderColor: theme.section.border }}>
        <h3 className="text-5xl font-black italic tracking-tighter uppercase" style={{ color: theme.section.titleColor }}>偏好设置</h3>
        <p className="text-sm font-bold mt-4 tracking-wide" style={{ color: theme.section.subtitleColor }}>定制系统行为逻辑，提升您的交互体验。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
           <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-6">系统行为 (Behavior)</h4>
           
           <div 
             className="p-8 rounded-[2.5rem] border flex items-center justify-between group transition-all"
             style={{ backgroundColor: theme.card.bg, borderColor: theme.card.border }}
           >
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl" style={{ backgroundColor: theme.card.iconBg }}>
                  <i className="fa-solid fa-terminal" style={{ color: settings.accentColor }}></i>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black tracking-tight" style={{ color: theme.card.title }}>控制台终端</span>
                  <span className="text-[10px] font-bold mt-1" style={{ color: theme.card.desc }}>允许系统实时输出操作审计日志流</span>
                </div>
              </div>
              <Switch 
                isOn={userPreferences.showConsole} 
                onClick={() => togglePreference('showConsole')} 
              />
           </div>
        </div>

        <div className="space-y-6">
           <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-6">配置同步 (Sync)</h4>
           
           <div 
             className="p-10 rounded-[3rem] border space-y-8"
             style={{ backgroundColor: theme.card.bg, borderColor: theme.card.border }}
           >
              <div className="space-y-2">
                 <h5 className="text-xl font-black italic tracking-tighter" style={{ color: theme.card.title }}>逻辑配置文件</h5>
                 <p className="text-xs font-bold leading-relaxed" style={{ color: theme.card.desc }}>导出包含开关逻辑的功能配置 JSON。注意：这不包含界面颜色设置，颜色设置请在“界面定制”中管理。</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <button 
                   onClick={exportPreferences}
                   className="py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 transition-all hover:scale-105"
                   style={{ backgroundColor: theme.actions.btnBg, borderColor: theme.actions.btnBorder, color: theme.actions.btnText }}
                 >
                   导出配置
                 </button>
                 <button 
                   onClick={importPreferences}
                   className="py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 transition-all hover:scale-105 text-center"
                   style={{ backgroundColor: theme.actions.accent, borderColor: theme.actions.accent, color: '#ffffff' }}
                 >
                   导入配置
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
