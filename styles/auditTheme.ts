/**
 * 操作审计模块专用视觉主题配置文件
 */

export const AUDIT_THEME = {
  // 头部区域样式
  header: {
    titleColor: '#0f172a',      // 主标题颜色
    subtitleColor: '#64748b',   // 副标题颜色
    dividerColor: '#f1f5f9',    // 分割线颜色
  },

  // 按钮样式
  buttons: {
    clear: {
      bg: '#fff1f2',           // 按钮背景 (Rose 50)
      text: '#e11d48',         // 按钮文字 (Rose 600)
      hoverBg: '#ffe4e6',      // 悬浮背景 (Rose 100)
    },
  },

  // 条目样式 (AuditEntryItem)
  entry: {
    bg: '#ffffff',             // 条目背景
    border: '#f1f5f9',         // 条目边框
    hoverBorder: '#e2e8f0',    // 条目悬浮边框
    shadow: 'rgba(0, 0, 0, 0.05)',
    hoverShadow: 'rgba(0, 0, 0, 0.1)',
    
    // 内部组件样式
    idBadgeBg: '#f8fafc',
    idBadgeText: '#94a3b8',
    metadataBg: '#f8fafc',
    metadataBorder: '#f1f5f9',
    metadataLabel: '#94a3b8',
    metadataValue: '#475569',
  },

  // 空状态样式
  emptyState: {
    iconColor: '#e2e8f0',
    textColor: '#94a3b8',
  }
};
