"use client";

import { useRef, useState } from "react";
import { clamp } from "../createLib/utils";

export function useResizableSplit(shellRef: React.RefObject<HTMLDivElement>) {
  const draggingRef = useRef(false);
  const [splitPct, setSplitPct] = useState(42); // 左侧编辑占比（越小预览越大）

  function setSplitFromClientX(clientX: number) {
    const shell = shellRef.current;
    if (!shell) return;

    const rect = shell.getBoundingClientRect();

    const sidebarPx = 72;
    const dividerPx = 8;

    const x = clientX - rect.left;

    const minEditorPx = 420;
    const minRightPx = 560;
    const minX = sidebarPx + minEditorPx;
    const maxX = rect.width - minRightPx - dividerPx;

    const clampedX = clamp(x, minX, maxX);
    const pct = (clampedX / rect.width) * 100;
    setSplitPct(clamp(pct, 32, 68));
  }

  const dividerHandlers = {
    onPointerDown: (e: React.PointerEvent) => {
      draggingRef.current = true;
      (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (!draggingRef.current) return;
      setSplitFromClientX(e.clientX);
    },
    onPointerUp: () => {
      draggingRef.current = false;
    },
    onPointerCancel: () => {
      draggingRef.current = false;
    },
  };

  return { splitPct, setSplitPct, dividerHandlers };
}
