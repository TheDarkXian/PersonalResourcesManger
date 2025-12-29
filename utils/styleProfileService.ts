
import { UISettings, StyleProfile } from '../types';

const STORAGE_KEY = 'ui_style_profiles_v1';
const ACTIVE_PROFILE_KEY = 'ui_active_style_profile_id';

const SYSTEM_PRESETS: StyleProfile[] = [
  {
    id: 'sys-light',
    name: '极简白瓷 (System)',
    isSystem: true,
    config: {
      pageBg: '#f8fafc',
      headerBg: '#ffffff',
      cardBg: '#ffffff',
      accentColor: '#3b82f6',
      textColor: '#1e293b',
      sidebarBg: 'rgba(248, 250, 252, 0.8)',
      sidebarTextColor: '#475569',
      sidebarActiveBg: '#0f172a',
      sidebarActiveTextColor: '#ffffff',
      primaryFontColor: '#0f172a',
      secondaryFontColor: '#475569',
      mutedFontColor: '#94a3b8',
      accentFontColor: '#3b82f6',
      defaultCardTitleBg: '#ffffff',
      defaultCardTitleColor: '#000000',
      controlPanelBg: '#f1f5f9',
      controlPanelBorder: '#e2e8f0',
      widgetBg: '#ffffff',
      widgetBorder: '#e2e8f0',
      widgetText: '#0f172a',
      auditEntryBg: '#ffffff',
      auditEntryBorder: '#f1f5f9',
      auditBtnExportBg: '#ffffff',
      auditBtnExportText: '#3b82f6',
      auditBtnClearBg: '#fff1f2',
      auditBtnClearText: '#e11d48',
      searchBarBg: '#f8fafc',
      searchBarBorder: '#e2e8f0',
      filterBadgeActiveBg: '#0f172a',
      filterBadgeActiveText: '#ffffff',
      filterBadgeInactiveBg: '#ffffff',
      filterBadgeInactiveText: '#64748b',
      // 优化：增强对比
      countBadgeBg: '#f1f5f9',
      countBadgeBorder: '#cbd5e1',
      countBadgeText: '#475569',
      sortDropdownBg: '#ffffff',
      sortDropdownBorder: '#cbd5e1',
      sortDropdownText: '#0f172a',
      detailsHeaderBg: '#ffffff',
      detailsHeaderBorder: 'rgba(0,0,0,0.08)',
      detailsEditBtnBg: 'rgba(255,255,255,0.2)',
      detailsEditBtnText: '#0f172a',
      detailsEditActiveBtnBg: '#fffbeb',
      detailsEditActiveBtnText: '#d97706',
      detailsDialogBg: '#ffffff',
      detailsDialogText: '#0f172a',
      detailsDialogConfirmBg: '#2563eb',
      detailsDialogConfirmText: '#ffffff',
      prefCardBg: '#ffffff',
      prefCardBorder: 'rgba(0,0,0,0.05)',
      prefSwitchOn: '#10b981',
      prefSwitchOff: '#cbd5e1',
      createTabBg: '#f1f5f9',
      createTabActiveBg: '#ffffff',
      createTabActiveText: '#2563eb',
      createTabInactiveText: '#94a3b8',
      restoreBtnBg: '#0f172a',
      restoreBtnText: '#ffffff',
    }
  },
  {
    id: 'sys-midnight',
    name: '深邃午夜 (System)',
    isSystem: true,
    config: {
      pageBg: '#020617',
      headerBg: '#0f172a',
      cardBg: '#1e293b',
      accentColor: '#6366f1',
      textColor: '#f8fafc',
      sidebarBg: 'rgba(15, 23, 42, 0.9)',
      sidebarTextColor: '#94a3b8',
      sidebarActiveBg: '#6366f1',
      sidebarActiveTextColor: '#ffffff',
      primaryFontColor: '#f8fafc',
      secondaryFontColor: '#cbd5e1',
      mutedFontColor: '#64748b',
      accentFontColor: '#818cf8',
      defaultCardTitleBg: '#1e293b',
      defaultCardTitleColor: '#ffffff',
      controlPanelBg: '#0f172a',
      controlPanelBorder: '#1e293b',
      widgetBg: '#1e293b',
      widgetBorder: '#334155',
      widgetText: '#f8fafc',
      auditEntryBg: '#1e293b',
      auditEntryBorder: '#334155',
      auditBtnExportBg: '#1e293b',
      auditBtnExportText: '#818cf8',
      auditBtnClearBg: '#450a0a',
      auditBtnClearText: '#fecdd3',
      searchBarBg: '#0f172a',
      searchBarBorder: '#334155',
      filterBadgeActiveBg: '#6366f1',
      filterBadgeActiveText: '#ffffff',
      filterBadgeInactiveBg: '#1e293b',
      filterBadgeInactiveText: '#94a3b8',
      // 优化：深色模式下的亮度层级
      countBadgeBg: '#1e293b',
      countBadgeBorder: '#475569',
      countBadgeText: '#cbd5e1',
      sortDropdownBg: '#0f172a',
      sortDropdownBorder: '#475569',
      sortDropdownText: '#f8fafc',
      detailsHeaderBg: '#0f172a',
      detailsHeaderBorder: '#334155',
      detailsEditBtnBg: 'rgba(255,255,255,0.1)',
      detailsEditBtnText: '#ffffff',
      detailsEditActiveBtnBg: '#4338ca',
      detailsEditActiveBtnText: '#ffffff',
      detailsDialogBg: '#1e293b',
      detailsDialogText: '#f8fafc',
      detailsDialogConfirmBg: '#6366f1',
      detailsDialogConfirmText: '#ffffff',
      prefCardBg: '#1e293b',
      prefCardBorder: '#334155',
      prefSwitchOn: '#6366f1',
      prefSwitchOff: '#0f172a',
      createTabBg: '#0f172a',
      createTabActiveBg: '#1e293b',
      createTabActiveText: '#818cf8',
      createTabInactiveText: '#64748b',
      restoreBtnBg: '#f8fafc',
      restoreBtnText: '#0f172a',
    }
  },
  {
    id: 'sys-matrix',
    name: '黑客矩阵 (System)',
    isSystem: true,
    config: {
      pageBg: '#000000',
      headerBg: '#050505',
      cardBg: '#0a0a0a',
      accentColor: '#22c55e',
      textColor: '#22c55e',
      sidebarBg: 'rgba(0, 0, 0, 0.95)',
      sidebarTextColor: '#166534',
      sidebarActiveBg: '#22c55e',
      sidebarActiveTextColor: '#000000',
      primaryFontColor: '#22c55e',
      secondaryFontColor: '#15803d',
      mutedFontColor: '#14532d',
      accentFontColor: '#4ade80',
      defaultCardTitleBg: '#000000',
      defaultCardTitleColor: '#22c55e',
      controlPanelBg: '#050505',
      controlPanelBorder: '#166534',
      widgetBg: '#000000',
      widgetBorder: '#15803d',
      widgetText: '#22c55e',
      auditEntryBg: '#000000',
      auditEntryBorder: '#166534',
      auditBtnExportBg: '#000000',
      auditBtnExportText: '#22c55e',
      auditBtnClearBg: '#000000',
      auditBtnClearText: '#f43f5e',
      searchBarBg: '#000000',
      searchBarBorder: '#166534',
      filterBadgeActiveBg: '#22c55e',
      filterBadgeActiveText: '#000000',
      filterBadgeInactiveBg: '#000000',
      filterBadgeInactiveText: '#15803d',
      // 优化：黑客帝国的极高对比
      countBadgeBg: '#050505',
      countBadgeBorder: '#15803d',
      countBadgeText: '#22c55e',
      sortDropdownBg: '#000000',
      sortDropdownBorder: '#15803d',
      sortDropdownText: '#22c55e',
      // Fix: Removed duplicate 'detailsHeaderBg' property
      detailsHeaderBg: '#050505',
      detailsHeaderBorder: '#166534',
      detailsEditBtnBg: '#000000',
      detailsEditBtnText: '#22c55e',
      detailsEditActiveBtnBg: '#22c55e',
      detailsEditActiveBtnText: '#000000',
      detailsDialogBg: '#050505',
      detailsDialogText: '#22c55e',
      detailsDialogConfirmBg: '#22c55e',
      detailsDialogConfirmText: '#000000',
      prefCardBg: '#000000',
      prefCardBorder: '#166534',
      prefSwitchOn: '#22c55e',
      prefSwitchOff: '#050505',
      createTabBg: '#000000',
      createTabActiveBg: '#22c55e',
      createTabActiveText: '#000000',
      createTabInactiveText: '#166534',
      restoreBtnBg: '#22c55e',
      restoreBtnText: '#000000',
    }
  },
  {
    id: 'sys-vscode-light',
    name: 'VSCode Light (System)',
    isSystem: true,
    config: {
      pageBg: '#ffffff',
      headerBg: '#f8f8f8',
      cardBg: '#ffffff',
      accentColor: '#007acc',
      textColor: '#3b3b3b',
      sidebarBg: '#f8f8f8',
      sidebarTextColor: '#616161',
      sidebarActiveBg: '#e4e6f1',
      sidebarActiveTextColor: '#000000',
      primaryFontColor: '#3b3b3b',
      secondaryFontColor: '#616161',
      mutedFontColor: '#919191',
      accentFontColor: '#007acc',
      defaultCardTitleBg: '#f8f8f8',
      defaultCardTitleColor: '#3b3b3b',
      controlPanelBg: '#f3f3f3',
      controlPanelBorder: '#dddddd',
      widgetBg: '#ffffff',
      widgetBorder: '#d5d5d5',
      widgetText: '#3b3b3b',
      auditEntryBg: '#ffffff',
      auditEntryBorder: '#f0f0f0',
      auditBtnExportBg: '#ffffff',
      auditBtnExportText: '#007acc',
      auditBtnClearBg: '#fee2e2',
      auditBtnClearText: '#dc2626',
      searchBarBg: '#ffffff',
      searchBarBorder: '#cecece',
      filterBadgeActiveBg: '#007acc',
      filterBadgeActiveText: '#ffffff',
      filterBadgeInactiveBg: '#f3f3f3',
      filterBadgeInactiveText: '#616161',
      // 优化：工业级质感
      countBadgeBg: '#e1e4e8',
      countBadgeBorder: '#d1d5da',
      countBadgeText: '#24292e',
      sortDropdownBg: '#ffffff',
      sortDropdownBorder: '#cecece',
      sortDropdownText: '#3b3b3b',
      detailsHeaderBg: '#f8f8f8',
      detailsHeaderBorder: '#e5e5e5',
      detailsEditBtnBg: '#f3f3f3',
      detailsEditBtnText: '#3b3b3b',
      detailsEditActiveBtnBg: '#007acc',
      detailsEditActiveBtnText: '#ffffff',
      detailsDialogBg: '#ffffff',
      detailsDialogText: '#3b3b3b',
      detailsDialogConfirmBg: '#007acc',
      detailsDialogConfirmText: '#ffffff',
      prefCardBg: '#ffffff',
      prefCardBorder: '#dddddd',
      prefSwitchOn: '#007acc',
      prefSwitchOff: '#f3f3f3',
      createTabBg: '#f3f3f3',
      createTabActiveBg: '#ffffff',
      createTabActiveText: '#007acc',
      createTabInactiveText: '#616161',
      restoreBtnBg: '#2c2c2c',
      restoreBtnText: '#ffffff',
    }
  },
  {
    id: 'sys-vscode-dark',
    name: 'VSCode Dark (System)',
    isSystem: true,
    config: {
      pageBg: '#1e1e1e',
      headerBg: '#181818',
      cardBg: '#252526',
      accentColor: '#007acc',
      textColor: '#cccccc',
      sidebarBg: '#181818',
      sidebarTextColor: '#858585',
      sidebarActiveBg: '#37373d',
      sidebarActiveTextColor: '#ffffff',
      primaryFontColor: '#cccccc',
      secondaryFontColor: '#858585',
      mutedFontColor: '#616161',
      accentFontColor: '#4fc1ff',
      defaultCardTitleBg: '#181818',
      defaultCardTitleColor: '#cccccc',
      controlPanelBg: '#252526',
      controlPanelBorder: '#333333',
      widgetBg: '#3c3c3c',
      widgetBorder: '#454545',
      widgetText: '#cccccc',
      auditEntryBg: '#252526',
      auditEntryBorder: '#333333',
      auditBtnExportBg: '#2d2d2d',
      auditBtnExportText: '#cccccc',
      auditBtnClearBg: '#450a0a',
      auditBtnClearText: '#fecdd3',
      searchBarBg: '#3c3c3c',
      searchBarBorder: '#454545',
      filterBadgeActiveBg: '#007acc',
      filterBadgeActiveText: '#ffffff',
      filterBadgeInactiveBg: '#252526',
      filterBadgeInactiveText: '#858585',
      // 优化：沉浸感与可读性并存
      countBadgeBg: '#252526',
      countBadgeBorder: '#454545',
      countBadgeText: '#cccccc',
      sortDropdownBg: '#3c3c3c',
      sortDropdownBorder: '#454545',
      sortDropdownText: '#ffffff',
      detailsHeaderBg: '#181818',
      detailsHeaderBorder: '#333333',
      detailsEditBtnBg: '#3c3c3c',
      detailsEditBtnText: '#cccccc',
      detailsEditActiveBtnBg: '#007acc',
      detailsEditActiveBtnText: '#ffffff',
      detailsDialogBg: '#252526',
      detailsDialogText: '#cccccc',
      detailsDialogConfirmBg: '#007acc',
      detailsDialogConfirmText: '#ffffff',
      prefCardBg: '#252526',
      prefCardBorder: '#333333',
      prefSwitchOn: '#007acc',
      prefSwitchOff: '#181818',
      createTabBg: '#252526',
      createTabActiveBg: '#3c3c3c',
      createTabActiveText: '#4fc1ff',
      createTabInactiveText: '#858585',
      restoreBtnBg: '#ffffff',
      restoreBtnText: '#181818',
    }
  }
];

