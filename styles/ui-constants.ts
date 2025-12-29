
/**
 * NAV-PRO 系统通用 UI 样式常量集
 * 集中管理复用率高的 Tailwind 类名组合
 */

export const UI_CLASSES = {
  // 基础布局
  scrollbar: "custom-scrollbar",
  
  // 按钮类
  btnPrimary: "px-5 py-2 rounded font-black text-white text-[11px] uppercase shadow-lg transition-transform active:scale-95",
  btnOutline: "text-[10px] font-black uppercase opacity-60 hover:opacity-100 flex items-center border border-slate-200 px-2 py-1 rounded transition-colors",
  btnGhost: "p-2 opacity-40 hover:opacity-100 transition-opacity",
  btnIcon: "w-8 h-8 flex items-center justify-center rounded-full transition-colors",
  
  // 标签类
  tagBadgeBase: "px-[0.5em] py-[0.2em] rounded-[0.2em] text-[0.6em] font-black uppercase flex items-center shadow-sm",
  
  // 卡片类
  resourceCard: "group rounded-lg border transition-all flex flex-col hover:shadow-xl relative overflow-hidden aspect-[4/3] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/50",
  cardActionBtn: "w-7 h-7 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-sm",
  
  // 容器类
  mainContainer: "h-screen flex flex-col overflow-hidden relative",
  scrollContainer: "flex-1 overflow-y-auto custom-scrollbar relative scroll-smooth",
  
  // 标题与文字
  titleMain: "text-xl font-black italic tracking-tighter",
  subtitleCaps: "text-[9px] font-black uppercase tracking-widest text-slate-400"
};
