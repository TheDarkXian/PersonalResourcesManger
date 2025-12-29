
import { UISettings } from '../types';

/**
 * 快速导航 (Outline Sidebar) 专用视觉主题配置 (动态紧凑版)
 */
export const getOutlineTheme = (settings: UISettings) => ({
  // 侧边栏基础布局
  sidebar: {
    bg: settings.sidebarBg || '#ffffff',
    border: 'rgba(0,0,0,0.1)',
    headerBg: 'rgba(0,0,0,0.02)',
    footerBg: 'rgba(0,0,0,0.01)',
    shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },

  // 头部区域
  header: {
    title: settings.primaryFontColor,
    subtitle: settings.mutedFontColor,
    countBg: settings.sidebarActiveBg,
    countText: settings.sidebarActiveTextColor,
  },

  // 文件夹节点
  folder: {
    icon: settings.accentColor, 
    text: settings.secondaryFontColor,
    hoverBg: 'rgba(0,0,0,0.05)',
    expandedIcon: settings.mutedFontColor,
    badgeBg: settings.cardBg,
    badgeText: settings.mutedFontColor,
  },

  // 文件节点
  file: {
    icon: settings.mutedFontColor,
    text: settings.textColor,
    hoverBg: settings.accentColor + '10',
    hoverBorder: settings.accentColor + '20',
  },

  // 交互组件
  resizeHandle: {
    idle: 'rgba(0,0,0,0.05)',
    active: settings.accentColor,
  },

  // 空状态
  empty: {
    icon: 'rgba(0,0,0,0.1)',
    text: settings.mutedFontColor,
  },

  // 底部栏
  footer: {
    label: settings.mutedFontColor,
    actionText: settings.mutedFontColor,
    actionHover: settings.accentColor,
  }
});
