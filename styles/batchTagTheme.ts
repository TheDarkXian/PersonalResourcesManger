
import { UISettings } from '../types';

export const getBatchTagTheme = (settings: UISettings) => ({
  container: {
    bg: settings.pageBg,
  },
  header: {
    bg: settings.headerBg,
    border: 'rgba(0,0,0,0.05)',
    titleColor: settings.primaryFontColor,
    closeBtnColor: settings.mutedFontColor,
    closeBtnHoverBg: 'rgba(0,0,0,0.05)',
  },
  infoBadge: {
    bg: settings.accentColor + '20', 
    text: settings.accentColor, 
  },
  main: {
    bg: settings.pageBg,
    divider: 'rgba(0,0,0,0.05)',
  },
  label: {
    text: settings.mutedFontColor,
  },
  tagItem: {
    bg: settings.cardBg,
    border: 'rgba(0,0,0,0.1)',
    focusRing: settings.accentColor + '50',
  },
  cardRemove: {
    bg: settings.cardBg,
    border: 'rgba(0,0,0,0.1)',
    hoverBorder: '#fda4af',
    iconBg: '#fff1f2',
    iconColor: '#f43f5e',
    titleColor: settings.primaryFontColor,
    descColor: settings.secondaryFontColor,
    focusRing: 'rgba(244, 63, 94, 0.2)',
  },
  cardAdd: {
    bg: settings.sidebarActiveBg || '#0f172a',
    hoverBg: '#000000',
    iconBg: settings.accentColor,
    iconColor: '#ffffff',
    titleColor: settings.sidebarActiveTextColor || '#ffffff',
    descColor: settings.mutedFontColor,
    focusRing: settings.accentColor + '30',
  }
});
