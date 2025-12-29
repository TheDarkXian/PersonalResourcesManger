
import { useEffect, useMemo } from 'react';
import { Resource } from '../types';

interface UseResourceNavigationProps {
  filteredList: Resource[];
  currentId: string | undefined;
  onNavigate: (res: Resource, direction: 'prev' | 'next') => void;
  isOpen: boolean;
  disabled?: boolean;
}

/**
 * 详情页资源导航 Hook
 * 用于在详情模式下通过方向键快速切换上一个/下一个资源
 */
export const useResourceNavigation = ({
  filteredList,
  currentId,
  onNavigate,
  isOpen,
  disabled = false
}: UseResourceNavigationProps) => {
  
  const navigationData = useMemo(() => {
    if (!currentId || filteredList.length === 0) return { prev: null, next: null };
    
    const currentIndex = filteredList.findIndex(r => r.id === currentId);
    if (currentIndex === -1) return { prev: null, next: null };

    return {
      prev: currentIndex > 0 ? filteredList[currentIndex - 1] : null,
      next: currentIndex < filteredList.length - 1 ? filteredList[currentIndex + 1] : null,
      currentIndex,
      total: filteredList.length
    };
  }, [filteredList, currentId]);

  useEffect(() => {
    // 如果未打开或处于禁用状态（如编辑模式），则不触发导航
    if (!isOpen || disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 如果焦点在输入框或文本域内，不触发导航
      if (
        e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.key === 'ArrowLeft' && navigationData.prev) {
        onNavigate(navigationData.prev, 'prev');
      } else if (e.key === 'ArrowRight' && navigationData.next) {
        onNavigate(navigationData.next, 'next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, navigationData, onNavigate, disabled]);

  return navigationData;
};
