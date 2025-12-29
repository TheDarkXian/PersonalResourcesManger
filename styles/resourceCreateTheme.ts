
import { UISettings } from '../types';

/**
 * 新建资源项目面板专用视觉主题配置 (动态响应版)
 */
export const getResourceCreateTheme = (settings: UISettings) => ({
  container: {
    bg: settings.pageBg,
    overlay: 'rgba(15, 23, 42, 0.4)',
  },
  header: {
    bg: settings.headerBg,
    border: 'rgba(0,0,0,0.05)',
    titleColor: settings.primaryFontColor,
    subtitleColor: settings.mutedFontColor,
    closeBtnHover: 'rgba(0,0,0,0.05)',
  },
  form: {
    labelColor: settings.mutedFontColor,
    inputBg: settings.cardBg,
    inputBorder: 'rgba(0,0,0,0.1)',
    inputFocusBorder: settings.accentColor,
    inputFocusRing: settings.accentColor + '15',
    placeholderColor: settings.mutedFontColor,
  },
  preview: {
    bg: '#0f172a',
    border: 'rgba(255,255,255,0.05)',
    emptyIcon: '#334155',
    emptyText: '#475569',
  },
  sidebar: {
    sectionBg: 'rgba(0,0,0,0.02)',
    sectionBorder: 'rgba(0,0,0,0.05)',
    tagLabel: settings.secondaryFontColor,
  },
  footer: {
    createBtnBg: settings.accentColor,
    createBtnHover: '#000000',
    createBtnShadow: settings.accentColor + '40',
    cancelBtnText: settings.mutedFontColor,
    cancelBtnHoverBg: 'rgba(0,0,0,0.05)',
  }
});
