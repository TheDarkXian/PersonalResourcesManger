
import { UISettings } from '../types';

export const getResourceEditTheme = (settings: UISettings) => ({
  main: {
    bg: settings.pageBg,
  },
  header: {
    bg: settings.headerBg,
    border: 'rgba(0,0,0,0.05)',
    timestampLabel: settings.mutedFontColor,
    timestampValue: settings.secondaryFontColor,
    divider: 'rgba(0,0,0,0.1)',
  },
  buttons: {
    returnBtn: {
      text: settings.secondaryFontColor,
      hoverBg: 'rgba(0,0,0,0.05)',
      hoverText: settings.primaryFontColor,
    },
    navBtn: {
      text: settings.secondaryFontColor,
      hoverBg: 'rgba(0,0,0,0.05)',
      disabled: 'rgba(0,0,0,0.1)',
    },
    editMode: {
      active: {
        bg: settings.detailsEditActiveBtnBg,
        border: 'transparent',
        text: settings.detailsEditActiveBtnText,
        hoverBg: settings.detailsEditActiveBtnBg,
      },
      inactive: {
        bg: settings.detailsEditBtnBg,
        border: 'rgba(0,0,0,0.1)',
        text: settings.detailsEditBtnText,
        hoverBorder: settings.primaryFontColor,
        hoverText: settings.primaryFontColor,
      }
    },
    save: {
      activeBg: settings.accentColor,
      activeText: '#ffffff',
      activeHover: '#000000',
      disabledBg: 'rgba(0,0,0,0.05)',
      disabledText: settings.mutedFontColor,
    }
  },
  form: {
    label: settings.mutedFontColor,
    input: {
      bg: settings.cardBg,
      border: 'rgba(0,0,0,0.1)',
      focusBorder: settings.accentColor,
      focusRing: settings.accentColor + '10',
      readOnlyText: settings.primaryFontColor,
      placeholder: settings.mutedFontColor,
    },
    pathInput: {
      bg: 'rgba(0,0,0,0.02)',
      border: 'rgba(0,0,0,0.05)',
      text: settings.secondaryFontColor,
    },
    actionBtn: {
      bg: settings.cardBg,
      border: 'rgba(0,0,0,0.1)',
      text: settings.secondaryFontColor,
      hoverBg: 'rgba(0,0,0,0.03)',
      primaryBg: settings.accentColor,
      primaryText: '#ffffff',
    },
    notesActionBtn: {
      bg: settings.detailsNotesCopyBg,
      border: settings.detailsNotesCopyBorder,
      text: settings.detailsNotesCopyText,
    }
  },
  tags: {
    sectionBg: 'rgba(0,0,0,0.01)',
    sectionBorder: 'rgba(0,0,0,0.05)',
    label: settings.secondaryFontColor,
    item: {
      bg: settings.cardBg,
      inactiveText: settings.mutedFontColor,
      inactiveBorder: 'rgba(0,0,0,0.1)',
    }
  }
});
