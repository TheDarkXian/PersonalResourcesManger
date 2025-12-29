
import { UISettings } from '../types';

export const getTagTheme = (settings: UISettings) => ({
  header: {
    bg: settings.headerBg,
    border: 'rgba(0,0,0,0.05)',
    titleColor: settings.primaryFontColor,
    subtitleColor: settings.mutedFontColor,
    closeBtnHoverBg: 'rgba(0,0,0,0.05)',
  },
  buttons: {
    batchMode: {
      activeBg: settings.sidebarActiveBg || '#0f172a',
      activeText: settings.sidebarActiveTextColor || '#ffffff',
      inactiveBg: settings.cardBg,
      inactiveText: settings.secondaryFontColor,
      border: 'rgba(0,0,0,0.1)',
    },
    batchDelete: {
      bg: '#e11d48',
      text: '#ffffff',
      hoverBg: '#be123c',
      shadow: 'rgba(225, 29, 72, 0.3)',
    },
    addNew: {
      bg: settings.accentColor,
      text: '#ffffff',
      hoverBg: '#000000',
      shadow: settings.accentColor + '30',
    }
  },
  main: {
    bg: settings.pageBg,
    emptyIconColor: settings.mutedFontColor,
    emptyTextColor: settings.mutedFontColor,
  },
  card: {
    bg: settings.cardBg,
    border: 'rgba(0,0,0,0.05)',
    hoverBorder: settings.accentColor,
    selectedRing: settings.accentColor + '20',
    labelColor: settings.mutedFontColor,
    inputBg: 'rgba(0,0,0,0.02)',
    inputTextColor: settings.primaryFontColor,
    placeholderColor: settings.mutedFontColor
  }
});
