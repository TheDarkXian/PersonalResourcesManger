
import React from 'react';
import { UISettings } from '../types';
import { UI_CUSTOM_THEME } from '../styles/uiCustomTheme';
import { StyleProfileDropdown } from '../components/StyleProfileDropdown';

interface UICustomizationTabProps {
  settings: UISettings;
  setSettings: (s: UISettings) => void;
  showDialog: (config: any) => void;
  onResetVisuals: () => void;
  addLog: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ColorItem: React.FC<{
  label: string;
  settingsKey: keyof UISettings;
  value: string;
  onChange: (key: keyof UISettings, val: string) => void;
  index: number;
}> = ({ label, settingsKey, value, onChange, index }) => {
  const theme = UI_CUSTOM_THEME.picker;
  
  return (
    <div 
      className="flex items-center space-x-3 animate-in fade-in duration-300 fill-mode-both py-1 group/item"
      style={{ animationDelay: `${index * 20}ms` }}
    >
      <div className="relative flex-shrink-0">
        <div 
          className={`${theme.size} ${theme.borderRadius} ${theme.shadow} ${theme.border} ${theme.ring} transition-transform group-hover/item:scale-110`}
          style={{ backgroundColor: value }}
        ></div>
        <input 
          type="color" 
          value={value} 
          onChange={e => onChange(settingsKey, e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <div className="flex flex-col overflow-hidden">
        <span className={`${theme.labelSize} font-bold uppercase tracking-tight text-slate-400 group-hover/item:text-slate-900 transition-colors truncate`}>
          {label}
        </span>
        <span className="text-[8px] font-mono text-slate-300 uppercase">{value}</span>
      </div>
    </div>
  );
};

const ColorPickerGroup: React.FC<{
  title: string;
  items: { label: string, key: keyof UISettings }[];
  settings: UISettings;
  onChange: (key: keyof UISettings, val: string) => void;
}> = ({ title, items, settings, onChange }) => {
  const sectionTheme = UI_CUSTOM_THEME.section;

  return (
    <div className={sectionTheme.spacing}>
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-1 h-4 rounded-full" style={{ backgroundColor: sectionTheme.indicatorColor }}></div>
        <h4 className={`${sectionTheme.titleSize} font-black uppercase tracking-widest`} style={{ color: sectionTheme.labelColor }}>
          {title}
        </h4>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
        {items.map((item, idx) => (
          <ColorItem 
            key={item.key}
            index={idx}
            label={item.label}
            settingsKey={item.key}
            value={settings[item.key] as string}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
};

export const UICustomizationTab: React.FC<UICustomizationTabProps> = ({ settings, setSettings, showDialog, onResetVisuals, addLog }) => {
  const updateSetting = (key: keyof UISettings, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  const applyPresetConfig = (config: Partial<UISettings>) => {
    setSettings({ ...settings, ...config });
  };

  const theme = UI_CUSTOM_THEME;

  return (
    <div className="space-y-12 animate-in slide-in-from-right duration-500 max-w-5xl">
      <div className="border-b border-slate-100 pb-6 flex items-end justify-between">
         <div>
            <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none" style={{ color: settings.accentColor }}>界面定制</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-2 tracking-widest uppercase">Visual Identity System Control</p>
         </div>
         
         <StyleProfileDropdown 
           currentSettings={settings} 
           onApply={applyPresetConfig} 
           showDialog={showDialog}
           addLog={addLog}
         />
      </div>

      <div 
        className={`grid grid-cols-1 md:grid-cols-3 gap-8 rounded-3xl border transition-all ${theme.slider.padding}`}
        style={{ 
          backgroundColor: settings.controlPanelBg, 
          borderColor: settings.controlPanelBorder 
        }}
      >
        {[
          { label: '字体分级', key: 'fontSize', min: 50, max: 200 },
          { label: '框架缩放', key: 'uiScale', min: 50, max: 150 },
          { label: '网格倍率', key: 'cardScale', min: 50, max: 200 },
        ].map(item => (
          <div key={item.key} className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">{item.label}</label>
              <span className="text-sm font-black" style={{ color: settings.accentColor }}>
                {(settings as any)[item.key]}%
              </span>
            </div>
            <input 
              type="range" 
              min={item.min} 
              max={item.max} 
              value={(settings as any)[item.key]} 
              onChange={e => updateSetting(item.key as any, parseInt(e.target.value))} 
              className={`w-full h-2 rounded-full cursor-pointer transition-all hover:brightness-110`} 
              style={{ 
                backgroundColor: settings.widgetBg, 
                border: `1px solid ${settings.widgetBorder}`,
                accentColor: settings.accentColor 
              }}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
        <div className="space-y-12">
          <ColorPickerGroup 
            title="核心布局 (CORE)" 
            settings={settings}
            onChange={updateSetting}
            items={[
              { label: '全局背景', key: 'pageBg' },
              { label: '页眉底色', key: 'headerBg' },
              { label: '网格底色', key: 'cardBg' },
              { label: '强调主色', key: 'accentColor' },
              { label: '正文字色', key: 'textColor' },
            ]} 
          />
          <ColorPickerGroup 
            title="搜索筛选 (SEARCH)" 
            settings={settings}
            onChange={updateSetting}
            items={[
              { label: '搜索框背景', key: 'searchBarBg' },
              { label: '搜索框边框', key: 'searchBarBorder' },
              { label: '标签激活色', key: 'filterBadgeActiveBg' },
              { label: '标签激活字', key: 'filterBadgeActiveText' },
              { label: '标签常规色', key: 'filterBadgeInactiveBg' },
              { label: '标签常规字', key: 'filterBadgeInactiveText' },
              { label: '计数区背景', key: 'countBadgeBg' },
              { label: '计数区边框', key: 'countBadgeBorder' },
              { label: '计数区文字', key: 'countBadgeText' },
              { label: '排序框背景', key: 'sortDropdownBg' },
              { label: '排序框边框', key: 'sortDropdownBorder' },
              { label: '排序框文字', key: 'sortDropdownText' },
            ]} 
          />
          <ColorPickerGroup 
            title="侧边栏 (SIDEBAR)" 
            settings={settings}
            onChange={updateSetting}
            items={[
              { label: '侧栏底色', key: 'sidebarBg' },
              { label: '侧栏字色', key: 'sidebarTextColor' },
              { label: '激活背景', key: 'sidebarActiveBg' },
              { label: '激活文字', key: 'sidebarActiveTextColor' },
            ]} 
          />
        </div>
        <div className="space-y-12">
          <ColorPickerGroup 
            title="审计系统 (AUDIT)" 
            settings={settings}
            onChange={updateSetting}
            items={[
              { label: '条目背景', key: 'auditEntryBg' },
              { label: '条目边框', key: 'auditEntryBorder' },
              { label: '导出按钮色', key: 'auditBtnExportBg' },
              { label: '导出按钮字', key: 'auditBtnExportText' },
              { label: '清空按钮色', key: 'auditBtnClearBg' },
              { label: '清空按钮字', key: 'auditBtnClearText' },
            ]} 
          />
          <ColorPickerGroup 
            title="排版体系 (TYPO)" 
            settings={settings}
            onChange={updateSetting}
            items={[
              { label: '主标题色', key: 'primaryFontColor' },
              { label: '次级描述', key: 'secondaryFontColor' },
              { label: '弱化提示', key: 'mutedFontColor' },
              { label: '重音高亮', key: 'accentFontColor' },
            ]} 
          />
          <ColorPickerGroup 
            title="深度定制 (ADVANCED)" 
            settings={settings}
            onChange={updateSetting}
            items={[
              { label: '面板底色', key: 'controlPanelBg' },
              { label: '面板边框', key: 'controlPanelBorder' },
              { label: '控件背景', key: 'widgetBg' },
              { label: '控件边框', key: 'widgetBorder' },
              { label: '控件文字', key: 'widgetText' },
              { label: '页签容器', key: 'createTabBg' },
              { label: '页签激活底', key: 'createTabActiveBg' },
              { label: '页签激活字', key: 'createTabActiveText' },
              { label: '页签常规字', key: 'createTabInactiveText' },
              { label: '详情页眉', key: 'detailsHeaderBg' },
              { label: '详情页边', key: 'detailsHeaderBorder' },
              { label: '编辑按钮背景', key: 'detailsEditBtnBg' },
              { label: '编辑按钮文字', key: 'detailsEditBtnText' },
              { label: '激活编辑背景', key: 'detailsEditActiveBtnBg' },
              { label: '激活编辑文字', key: 'detailsEditActiveBtnText' },
              { label: '笔记复制背景', key: 'detailsNotesCopyBg' },
              { label: '笔记复制边框', key: 'detailsNotesCopyBorder' },
              { label: '笔记复制文字', key: 'detailsNotesCopyText' },
              { label: '对话框背景', key: 'detailsDialogBg' },
              { label: '对话框文字', key: 'detailsDialogText' },
              { label: '对话框保存背景', key: 'detailsDialogConfirmBg' },
              { label: '对话框保存文字', key: 'detailsDialogConfirmText' },
              { label: '偏好卡片背景', key: 'prefCardBg' },
              { label: '偏好卡片边框', key: 'prefCardBorder' },
              { label: '开关激活色', key: 'prefSwitchOn' },
              { label: '开关常规色', key: 'prefSwitchOff' },
              { label: '恢复背景', key: 'restoreBtnBg' },
              { label: '恢复文字', key: 'restoreBtnText' },
            ]} 
          />
        </div>
      </div>

      <div className={`p-8 rounded-[2rem] border flex items-center justify-between ${theme.preview.bg} ${theme.preview.border} shadow-2xl`}>
        <div className="space-y-1">
          <h5 className="text-sm font-black uppercase italic tracking-tighter" style={{ color: theme.preview.titleColor }}>实时引擎已挂载</h5>
          <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: theme.preview.descColor }}>PREVIEW ENGINE IS ACTIVE. CHANGES SYNCED TO LOCALSTORAGE.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => {
              showDialog({
                type: 'confirm',
                variant: 'danger',
                title: '重置界面定制',
                message: '确定要清除所有界面颜色设置并恢复出厂配置吗？此操作将保留您的书库数据。',
                onConfirm: () => {
                  onResetVisuals();
                }
              });
            }}
            className="px-8 py-3 border border-white/20 text-white/40 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            冷重置视觉引擎
          </button>
        </div>
      </div>
    </div>
  );
};
