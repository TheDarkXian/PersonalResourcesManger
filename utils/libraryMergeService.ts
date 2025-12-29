
import { Resource, Tag, Library } from '../types';

const DEFAULT_TAG_ID = 'system-default-tag';

/**
 * 书库合并服务：将源数据合并到目标库中
 */
export const libraryMergeService = {
  merge(target: Library, source: Partial<Library>): Library {
    const now = Date.now();
    
    // 1. 合并标签 (以名称为基准去重)
    const nextTags = [...target.tags];
    const tagIdMap: Record<string, string> = {};

    if (Array.isArray(source.tags)) {
      source.tags.forEach(sTag => {
        // 核心增强：跳过源数据中的系统 ID，防止持久化存储默认标签
        if (sTag.id === DEFAULT_TAG_ID) {
            tagIdMap[sTag.id] = DEFAULT_TAG_ID;
            return;
        }

        const existing = nextTags.find(t => t.name.toLowerCase() === sTag.name.toLowerCase());
        if (existing) {
          tagIdMap[sTag.id] = existing.id;
        } else {
          const newId = crypto.randomUUID();
          tagIdMap[sTag.id] = newId;
          nextTags.push({ ...sTag, id: newId });
        }
      });
    }

    // 2. 合并资源 (以类型和路径为基准去重)
    const nextResources = [...target.resources];
    let addedCount = 0;

    if (Array.isArray(source.resources)) {
      source.resources.forEach(sRes => {
        // 数据清洗：确保 pathOrUrl 存在
        if (!sRes.pathOrUrl) return;

        const isDuplicate = nextResources.some(r => 
          r.type === sRes.type && 
          r.pathOrUrl === sRes.pathOrUrl
        );

        if (!isDuplicate) {
          const newResId = crypto.randomUUID();
          const mappedTags = (sRes.tags || []).map(tid => tagIdMap[tid] || tid);
          
          nextResources.push({
            ...sRes,
            id: newResId,
            tags: mappedTags.length > 0 ? mappedTags : [DEFAULT_TAG_ID],
            color: sRes.color || '#ffffff',
            titleColor: sRes.titleColor || '#000000',
            updatedAt: now
          });
          addedCount++;
        }
      });
    }

    // 核心增强：合并结果不包含系统默认标签对象
    const finalTags = nextTags.filter(t => t.id !== DEFAULT_TAG_ID);

    return {
      ...target,
      tags: finalTags,
      resources: nextResources,
      updatedAt: now,
      history: [
        {
          id: crypto.randomUUID(),
          timestamp: now,
          action: '数据合并',
          details: `通过导入合并了 ${addedCount} 个新资源项目。`,
        },
        ...target.history
      ]
    };
  }
};
