
import { Resource, HistoryEntry, AuditMetadata } from '../types';

/**
 * 审计日志服务
 * 负责生成高质量、详尽的操作记录元数据
 */
export const auditService = {
  /**
   * 生成基础历史条目
   */
  createEntry(action: string, details: string, metadata?: AuditMetadata): HistoryEntry {
    return {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      action,
      details,
      metadata
    };
  },

  /**
   * 分析资源列表并生成统计元数据
   */
  analyzeResources(resources: Resource[]): AuditMetadata {
    const stats: Record<string, number> = {};
    const filenames: string[] = [];

    resources.forEach(res => {
      // 统计类型
      stats[res.type] = (stats[res.type] || 0) + 1;
      // 提取前20个文件名（防止审计详情过长）
      if (filenames.length < 20) {
        filenames.push(res.title || '未命名资源');
      }
    });

    return {
      count: resources.length,
      types: stats,
      filenames: filenames
    };
  },

  /**
   * 格式化审计动作描述
   */
  getFriendlyAction(action: string): { label: string; icon: string; color: string } {
    const map: Record<string, { label: string; icon: string; color: string }> = {
      '库创建': { label: '系统初始化', icon: 'fa-plus-circle', color: 'text-blue-500' },
      '添加项目': { label: '资源录入', icon: 'fa-file-circle-plus', color: 'text-emerald-500' },
      '修改项目': { label: '元数据更新', icon: 'fa-pen-nib', color: 'text-amber-500' },
      '批量删除': { label: '资源移除', icon: 'fa-trash-sweep', color: 'text-rose-500' },
      '批量添加标签': { label: '批量标注', icon: 'fa-tags', color: 'text-indigo-500' },
      '批量移除标签': { label: '标签解绑', icon: 'fa-tag-slash', color: 'text-slate-500' },
      '合并库/导入': { label: '物理导入', icon: 'fa-file-import', color: 'text-cyan-500' },
      '文本批量导入': { label: '数据流注入', icon: 'fa-terminal', color: 'text-purple-500' },
      '新建标签': { label: '标签定义', icon: 'fa-circle-plus', color: 'text-sky-500' },
      '批量删除标签': { label: '标签清理', icon: 'fa-eraser', color: 'text-pink-500' },
      '库导入': { label: '数据迁移', icon: 'fa-file-export', color: 'text-orange-500' },
      '文本导入': { label: '剪贴板导入', icon: 'fa-paste', color: 'text-violet-500' },
      '重命名库': { label: '库标识修改', icon: 'fa-signature', color: 'text-teal-500' }
    };
    return map[action] || { label: action, icon: 'fa-clock-rotate-left', color: 'text-slate-400' };
  }
};
