
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  processFilesToResources, 
  filterDuplicateResources, 
  getExtension 
} from './utils/localFolderService';
import { platformAdapter } from './utils/platformAdapter';
import { Resource, Tag, UISettings, DialogState, ResourceType, Library, HistoryEntry, AuditMetadata } from './types';
import { CustomDialog } from './components/SharedUI';
import { ConsolePanel, LogEntry } from './components/ConsolePanel';
import { getContrastYIQ, generateProfessionalRandomColor, formatDate } from './utils/helpers';
import { useResourceNavigation } from './hooks/useResourceNavigation';
import { auditService } from './utils/auditService';
import { usePingHighlight } from './hooks/usePingHighlight';
import { libraryMergeService } from './utils/libraryMergeService';
import { filterService } from './utils/filterService';

// Layout Components
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { MainGrid } from './components/MainGrid';
import { OutlineSidebar } from './components/OutlineSidebar';
import { FilterSettingsSidebar } from './components/FilterSettingsSidebar';

// Views
import { TagCenterView } from './views/TagCenterView';
import { ImportView } from './views/ImportView';
import { ResourceEditView } from './views/ResourceEditView';
import { ResourceCreateView } from './views/ResourceCreateView';
import { BatchTagView } from './views/BatchTagView';
import { SystemPreferencesView } from './views/SystemPreferencesView';
import { CreateLibraryPanelView } from './views/CreateLibraryPanelView';

const DEFAULT_TAG_ID = 'system-default-tag';

const SYSTEM_DEFAULT_TAG: Tag = { 
  id: DEFAULT_TAG_ID, 
  name: '默认', 
  color: '#94a3b8', 
  displayMode: 'all', 
  icon: 'fa-folder', 
  isDefault: true 
};

const STORAGE_KEY_LIBRARIES = 'resource_nav_libraries_v7';
const STORAGE_KEY_SETTINGS = 'resource_nav_settings_v7';

const DEFAULT_SETTINGS: UISettings = {
  fontSize: 100,
  uiScale: 100,
  cardScale: 100,
  pageBg: '#f8fafc',
  textColor: '#1e293b',
  accentColor: '#3b82f6',
  headerBg: '#ffffff',
  cardBg: '#ffffff',
  defaultCardTitleBg: '#ffffff',
  defaultCardTitleColor: '#000000',
  sidebarBg: 'rgba(248, 250, 252, 0.8)',
  sidebarTextColor: '#475569',
  sidebarActiveBg: '#0f172a',
  sidebarActiveTextColor: '#ffffff',
  primaryFontColor: '#0f172a',
  secondaryFontColor: '#475569',
  mutedFontColor: '#94a3b8',
  accentFontColor: '#3b82f6',
  controlPanelBg: '#f1f5f9',
  controlPanelBorder: '#e2e8f0',
  widgetBg: '#ffffff',
  widgetBorder: '#e2e8f0',
  widgetText: '#0f172a',
  auditEntryBg: '#ffffff',
  auditEntryBorder: '#f1f5f9',
  auditBtnExportBg: '#ffffff',
  auditBtnExportText: '#3b82f6',
  auditBtnClearBg: '#fff1f2',
  auditBtnClearText: '#e11d48',
  searchBarBg: '#f8fafc',
  searchBarBorder: '#e2e8f0',
  filterBadgeActiveBg: '#0f172a',
  filterBadgeActiveText: '#ffffff',
  filterBadgeInactiveBg: '#ffffff',
  filterBadgeInactiveText: '#64748b',
  // 优化：明亮模式下增强计数区与排序区的对比
  countBadgeBg: '#f1f5f9', 
  countBadgeBorder: '#cbd5e1',
  countBadgeText: '#475569',
  sortDropdownBg: '#ffffff',
  sortDropdownBorder: '#cbd5e1',
  sortDropdownText: '#0f172a',
  detailsHeaderBg: '#ffffff',
  detailsHeaderBorder: 'rgba(0,0,0,0.08)',
  detailsEditBtnBg: 'rgba(255,255,255,0.2)',
  detailsEditBtnText: '#0f172a',
  detailsEditActiveBtnBg: '#fffbeb',
  detailsEditActiveBtnText: '#d97706',
  detailsNotesCopyBg: '#ffffff',
  detailsNotesCopyBorder: 'rgba(0,0,0,0.1)',
  detailsNotesCopyText: '#475569',
  detailsDialogBg: '#ffffff',
  detailsDialogText: '#0f172a',
  detailsDialogConfirmBg: '#2563eb',
  detailsDialogConfirmText: '#ffffff',
  prefCardBg: '#ffffff',
  prefCardBorder: 'rgba(0,0,0,0.05)',
  prefSwitchOn: '#10b981',
  prefSwitchOff: '#cbd5e1',
  createTabBg: '#f1f5f9',
  createTabActiveBg: '#ffffff',
  createTabActiveText: '#2563eb',
  createTabInactiveText: '#94a3b8',
  restoreBtnBg: '#0f172a',
  restoreBtnText: '#ffffff',
  filterMode: 'AND',
  filterCaseSensitive: false,
  filterIncludePath: false,
  filterShowCounts: true,
  showConsole: true,
  confirmBeforeDelete: true
};

