import React from "react";

export default function LayersPanel({ objects, selectedId, onSelect, onDelete, onToggleVisibility, onToggleLock, onMoveLayer }) {
  return (
    <div className="panel-content">
      <div className="panel-title">لایه‌ها</div>
      <div className="layer-list">
        {[...objects].reverse().map(o => (
          <div key={o.id} className={`layer ${selectedId === o.id ? "selected" : ""}`} onClick={() => onSelect(o.id)}>
            <div className="layer-main">
              <span className="layer-type">T</span>
              <span className="layer-name">{o.text || "بدون متن"}</span>
            </div>
            <div className="layer-actions" onClick={e => e.stopPropagation()}>
              <button onClick={() => onToggleVisibility(o.id)}>{o.visible ? "◉" : "○"}</button>
              <button onClick={() => onToggleLock(o.id)}>{o.locked ? "🔒" : "⌕"}</button>
              <button onClick={() => onMoveLayer(o.id, "up")}>↑</button>
              <button onClick={() => onMoveLayer(o.id, "down")}>↓</button>
              <button onClick={() => onDelete(o.id)}>×</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
