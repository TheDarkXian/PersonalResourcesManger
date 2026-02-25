
import { UISettings, StyleProfile } from '../types';
import { platformAdapter } from './platformAdapter';

const KEY_PROFILES = 'ui_style_profiles_v1';
const KEY_ACTIVE_ID = 'ui_active_style_profile_id';

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
  }
];

export const styleProfileService = {
  async getProfiles(): Promise<StyleProfile[]> {
    const userProfiles = await platformAdapter.loadData<StyleProfile[]>(KEY_PROFILES) || [];
    return [...SYSTEM_PRESETS, ...userProfiles];
  },

  async saveProfiles(profiles: StyleProfile[]) {
    const userOnly = profiles.filter(p => !p.isSystem);
    await platformAdapter.saveData(KEY_PROFILES, userOnly);
  },

  async getActiveProfileId(): Promise<string> {
    const id = localStorage.getItem(KEY_ACTIVE_ID);
    return id || 'sys-light';
  },

  async setActiveProfileId(id: string) {
    localStorage.setItem(KEY_ACTIVE_ID, id);
  },

  async addProfile(name: string, settings: UISettings): Promise<StyleProfile> {
    const { activeLibraryId, fontSize, uiScale, cardScale, ...pureConfig } = settings;
    const newProfile: StyleProfile = {
      id: crypto.randomUUID(),
      name,
      config: pureConfig,
      isSystem: false
    };
    const current = await this.getProfiles();
    await this.saveProfiles([...current, newProfile]);
    return newProfile;
  },

  async updateProfileName(id: string, newName: string) {
    const current = await this.getProfiles();
    const updated = current.map(p => (p.id === id && !p.isSystem) ? { ...p, name: newName } : p);
    await this.saveProfiles(updated);
  },

  async deleteProfile(id: string) {
    const current = await this.getProfiles();
    const filtered = current.filter(p => p.id !== id || p.isSystem);
    await this.saveProfiles(filtered);
    const activeId = await this.getActiveProfileId();
    if (activeId === id) {
      await this.setActiveProfileId('sys-light');
    }
  },

  async importProfile(json: string): Promise<StyleProfile | null> {
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
        const current = await this.getProfiles();
        await this.saveProfiles([...current, newProfile]);
        return newProfile;
      }
      return null;
    } catch {
      return null;
    }
  }
};
