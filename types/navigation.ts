
import { Resource } from './index';

/**
 * 导航树节点类型
 */
export type NavTreeNodeType = 'folder' | 'file';

/**
 * 导航树节点接口
 */
export interface NavTreeNode {
  id: string;               // 唯一标识 (文件夹为路径，文件为资源ID)
  name: string;             // 显示名称
  type: NavTreeNodeType;    // 节点类型
  path: string;             // 完整路径
  children: NavTreeNode[];  // 子节点
  resource?: Resource;      // 如果是文件，关联原始资源对象
  depth: number;            // 嵌套层级
}

/**
 * 导航树状态接口
 */
export interface NavTreeState {
  expandedKeys: Set<string>;
}
