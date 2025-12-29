
import { useState, useCallback } from 'react';

interface UseLibraryBatchActionsProps {
  activeLibraryId?: string;
  onDeleteLibrary: (id: string) => void;
  showDialog: (config: any) => void;
}

/**
 * 书库批量管理逻辑 Hook
 */
export const useLibraryBatchActions = ({
  activeLibraryId,
  onDeleteLibrary,
  showDialog
}: UseLibraryBatchActionsProps) => {
  const [isManagementMode, setIsManagementMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleManagementMode = useCallback(() => {
    setIsManagementMode(prev => {
      if (prev) setSelectedIds(new Set()); // 退出模式时清空选中
      return !prev;
    });
  }, []);

  const toggleSelection = useCallback((id: string) => {
    // 根据新需求：不再限制选中当前活跃库，允许清空所有书库
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const executeBatchDelete = useCallback(() => {
    if (selectedIds.size === 0) return;

    showDialog({
      type: 'confirm',
      variant: 'danger',
      title: '全域库销毁协议',
      message: `您即将永久删除选中的 ${selectedIds.size} 个书库。如果这是系统内最后的书库，资源浏览器将被锁定直至新库创建。是否确认继续？`,
      onConfirm: () => {
        selectedIds.forEach(id => onDeleteLibrary(id));
        setSelectedIds(new Set());
        setIsManagementMode(false);
      }
    });
  }, [selectedIds, onDeleteLibrary, showDialog]);

  return {
    isManagementMode,
    selectedIds,
    toggleManagementMode,
    toggleSelection,
    executeBatchDelete
  };
};
