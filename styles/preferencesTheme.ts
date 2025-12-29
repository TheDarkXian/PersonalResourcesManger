
import { UISettings } from '../types';

export const getPreferencesTheme = (settings: UISettings) => ({
  container: {
    padding: 'p-12',
    spacing: 'space-y-12',
  },
  section: {
    titleColor: settings.primaryFontColor,
    subtitleColor: settings.secondaryFontColor,
    border: 'rgba(0,0,0,0.05)',
  },
  card: {
    bg: settings.prefCardBg,
    border: settings.prefCardBorder,
    title: settings.primaryFontColor,
    desc: settings.mutedFontColor,
    iconBg: 'rgba(0,0,0,0.03)',
  },
  switch: {
    on: settings.prefSwitchOn,
    off: settings.prefSwitchOff,
    thumb: '#ffffff',
  },
  actions: {
    btnBg: settings.widgetBg,
    btnBorder: settings.widgetBorder,
    btnText: settings.widgetText,
    accent: settings.accentColor,
  }
});
