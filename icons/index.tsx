
import React, { useState, useEffect } from 'react';
import { iconCacheService } from '../utils/iconCacheService';

/**
 * 资源类型到 FontAwesome 图标的默认映射
 */
export const RESOURCE_TYPE_ICONS = {
  'url': 'fa-globe',
  'local-file': 'fa-file',
  'local-folder': 'fa-folder',
  'cloud': 'fa-cloud',
  'text-note': 'fa-note-sticky',
  'other': 'fa-circle-question'
};

/**
 * 详尽的本地文件后缀到图标的映射
 */
export const FILE_EXTENSION_ICONS: Record<string, string> = {
  '.pdf': 'fa-file-pdf',
  '.doc': 'fa-file-word',
  '.docx': 'fa-file-word',
  '.xls': 'fa-file-excel',
  '.xlsx': 'fa-file-excel',
  '.ppt': 'fa-file-powerpoint',
  '.pptx': 'fa-file-powerpoint',
  '.jpg': 'fa-file-image',
  '.jpeg': 'fa-file-image',
  '.png': 'fa-file-image',
  '.gif': 'fa-file-image',
  '.svg': 'fa-file-image',
  '.webp': 'fa-file-image',
  '.zip': 'fa-file-zipper',
  '.rar': 'fa-file-zipper',
  '.7z': 'fa-file-zipper',
  '.txt': 'fa-file-lines',
  '.md': 'fa-file-lines',
  '.js': 'fa-file-code',
  '.ts': 'fa-file-code',
  '.tsx': 'fa-file-code',
  '.jsx': 'fa-file-code',
  '.html': 'fa-file-code',
  '.css': 'fa-file-code',
  '.json': 'fa-file-code',
  '.mp3': 'fa-file-audio',
  '.wav': 'fa-file-audio',
  '.mp4': 'fa-file-video',
  '.mov': 'fa-file-video',
  '.avi': 'fa-file-video',
  '.mkv': 'fa-file-video',
  '.exe': 'fa-file-shield',
  '.c': 'fa-file-code',
  '.cpp': 'fa-file-code',
  '.h': 'fa-file-code',
  '.py': 'fa-file-code',
  '.java': 'fa-file-code',
  '.go': 'fa-file-code',
};

/**
 * 文件类型检测工具函数
 */
export const getFileTypeInfo = (path: string) => {
  const extMatch = path.match(/\.[^/.]+$/);
  const ext = extMatch ? extMatch[0].toLowerCase() : '';
  
  const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp'].includes(ext);
  const isVideo = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'].includes(ext);
  const isText = ['.txt', '.md', '.js', '.ts', '.tsx', '.jsx', '.html', '.css', '.json', '.c', '.cpp', '.h', '.py', '.java', '.go', '.rs', '.php', '.sql', '.sh', '.yaml', '.yml'].includes(ext);
  
  return { ext, isImage, isVideo, isText };
};

/**
 * UI 界面通用图标库
 */
export const UI_ICONS = {
  tags: 'fa-tags',
  outline: 'fa-list-ul',
  import: 'fa-folder-tree',
  batch: 'fa-tag',
  delete: 'fa-trash-can',
  settings: 'fa-gear',
  search: 'fa-magnifying-glass',
  regex: 'fa-hashtag',
  mode: 'fa-list-check',
  close: 'fa-xmark',
  plus: 'fa-plus',
  minus: 'fa-minus',
  check: 'fa-check',
  arrowLeft: 'fa-arrow-left',
  relocation: 'fa-arrows-rotate',
  copy: 'fa-copy',
  external: 'fa-external-link',
  folderOpen: 'fa-folder-open',
  files: 'fa-files',
  fileImport: 'fa-file-import',
  image: 'fa-image',
  warning: 'fa-triangle-exclamation',
  info: 'fa-circle-info',
  success: 'fa-circle-check',
};

/**
 * 从 URL 中提取域名的助手函数
 */
const getDomain = (url: string) => {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
    return u.hostname;
  } catch {
    return null;
  }
};

/**
 * 智能图标渲染组件：支持本地缓存读取与自动 fallback
 */
const SmartFavicon = ({ domain, className, style }: { domain: string, className?: string, style?: React.CSSProperties }) => {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    // 调用缓存服务解析路径
    iconCacheService.resolveIcon(domain).then(setSrc);
  }, [domain]);

  if (!src) return <div className={`${className} bg-slate-100 animate-pulse rounded-sm`} style={{ ...style, width: '1em', height: '1em' }}></div>;

  return (
    <img 
      src={src} 
      className={`object-contain ${className}`} 
      style={{ ...style, width: '1em', height: '1em', display: 'inline-block' }}
      onError={(e) => {
        // 如果物理缓存失效或链接挂了，显示占位图标
        (e.target as HTMLImageElement).style.display = 'none';
        const next = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
        if (next) next.style.display = 'inline-block';
      }}
      alt=""
    />
  );
};

/**
 * 标签图标组件
 */
export const TagIcon = ({ 
  icon, 
  customIcon, 
  className = "w-3 h-3", 
  style = {} 
}: { 
  icon?: string, 
  customIcon?: string, 
  className?: string, 
  style?: React.CSSProperties 
}) => {
  if (customIcon) {
    return (
      <img 
        src={customIcon} 
        className={`object-cover rounded-sm ${className}`} 
        style={{ ...style, maxWidth: '100%', maxHeight: '100%' }} 
        alt="tag" 
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
          const sibling = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
          if (sibling) sibling.style.display = 'flex';
        }}
      />
    );
  }
  if (icon) {
    return <i className={`fa-solid ${icon} ${className} flex items-center justify-center`} style={style}></i>;
  }
  return <i className={`fa-solid fa-tag ${className} flex items-center justify-center`} style={style}></i>;
};

/**
 * 资源图标组件
 */
export const ResourceIcon = ({ 
  type, 
  path, 
  className = "", 
  style = {},
  showFavicon = true
}: { 
  type: string, 
  path: string, 
  className?: string, 
  style?: React.CSSProperties,
  showFavicon?: boolean
}) => {
  if (type === 'url' && showFavicon) {
    const domain = getDomain(path);
    if (domain) {
      // 核心修改：使用 SmartFavicon 代替原有的 img
      return (
        <>
          <SmartFavicon domain={domain} className={className} style={style} />
          <i className={`fa-solid ${RESOURCE_TYPE_ICONS['url']} ${className} hidden`} style={style}></i>
        </>
      );
    }
  }

  let iconClass = RESOURCE_TYPE_ICONS[type as keyof typeof RESOURCE_TYPE_ICONS] || RESOURCE_TYPE_ICONS['other'];
  
  if (type === 'local-file') {
    const { ext } = getFileTypeInfo(path);
    iconClass = FILE_EXTENSION_ICONS[ext] || iconClass;
  }

  return <i className={`fa-solid ${iconClass} ${className}`} style={style}></i>;
};
