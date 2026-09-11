import { useCallback, useState } from "react";
import { cloneProject } from "./model";
import { exportProjectPNG, exportProjectSVG } from "../export/exportManager";

export function useEditor(project, setProject, history) {
  const [message, setMessage] = useState("");

  const flash = useCallback((msg) => {
    if (!msg) return;
    setMessage(msg);
    window.setTimeout(() => setMessage(""), 1400);
  }, []);

  const commit = useCallback((mutator, msg = "") => {
    const before = cloneProject(project);
    const next = cloneProject(project);
    const changed = mutator(next);
    if (changed === false) return false;
    setProject(next);
    history.commit(before);
    flash(msg);
    return true;
  }, [project, setProject, history, flash]);

  const selectObject = useCallback((id) => {
    setProject(p => p.selectedId === id ? p : ({ ...p, selectedId: id }));
  }, [setProject]);

  const updateSelected = useCallback((patch) => commit(p => {
    const obj = p.objects.find(o => o.id === p.selectedId);
    if (!obj || obj.locked) return false;

    if (patch.style) obj.style = { ...obj.style, ...patch.style };
    Object.keys(patch).filter(k => k !== "style").forEach(k => { obj[k] = patch[k]; });
    return true;
  }), [commit]);

  const addObject = useCallback((obj) => commit(p => {
    p.objects.push(obj);
    p.selectedId = obj.id;
  }, "متن جدید اضافه شد"), [commit]);

  const deleteObject = useCallback((id) => commit(p => {
    const before = p.objects.length;
    p.objects = p.objects.filter(o => o.id !== id);
    if (p.objects.length === before) return false;
    if (p.selectedId === id) p.selectedId = p.objects.at(-1)?.id ?? null;
  }, "آبجکت حذف شد"), [commit]);

  const deleteSelected = useCallback(() => {
    if (project.selectedId) deleteObject(project.selectedId);
  }, [project.selectedId, deleteObject]);

  const moveSelected = useCallback((dx, dy) => commit(p => {
    const o = p.objects.find(x => x.id === p.selectedId);
    if (!o || o.locked) return false;
    if (!Number.isFinite(dx) || !Number.isFinite(dy)) return false;
    o.x += dx; o.y += dy;
  }), [commit]);

  const rotateSelected = useCallback((deg) => {
    if (!Number.isFinite(deg)) return;
    updateSelected({ rotation: deg });
  }, [updateSelected]);

  const scaleSelected = useCallback((value) => {
    if (!Number.isFinite(value)) return;
    updateSelected({ scaleX: value, scaleY: value });
  }, [updateSelected]);

  const setArtboard = useCallback((dims) => commit(p => {
    const width = Number.isFinite(dims.width) ? Math.max(320, Math.round(dims.width)) : p.artboard.width;
    const height = Number.isFinite(dims.height) ? Math.max(240, Math.round(dims.height)) : p.artboard.height;
    p.artboard = { ...p.artboard, ...dims, width, height };
  }, "اندازه آرت‌بورد تغییر کرد"), [commit]);

  const setZoom = useCallback((zoom) => {
    if (!Number.isFinite(zoom)) return;
    setProject(p => ({ ...p, zoom: Math.min(3, Math.max(.25, zoom)) }));
  }, [setProject]);

  const setScope = useCallback((scope) => setProject(p => ({ ...p, scope })), [setProject]);

  const toggleVisibility = useCallback((id) => commit(p => {
    const o = p.objects.find(x => x.id === id);
    if (!o) return false;
    o.visible = !o.visible;
    if (!o.visible && p.selectedId === id) p.selectedId = null;
  }), [commit]);

  const toggleLock = useCallback((id) => commit(p => {
    const o = p.objects.find(x => x.id === id);
    if (!o) return false;
    o.locked = !o.locked;
  }), [commit]);

  const moveLayer = useCallback((id, direction) => commit(p => {
    const i = p.objects.findIndex(o => o.id === id);
    if (i < 0) return false;
    const j = direction === "up" ? i + 1 : i - 1;
    if (j < 0 || j >= p.objects.length) return false;
    [p.objects[i], p.objects[j]] = [p.objects[j], p.objects[i]];
  }), [commit]);

  const undo = useCallback(() => {
    const previous = history.undo(project);
    if (previous) {
      setProject(previous);
      flash("برگشت انجام شد");
    }
  }, [history, project, setProject, flash]);

  const redo = useCallback(() => {
    const next = history.redo(project);
    if (next) {
      setProject(next);
      flash("انجام دوباره انجام شد");
    }
  }, [history, project, setProject, flash]);

  const exportPNG = useCallback(() => exportProjectPNG(project), [project]);
  const exportSVG = useCallback(() => exportProjectSVG(project), [project]);

  return {
    message, selectObject, updateSelected, addObject, deleteObject, deleteSelected,
    moveSelected, rotateSelected, scaleSelected, setArtboard, setZoom, setScope,
    toggleVisibility, toggleLock, moveLayer, undo, redo, exportPNG, exportSVG
  };
}