export const styleProfileService = {
  getProfiles(): StyleProfile[] {
    const saved = localStorage.getItem(STORAGE_KEY);
    const userProfiles = saved ? JSON.parse(saved) : [];
    return [...SYSTEM_PRESETS, ...userProfiles];
  },

  saveProfiles(profiles: StyleProfile[]) {
    const userOnly = profiles.filter(p => !p.isSystem);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userOnly));
  },

  getActiveProfileId(): string {
    return localStorage.getItem(ACTIVE_PROFILE_KEY) || 'sys-light';
  },

  setActiveProfileId(id: string) {
    localStorage.setItem(ACTIVE_PROFILE_KEY, id);
  },

  addProfile(name: string, settings: UISettings): StyleProfile {
    const { activeLibraryId, fontSize, uiScale, cardScale, ...pureConfig } = settings;
    const newProfile: StyleProfile = {
      id: crypto.randomUUID(),
      name,
      config: pureConfig,
      isSystem: false
    };
    const current = this.getProfiles();
    this.saveProfiles([...current, newProfile]);
    return newProfile;
  },

  updateProfileName(id: string, newName: string) {
    const current = this.getProfiles();
    const updated = current.map(p => (p.id === id && !p.isSystem) ? { ...p, name: newName } : p);
    this.saveProfiles(updated);
  },

  deleteProfile(id: string) {
    const current = this.getProfiles();
    const filtered = current.filter(p => p.id !== id || p.isSystem);
    this.saveProfiles(filtered);
    if (this.getActiveProfileId() === id) {
      this.setActiveProfileId('sys-light');
    }
  },

  importProfile(json: string): StyleProfile | null {
    try {
      const parsed = JSON.parse(json);
      const config = parsed.config || parsed;
      const name = parsed.name || '导入的样式';
      
      if (config && typeof config === 'object') {
        const newProfile: StyleProfile = {
          id: crypto.randomUUID(),
          name,
          config,
          isSystem: false
        };
        const current = this.getProfiles();
        this.saveProfiles([...current, newProfile]);
        return newProfile;
      }
      return null;
    } catch {
      return null;
    }
  }
};
