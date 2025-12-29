
import { platformAdapter } from './platformAdapter';

/**
 * 图标缓存协调服务
 * 负责链接本地存储与网络资源，解决断网/弱网下的图标加载问题
 */
export const iconCacheService = {
  /**
   * 智能解析图标路径
   * @param domain 域名
   * @returns 最终可用的 URL (本地 Base64 或 网络地址)
   */
  async resolveIcon(domain: string): Promise<string> {
    const cacheKey = `fav_${domain.replace(/\./g, '_')}`;
    
    // 1. 尝试从本地物理/虚拟文件夹读取
    const localCached = await platformAdapter.readIconFromCache(cacheKey);
    if (localCached) {
      return localCached;
    }

    // 2. 本地不存在，返回网络地址，并触发后台静默下载
    const remoteUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    
    // 静默执行后台缓存任务，不阻塞渲染
    this.triggerBackgroundCache(remoteUrl, cacheKey);

    return remoteUrl;
  },

  /**
   * 后台异步缓存任务
   */
  async triggerBackgroundCache(url: string, key: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) return;
      const blob = await response.blob();
      
      // 调用预留的平台适配器接口存入本地
      await platformAdapter.writeIconToCache(key, blob);
    } catch (error) {
      // 静默失败，不干扰主逻辑
      console.debug(`Icon cache task for ${key} failed. Network may be restricted.`);
    }
  }
};
