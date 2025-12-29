
import { UISettings } from '../types';

export const getMainGridTheme = (settings: UISettings) => ({
  container: {
    padding: 'p-6',
    defaultBg: settings.pageBg, 
  },
  loading: {
    spinnerColor: settings.accentColor,
    textColor: settings.mutedFontColor,
    shimmer: {
      bg: 'rgba(0,0,0,0.05)',
      highlight: 'rgba(0,0,0,0.02)',
    }
  },
  empty: {
    iconColor: settings.mutedFontColor,
    textColor: settings.mutedFontColor,
  },
  footer: {
    textColor: settings.mutedFontColor,
  },
  card: {
    bg: settings.cardBg,
    border: 'rgba(0,0,0,0.05)',
    hoverShadow: 'shadow-xl',
    
    selectionRing: settings.accentColor,
    selectionBg: settings.accentColor + '08',
    pingBorder: settings.accentColor,
    
    previewBg: 'rgba(0,0,0,0.02)',
    previewIconColor: settings.mutedFontColor,
    
    actionBtn: {
      bg: 'rgba(255, 255, 255, 0.9)',
      text: settings.secondaryFontColor,
      hoverBg: settings.accentColor,
      hoverText: '#ffffff',
      border: 'rgba(0,0,0,0.1)',
    },
    
    defaultFooterBg: settings.defaultCardTitleBg,
    defaultFooterText: settings.defaultCardTitleColor,
    footerDivider: 'rgba(0,0,0,0.05)',
  }
});
