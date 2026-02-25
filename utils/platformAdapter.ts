
import { ResourceType } from '../types';

/**
 * [TAURI 2.0 深度适配控制台]
 * 修改此变量以切换运行环境逻辑
 */
const isTauri = false;

export const platformAdapter = {
  /**
   * 环境检测常量
   */
  isTauri(): boolean {
    return isTauri;
  },

  /**
   * [TAURI 专用接口] 资源路径协议转换
   * 解决桌面端无法直接加载本地磁盘绝对路径的问题 (C:\... -> asset://...)
   */
  resolveAssetUrl(path: string): string {
    if (!this.isTauri()) return path;
    if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:')) return path;
    
    // 此处对应 Tauri 的 convertFileSrc(path)
    // 接入时应改为: import { convertFileSrc } from '@tauri-apps/api/core'; return convertFileSrc(path);
    return `asset://localhost/${path.replace(/\\/g, '/')}`;
  },

  /**
   * [TAURI 专用接口] 读取应用配置数据 (物理文件)
   */
  async readAppData<T>(key: string): Promise<T | null> {
    if (this.isTauri()) {
      const root = await this.getStorageRoot();
      if (root) {
        console.log(`[Tauri FS] Reading config: ${key}.json from ${root}`);
        // 接入点：await invoke('plugin:fs|read_text_file', { path: `${root}/${key}.json` })
        const emulated = localStorage.getItem(`tauri_phys_${key}`);
        return emulated ? JSON.parse(emulated) : null;
      }
    }
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },

  /**
   * [TAURI 专用接口] 写入应用配置数据 (物理文件)
   */
  async writeAppData(key: string, data: any): Promise<void> {
    const json = JSON.stringify(data, null, 2);
    if (this.isTauri()) {
      const root = await this.getStorageRoot();
      if (root) {
        console.log(`[Tauri FS] Writing config: ${key}.json to ${root}`);
        // 接入点：await invoke('plugin:fs|write_text_file', { path: `${root}/${key}.json`, contents: json })
        localStorage.setItem(`tauri_phys_${key}`, json);
        return;
      }
    }
    localStorage.setItem(key, json);
  },

  /**
   * 初始化存储引擎路径
   */
  async initStorage(): Promise<{ ready: boolean; path?: string }> {
    if (!this.isTauri()) return { ready: true };

    const root = await this.getStorageRoot();
    if (root) return { ready: true, path: root };

    return { ready: false };
  },

  async getStorageRoot(): Promise<string | null> {
    return localStorage.getItem('nav_pro_tauri_storage_root');
  },

  async setStorageRoot(path: string): Promise<void> {
    localStorage.setItem('nav_pro_tauri_storage_root', path);
  },

  /**
   * 通用数据保存 (内部已封装物理读写)
   */
  async saveData(key: string, data: any): Promise<void> {
    await this.writeAppData(key, data);
  },

  /**
   * 通用数据读取 (内部已封装物理读写)
   */
  async loadData<T>(key: string): Promise<T | null> {
    // Fix: Removed explicit generic <T> to resolve "Untyped function calls may not accept type arguments"
    // when calling a generic method from 'this' in an object literal context.
    return this.readAppData(key);
  },

  /**
   * 获取文件路径
   */
  getFilePath(file: File | string): string {
    if (typeof file === 'string') return file;
    const relPath = (file as any).webkitRelativePath;
    if (relPath) {
      const normalized = relPath.replace(/\\/g, '/');
      return normalized.startsWith('/') ? normalized : '/' + normalized;
    }
    return '/' + file.name;
  },

  /**
   * 保存文件 (导出功能)
   */
  async saveFile(content: string, filename: string): Promise<void> {
    if (this.isTauri()) {
      // 接入点：调用 @tauri-apps/plugin-dialog 的 save() 接口
      console.log(`[Tauri Dialog] Opening Save Dialog for ${filename}`);
      // const path = await save({ defaultPath: filename });
      // if (path) await writeAppData(path, content);
      
      // Web 模拟回滚
      this._webDownload(content, filename);
      return;
    }
    this._webDownload(content, filename);
  },

  _webDownload(content: string, filename: string) {
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
   * 选择文件 (支持物理路径返回)
   */
  async pickFile(options: { accept?: string, multiple?: boolean } = {}): Promise<any> {
    if (this.isTauri()) {
      // 接入点：调用 @tauri-apps/plugin-dialog 的 open() 接口
      console.log("[Tauri Dialog] Opening File Picker");
      // return await open({ multiple: options.multiple, filters: [{ name: 'Data', extensions: ['json'] }] });
    }
    
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      if (options.accept) input.accept = options.accept;
      if (options.multiple) input.multiple = true;
      input.onchange = () => resolve(input.files ? Array.from(input.files) : null);
      input.click();
    });
  },

  /**
   * 选择目录
   */
  async pickDirectory(): Promise<any> {
    if (this.isTauri()) {
      // 接入点：open({ directory: true })
      console.log("[Tauri Dialog] Opening Directory Picker");
    }

    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      (input as any).webkitdirectory = true;
      (input as any).directory = true;
      input.onchange = () => resolve(input.files);
      input.click();
    });
  },

  /**
   * 打开路径
   */
  async openPath(path: string, type: ResourceType): Promise<void> {
    if (path.startsWith('http') || type === 'url') {
      window.open(path.startsWith('http') ? path : `https://${path}`, '_blank');
    } else {
      if (this.isTauri()) {
        // 接入点：import { open } from '@tauri-apps/plugin-shell'; await open(path);
        console.log(`[Tauri Shell] Opening physical path: ${path}`);
      }
      const fileUrl = (path.startsWith('/') || path.includes(':')) ? `file://${path}` : `file:///${path}`;
      window.open(fileUrl, '_blank');
    }
  },

  /**
   * 复制文本
   */
  async copyText(text: string): Promise<void> {
    await navigator.clipboard.writeText(text);
  },

  /**
   * 读取文本内容 (支持路径或文件对象)
   */
  async readTextFile(input: File | string): Promise<string> {
    if (typeof input === 'string') {
      if (this.isTauri()) {
        // 接入点：物理读取不再使用 fetch
        console.log(`[Tauri FS] Reading physical file: ${input}`);
        // return await readTextFile(input);
      }
      // Web 环境下尝试 fetch (通常会跨域失败，仅作占位)
      const res = await fetch(input);
      return await res.text();
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error("读取失败"));
      reader.readAsText(input);
    });
  },

  /**
   * 读取 DataURL
   */
  async readDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error("读取失败"));
      reader.readAsDataURL(file);
    });
  },

  /**
   * 生成预览 URL (含协议转换逻辑)
   */
  createPreviewUrl(file: File | string): string {
    if (typeof file === 'string') {
      return this.resolveAssetUrl(file);
    }
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
   * 图标缓存读取
   */
  async readIconFromCache(key: string): Promise<string | null> {
    if (this.isTauri()) {
      const root = await this.getStorageRoot();
      if (root) {
        // 预留从 icons/ 目录物理读取逻辑
        const emulated = localStorage.getItem(`tauri_icons_${key}`);
        return emulated;
      }
    }
    return localStorage.getItem(`local_icon_cache_${key}`);
  },

  /**
   * 图标缓存写入
   */
  async writeIconToCache(key: string, blob: Blob): Promise<string | null> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (this.isTauri()) {
          this.getStorageRoot().then(root => {
            if (root) {
               // 预留写入 icons/ 物理目录逻辑
               localStorage.setItem(`tauri_icons_${key}`, base64);
            }
          });
        } else {
          try {
            localStorage.setItem(`local_icon_cache_${key}`, base64);
          } catch (e) {
            console.warn("Storage full");
          }
        }
        resolve(base64);
      };
      reader.readAsDataURL(blob);
    });
  }
};
