
import React from 'react';
import { formatDate } from '../utils/helpers';

interface LivePreviewProps {
  previewUrl: string | null;
  textContent: string | null;
  loadingText: boolean;
  isImage: boolean;
  isVideo: boolean;
  isText: boolean;
  file?: File; // 新增：传入原始 File 对象以获取元数据
  headerLabel?: string;
  className?: string; 
  theme?: {
    bg?: string;
    border?: string;
    headerBorder?: string;
    emptyIcon?: string;
    emptyText?: string;
    textPreviewColor?: string;
  };
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  previewUrl,
  textContent,
  loadingText,
  isImage,
  isVideo,
  isText,
  file,
  headerLabel = "内容实时预览",
  className = "h-80 rounded-[3rem]",
  theme = {}
}) => {
  const defaultTheme = {
    bg: '#0f172a', 
    border: '#1e293b', 
    headerBorder: 'rgba(255, 255, 255, 0.05)',
    emptyIcon: '#334155', 
    emptyText: '#475569', 
    textPreviewColor: '#34d399' 
  };

  const activeTheme = { ...defaultTheme, ...theme };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getExt = (name: string) => {
    const parts = name.split('.');
    return parts.length > 1 ? `.${parts.pop()?.toUpperCase()}` : 'NONE';
  };

  return (
    <div 
      className={`flex flex-col overflow-hidden border shadow-inner transition-all ${className}`} 
      style={{ backgroundColor: activeTheme.bg, borderColor: activeTheme.border }}
    >
      <div 
        className="px-4 py-3 border-b flex items-center justify-between bg-black/10"
        style={{ borderColor: activeTheme.headerBorder }}
      >
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
          {headerLabel}
        </span>
      </div>

      <div className="flex-1 overflow-hidden flex items-center justify-center relative">
        {previewUrl ? (
          <>
            {isImage && (
              <img 
                src={previewUrl} 
                className="max-w-full max-h-full object-contain p-4 animate-in fade-in duration-500" 
                alt="preview" 
              />
            )}
            {isVideo && (
              <video 
                src={previewUrl} 
                controls 
                className="w-full h-full p-4 animate-in fade-in duration-500" 
              />
            )}
          </>
        ) : isText ? (
          <div className="w-full h-full flex flex-col p-5">
            {loadingText ? (
              <div className="m-auto text-slate-500 animate-pulse text-[10px] uppercase font-black">
                正在读取文本流...
              </div>
            ) : (
              <pre 
                className="flex-1 text-[10px] font-mono overflow-auto whitespace-pre-wrap scroll-smooth custom-scrollbar"
                style={{ color: activeTheme.textPreviewColor }}
              >
                {textContent}
              </pre>
            )}
          </div>
        ) : (
          <div className="text-center p-10 space-y-4">
            <i 
              className="fa-solid fa-eye-slash text-4xl block" 
              style={{ color: activeTheme.emptyIcon }}
            ></i>
            <p 
              className="text-[9px] font-black uppercase tracking-widest" 
              style={{ color: activeTheme.emptyText }}
            >
              {isText || isImage || isVideo ? "等待资源加载..." : "该格式暂不支持预览"}
            </p>
          </div>
        )}
      </div>

      {/* 文件元数据展示区 */}
      {file && (
        <div 
          className="px-5 py-2.5 border-t flex items-center justify-between bg-black/20 backdrop-blur-sm"
          style={{ borderColor: activeTheme.headerBorder }}
        >
          <div className="flex items-center space-x-4 overflow-hidden">
            <div className="flex flex-col min-w-0">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">文件名</span>
              <span className="text-[10px] font-bold text-slate-300 truncate" title={file.name}>{file.name}</span>
            </div>
            <div className="h-6 w-px bg-white/5"></div>
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">大小</span>
              <span className="text-[10px] font-bold text-slate-300 whitespace-nowrap">{formatSize(file.size)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 shrink-0">
            <div className="flex flex-col text-right">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">最后修改</span>
              <span className="text-[10px] font-bold text-slate-300">{formatDate(file.lastModified).split(' ')[0]}</span>
            </div>
            <div 
              className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[9px] font-black text-emerald-400"
            >
              {getExt(file.name)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
