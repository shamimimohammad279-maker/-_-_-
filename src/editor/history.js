import { useMemo, useRef, useState } from "react";

export function useEditorHistory() {
  const stack = useRef([]);
  const future = useRef([]);
  const [, force] = useState(0);

  const notify = () => force(v => v + 1);

  return useMemo(() => ({
    get canUndo() { return stack.current.length > 0; },
    get canRedo() { return future.current.length > 0; },
    commit(previous) {
      stack.current.push(structuredClone(previous));
      if (stack.current.length > 60) stack.current.shift();
      future.current = [];
      notify();
    },
    undo(current) {
      const previous = stack.current.pop();
      if (!previous) return null;
      future.current.push(structuredClone(current));
      notify();
      return structuredClone(previous);
    },
    redo(current) {
      const next = future.current.pop();
      if (!next) return null;
      stack.current.push(structuredClone(current));
      notify();
      return structuredClone(next);
    },
    reset(current) {
      stack.current = [];
      future.current = [];
      notify();
    }
  }), []);
}
