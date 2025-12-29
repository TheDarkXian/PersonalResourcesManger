
import { ResourceType } from '../types';

/**
 * [TAURI 2.0 适配层]
 * 此文件集中处理所有与底层系统交互的逻辑。
 */

export const platformAdapter = {
  /**
   * 获取文件的物理路径表现形式
   */
  getFilePath(file: File): string {
    const relPath = (file as any).webkitRelativePath;
    if (relPath) {
      const normalized = relPath.replace(/\\/g, '/');
      return normalized.startsWith('/') ? normalized : '/' + normalized;
    }
    return '/' + file.name;
  },

  /**
   * 保存文件到本地 (下载/导出)
   */
  async saveFile(content: string, filename: string): Promise<void> {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /**
   * 选择文件
   */
  async pickFile(options: { accept?: string, multiple?: boolean } = {}): Promise<File[] | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      if (options.accept) input.accept = options.accept;
      if (options.multiple) input.multiple = true;
      
      input.onchange = () => {
        if (input.files && input.files.length > 0) {
          resolve(Array.from(input.files));
        } else {
          resolve(null);
        }
      };
      input.click();
    });
  },

  /**
   * 选择目录
   */
  async pickDirectory(): Promise<File[] | FileList | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      (input as any).webkitdirectory = true;
      (input as any).directory = true;
      
      input.onchange = () => {
        resolve(input.files);
      };
      input.click();
    });
  },

  /**
   * 使用系统默认方式打开路径或 URL
   */
  async openPath(path: string, type: ResourceType): Promise<void> {
    if (path.startsWith('http') || type === 'url') {
      const url = path.startsWith('http') ? path : `https://${path}`;
      window.open(url, '_blank');
    } else {
      const fileUrl = (path.startsWith('/') || path.includes(':')) ? `file://${path}` : `file:///${path}`;
      window.open(fileUrl, '_blank');
    }
  },

  /**
   * 复制文本到剪贴板
   */
  async copyText(text: string): Promise<void> {
    await navigator.clipboard.writeText(text);
  },

  /**
   * 读取本地文件内容作为文本
   */
  async readTextFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(new Error("读取文件失败"));
      reader.readAsText(file);
    });
  },

  /**
   * 读取本地文件内容作为 DataURL (用于预览/图标)
   */
  async readDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(new Error("读取媒体失败"));
      reader.readAsDataURL(file);
    });
  },

  /**
   * 生成文件预览 URL
   */
  createPreviewUrl(file: File | string): string {
    if (typeof file === 'string') return file;
    return URL.createObjectURL(file);
  },

  /**
   * 销毁预览 URL
   */
  revokePreviewUrl(url: string): void {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  },

  /**
   * [TAURI 2.0 接入点]
   * 读取本地图标缓存。
   * 打包为 exe 后，可在此处接入 @tauri-apps/plugin-fs
   */
  async readIconFromCache(key: string): Promise<string | null> {
    // 浏览器环境演示：从 IndexedDB 或 LocalStorage 获取 base64
    // Tauri 环境：await readFile(`$APPDATA/icons/${key}.png`)
    return localStorage.getItem(`local_icon_cache_${key}`);
  },

  /**
   * [TAURI 2.0 接入点]
   * 将网络获取的图标持久化到本地文件夹。
   */
  async writeIconToCache(key: string, blob: Blob): Promise<string | null> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // 浏览器环境演示：存入 LocalStorage
        // Tauri 环境：await writeFile(`$APPDATA/icons/${key}.png`, new Uint8Array(buffer))
        try {
          localStorage.setItem(`local_icon_cache_${key}`, base64);
        } catch (e) {
          console.warn("Storage full, could not cache icon");
        }
        resolve(base64);
      };
      reader.readAsDataURL(blob);
    });
  }
};
