/**
 * 书库管理模块专用视觉主题配置文件
 */

export const LIBRARY_THEME = {
  // 头部区域样式
  header: {
    titleColor: '#0f172a',      // 主标题颜色
    subtitleColor: '#94a3b8',   // 副标题颜色
    dividerColor: '#f1f5f9',    // 分割线颜色
  },

  // 按钮样式
  buttons: {
    create: {
      bg: '#0f172a',           // 创建按钮背景
      text: '#ffffff',         // 创建按钮文字
      hoverBg: '#000000',      // 悬浮背景
      shadow: 'rgba(15, 23, 42, 0.2)',
    },
    batchDelete: {
      bg: '#fff1f2',           // 批量删除背景
      text: '#e11d48',         // 批量删除文字
      hoverBg: '#ffe4e6',
    }
  },

  // 书库卡片样式
  card: {
    // 基础状态
    default: {
      bg: 'rgba(248, 250, 252, 0.5)',
      border: '#f8fafc',
      shadow: 'none',
      textColor: '#1e293b',
      mutedTextColor: '#94a3b8',
    },
    // 活跃状态
    active: {
      bg: 'rgba(59, 130, 246, 0.05)',
      border: '#3b82f6',
      shadow: '0 40px 80px -15px rgba(59, 130, 246, 0.15)',
      textColor: '#2563eb',
    },
    // 选中状态 (待删除)
    selected: {
      bg: 'rgba(225, 29, 72, 0.05)',
      border: '#fda4af',
      textColor: '#e11d48',
    },
    // 内部组件
    inner: {
      statsValue: '#0f172a',
      statsLabel: '#94a3b8',
      divider: 'rgba(15, 23, 42, 0.05)',
      actionBtnBg: '#ffffff',
      actionBtnBorder: '#f1f5f9',
      actionBtnIcon: '#94a3b8',
      actionBtnHoverText: '#3b82f6',
    }
  },

  // 创建书库弹窗
  dialog: {
    bg: '#ffffff',
    iconBg: '#eff6ff',
    iconColor: '#3b82f6',
    inputBg: '#f8fafc',
    inputBorder: '#f1f5f9',
    inputFocusBorder: '#3b82f6',
    primaryBtnBg: '#0f172a',
    primaryBtnText: '#ffffff',
  }
};
