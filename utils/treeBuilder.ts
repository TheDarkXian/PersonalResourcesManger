
import { Resource } from '../types';
import { NavTreeNode } from '../types/navigation';

/**
 * 将平铺的资源列表构建为树形结构
 */
export const buildResourceTree = (resources: Resource[]): NavTreeNode[] => {
  const root: NavTreeNode[] = [];
  
  // 辅助函数：根据路径查找或创建文件夹节点
  const getOrCreateFolder = (parts: string[], parentArray: NavTreeNode[], depth: number, fullPathPrefix: string): NavTreeNode[] => {
    if (parts.length === 0) return parentArray;
    
    const folderName = parts[0];
    const currentPath = fullPathPrefix ? `${fullPathPrefix}/${folderName}` : folderName;
    
    let folder = parentArray.find(n => n.type === 'folder' && n.name === folderName);
    
    if (!folder) {
      folder = {
        id: `folder-${currentPath}`,
        name: folderName,
        type: 'folder',
        path: currentPath,
        children: [],
        depth: depth
      };
      parentArray.push(folder);
      // 保持文件夹排序
      parentArray.sort((a, b) => {
        if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
    }
    
    return getOrCreateFolder(parts.slice(1), folder.children, depth + 1, currentPath);
  };

  resources.forEach(res => {
    // 处理路径：统一斜杠并移除协议头
    let cleanPath = res.pathOrUrl.replace(/\\/g, '/');
    if (cleanPath.startsWith('file:///')) cleanPath = cleanPath.replace('file:///', '');
    
    const parts = cleanPath.split('/').filter(Boolean);
    
    if (parts.length <= 1) {
      // 根目录文件
      root.push({
        id: res.id,
        name: res.title || parts[parts.length - 1] || '未命名',
        type: 'file',
        path: cleanPath,
        children: [],
        resource: res,
        depth: 0
      });
    } else {
      // 嵌套文件
      const fileName = res.title || parts[parts.length - 1];
      const folderParts = parts.slice(0, -1);
      const targetChildren = getOrCreateFolder(folderParts, root, 0, "");
      
      targetChildren.push({
        id: res.id,
        name: fileName,
        type: 'file',
        path: cleanPath,
        children: [],
        resource: res,
        depth: folderParts.length
      });
      
      // 重新排序子节点
      targetChildren.sort((a, b) => {
        if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
    }
  });

  // 最终对根节点进行排序
  root.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return root;
};
