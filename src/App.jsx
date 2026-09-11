import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { createInitialProject, makeTextObject, cloneProject, getContentBounds } from "./editor/model";
import { useEditorHistory } from "./editor/history";
import { useEditor } from "./editor/useEditor";
import Toolbar from "./components/Toolbar";
import Artboard from "./components/Artboard";
import PropertiesPanel from "./components/PropertiesPanel";
import LayersPanel from "./components/LayersPanel";
import MobileBottomSheet from "./components/MobileBottomSheet";

export default function App() {
  const [project, setProject] = useState(createInitialProject);
  const [theme, setTheme] = useState(() => localStorage.getItem("khatavar-theme") || "system");
  const history = useEditorHistory();
  const editor = useEditor(project, setProject, history);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("khatavar-theme", theme);
  }, [theme]);

  useEffect(() => {
    const raw = localStorage.getItem("khatavar-project");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.objects && parsed?.artboard) {
        setProject(parsed);
        history.reset(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("khatavar-project", JSON.stringify(project));
    }, 250);
    return () => clearTimeout(timer);
  }, [project]);

  const selected = project.objects.find(o => o.id === project.selectedId) || null;
  const contentBounds = useMemo(() => getContentBounds(project.objects), [project.objects]);

  const addText = () => {
    const obj = makeTextObject({
      text: "خط‌آور",
      x: Math.max(40, project.artboard.width / 2 - 100),
      y: Math.max(80, project.artboard.height / 2 - 50)
    });
    editor.addObject(obj);
  };

  const fitContent = () => {
    if (!contentBounds) return;
    const pad = 70;
    editor.setArtboard({
      width: Math.max(320, Math.ceil(contentBounds.width + pad * 2)),
      height: Math.max(240, Math.ceil(contentBounds.height + pad * 2))
    });
  };

  const resetProject = () => {
    const next = createInitialProject();
    setProject(next);
    history.reset(next);
    localStorage.removeItem("khatavar-project");
  };

  return (
    <div className="app-shell">
      <header className="topbar glass">
        <div className="brand">
          <div className="brand-mark">خ</div>
          <div>
            <div className="brand-title">خط‌آور</div>
            <div className="brand-subtitle">استودیوی تایپوگرافی فارسی</div>
          </div>
        </div>
        <Toolbar
          canUndo={history.canUndo}
          canRedo={history.canRedo}
          onUndo={editor.undo}
          onRedo={editor.redo}
          onAddText={addText}
          onFit={fitContent}
          onExport={() => editor.exportPNG()}
          onExportSvg={() => editor.exportSVG()}
          theme={theme}
          setTheme={setTheme}
          onReset={resetProject}
        />
      </header>

      <main className="workspace">
        <aside className="sidebar right-panel glass">
          <PropertiesPanel
            object={selected}
            scope={project.scope}
            onScopeChange={editor.setScope}
            onChange={editor.updateSelected}
            onDelete={editor.deleteSelected}
          />
        </aside>

        <section className="stage">
          <div className="stage-head glass">
            <div className="scope-switch">
              {["text", "word", "character"].map(scope => (
                <button
                  key={scope}
                  className={project.scope === scope ? "active" : ""}
                  onClick={() => editor.setScope(scope)}
                >
                  {scope === "text" ? "متن" : scope === "word" ? "کلمه" : "کاراکتر"}
                </button>
              ))}
            </div>
            <div className="zoom-control">
              <button onClick={() => editor.setZoom(Math.max(.25, project.zoom - .1))}>−</button>
              <span>{Math.round(project.zoom * 100)}%</span>
              <button onClick={() => editor.setZoom(Math.min(3, project.zoom + .1))}>+</button>
            </div>
          </div>

          <Artboard
            project={project}
            selected={selected}
            onSelect={editor.selectObject}
            onMove={editor.moveSelected}
            onRotate={editor.rotateSelected}
            onScale={editor.scaleSelected}
            onTextChange={editor.updateSelected}
          />

          <div className="statusbar glass">
            <span>{project.objects.length} آبجکت</span>
            <span>آرت‌بورد {project.artboard.width} × {project.artboard.height}</span>
            <span>{project.scope === "text" ? "ویرایش متن" : project.scope === "word" ? "ویرایش کلمه" : "ویرایش کاراکتر"}</span>
          </div>
        </section>

        <aside className="sidebar left-panel glass">
          <LayersPanel
            objects={project.objects}
            selectedId={project.selectedId}
            onSelect={editor.selectObject}
            onDelete={editor.deleteObject}
            onToggleVisibility={editor.toggleVisibility}
            onToggleLock={editor.toggleLock}
            onMoveLayer={editor.moveLayer}
          />
        </aside>
      </main>

      <MobileBottomSheet
        object={selected}
        scope={project.scope}
        onScopeChange={editor.setScope}
        onChange={editor.updateSelected}
        onDelete={editor.deleteSelected}
      />

      <div className="toast" aria-live="polite">{editor.message}</div>
    </div>
  );
}
