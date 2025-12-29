
import React, { useMemo, useEffect, useState, useRef } from 'react';
import { Resource, Tag, UISettings } from '../types';
import { UI_ICONS, ResourceIcon, TagIcon, getFileTypeInfo } from '../icons/index';
import { getContrastYIQ } from '../utils/helpers';
import { UI_CLASSES } from '../styles/ui-constants';
import { getMainGridTheme } from '../styles/mainGridTheme';
import { platformAdapter } from '../utils/platformAdapter';

interface ResourceCardProps {
  res: Resource;
  isSelected: boolean;
  isBatchDeleteMode: boolean;
  settings: UISettings;
  currentFontSize: number;
  toggleSelection: (id: string, shiftKey?: boolean) => void;
  openResource: (res: Resource) => void;
  tags: Tag[];
  onPathAction: (action: 'copy' | 'open', res: Resource) => void;
  localFile?: File;
  isPinged?: boolean;
}

export const ResourceCard = React.memo(({
  res,
  isSelected,
  isBatchDeleteMode,
  settings,
  currentFontSize,
  toggleSelection,
  openResource,
  tags,
  onPathAction,
  localFile,
  isPinged
}: ResourceCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const theme = getMainGridTheme(settings).card;
  
  const { isImage, isVideo } = useMemo(() => getFileTypeInfo(res.pathOrUrl), [res.pathOrUrl]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.01, rootMargin: '1200px 0px' } 
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return; 

    let url: string | null = null;
    if (localFile) {
      url = platformAdapter.createPreviewUrl(localFile);
      setPreviewUrl(url);
    } else if (res.pathOrUrl.startsWith('http')) {
      setPreviewUrl(res.pathOrUrl);
    }

    return () => {
      if (url) platformAdapter.revokePreviewUrl(url);
    };
  }, [isVisible, localFile, res.pathOrUrl]);

  const frameBgColor = res.color || settings.defaultCardTitleBg || theme.defaultFooterBg;
  const frameTextColor = res.titleColor || settings.defaultCardTitleColor || theme.defaultFooterText;

  // 核心修复：根据 cardScale 动态计算最小高度。
  // 基准宽度 180px 对应 4:3 的高度为 135px。
  // 如果 minHeight 设得过高（如之前的 160px），aspect-ratio 会强行增加元素宽度，导致在 grid 布局中发生重叠。
  const dynamicMinHeight = useMemo(() => {
    const scale = settings.cardScale || 100;
    return `${135 * (scale / 100)}px`;
  }, [settings.cardScale]);

  return (
    <div 
      ref={cardRef}
      id={`resource-${res.id}`}
      tabIndex={0}
      role="button"
      onClick={(e) => { 
        if (isBatchDeleteMode || e.ctrlKey || e.metaKey || e.shiftKey) {
          toggleSelection(res.id, e.shiftKey);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (isBatchDeleteMode) toggleSelection(res.id, e.shiftKey);
          else openResource(res);
        }
      }}
      className={`${UI_CLASSES.resourceCard} ${isSelected ? 'shadow-2xl z-10' : ''} ${isPinged ? 'ping-highlight' : ''}`}
      style={{ 
        backgroundColor: settings.cardBg || theme.bg, 
        borderColor: isSelected ? theme.selectionRing : theme.border, 
        fontSize: `${currentFontSize}rem`,
        minHeight: dynamicMinHeight,
        boxShadow: isSelected ? `0 0 0 4px ${theme.selectionRing}33` : 'none',
        background: isSelected ? theme.selectionBg : (settings.cardBg || theme.bg)
      }}
    >
      <div className={`relative flex flex-col h-full transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {isVisible && (
          <>
            {(isBatchDeleteMode || isSelected) && (
              <div 
                className={`absolute top-2 left-2 w-5 h-5 flex items-center justify-center rounded-full z-30 shadow-sm border transition-all`}
                style={{
                  backgroundColor: isSelected ? theme.selectionRing : '#ffffff',
                  borderColor: isSelected ? theme.selectionRing : '#cbd5e1',
                  color: isSelected ? '#ffffff' : 'transparent'
                }}
              >
                {isSelected ? <i className={`fa-solid ${UI_ICONS.check} text-[10px]`}></i> : null}
              </div>
            )}

            {!isBatchDeleteMode && (
              <div className="absolute top-2 right-2 flex space-x-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity z-30">
                <button 
                  onClick={(e) => { e.stopPropagation(); onPathAction('copy', res); }}
                  className={UI_CLASSES.cardActionBtn}
                  style={{ backgroundColor: theme.actionBtn.bg, borderColor: theme.actionBtn.border, color: theme.actionBtn.text }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.actionBtn.hoverBg;
                    e.currentTarget.style.color = theme.actionBtn.hoverText;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = theme.actionBtn.bg;
                    e.currentTarget.style.color = theme.actionBtn.text;
                  }}
                >
                  <i className={`fa-solid ${UI_ICONS.copy} text-[10px]`}></i>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onPathAction('open', res); }}
                  className={UI_CLASSES.cardActionBtn}
                  style={{ backgroundColor: theme.actionBtn.bg, borderColor: theme.actionBtn.border, color: theme.actionBtn.text }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.actionBtn.hoverBg;
                    e.currentTarget.style.color = theme.actionBtn.hoverText;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = theme.actionBtn.bg;
                    e.currentTarget.style.color = theme.actionBtn.text;
                  }}
                >
                  <i className={`fa-solid ${res.type === 'url' ? UI_ICONS.external : UI_ICONS.folderOpen} text-[10px]`}></i>
                </button>
              </div>
            )}
            
            <div 
              onClick={(e) => {
                if (!isBatchDeleteMode && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.stopPropagation();
                  openResource(res);
                }
              }}
              className="flex-1 flex items-center justify-center relative border-b overflow-hidden group-hover:bg-white transition-colors cursor-pointer"
              style={{ backgroundColor: theme.previewBg, borderColor: theme.footerDivider }}
            >
                {(isImage && previewUrl) ? (
                  <img src={previewUrl} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 animate-in fade-in" />
                ) : (isVideo && previewUrl) ? (
                  <div className="w-full h-full relative">
                    <video src={previewUrl} className="w-full h-full object-cover" preload="metadata" muted />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <i className="fa-solid fa-play text-white/50 text-2xl"></i>
                    </div>
                  </div>
                ) : (
                  <ResourceIcon type={res.type} path={res.pathOrUrl} className="opacity-20" style={{ fontSize: '3.5em', color: theme.previewIconColor }} />
                )}
            </div>
            
            <div 
              className="p-[1em] space-y-[0.5em] flex flex-col justify-between cursor-default select-none transition-colors duration-300 border-t" 
              style={{ backgroundColor: frameBgColor, borderColor: theme.footerDivider }}
            >
              <h3 
                className="font-bold leading-tight line-clamp-2" 
                style={{ color: frameTextColor }}
              >
                {res.title || '未命名'}
              </h3>
              <div className="flex flex-wrap gap-1">
                {res.tags.slice(0, 3).map(tid => {
                  const t = tags.find(x => x.id === tid);
                  if (!t) return null;
                  return (
                    <div key={tid} className={UI_CLASSES.tagBadgeBase} style={{ backgroundColor: t.color, color: getContrastYIQ(t.color) }}>
                      <TagIcon icon={t.icon} customIcon={t.customIcon} className="mr-1 w-2.5 h-2.5" />
                      {t.name}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
      
      {!isVisible && (
        <div className="absolute inset-0 flex flex-col animate-pulse">
           <div className="flex-1 bg-slate-50/50 flex items-center justify-center">
              <i className="fa-solid fa-cloud-arrow-down text-slate-200 text-3xl"></i>
           </div>
           <div className="h-20 bg-white p-4 space-y-3">
              <div className="h-4 bg-slate-100 rounded w-3/4"></div>
              <div className="h-3 bg-slate-50 rounded w-1/2"></div>
           </div>
        </div>
      )}
    </div>
  );
});
