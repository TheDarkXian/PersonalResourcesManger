
import React, { useState } from 'react';
import { UISettings } from '../types';
import { UI_ICONS } from '../icons/index';

interface TagCenterHelpViewProps {
  onClose: () => void;
  settings: UISettings;
}

export const TagCenterHelpView: React.FC<TagCenterHelpViewProps> = ({ onClose, settings }) => {
  const [selectedIcon, setSelectedIcon] = useState('fa-ghost');

  const commonIcons = [
    'fa-tag', 'fa-ghost', 'fa-bolt', 'fa-heart', 'fa-star', 'fa-fire', 
    'fa-microchip', 'fa-code', 'fa-database', 'fa-folder', 'fa-box', 'fa-cube',
    'fa-robot', 'fa-rocket', 'fa-leaf', 'fa-anchor', 'fa-gear', 'fa-bell'
  ];

  return (
    <div 
      className="fixed inset-0 z-[300] bg-white/95 backdrop-blur-3xl flex flex-col animate-in fade-in duration-300"
      style={{ color: settings.primaryFontColor }}
    >
      <header className="px-12 py-10 border-b flex items-center" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
        <button 
          onClick={onClose}
          className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all active:scale-90 mr-8 shrink-0"
          title="返回标签管理"
        >
          <i className={`fa-solid ${UI_ICONS.arrowLeft} text-xl`}></i>
        </button>
        <div className="flex items-center space-x-6">
           <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xl rotate-3">
              <i className="fa-solid fa-circle-question text-xl"></i>
           </div>
           <div>
              <h2 className="text-4xl font-black italic tracking-tighter uppercase">标签图标使用手册</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mt-1">Tag Icon Specification & Guide</p>
           </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-12 lg:p-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
          
          {/* 左侧：系统矢量图标 */}
          <div className="space-y-10">
            <div className="space-y-4 border-l-4 border-slate-900 pl-8">
               <h3 className="text-2xl font-black uppercase italic tracking-tight">方法 A：系统矢量预设</h3>
               <p className="text-sm font-bold text-slate-500 leading-relaxed">
                 直接在输入框中填写 FontAwesome 6 Free 的类名。系统将根据您设置的“标签色”自动为图标染色。
               </p>
            </div>

            <div className="bg-slate-50 rounded-[2.5rem] p-10 space-y-8">
               <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">语法示例 (点击下方图标自动填充)</span>
                  <div className="bg-white p-5 rounded-2xl font-mono text-sm border border-slate-100 shadow-inner flex items-center justify-between group">
                     <span className="text-slate-900">{selectedIcon}</span>
                     <i className={`fa-solid ${selectedIcon} opacity-20 group-hover:opacity-100 transition-opacity`}></i>
                  </div>
               </div>

               <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">常用图标参考 (点击预览名称)</span>
                  <div className="grid grid-cols-6 gap-4">
                     {commonIcons.map(icon => {
                       const isActive = selectedIcon === icon;
                       return (
                        <div 
                          key={icon} 
                          onClick={() => setSelectedIcon(icon)}
                          className={`aspect-square rounded-xl border flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all ${
                            isActive ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-110' : 'bg-white border-slate-100 hover:border-blue-500'
                          }`} 
                          title={icon}
                        >
                           <i className={`fa-solid ${icon} text-lg`}></i>
                        </div>
                       );
                     })}
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 italic">提示：访问 fontawesome.com 获取更多图标类名。</p>
               </div>
            </div>
          </div>

          {/* 右侧：自定义图片上传 */}
          <div className="space-y-10">
            <div className="space-y-4 border-l-4 border-blue-500 pl-8">
               <h3 className="text-2xl font-black uppercase italic tracking-tight">方法 B：本地图片标识</h3>
               <p className="text-sm font-bold text-slate-500 leading-relaxed">
                 点击卡片左侧的虚线预览框即可上传。此方式优先级高于矢量图标。
               </p>
            </div>

            <div className="bg-blue-50/50 rounded-[2.5rem] p-10 space-y-8 border border-blue-100">
               <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-widest text-blue-600">硬性技术规范 (非常重要)</h4>
                  
                  <div className="space-y-5">
                    <div className="flex items-start space-x-4">
                       <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1"><i className="fa-solid fa-weight-hanging text-[10px]"></i></div>
                       <div className="flex flex-col">
                          <span className="text-sm font-black uppercase tracking-tight">体积限制: &lt; 100KB</span>
                          <span className="text-xs font-medium text-slate-500 mt-1">由于数据存储在浏览器 LocalStorage，单张图片严禁超过 100KB，否则会导致系统无法保存或黑屏崩溃。</span>
                       </div>
                    </div>

                    <div className="flex items-start space-x-4">
                       <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1"><i className="fa-solid fa-expand text-[10px]"></i></div>
                       <div className="flex flex-col">
                          <span className="text-sm font-black uppercase tracking-tight">推荐尺寸: 1:1 (正方形)</span>
                          <span className="text-xs font-medium text-slate-500 mt-1">建议上传 128x128 像素的图片。非正方形图片将被居中裁剪。</span>
                       </div>
                    </div>

                    <div className="flex items-start space-x-4">
                       <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1"><i className="fa-solid fa-file-image text-[10px]"></i></div>
                       <div className="flex flex-col">
                          <span className="text-sm font-black uppercase tracking-tight">推荐格式: PNG / SVG</span>
                          <span className="text-xs font-medium text-slate-500 mt-1">使用透明背景的图片能获得最佳的视觉融合效果。</span>
                       </div>
                    </div>
                  </div>
               </div>

               <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl space-y-2">
                  <span className="text-[10px] font-black uppercase text-rose-600 tracking-widest flex items-center">
                    <i className="fa-solid fa-triangle-exclamation mr-2"></i> 上传失败排查
                  </span>
                  <p className="text-[11px] font-bold text-rose-500 leading-relaxed">
                    如果您上传后图标未显示或没有反应，通常是因为**图片文件体积太大**。请务必使用在线压缩工具将图片缩小至 50KB 左右再尝试。
                  </p>
               </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
