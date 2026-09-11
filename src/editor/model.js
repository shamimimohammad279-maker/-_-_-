export const DEFAULT_STYLE = {
  fontFamily: "Vazirmatn",
  fontSize: 72,
  fontWeight: 600,
  fontStyle: "normal",
  color: "#e9edf5",
  letterSpacing: 0,
  lineHeight: 1.25,
  textAlign: "center",
  direction: "rtl"
};

export function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

export function makeTextObject(overrides = {}) {
  return {
    id: uid(),
    type: "text",
    text: "خط‌آور",
    x: 250,
    y: 170,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    width: 240,
    height: 100,
    visible: true,
    locked: false,
    style: { ...DEFAULT_STYLE },
    ...overrides,
    style: { ...DEFAULT_STYLE, ...(overrides.style || {}) }
  };
}

export function createInitialProject() {
  const first = makeTextObject({ text: "خط‌آور", x: 310, y: 180 });
  return {
    version: 1,
    scope: "text",
    zoom: 1,
    artboard: { width: 900, height: 600, background: "#101522" },
    objects: [first],
    selectedId: first.id
  };
}

export function cloneProject(project) {
  return structuredClone(project);
}

function rotatePoint(px, py, cx, cy, rad) {
  const dx = px - cx, dy = py - cy;
  return {
    x: cx + dx * Math.cos(rad) - dy * Math.sin(rad),
    y: cy + dx * Math.sin(rad) + dy * Math.cos(rad)
  };
}

export function getObjectBounds(o) {
  const w = Math.max(1, o.width * o.scaleX);
  const h = Math.max(1, o.height * o.scaleY);
  const cx = o.x + w / 2, cy = o.y + h / 2;
  const r = (o.rotation * Math.PI) / 180;
  const pts = [
    rotatePoint(o.x, o.y, cx, cy, r),
    rotatePoint(o.x + w, o.y, cx, cy, r),
    rotatePoint(o.x + w, o.y + h, cx, cy, r),
    rotatePoint(o.x, o.y + h, cx, cy, r)
  ];
  return {
    left: Math.min(...pts.map(p => p.x)),
    top: Math.min(...pts.map(p => p.y)),
    right: Math.max(...pts.map(p => p.x)),
    bottom: Math.max(...pts.map(p => p.y))
  };
}

export function getContentBounds(objects) {
  const visible = objects.filter(o => o.visible);
  if (!visible.length) return null;
  const bounds = visible.map(getObjectBounds);
  return {
    left: Math.min(...bounds.map(b => b.left)),
    top: Math.min(...bounds.map(b => b.top)),
    right: Math.max(...bounds.map(b => b.right)),
    bottom: Math.max(...bounds.map(b => b.bottom)),
    width: Math.max(...bounds.map(b => b.right)) - Math.min(...bounds.map(b => b.left)),
    height: Math.max(...bounds.map(b => b.bottom)) - Math.min(...bounds.map(b => b.top))
  };
}

export function splitWords(text) {
  return text.trim().split(/\s+/u).filter(Boolean);
}
