/**
 * NAV-PRO 系统主题配置文件
 * 用于集中管理系统默认颜色、组件样式和字体配色
 */

export const THEME_CONFIG = {
  // 核心品牌色彩
  brand: {
    primary: '#0f172a',   // Slate 900
    secondary: '#1e293b', // Slate 800
    accent: '#3b82f6',    // Blue 500
    danger: '#e11d48',    // Rose 600
    success: '#10b981',   // Emerald 500
    warning: '#f59e0b',   // Amber 500
    info: '#0ea5e9',      // Sky 500
  },

  // 界面层级背景
  surface: {
    page: '#f8fafc',      // Slate 50
    header: '#ffffff',
    card: '#ffffff',
    sidebar: 'rgba(248, 250, 252, 0.8)',
    overlay: 'rgba(15, 23, 42, 0.6)',
  },

  // 字体色彩体系
  typography: {
    colors: {
      primary: '#0f172a',   // 主标题、正文
      secondary: '#475569', // 次要描述
      muted: '#94a3b8',     // 禁用或弱化文字
      inverse: '#ffffff',   // 深色背景上的反转文字
      accent: '#3b82f6',    // 高亮文字
    },
    weights: {
      normal: 400,
      medium: 500,
      bold: 700,
      black: 900,
    }
  },

  // 组件特定样式配置
  components: {
    sidebar: {
      activeBg: '#0f172a',
      activeText: '#ffffff',
      hoverBg: '#ffffff',
    },
    audit: {
      entryBg: '#ffffff',
      entryBorder: '#f1f5f9',
    },
    maintenance: {
      cardBg: 'rgba(248, 250, 252, 0.5)',
      cardBorder: '#f1f5f9',
      dangerBg: 'rgba(255, 241, 242, 0.5)',
      dangerBorder: '#ffe4e6',
    }
  }
};
