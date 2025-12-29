
import { Resource, ResourceType } from '../types';
import { platformAdapter } from './platformAdapter';

/**
 * 获取文件后缀名 - 增加空值和异常处理
 */
export const getExtension = (path: string): string => {
  if (!path || typeof path !== 'string') return '无后缀';
  try {
    const parts = path.split('.');
    return parts.length > 1 ? `.${parts[parts.length - 1].toLowerCase()}` : '无后缀';
  } catch (e) {
    return '无后缀';
  }
};

/**
 * 将 FileList 或 File 数组 转换为 Resource 对象数组及其对应的文件映射
 */
// Fix: Use FileList | File[] to support both standard web inputs and programmatic file arrays, resolving the type mismatch in index.tsx
export const processFilesToResources = (
  files: FileList | File[],
  isRecursive: boolean,
  isDirectoryMode: boolean,
  defaultTagId: string
): { resources: Resource[], fileMap: Map<string, File> } => {
  const newResources: Resource[] = [];
  const fileMap = new Map<string, File>();
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fullPath = platformAdapter.getFilePath(file);
    
    if (isDirectoryMode && !isRecursive) {
      const parts = fullPath.split('/').filter(Boolean);
      if (parts.length > 2) continue; 
    }

    const id = crypto.randomUUID();
    newResources.push({
      id,
      title: file.name,
      type: 'local-file',
      pathOrUrl: fullPath,
      tags: [defaultTagId],
      color: '#ffffff',      // 序列化默认白底
      titleColor: '#000000', // 序列化默认黑字
      createdAt: Date.now(),
      updatedAt: Date.now(),
      lastAccessedAt: 0
    });
    fileMap.set(id, file);
  }
  
  return { resources: newResources, fileMap };
};

export const filterDuplicateResources = (
  existing: Resource[],
  incoming: Resource[]
): { nextResources: Resource[], skipCount: number, addedResources: Resource[] } => {
  let skipCount = 0;
  const addedResources: Resource[] = [];
  const next = [...existing];
  
  incoming.forEach(newRes => {
    const isDuplicate = next.some(r => 
      r.title === newRes.title && 
      r.type === newRes.type && 
      r.pathOrUrl === newRes.pathOrUrl
    );
    
    if (isDuplicate) {
      skipCount++;
      return;
    }
    
    next.push(newRes);
    addedResources.push(newRes);
  });
  
  return { nextResources: next, skipCount, addedResources };
};
