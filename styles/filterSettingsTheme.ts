
import { UISettings } from '../types';

export const getFilterSettingsTheme = (settings: UISettings) => ({
  main: {
    bg: settings.pageBg || '#f8fafc',
    overlay: 'rgba(15, 23, 42, 0.05)',
  },
  header: {
    bg: settings.headerBg || '#ffffff',
    border: 'rgba(0,0,0,0.05)',
    title: settings.primaryFontColor,
    subtitle: settings.mutedFontColor,
    backBtnText: settings.secondaryFontColor,
    backBtnHoverBg: 'rgba(0,0,0,0.05)',
  },
  section: {
    label: settings.mutedFontColor,
    title: settings.primaryFontColor,
    divider: 'rgba(0,0,0,0.05)',
  },
  card: {
    bg: settings.cardBg || '#ffffff',
    border: 'rgba(0,0,0,0.05)',
    shadow: 'shadow-sm hover:shadow-xl',
  },
  option: {
    bg: 'rgba(0,0,0,0.02)',
    hoverBg: 'rgba(0,0,0,0.04)',
    activeBg: settings.accentColor + '15',
    activeBorder: settings.accentColor,
    activeText: settings.accentColor,
    text: settings.secondaryFontColor,
  },
  footer: {
    resetBtnBg: 'rgba(0,0,0,0.05)',
    resetBtnText: settings.secondaryFontColor,
    closeBtnBg: settings.accentColor,
    closeBtnText: '#ffffff',
  }
});
