
import { UISettings } from '../types';

export const getImportTheme = (settings: UISettings) => ({
  main: {
    bg: settings.pageBg,
    contentBg: settings.pageBg,
  },
  header: {
    padding: 'p-8',
    border: 'rgba(0,0,0,0.05)',
    titleColor: settings.primaryFontColor,
    closeBtnColor: settings.mutedFontColor,
    closeBtnHoverBg: 'rgba(0,0,0,0.05)',
    closeBtnHoverText: settings.primaryFontColor,
    tab: {
      activeBorder: settings.accentColor,
      activeText: settings.primaryFontColor,
      inactiveText: settings.mutedFontColor,
    }
  },
  toggle: {
    labelColor: settings.primaryFontColor,
    descColor: settings.secondaryFontColor,
    trackOn: settings.accentColor,
    trackOff: 'rgba(0,0,0,0.1)',
    thumbBg: '#ffffff',
    cardBg: settings.cardBg,
    cardBorder: 'rgba(0,0,0,0.05)',
  },
  cards: {
    folder: {
      border: 'rgba(0,0,0,0.05)',
      hoverBorder: settings.accentColor,
      hoverBg: settings.accentColor + '05',
      iconBg: settings.accentColor + '10',
      iconColor: settings.accentColor,
      titleColor: settings.primaryFontColor,
      descColor: settings.mutedFontColor,
    },
    files: {
      border: 'rgba(0,0,0,0.05)',
      hoverBorder: '#34d399',
      hoverBg: '#34d39905',
      iconBg: '#34d39910',
      iconColor: '#10b981',
      titleColor: settings.primaryFontColor,
      descColor: settings.mutedFontColor,
    }
  },
  textImport: {
    cardBg: settings.cardBg,
    cardBorder: 'rgba(0,0,0,0.05)',
    labelColor: settings.primaryFontColor,
    descColor: settings.secondaryFontColor,
    textareaBg: 'rgba(0,0,0,0.02)',
    textareaBorder: 'rgba(0,0,0,0.05)',
    textareaFocusBg: settings.cardBg,
    submitBtnBg: settings.accentColor,
    submitBtnText: '#ffffff',
    submitBtnHover: '#000000',
  },
  footer: {
    border: 'rgba(0,0,0,0.05)',
    btnBg: settings.accentColor,
    btnText: '#ffffff',
    btnHover: '#000000',
  }
});
