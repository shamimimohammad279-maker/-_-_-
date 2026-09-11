import { getObjectBounds } from "../editor/model";

function esc(s) {
  return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
}

export function projectToSVG(project) {
  const { width, height, background } = project.artboard;
  const nodes = project.objects.filter(o => o.visible).map(o => {
    const s = o.style;
    const transform = `translate(${o.x} ${o.y}) rotate(${o.rotation} ${o.width*o.scaleX/2} ${o.height*o.scaleY/2}) scale(${o.scaleX} ${o.scaleY})`;
    return `<text x="0" y="${s.fontSize}" width="${o.width}" transform="${transform}" fill="${esc(s.color)}" font-family="${esc(s.fontFamily)}" font-size="${s.fontSize}" font-weight="${s.fontWeight}" font-style="${s.fontStyle}" letter-spacing="${s.letterSpacing}px" direction="${s.direction}" text-anchor="${s.textAlign === "center" ? "middle" : s.textAlign === "right" ? "end" : "start"}">${esc(o.text)}</text>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="${background}"/>${nodes}</svg>`;
}

function download(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportProjectSVG(project) {
  download(new Blob([projectToSVG(project)], {type:"image/svg+xml;charset=utf-8"}), "khatavar.svg");
}

export async function exportProjectPNG(project) {
  const svg = projectToSVG(project);
  const blob = new Blob([svg], {type:"image/svg+xml;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = project.artboard.width;
    canvas.height = project.artboard.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    canvas.toBlob(png => download(png, "khatavar.png"), "image/png");
    URL.revokeObjectURL(url);
  };
  img.src = url;
}