const ResourceNavigator = () => {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [settings, setSettings] = useState<UISettings>(DEFAULT_SETTINGS);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  const [activeModal, setActiveModal] = useState<'resource' | 'resource-create' | 'preferences' | 'tag-center' | 'batch-tag' | 'dir-import' | 'library-creation' | 'filter-settings' | null>(null);
  
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [isResourceEditing, setIsResourceEditing] = useState(false); 
  const [navDirection, setNavDirection] = useState<'prev' | 'next' | 'none'>('none');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const lastSelectedIdRef = useRef<string | null>(null); 
  const [selectedTagManageIds, setSelectedTagManageIds] = useState<Set<string>>(new Set());
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);
  const [isBatchDeleteMode, setIsBatchDeleteMode] = useState(false);

  const { pingId, triggerPing } = usePingHighlight();

  const [isRegexEnabled, setIsRegexEnabled] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<ResourceType[]>([]);
  const [selectedExtensions, setSelectedExtensions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'updatedAt' | 'title' | 'createdAt' | 'tagCount'>('updatedAt');

  const [batchTagsSelected, setBatchTagsSelected] = useState<string[]>([]);
  const [isRecursiveImport, setIsRecursiveImport] = useState(true);
  
  const relocationFileRef = useRef<HTMLInputElement>(null);
  const relocationDirRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLElement>(null);
  const observerTargetRef = useRef<HTMLDivElement>(null); 

  const [visibleLimit, setVisibleLimit] = useState(40);
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    type: 'confirm',
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const [sessionFileMap, setSessionFileMap] = useState<Map<string, File>>(new Map());

  const activeLibrary = useMemo(() => {
    return libraries.find(l => l.id === settings.activeLibraryId) || (libraries.length > 0 ? libraries[0] : undefined);
  }, [libraries, settings.activeLibraryId]);

  const resources = activeLibrary?.resources || [];
  
  const tags = useMemo(() => {
    const rawTags = activeLibrary?.tags || [];
    const hasDefault = rawTags.some(t => t.id === DEFAULT_TAG_ID);
    if (hasDefault) return rawTags;
    return [SYSTEM_DEFAULT_TAG, ...rawTags];
  }, [activeLibrary?.tags]);

  const availableExtensions = useMemo(() => {
    const exts = new Set<string>();
    resources.forEach(r => {
      if (r.type === 'local-file' && r.pathOrUrl) {
        exts.add(getExtension(r.pathOrUrl));
      }
    });
    return Array.from(exts).sort();
  }, [resources]);

  const updateEditingResource = useCallback((updates: Partial<Resource>) => {
    setEditingResource(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  const addLog = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setLogs(p => [{ id: Date.now(), message, type, timestamp: Date.now() }, ...p].slice(0, 100));
  }, []);

  const showDialog = useCallback((config: Partial<DialogState>) => {
    setDialogState({
      isOpen: true,
      type: config.type || 'confirm',
      variant: config.variant || 'default',
      title: config.title || '操作确认',
      message: config.message || '您确定执行此操作吗？',
      placeholder: config.placeholder,
      inputValue: '',
      onConfirm: config.onConfirm || (() => {}),
    });
  }, []);

  const logAction = useCallback((action: string, details: string, libId?: string, metadata?: AuditMetadata) => {
    const targetId = libId || settings.activeLibraryId;
    if (!targetId) return;
    setLibraries(prev => prev.map(lib => {
      if (lib.id !== targetId) return lib;
      const newEntry = auditService.createEntry(action, details, metadata);
      return { ...lib, history: [newEntry, ...lib.history], updatedAt: Date.now() };
    }));
  }, [settings.activeLibraryId]);

  const updateActiveLibraryData = useCallback((updates: Partial<Library>) => {
    if (!settings.activeLibraryId) return;
    setLibraries(prev => prev.map(lib => {
      if (lib.id !== settings.activeLibraryId) return lib;
      const nextLib = { ...lib, ...updates, updatedAt: Date.now() };
      if (nextLib.tags) {
        nextLib.tags = nextLib.tags.filter(t => t.id !== DEFAULT_TAG_ID);
      }
      return nextLib;
    }));
  }, [settings.activeLibraryId]);

  const handleResetVisuals = useCallback(() => {
    const currentActiveLib = settings.activeLibraryId;
    const reset = { ...DEFAULT_SETTINGS, activeLibraryId: currentActiveLib };
    setSettings(reset);
    localStorage.removeItem('ui_active_style_profile_id');
    addLog('界面视觉引擎已回滚至出厂配置', 'info');
  }, [settings.activeLibraryId, addLog]);

  const createDefaultLibrary = useCallback(() => {
    const newLib: Library = {
      id: crypto.randomUUID(),
      name: '我的主书库',
      resources: [],
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      history: [auditService.createEntry('库创建', '初始库已生成')]
    };
    setLibraries([newLib]);
    setSettings(prev => ({ ...prev, activeLibraryId: newLib.id }));
    return newLib;
  }, []);

  useEffect(() => {
    const savedLibs = localStorage.getItem(STORAGE_KEY_LIBRARIES);
    const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
    
    if (savedSettings) {
      try { 
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...DEFAULT_SETTINGS, ...parsed })); 
      } catch(e) {}
    }

    if (savedLibs) {
      try { 
        const parsed = JSON.parse(savedLibs);
        if (Array.isArray(parsed)) setLibraries(parsed);
        else createDefaultLibrary();
      } catch(e) { createDefaultLibrary(); }
    } else {
      createDefaultLibrary();
    }
  }, [createDefaultLibrary]);

  useEffect(() => {
    try {
      const libsToSave = libraries.map(lib => ({
        ...lib,
        tags: lib.tags.filter(t => t.id !== DEFAULT_TAG_ID)
      }));
      localStorage.setItem(STORAGE_KEY_LIBRARIES, JSON.stringify(libsToSave));
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error("LocalStorage persistence failed:", error);
    }
  }, [libraries, settings]);

  const filteredList = useMemo(() => {
    return filterService.filterResources(resources, {
      searchQuery,
      isRegexEnabled,
      selectedTypes,
      selectedExtensions,
      selectedTagIds,
      sortBy,
      settings
    });
  }, [resources, searchQuery, isRegexEnabled, selectedTypes, selectedExtensions, selectedTagIds, sortBy, settings]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleLimit < filteredList.length) {
          setVisibleLimit(prev => Math.min(prev + 40, filteredList.length));
        }
      },
      { threshold: 0.1, rootMargin: '1000px' } 
    );

    const target = observerTargetRef.current;
    if (target) observer.observe(target);
    return () => {
      if (target) observer.unobserve(target);
    };
  }, [filteredList.length, visibleLimit]);

  useEffect(() => {
    setVisibleLimit(40);
  }, [searchQuery, selectedTagIds, selectedTypes, selectedExtensions]);

  const toggleSelection = useCallback((id: string, shiftKey?: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      const lastId = lastSelectedIdRef.current;
      if (shiftKey && lastId) {
        const currentIndex = filteredList.findIndex(r => r.id === id);
        const lastIndex = filteredList.findIndex(r => r.id === lastId);
        if (currentIndex !== -1 && lastIndex !== -1) {
          const start = Math.min(currentIndex, lastIndex);
          const end = Math.max(currentIndex, lastIndex);
          for (let i = start; i <= end; i++) next.add(filteredList[i].id);
          return next;
        }
      }
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    lastSelectedIdRef.current = id;
  }, [filteredList]);

  const handleOpenResource = useCallback((res: Resource) => {
    setEditingResource({ ...res });
    setNavDirection('none');
    setIsResourceEditing(false); 
    setActiveModal('resource');
  }, []);

  const handleSaveResource = useCallback(() => {
    if (!editingResource) return;
    if (!editingResource.title.trim()) {
      addLog('保存拦截：标题不能为空', 'error');
      return;
    }
    const now = Date.now();
    const updatedRes = { ...editingResource, updatedAt: now };
    const isNew = !resources.some(r => r.id === editingResource.id);
    const nextResources = isNew 
      ? [updatedRes, ...resources] 
      : resources.map(r => r.id === editingResource.id ? updatedRes : r);
    updateActiveLibraryData({ resources: nextResources });
    setEditingResource(updatedRes);
    logAction(isNew ? '添加项目' : '修改项目', `名称: ${editingResource.title || '空'}`, undefined, {
      count: 1,
      filenames: [editingResource.title],
      types: { [editingResource.type]: 1 }
    });
    addLog('资源已保存', 'success');
  }, [editingResource, resources, updateActiveLibraryData, logAction, addLog]);

  const handleNavigate = useCallback((res: Resource, direction: 'prev' | 'next') => {
    setNavDirection(direction);
    setEditingResource({ ...res });
    setIsResourceEditing(false); 
  }, []);

  const navigationInfo = useResourceNavigation({
    filteredList,
    currentId: editingResource?.id,
    onNavigate: handleNavigate,
    isOpen: activeModal === 'resource',
    disabled: isResourceEditing 
  });

  const handleAddTag = useCallback(() => {
    const newTag: Tag = { id: crypto.randomUUID(), name: '新标签', color: generateProfessionalRandomColor(), displayMode: 'all', icon: 'fa-tag' };
    updateActiveLibraryData({ tags: [...tags, newTag] });
    logAction('新建标签', `名称: ${newTag.name}`);
    addLog('已添加新标签', 'success');
  }, [tags, updateActiveLibraryData, logAction, addLog]);

  const handleBatchDelete = useCallback(() => {
    const count = selectedIds.size;
    const targets = resources.filter(r => selectedIds.has(r.id));
    const metadata = auditService.analyzeResources(targets);
    updateActiveLibraryData({ resources: resources.filter(r => !selectedIds.has(r.id)) });
    logAction('批量删除', `删开了 ${count} 个资源项目`, undefined, metadata);
    setSelectedIds(new Set());
    addLog('批量删除完成', 'success');
  }, [selectedIds, resources, updateActiveLibraryData, logAction, addLog]);

  const handleApplyBatchTags = useCallback(() => {
    if (batchTagsSelected.length === 0) return;
    const nextResources = resources.map(r => {
      if (!selectedIds.has(r.id)) return r;
      const combined = new Set([...(r.tags || []), ...batchTagsSelected]);
      return { ...r, tags: Array.from(combined), updatedAt: Date.now() };
    });
    updateActiveLibraryData({ resources: nextResources });
    addLog('批量标签添加成功', 'success');
    setActiveModal(null);
    setSelectedIds(new Set());
    setBatchTagsSelected([]);
  }, [resources, selectedIds, batchTagsSelected, updateActiveLibraryData, addLog]);

  const handleRemoveBatchTags = useCallback(() => {
    if (batchTagsSelected.length === 0) return;
    const nextResources = resources.map(r => {
      if (!selectedIds.has(r.id)) return r;
      const filtered = (r.tags || []).filter(tid => !batchTagsSelected.includes(tid));
      return { ...r, tags: filtered.length === 0 ? [DEFAULT_TAG_ID] : filtered, updatedAt: Date.now() };
    });
    updateActiveLibraryData({ resources: nextResources });
    addLog('批量标签移除成功', 'success');
    setActiveModal(null);
    setSelectedIds(new Set());
    setBatchTagsSelected([]);
  }, [resources, selectedIds, batchTagsSelected, updateActiveLibraryData, addLog]);

  const handleRenameLibrary = useCallback((libId: string, newName: string) => {
    setLibraries(prev => prev.map(lib => lib.id === libId ? { ...lib, name: newName, updatedAt: Date.now() } : lib));
    logAction('重命名库', `新名称: ${newName}`, libId);
    addLog(`书库已更名为 "${newName}"`, 'success');
  }, [logAction, addLog]);

  const handleDeleteLibrary = useCallback((libId: string) => {
    setLibraries(prev => {
      const next = prev.filter(lib => lib.id !== libId);
      if (next.length === 0) {
        setSettings(s => ({ ...s, activeLibraryId: undefined }));
      } else if (libId === settings.activeLibraryId) {
        setSettings(s => ({ ...s, activeLibraryId: next[0].id }));
      }
      return next;
    });
    addLog('书库已移除', 'info');
  }, [settings.activeLibraryId]);

  const handleLocateResource = useCallback((id: string) => {
    const el = document.getElementById(`resource-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      triggerPing(id);
    } else {
      addLog('定位失败：资源不在当前列表或已过滤', 'error');
    }
  }, [triggerPing, addLog]);

  const handlePathAction = useCallback((action: 'copy' | 'open', res: Resource) => {
    if (action === 'copy') {
      platformAdapter.copyText(res.pathOrUrl).then(() => addLog('路径已复制', 'success'));
    } else {
      platformAdapter.openPath(res.pathOrUrl, res.type);
    }
  }, [addLog]);

  const handleMergeImport = useCallback((sourceData: Partial<Library>) => {
    if (!activeLibrary) return;
    const merged = libraryMergeService.merge(activeLibrary, sourceData);
    setLibraries(prev => {
      const exists = prev.some(l => l.id === merged.id);
      if (exists) return prev.map(l => l.id === merged.id ? merged : l);
      return [...prev, merged];
    });
    addLog('数据已合并至书库', 'success');
  }, [activeLibrary, addLog]);

  const handleExportToJSON = async () => {
    if (!activeLibrary) return;
    const exportData = {
      ...activeLibrary,
      tags: activeLibrary.tags.filter(t => t.id !== DEFAULT_TAG_ID)
    };
    const data = JSON.stringify(exportData, null, 2);
    await platformAdapter.saveFile(data, `${activeLibrary.name || 'Library'}.json`);
    addLog('库镜像导出成功', 'success');
  };

  const handleImportFromJSON = async () => {
    const files = await platformAdapter.pickFile({ accept: '.json' });
    if (!files || files.length === 0) return;
    const content = await platformAdapter.readTextFile(files[0]);
    try {
      const p = JSON.parse(content);
      handleMergeImport(p);
    } catch (err) {
      addLog('导入失败：无效的 JSON 格式', 'error');
    }
  };

  if (libraries.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-700" style={{ backgroundColor: settings.pageBg }}>
         <div className="w-24 h-24 rounded-[2rem] shadow-2xl flex items-center justify-center mb-10 rotate-3 animate-bounce border-4 border-white" style={{ backgroundColor: settings.accentColor }}>
            <i className="fa-solid fa-database text-white text-3xl"></i>
         </div>
         <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-4" style={{ color: settings.primaryFontColor }}>核心数据库未就绪</h1>
         <p className="text-sm font-bold max-w-md leading-relaxed mb-12" style={{ color: settings.secondaryFontColor }}>
           系统检测到当前没有活跃的资源书库。您需要创建一个初始存储节点，才能解锁浏览器、标签中控与快速导航功能。
         </p>
         <button 
           onClick={() => setActiveModal('library-creation')}
           className="px-12 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-2xl active:scale-95"
         >
           开启初始化向导
         </button>
         
         {activeModal === 'library-creation' && (
           <CreateLibraryPanelView 
             settings={settings} 
             onClose={() => setActiveModal(null)} 
             onCreate={(lib) => {
                setLibraries([lib]);
                setSettings(prev => ({ ...prev, activeLibraryId: lib.id }));
                setActiveModal(null);
                addLog(`书库 "${lib.name}" 已就绪`, 'success');
             }} 
           />
         )}
         {settings.showConsole && <ConsolePanel logs={logs} onClear={() => setLogs([])} />}
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden relative" style={{ backgroundColor: settings.pageBg, color: settings.textColor, fontSize: `${settings.fontSize}%` }}>
      <Header 
        settings={settings} activeModal={activeModal} setActiveModal={(m) => m === 'settings' || m === 'library' ? setActiveModal('preferences') : setActiveModal(m)} 
        selectedIds={selectedIds} setSelectedIds={setSelectedIds} isBatchDeleteMode={isBatchDeleteMode} setIsBatchDeleteMode={setIsBatchDeleteMode} activeLibraryName={activeLibrary?.name}
        openNewResource={() => setActiveModal('resource-create')} 
        onBatchDelete={() => showDialog({ title: '批量删除', message: `确定删除 ${selectedIds.size} 个项目吗？`, onConfirm: handleBatchDelete })} 
      />

      <FilterBar 
        settings={settings} setSettings={setSettings} isFiltered={!!(searchQuery || selectedTagIds.length || selectedTypes.length || selectedExtensions.length)} 
        filteredCount={filteredList.length} totalCount={resources.length} resources={resources} searchQuery={searchQuery} setSearchQuery={setSearchQuery} isRegexEnabled={isRegexEnabled} setIsRegexEnabled={setIsRegexEnabled} 
        sortBy={sortBy} setSortBy={setSortBy as any} selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} 
        availableExtensions={availableExtensions} selectedExtensions={selectedExtensions} setSelectedExtensions={setSelectedExtensions} tags={tags} selectedTagIds={selectedTagIds} setSelectedTagIds={setSelectedTagIds} 
        setVisibleLimit={setVisibleLimit} 
        onOpenSettings={() => setActiveModal('filter-settings')} 
        isOutlineOpen={isOutlineOpen} setIsOutlineOpen={setIsOutlineOpen}
      />

      <div className="flex-1 flex relative overflow-hidden group/container">
        <MainGrid 
          filteredList={filteredList} visibleLimit={visibleLimit} currentCardWidth={180 * (settings.cardScale/100)} currentFontSize={0.7 * (settings.cardScale/100)} settings={settings} 
          selectedIds={selectedIds} isBatchDeleteMode={isBatchDeleteMode} toggleSelection={toggleSelection} 
          openResource={handleOpenResource} tags={tags} observerTarget={observerTargetRef}
          onPathAction={handlePathAction} sessionFileMap={sessionFileMap} scrollRef={scrollContainerRef}
          pingId={pingId}
        />
        {isOutlineOpen && (
          <OutlineSidebar 
            filteredList={filteredList} 
            onClose={() => setIsOutlineOpen(false)} 
            locateResource={handleLocateResource} 
            settings={settings}
          />
        )}
      </div>

      {activeModal === 'resource' && editingResource && (
        <ResourceEditView 
          key={editingResource.id} editingResource={editingResource} updateEditingResource={updateEditingResource} undoStack={[]} onUndo={() => {}} onSave={handleSaveResource} onClose={() => setActiveModal(null)} tags={tags} tagSearch={''} setTagSearch={() => {}} relocationFileRef={relocationFileRef} relocationDirRef={relocationDirRef} 
          onRelocationSelect={(e) => { 
            const f = e.target.files?.[0]; 
            if (f) { 
              updateEditingResource({pathOrUrl: platformAdapter.getFilePath(f)}); 
              setSessionFileMap(prev => { const next = new Map(prev); next.set(editingResource.id, f); return next; });
            } 
          }} 
          onPathAction={(a) => a === 'copy' ? platformAdapter.copyText(editingResource.pathOrUrl).then(() => addLog('路径已复制', 'success')) : platformAdapter.openPath(editingResource.pathOrUrl, editingResource.type)} 
          onCopyNotes={() => {
            if (editingResource.notes) {
              platformAdapter.copyText(editingResource.notes).then(() => addLog('笔记已复制', 'success'));
            } else {
              addLog('暂无笔记内容可复制', 'error');
            }
          }}
          onOpenTagCenter={() => setActiveModal('tag-center')}
          settings={settings} getContrastYIQ={getContrastYIQ} prevResource={navigationInfo.prev} nextResource={navigationInfo.next} onNavigate={handleNavigate} navDirection={navDirection} sessionFileMap={sessionFileMap} isEditMode={isResourceEditing} setIsEditMode={setIsResourceEditing} 
        />
      )}

      {activeModal === 'resource-create' && (
        <ResourceCreateView 
          onClose={() => setActiveModal(null)}
          onCreate={(res) => {
            const nextResources = [res, ...resources];
            updateActiveLibraryData({ resources: nextResources });
            logAction('添加项目', `名称: ${res.title}`, undefined, {
              count: 1,
              filenames: [res.title],
              types: { [res.type]: 1 }
            });
            addLog(`成功创建项目: ${res.title}`, 'success');
          }}
          onOpenTagCenter={() => setActiveModal('tag-center')}
          tags={tags}
          settings={settings}
          defaultTagId={DEFAULT_TAG_ID}
          sessionFileMap={sessionFileMap}
          updateSessionFileMap={(id, file) => setSessionFileMap(prev => { const next = new Map(prev); next.set(id, file); return next; })}
        />
      )}

      {activeModal === 'batch-tag' && (
        <BatchTagView selectedCount={selectedIds.size} tags={tags} batchTagsSelected={batchTagsSelected} setBatchTagsSelected={setBatchTagsSelected} onClose={() => setActiveModal(null)} onRemoveBatchTags={handleRemoveBatchTags} onApplyBatchTags={handleApplyBatchTags} getContrastYIQ={getContrastYIQ} settings={settings} />
      )}

      {activeModal === 'tag-center' && <TagCenterView tags={tags} setTags={(nextTags) => updateActiveLibraryData({ tags: typeof nextTags === 'function' ? nextTags(tags) : nextTags })} selectedTagManageIds={selectedTagManageIds} setSelectedTagManageIds={setSelectedTagManageIds} onClose={() => setActiveModal(null)} onBatchDelete={() => { const count = selectedTagManageIds.size; updateActiveLibraryData({ tags: tags.filter(t => t.isDefault || !selectedTagManageIds.has(t.id)) }); setSelectedTagManageIds(new Set()); logAction('批量删除标签', `删开了 ${count} 个标签`); addLog(`成功批量删除 ${count} 个标签`, 'success'); }} onAddTag={handleAddTag} onIconUpload={(id, file) => { 
        if (file.size > 1024 * 100) {
          addLog('图片体积过大 (需小于 100KB)', 'error');
          return;
        }
        platformAdapter.readDataUrl(file).then(dataUrl => {
          updateActiveLibraryData({ tags: tags.map(t => t.id === id ? {...t, customIcon: dataUrl} : t) });
        });
      }} settings={settings} />}
      
      {activeModal === 'dir-import' && (
        <ImportView isRecursiveImport={isRecursiveImport} setIsRecursiveImport={setIsRecursiveImport} onClose={() => setActiveModal(null)} processImportFiles={(files) => { 
          if (!files) return; 
          const { resources: processed, fileMap } = processFilesToResources(files, isRecursiveImport, true, DEFAULT_TAG_ID); 
          const { nextResources, addedResources } = filterDuplicateResources(resources, processed); 
          setSessionFileMap(prev => { 
            const next = new Map(prev); 
            addedResources.forEach(r => { 
              const f = fileMap.get(r.id); 
              if (f) next.set(r.id, f); 
            }); 
            return next; 
          }); 
          updateActiveLibraryData({ resources: nextResources }); 
          const metadata = auditService.analyzeResources(addedResources);
          logAction('合并库/导入', `导入了 ${addedResources.length} 个新资源项目`, undefined, metadata);
          addLog(`导入了 ${processed.length} 个资源`, 'success'); 
          setActiveModal(null); 
        }} onTextImport={(parsed, newImplicitTags) => { 
          // 核心逻辑升级：合并自动创建的新标签
          if (newImplicitTags && newImplicitTags.length > 0) {
            updateActiveLibraryData({ tags: [...tags, ...newImplicitTags] });
            addLog(`自动同步创建了 ${newImplicitTags.length} 个新标签`, 'info');
          }
          
          const { nextResources, addedResources } = filterDuplicateResources(resources, parsed); 
          updateActiveLibraryData({ resources: nextResources }); 
          const metadata = auditService.analyzeResources(addedResources);
          logAction('文本批量导入', `通过文本导入了 ${addedResources.length} 个资源项目`, undefined, metadata);
          addLog(`文本导入成功: ${addedResources.length} 条`, 'success'); 
          setActiveModal(null); 
        }} existingTags={tags} defaultTagId={DEFAULT_TAG_ID} settings={settings} />
      )}

      {activeModal === 'preferences' && (
        <SystemPreferencesView 
          libraries={libraries} 
          setLibraries={setLibraries} 
          activeLibraryId={settings.activeLibraryId} 
          onSwitch={(id) => setSettings(p => ({ ...p, activeLibraryId: id }))} 
          onCreate={() => setActiveModal('library-creation')} 
          onRenameLibrary={handleRenameLibrary} 
          onDeleteLibrary={handleDeleteLibrary} 
          settings={settings} 
          setSettings={setSettings} 
          onClose={() => setActiveModal(null)} 
          exportToJSON={handleExportToJSON} 
          copyDataToClipboard={() => { 
            const exportData = {
              ...activeLibrary,
              tags: activeLibrary?.tags.filter(t => t.id !== DEFAULT_TAG_ID)
            };
            platformAdapter.copyText(JSON.stringify(exportData)).then(() => addLog('库数据已复制', 'success')); 
          }} 
          importFromJSON={handleImportFromJSON} 
          importFromText={() => showDialog({ type: 'prompt', title: '粘贴 JSON 合并至库', message: '请粘贴库数据 JSON，其中的资源和标签将合并到当前库。', onConfirm: (val) => { if (!val) return; try { const p = JSON.parse(val); handleMergeImport(p); } catch(e) { addLog('导入失败：无效的 JSON', 'error'); } } })} 
          onReset={() => showDialog({ type: 'confirm', variant: 'danger', title: '抹除全部数据', message: '您确定要抹除所有资源库吗？此操作不可撤销。', onConfirm: () => { setLibraries([]); setSettings(DEFAULT_SETTINGS); localStorage.clear(); setActiveModal(null); } })} 
          showDialog={showDialog}
          onResetVisuals={handleResetVisuals}
          addLog={addLog}
        />
      )}

      {activeModal === 'library-creation' && (
        <CreateLibraryPanelView 
          settings={settings} 
          onClose={() => setActiveModal('preferences')} 
          onCreate={(lib) => {
             setLibraries(prev => [...prev, lib]);
             setSettings(prev => ({ ...prev, activeLibraryId: lib.id }));
             setActiveModal('preferences');
             addLog(`新书库 "${lib.name}" 创建成功`, 'success');
          }} 
        />
      )}

      {/* 核心修改：筛选设置面板作为全屏 Modal 渲染 */}
      {activeModal === 'filter-settings' && (
        <FilterSettingsSidebar 
          isOpen={true} 
          onClose={() => setActiveModal(null)} 
          settings={settings} 
          onUpdate={(updates) => setSettings({ ...settings, ...updates })}
        />
      )}

      <CustomDialog state={dialogState} onClose={() => setDialogState(p => ({...p, isOpen: false}))} setDialogState={setDialogState} />
      {settings.showConsole && <ConsolePanel logs={logs} onClear={() => setLogs([])} />}
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<ResourceNavigator />);
