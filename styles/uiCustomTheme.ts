
/**
 * 界面定制模块专用视觉主题配置 (紧凑增强版)
 */
export const UI_CUSTOM_THEME = {
  // 分类标题样式
  section: {
    indicatorColor: '#3b82f6',
    labelColor: '#64748b',
    spacing: 'space-y-6', // 缩小间距
    titleSize: 'text-[11px]',
  },
  
  // 颜色选择器组件样式
  picker: {
    size: 'w-8 h-8', // 大幅缩小色块
    borderRadius: 'rounded-lg',
    border: 'border-2 border-white',
    ring: 'ring-1 ring-slate-200',
    shadow: 'shadow-sm',
    hoverScale: 'group-hover/color:scale-110',
    labelSize: 'text-[10px]',
    labelColor: '#475569',
  },
  
  // 滑块区域样式
  slider: {
    bg: 'bg-slate-50',
    border: 'border-slate-100',
    padding: 'p-6', // 缩小内边距
    valueColor: '#2563eb',
  },

  // 底部预览区样式
  preview: {
    bg: 'bg-slate-900',
    border: 'border-slate-800',
    titleColor: '#ffffff',
    descColor: '#94a3b8',
  }
};
