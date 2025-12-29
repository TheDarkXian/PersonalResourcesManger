
export type ResourceType = 'local-file' | 'local-folder' | 'url' | 'cloud' | 'text-note' | 'other';
export type TagDisplayMode = 'all' | 'icon-only' | 'text-only' | 'color-only';
export type FilterMatchMode = 'AND' | 'OR';

/**
 * Fix: Define UserPreferences interface which was referenced in PreferencesTab.tsx but missing in types.ts
 */
export interface UserPreferences {
  showConsole: boolean;
  confirmBeforeDelete: boolean;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  icon?: string;
  customIcon?: string;
  displayMode: TagDisplayMode;
  isDefault?: boolean;
}

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  pathOrUrl: string;
  tags: string[];
  color?: string;
  titleColor?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
  lastAccessedAt: number;
}

export interface AuditMetadata {
  count?: number;
  types?: Record<string, number>;
  filenames?: string[];
  tags?: string[];
  previousState?: any;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  action: string;
  details: string;
  metadata?: AuditMetadata;
}

export interface Library {
  id: string;
  name: string;
  resources: Resource[];
  tags: Tag[];
  createdAt: number;
  updatedAt: number;
  history: HistoryEntry[];
}

export interface UISettings {
  fontSize: number;
  uiScale: number;
  cardScale: number;
  pageBg: string;
  textColor: string;
  accentColor: string;
  headerBg: string;
  cardBg: string;
  defaultCardTitleBg: string;
  defaultCardTitleColor: string;
  
  // 筛选策略设置
  filterMode: FilterMatchMode;
  filterCaseSensitive: boolean;
  filterIncludePath: boolean;
  filterShowCounts: boolean;

  // 系统偏好设置 (由 UserPreferences 合并而来)
  showConsole: boolean;
  confirmBeforeDelete: boolean;

  // 组件特定颜色 (Components)
  sidebarBg: string;
  sidebarTextColor: string;
  sidebarActiveBg: string;
  sidebarActiveTextColor: string;
  
  // 字体色彩体系 (Typography)
  primaryFontColor: string;
  secondaryFontColor: string;
  mutedFontColor: string;
  accentFontColor: string;

  // 控件与面板定制 (Controls & Panels)
  controlPanelBg: string;
  controlPanelBorder: string;
  widgetBg: string;
  widgetBorder: string;
  widgetText: string;

  // 审计系统定制 (Audit System)
  auditEntryBg: string;
  auditEntryBorder: string;
  auditBtnExportBg: string;
  auditBtnExportText: string;
  auditBtnClearBg: string;
  auditBtnClearText: string;

  // 搜索与筛选定制 (Search & Filter)
  searchBarBg: string;
  searchBarBorder: string;
  filterBadgeActiveBg: string;
  filterBadgeActiveText: string;
  filterBadgeInactiveBg: string;
  filterBadgeInactiveText: string;

  // 计数与排序定制 (Count & Sort)
  countBadgeBg: string;
  countBadgeBorder: string;
  countBadgeText: string;
  sortDropdownBg: string;
  sortDropdownBorder: string;
  sortDropdownText: string;

  // 细节面板定制 (Details Panel)
  detailsHeaderBg: string;
  detailsHeaderBorder: string;
  detailsEditBtnBg: string;
  detailsEditBtnText: string;
  detailsEditActiveBtnBg: string;
  detailsEditActiveBtnText: string;
  
  // 笔记区域复制按钮配置
  detailsNotesCopyBg: string;
  detailsNotesCopyBorder: string;
  detailsNotesCopyText: string;

  // 交互对话框定制 (Dialogs)
  detailsDialogBg: string;
  detailsDialogText: string;
  detailsDialogConfirmBg: string;
  detailsDialogConfirmText: string;

  // 偏好设置页面定制 (Preferences Tab)
  prefCardBg: string;
  prefCardBorder: string;
  prefSwitchOn: string;
  prefSwitchOff: string;

  // 创建书库引导定制 (Create Library Flow)
  createTabBg: string;
  createTabActiveBg: string;
  createTabActiveText: string;
  createTabInactiveText: string;

  // 维护面板定制 (Maintenance)
  restoreBtnBg: string;
  restoreBtnText: string;

  activeLibraryId?: string;
}

export interface StyleProfile {
  id: string;
  name: string;
  isSystem?: boolean;
  config: Partial<UISettings>;
}

export interface DialogState {
  isOpen: boolean;
  type: 'confirm' | 'prompt' | 'alert';
  variant?: 'default' | 'danger'; 
  title: string;
  message: string;
  placeholder?: string;
  onConfirm: (input?: string) => void;
  inputValue?: string;
}
