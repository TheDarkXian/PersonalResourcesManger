
import { Resource, ResourceType, UISettings } from '../types';
import { getExtension } from './localFolderService';

interface FilterOptions {
  searchQuery: string;
  isRegexEnabled: boolean;
  selectedTypes: ResourceType[];
  selectedExtensions: string[];
  selectedTagIds: string[];
  sortBy: 'updatedAt' | 'title' | 'createdAt' | 'tagCount';
  settings: UISettings; // 引入全局配置
}

/**
 * 核心筛选逻辑服务
 */
export const filterService = {
  /**
   * 执行资源过滤
   */
  filterResources(resources: Resource[], options: FilterOptions): Resource[] {
    const {
      searchQuery,
      isRegexEnabled,
      selectedTypes,
      selectedExtensions,
      selectedTagIds,
      sortBy,
      settings
    } = options;

    const { 
      filterMode, 
      filterCaseSensitive, 
      filterIncludePath 
    } = settings;

    const filtered = resources.filter(r => {
      // 1. 文本搜索匹配
      let matchText = true;
      if (searchQuery) {
        const query = filterCaseSensitive ? searchQuery : searchQuery.toLowerCase();
        const searchableTitle = filterCaseSensitive ? r.title : r.title.toLowerCase();
        const searchablePath = filterCaseSensitive ? r.pathOrUrl : r.pathOrUrl.toLowerCase();

        if (isRegexEnabled) {
          try {
            const flags = filterCaseSensitive ? '' : 'i';
            const regex = new RegExp(searchQuery, flags);
            matchText = regex.test(r.title) || (filterIncludePath && regex.test(r.pathOrUrl));
          } catch (e) {
            matchText = searchableTitle.includes(query) || (filterIncludePath && searchablePath.includes(query));
          }
        } else {
          matchText = searchableTitle.includes(query) || (filterIncludePath && searchablePath.includes(query));
        }
      }
      if (!matchText) return false;

      // 2. 资源类型匹配
      const matchType = selectedTypes.length === 0 || selectedTypes.includes(r.type);
      if (!matchType) return false;

      // 3. 后缀名筛选逻辑
      let matchExt = true;
      if (selectedExtensions.length > 0) {
        if (r.type === 'local-file') {
          const ext = getExtension(r.pathOrUrl);
          matchExt = selectedExtensions.includes(ext);
        } else {
          matchExt = true; 
        }
      }
      if (!matchExt) return false;

      // 4. 标签筛选匹配 (使用配置中的 filterMode)
      let matchTags = true;
      if (selectedTagIds.length > 0) {
        const resourceTags = r.tags || [];
        if (filterMode === 'AND') {
          matchTags = selectedTagIds.every(id => resourceTags.includes(id));
        } else {
          matchTags = selectedTagIds.some(id => resourceTags.includes(id));
        }
      }
      if (!matchTags) return false;

      return true;
    });

    return this.sortResources(filtered, sortBy);
  },

  /**
   * 执行资源排序
   */
  sortResources(resources: Resource[], sortBy: string): Resource[] {
    return [...resources].sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'createdAt') {
        return b.createdAt - a.createdAt;
      }
      if (sortBy === 'tagCount') {
        return (b.tags?.length || 0) - (a.tags?.length || 0);
      }
      return b.updatedAt - a.updatedAt;
    });
  }
};
