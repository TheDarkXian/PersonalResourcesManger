
import React, { useState } from 'react';
import { UI_ICONS } from '../icons/index';
import { Resource, Tag, UISettings, ResourceType } from '../types';
import { getImportTheme } from '../styles/importTheme';
import { platformAdapter } from '../utils/platformAdapter';
import { generateProfessionalRandomColor } from '../utils/helpers';

interface ImportViewProps {
  isRecursiveImport: boolean;
  setIsRecursiveImport: (r: boolean) => void;
  onClose: () => void;
  processImportFiles: (files: FileList | File[] | null) => void;
  onTextImport: (resources: Resource[], newTags?: Tag[]) => void;
  existingTags: Tag[];
  defaultTagId: string;
  settings: UISettings;
}

export const ImportView: React.FC<ImportViewProps> = ({
  isRecursiveImport,
  setIsRecursiveImport,
  onClose,
  processImportFiles,
  onTextImport,
  existingTags,
  defaultTagId,
  settings
}) => {
  const [importText, setImportText] = useState('');
  const [activeTab, setActiveTab] = useState<'files' | 'text'>('files');
  const theme = getImportTheme(settings);

  const handlePickDirectory = async () => {
    const files = await platformAdapter.pickDirectory();
    if (files) processImportFiles(files);
  };

  const handlePickFiles = async () => {
    const files = await platformAdapter.pickFile({ multiple: true });
    if (files) processImportFiles(files);
  };

  /**
   * 增强型资源类型自动检测引擎
   */
  const detectResourceType = (pathOrUrl: string): ResourceType => {
    const urlPattern = /^(https?:\/\/|www\.)[^\s/$.?#].[^\s]*$/i;
    const pathPattern = /^([a-z]:\\|\\|(?:\.\.?\/)+|\/)/i;
    
    if (urlPattern.test(pathOrUrl)) return 'url';
    if (pathPattern.test(pathOrUrl)) return 'local-file';
    
    // 若均不匹配，判定为文本笔记
    return 'text-note';
  };

  const handleTextImport = () => {
    if (!importText.trim()) return;
    const lines = importText.split('\n');
    const newResources: Resource[] = [];
    
    // 动态维护一个待创建的标签列表
    const implicitTags: Tag[] = [];
    const tagNameToIdMap: Record<string, string> = {};
    
    // 初始化已有标签映射
    existingTags.forEach(t => tagNameToIdMap[t.name] = t.id);

    lines.forEach(line => {
      if (!line.trim()) return;
      const parts = line.includes('\t') ? line.split('\t') : line.split(',');
      const title = parts[0]?.trim();
      const pathOrUrl = parts[1]?.trim();
      const tagStr = parts[2]?.trim();

      if (title && pathOrUrl) {
        const resourceTags: string[] = [defaultTagId];
        
        if (tagStr) {
          const splitTags = tagStr.split('|');
          splitTags.forEach(tagName => {
            const trimmedName = tagName.trim();
            if (!trimmedName) return;

            if (tagNameToIdMap[trimmedName]) {
              if (!resourceTags.includes(tagNameToIdMap[trimmedName])) {
                resourceTags.push(tagNameToIdMap[trimmedName]);
              }
            } else {
              // 自动创建不存在的标签
              const newTag: Tag = {
                id: crypto.randomUUID(),
                name: trimmedName,
                color: generateProfessionalRandomColor(),
                displayMode: 'all',
                icon: 'fa-tag'
              };
              implicitTags.push(newTag);
              tagNameToIdMap[trimmedName] = newTag.id;
              resourceTags.push(newTag.id);
            }
          });
        }

        newResources.push({
          id: crypto.randomUUID(),
          title,
          type: detectResourceType(pathOrUrl),
          pathOrUrl: pathOrUrl,
          tags: resourceTags,
          color: '#ffffff',
          titleColor: '#000000',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          lastAccessedAt: 0
        });
      }
    });

    if (newResources.length > 0) {
      onTextImport(newResources, implicitTags);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[400] flex flex-col animate-in slide-in-from-bottom duration-300"
      style={{ backgroundColor: theme.main.bg }}
    >
      <header className={`${theme.header.padding} border-b flex items-center justify-between`} style={{ borderColor: theme.header.border, backgroundColor: settings.headerBg }}>
        <div className="flex items-center space-x-6">
          <button 
            onClick={onClose} 
            className="p-4 rounded-full transition-all"
            style={{ color: theme.header.closeBtnColor }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.header.closeBtnHoverBg;
              e.currentTarget.style.color = theme.header.closeBtnHoverText;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = theme.header.closeBtnColor;
            }}
          >
            <i className={`fa-solid ${UI_ICONS.close} text-2xl`}></i>
          </button>
          <div className="space-y-1">
            <h2 className="text-3xl font-black uppercase tracking-tight italic" style={{ color: theme.header.titleColor }}>IMPORT RESOURCES</h2>
            <div className="flex space-x-4">
               <button 
                 onClick={() => setActiveTab('files')}
                 className={`text-[10px] font-black uppercase tracking-widest py-1 border-b-2 transition-all`}
                 style={{ 
                   borderColor: activeTab === 'files' ? theme.header.tab.activeBorder : 'transparent',
                   color: activeTab === 'files' ? theme.header.tab.activeText : theme.header.tab.inactiveText
                 }}
               >
                 本地物理导入
               </button>
               <button 
                 onClick={() => setActiveTab('text')}
                 className={`text-[10px] font-black uppercase tracking-widest py-1 border-b-2 transition-all`}
                 style={{ 
                   borderColor: activeTab === 'text' ? theme.header.tab.activeBorder : 'transparent',
                   color: activeTab === 'text' ? theme.header.tab.activeText : theme.header.tab.inactiveText
                 }}
               >
                 文本/表格批量导入
               </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-12 overflow-y-auto flex flex-col items-center" style={{ backgroundColor: theme.main.contentBg }}>
        <div className="max-w-4xl w-full">
          {activeTab === 'files' ? (
            <div className="space-y-12 animate-in fade-in duration-300">
              <div 
                className="p-8 rounded-3xl shadow-sm border flex items-center justify-between"
                style={{ backgroundColor: theme.toggle.cardBg, borderColor: theme.toggle.cardBorder }}
              >
                <div className="space-y-1">
                  <div className="text-lg font-black uppercase" style={{ color: theme.toggle.labelColor }}>目录递归模式</div>
                  <div className="text-sm font-medium" style={{ color: theme.toggle.descColor }}>开启后将包含目录下所有层级的子文件</div>
                </div>
                <button 
                  onClick={() => setIsRecursiveImport(!isRecursiveImport)} 
                  className={`w-16 h-8 rounded-full transition-colors relative shadow-inner`}
                  style={{ backgroundColor: isRecursiveImport ? theme.toggle.trackOn : theme.toggle.trackOff }}
                >
                  <div 
                    className={`absolute top-1 w-6 h-6 rounded-full transition-all shadow-md`}
                    style={{ 
                      backgroundColor: theme.toggle.thumbBg,
                      left: isRecursiveImport ? '2.25rem' : '0.25rem' 
                    }}
                  ></div>
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <button 
                  onClick={handlePickDirectory} 
                  className="h-80 border-2 border-dashed rounded-[3rem] flex flex-col items-center justify-center space-y-6 group transition-all"
                  style={{ 
                    backgroundColor: settings.cardBg, 
                    borderColor: theme.cards.folder.border 
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = theme.cards.folder.hoverBorder;
                    e.currentTarget.style.backgroundColor = theme.cards.folder.hoverBg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = theme.cards.folder.border;
                    e.currentTarget.style.backgroundColor = settings.cardBg;
                  }}
                >
                  <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: theme.cards.folder.iconBg }}
                  >
                    <i className={`fa-solid ${UI_ICONS.folderOpen} text-4xl`} style={{ color: theme.cards.folder.iconColor }}></i>
                  </div>
                  <div className="text-center">
                    <span className="text-xl font-black uppercase block mb-2" style={{ color: theme.cards.folder.titleColor }}>选择物理目录</span>
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: theme.cards.folder.descColor }}>导入整个文件夹结构</span>
                  </div>
                </button>

                <button 
                  onClick={handlePickFiles} 
                  className="h-80 border-2 border-dashed rounded-[3rem] flex flex-col items-center justify-center space-y-6 group transition-all"
                  style={{ 
                    backgroundColor: settings.cardBg, 
                    borderColor: theme.cards.files.border 
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = theme.cards.files.hoverBorder;
                    e.currentTarget.style.backgroundColor = theme.cards.files.hoverBg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = theme.cards.files.border;
                    e.currentTarget.style.backgroundColor = settings.cardBg;
                  }}
                >
                  <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: theme.cards.files.iconBg }}
                  >
                    <i className={`fa-solid ${UI_ICONS.files} text-4xl`} style={{ color: theme.cards.files.iconColor }}></i>
                  </div>
                  <div className="text-center">
                    <span className="text-xl font-black uppercase block mb-2" style={{ color: theme.cards.files.titleColor }}>手动多选文件</span>
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: theme.cards.files.descColor }}>从本地选取特定资源文件</span>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div 
              className="p-8 rounded-3xl shadow-sm border space-y-6 animate-in slide-in-from-right duration-300"
              style={{ backgroundColor: theme.textImport.cardBg, borderColor: theme.textImport.cardBorder }}
            >
               <div className="space-y-1">
                  <h3 className="text-lg font-black uppercase" style={{ color: theme.textImport.labelColor }}>文本导入格式说明</h3>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textImport.descColor }}>格式: 资源名称 , 资源链接 , 标签1|标签2</p>
               </div>
               <textarea 
                 value={importText}
                 onChange={e => setImportText(e.target.value)}
                 className="w-full h-80 rounded-2xl p-6 font-mono text-xs outline-none transition-all shadow-inner"
                 style={{ 
                   backgroundColor: theme.textImport.textareaBg, 
                   borderColor: theme.textImport.textareaBorder,
                   color: theme.textImport.labelColor 
                 }}
                 placeholder="示例：&#10;Google官网, https://google.com, 搜索|工具&#10;项目文档, /Users/work/doc.pdf, 重要|本地&#10;临时笔记, 记得周五要开会, 工作|待办"
               />
               <div className="flex justify-end">
                  <button 
                    onClick={handleTextImport}
                    className="px-12 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95"
                    style={{ backgroundColor: theme.textImport.submitBtnBg, color: theme.textImport.submitBtnText }}
                  >
                    确认批量导入
                  </button>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
