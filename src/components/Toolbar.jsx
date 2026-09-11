import React from "react";

export default function Toolbar({ canUndo, canRedo, onUndo, onRedo, onAddText, onFit, onExport, onExportSvg, theme, setTheme, onReset }) {
  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <button className="primary" onClick={onAddText}>＋ متن</button>
        <button title="Fit to content" onClick={onFit}>↗ فیت</button>
      </div>
      <div className="toolbar-group">
        <button disabled={!canUndo} onClick={onUndo}>↶</button>
        <button disabled={!canRedo} onClick={onRedo}>↷</button>
      </div>
      <div className="toolbar-group">
        <button onClick={onExport}>PNG</button>
        <button onClick={onExportSvg}>SVG</button>
      </div>
      <select value={theme} onChange={e => setTheme(e.target.value)} aria-label="Theme">
        <option value="system">سیستم</option>
        <option value="light">روشن</option>
        <option value="dark">تیره</option>
      </select>
      <button className="danger-soft" onClick={onReset}>بازنشانی</button>
    </div>
  );
}
