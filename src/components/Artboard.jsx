import React, { useRef } from "react";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function Artboard({ project, selected, onSelect, onMove, onRotate, onScale }) {
  const interaction = useRef(null);

  const endInteraction = (e) => {
    if (interaction.current?.pointerId === e.pointerId) interaction.current = null;
  };

  const handleObjectPointerDown = (e, o) => {
    e.stopPropagation();
    onSelect(o.id);
    if (o.locked || e.button !== 0) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    interaction.current = {
      type: "move",
      pointerId: e.pointerId,
      lastX: e.clientX,
      lastY: e.clientY
    };
  };

  const handlePointerMove = (e) => {
    const state = interaction.current;
    if (!state || state.pointerId !== e.pointerId || !selected || selected.locked) return;

    if (state.type === "move") {
      const dx = (e.clientX - state.lastX) / project.zoom;
      const dy = (e.clientY - state.lastY) / project.zoom;
      if (dx || dy) onMove(dx, dy);
      state.lastX = e.clientX;
      state.lastY = e.clientY;
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + (selected.width * selected.scaleX * project.zoom) / 2;
    const cy = rect.top + (selected.height * selected.scaleY * project.zoom) / 2;

    if (state.type === "rotate") {
      const angle = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI + 90;
      onRotate(Math.round(angle));
    } else if (state.type === "scale") {
      const distance = Math.hypot(e.clientX - cx, e.clientY - cy);
      const value = clamp(state.startScale * (distance / Math.max(1, state.startDistance)), .1, 10);
      onScale(Number(value.toFixed(2)));
    }
  };

  const startRotate = (e) => {
    e.stopPropagation();
    if (!selected || selected.locked) return;
    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    const cx = rect.left + (selected.width * selected.scaleX * project.zoom) / 2;
    const cy = rect.top + (selected.height * selected.scaleY * project.zoom) / 2;
    interaction.current = { type: "rotate", pointerId: e.pointerId, startRotation: selected.rotation, cx, cy };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const startScale = (e) => {
    e.stopPropagation();
    if (!selected || selected.locked) return;
    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    interaction.current = {
      type: "scale",
      pointerId: e.pointerId,
      startScale: selected.scaleX,
      startDistance: Math.hypot(e.clientX - cx, e.clientY - cy)
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  return (
    <div className="artboard-wrap">
      <div className="artboard-shadow">
        <div
          className="artboard"
          style={{
            width: project.artboard.width * project.zoom,
            height: project.artboard.height * project.zoom,
            background: project.artboard.background
          }}
          onPointerDown={() => onSelect(null)}
          onPointerMove={handlePointerMove}
          onPointerUp={endInteraction}
          onPointerCancel={endInteraction}
        >
          {project.objects.map(o => {
            if (!o.visible) return null;
            const isSelected = selected?.id === o.id;
            return (
              <div
                key={o.id}
                className={`text-object ${isSelected ? "selected-object" : ""} ${o.locked ? "locked-object" : ""}`}
                style={{
                  left: o.x * project.zoom,
                  top: o.y * project.zoom,
                  width: o.width * o.scaleX * project.zoom,
                  height: o.height * o.scaleY * project.zoom,
                  transform: `rotate(${o.rotation}deg)`,
                  transformOrigin: "center",
                  color: o.style.color,
                  fontFamily: o.style.fontFamily,
                  fontSize: o.style.fontSize * project.zoom,
                  fontWeight: o.style.fontWeight,
                  fontStyle: o.style.fontStyle,
                  letterSpacing: o.style.letterSpacing * project.zoom,
                  lineHeight: o.style.lineHeight,
                  textAlign: o.style.textAlign,
                  direction: o.style.direction
                }}
                onPointerDown={e => handleObjectPointerDown(e, o)}
              >
                <span>{o.text}</span>
                {isSelected && !o.locked && (
                  <>
                    <span className="handle tl" onPointerDown={startScale} />
                    <span className="handle tr" onPointerDown={startScale} />
                    <span className="handle bl" onPointerDown={startScale} />
                    <span className="handle br" onPointerDown={startScale} />
                    <span className="rotate-handle" onPointerDown={startRotate} />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
