
import React from 'react';
import { UISettings } from '../types';
import { getFilterSettingsTheme } from '../styles/filterSettingsTheme';
import { UI_ICONS } from '../icons/index';

// 将子组件定义移至主组件外部，防止 React 重新挂载组件导致页面跳动/滚动重置
const Section = ({ title, icon, settings, labelColor, children }: { 
  title: string, 
  icon: string, 
  settings: UISettings,
  labelColor: string,
  children: React.ReactNode 
}) => (
  <div className="space-y-6">
    <div className="flex items-center space-x-3 px-1">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: settings.accentColor + '10' }}>
         <i className={`fa-solid ${icon} text-xs`} style={{ color: settings.accentColor }}></i>
      </div>
      <h4 className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: labelColor }}>{title}</h4>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
  </div>
);

const ToggleOption = ({ label, desc, active, onClick, theme, accentColor }: { 
  label: string, 
  desc: string, 
  active: boolean, 
  onClick: (e: React.MouseEvent) => void,
  theme: any,
  accentColor: string
}) => (
  <button 
    type="button"
    onClick={onClick}
    className={`w-full text-left p-6 rounded-[2rem] border transition-all flex items-center justify-between group ${theme.card.shadow}`}
    style={{ 
      backgroundColor: active ? theme.option.activeBg : theme.card.bg,
      borderColor: active ? theme.option.activeBorder : theme.card.border
    }}
  >
    <div className="flex flex-col pr-4">
      <span className="text-sm font-black" style={{ color: active ? theme.option.activeText : theme.option.text }}>{label}</span>
      <span className="text-[10px] font-bold opacity-50 mt-1.5" style={{ color: theme.option.text }}>{desc}</span>
    </div>
    <div 
      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${active ? 'scale-110' : 'opacity-20'}`}
      style={{ borderColor: active ? accentColor : theme.option.text }}
    >
      {active && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: accentColor }}></div>}
    </div>
  </button>
);

interface FilterSettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UISettings;
  onUpdate: (updates: Partial<UISettings>) => void;
}

export const FilterSettingsSidebar: React.FC<FilterSettingsSidebarProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdate
}) => {
  const theme = getFilterSettingsTheme(settings);

  if (!isOpen) return null;

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onUpdate({
      filterMode: 'AND',
      filterCaseSensitive: false,
      filterIncludePath: false,
      filterShowCounts: true,
      showConsole: true,
      confirmBeforeDelete: true
    });
  };

  const handleToggle = (key: keyof UISettings, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onUpdate({ [key]: !settings[key] });
  };

  const handleSetMode = (mode: 'AND' | 'OR', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onUpdate({ filterMode: mode });
  };

  return (
    <div 
      className="fixed inset-0 z-[1100] flex flex-col animate-in fade-in duration-300" 
      style={{ 
        backgroundColor: theme.main.bg,
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        position: 'fixed'
      }}
    >
      {/* 顶部导航栏 - 锁定在顶部 */}
      <header 
        className="px-10 py-6 border-b flex items-center justify-between shrink-0" 
        style={{ backgroundColor: theme.header.bg, borderColor: theme.header.border }}
      >
        <div className="flex items-center space-x-8">
           <button 
             type="button"
             onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }} 
             className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-all flex items-center space-x-3 group"
             style={{ color: theme.header.backBtnText }}
           >
             <i className="fa-solid fa-arrow-left text-xs group-hover:-translate-x-1 transition-transform"></i>
             <span className="text-[10px] font-black uppercase tracking-widest">返回浏览</span>
           </button>
           <div className="h-8 w-px bg-slate-100"></div>
           <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-[1.25rem] bg-slate-900 text-white flex items-center justify-center shadow-2xl rotate-3">
                 <i className="fa-solid fa-sliders text-xl"></i>
              </div>
              <div className="flex flex-col">
                 <h2 className="text-2xl font-black italic tracking-tighter uppercase" style={{ color: theme.header.title }}>筛选与系统中心</h2>
                 <p className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: theme.header.subtitle }}>Strategy & System Preferences Configuration</p>
              </div>
           </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            type="button"
            onClick={handleReset}
            className="px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-black/5 flex items-center space-x-2"
            style={{ backgroundColor: theme.footer.resetBtnBg, color: theme.footer.resetBtnText }}
          >
            <i className="fa-solid fa-rotate-left"></i>
            <span>恢复出厂策略</span>
          </button>
          <button 
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}
            className="px-10 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl transition-all active:scale-95"
            style={{ backgroundColor: theme.footer.closeBtnBg, color: theme.footer.closeBtnText }}
          >
            应用并返回
          </button>
        </div>
      </header>

      {/* 主体配置区域 - 填充剩余空间并支持滚动 */}
      <main className="flex-1 overflow-y-auto p-12 lg:p-24 lg:pt-16 custom-scrollbar">
        <div className="max-w-5xl mx-auto space-y-16">
          <Section title="标签匹配模式" icon="fa-tags" settings={settings} labelColor={theme.section.label}>
            <ToggleOption 
              label="严格交集 (AND)" 
              desc="项目必须同时包含所有选中的标签，适用于精确缩小范围。"
              active={settings.filterMode === 'AND'}
              onClick={(e) => handleSetMode('AND', e)}
              theme={theme}
              accentColor={settings.accentColor}
            />
            <ToggleOption 
              label="宽松并集 (OR)" 
              desc="项目包含任意一个选中的标签即可，适用于扩大浏览视野。"
              active={settings.filterMode === 'OR'}
              onClick={(e) => handleSetMode('OR', e)}
              theme={theme}
              accentColor={settings.accentColor}
            />
          </Section>

          <Section title="全局搜索增强" icon="fa-magnifying-glass" settings={settings} labelColor={theme.section.label}>
            <ToggleOption 
              label="区分英文字母大小写" 
              desc="搜索关键词时严格匹配字母大小写状态。"
              active={settings.filterCaseSensitive}
              onClick={(e) => handleToggle('filterCaseSensitive', e)}
              theme={theme}
              accentColor={settings.accentColor}
            />
            <ToggleOption 
              label="检索物理存储路径" 
              desc="在物理地址、文件夹路径和 URL 中同步进行搜索。"
              active={settings.filterIncludePath}
              onClick={(e) => handleToggle('filterIncludePath', e)}
              theme={theme}
              accentColor={settings.accentColor}
            />
          </Section>

          <Section title="系统行为偏好" icon="fa-microchip" settings={settings} labelColor={theme.section.label}>
            <ToggleOption 
              label="实时操作终端" 
              desc="在右下角显示系统的实时审计日志流，适合开发者调试。"
              active={settings.showConsole}
              onClick={(e) => handleToggle('showConsole', e)}
              theme={theme}
              accentColor={settings.accentColor}
            />
            <ToggleOption 
              label="删除资源前进行二次确认" 
              desc="执行移除操作时弹出强制性的对话框以防止误删。"
              active={settings.confirmBeforeDelete}
              onClick={(e) => handleToggle('confirmBeforeDelete', e)}
              theme={theme}
              accentColor={settings.accentColor}
            />
          </Section>

          <Section title="界面反馈偏好" icon="fa-eye" settings={settings} labelColor={theme.section.label}>
            <ToggleOption 
              label="显示资源实时计数" 
              desc="在分类卡片和标签徽章旁显示当前库中的项目总数。"
              active={settings.filterShowCounts}
              onClick={(e) => handleToggle('filterShowCounts', e)}
              theme={theme}
              accentColor={settings.accentColor}
            />
          </Section>
          
          <div className="pt-12 opacity-20 text-center select-none">
             <i className="fa-solid fa-shield-halved text-6xl mb-4" style={{ color: settings.accentColor }}></i>
             <p className="text-[10px] font-black uppercase tracking-[0.5em]">System Governance Engine v10.0</p>
          </div>
        </div>
      </main>
    </div>
  );
};
