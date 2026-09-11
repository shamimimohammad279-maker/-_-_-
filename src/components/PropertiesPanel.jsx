import React from "react";

const Field = ({ label, value, onChange, step = 1, min, max }) => (
  <label className="field">
    <span>{label}</span>
    <input type="number" value={Number.isFinite(value) ? value : 0}
      step={step} min={min} max={max}
      onChange={e => { const n = e.target.value === "" ? 0 : Number(e.target.value); if (Number.isFinite(n)) onChange(n); }} />
  </label>
);

export default function PropertiesPanel({ object, scope, onScopeChange, onChange, onDelete }) {
  if (!object) return <div className="empty-panel">آبجکتی انتخاب نشده</div>;

  return (
    <div className="panel-content">
      <div className="panel-title">ویژگی‌ها</div>
      <div className="mini-tabs">
        {["text","word","character"].map(s =>
          <button key={s} className={scope === s ? "active" : ""} onClick={() => onScopeChange(s)}>
            {s === "text" ? "متن" : s === "word" ? "کلمه" : "کاراکتر"}
          </button>
        )}
      </div>

      <label className="field">
        <span>متن</span>
        <textarea dir="rtl" value={object.text} onChange={e => onChange({ text: e.target.value })} />
      </label>

      <div className="field-grid">
        <Field label="X" value={object.x} onChange={v => onChange({x:v})} />
        <Field label="Y" value={object.y} onChange={v => onChange({y:v})} />
        <Field label="عرض" value={object.width} onChange={v => onChange({width:Math.max(20,v)})} />
        <Field label="ارتفاع" value={object.height} onChange={v => onChange({height:Math.max(20,v)})} />
        <Field label="چرخش" value={object.rotation} onChange={v => onChange({rotation:v})} />
        <Field label="Scale" value={object.scaleX} step={0.05} min={0.1} max={10} onChange={v => onChange({scaleX:v,scaleY:v})} />
        <Field label="اندازه فونت" value={object.style.fontSize} onChange={v => onChange({style:{fontSize:Math.max(6,v)}})} />
        <Field label="فاصله حروف" value={object.style.letterSpacing} step={0.5} onChange={v => onChange({style:{letterSpacing:v}})} />
        <Field label="ارتفاع خط" value={object.style.lineHeight} step={0.05} min={0.5} max={3} onChange={v => onChange({style:{lineHeight:v}})} />
        <Field label="وزن" value={object.style.fontWeight} step={100} min={100} max={900} onChange={v => onChange({style:{fontWeight:v}})} />
      </div>

      <div className="style-row">
        <label>رنگ <input type="color" value={object.style.color} onChange={e => onChange({style:{color:e.target.value}})} /></label>
        <label>جهت
          <select value={object.style.direction} onChange={e => onChange({style:{direction:e.target.value}})}>
            <option value="rtl">RTL</option>
            <option value="ltr">LTR</option>
          </select>
        </label>
      </div>

      <div className="style-row">
        <label>وزن
          <select value={object.style.fontWeight} onChange={e => onChange({style:{fontWeight:Number(e.target.value)}})}>
            <option value="400">Regular</option><option value="500">Medium</option>
            <option value="600">SemiBold</option><option value="700">Bold</option><option value="800">ExtraBold</option>
          </select>
        </label>
        <label>استایل
          <select value={object.style.fontStyle} onChange={e => onChange({style:{fontStyle:e.target.value}})}>
            <option value="normal">Normal</option><option value="italic">Italic</option>
          </select>
        </label>
      </div>

      <button className="delete-button" onClick={onDelete}>حذف آبجکت</button>
    </div>
  );
}
