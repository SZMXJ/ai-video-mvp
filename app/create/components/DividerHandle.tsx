"use client";

import React from "react";

type Props = {
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: () => void;
};

export default function DividerHandle({ onPointerDown, onPointerMove, onPointerUp }: Props) {
  return (
    <div className="hidden lg:block">
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative h-full w-[8px] cursor-col-resize bg-white/5 hover:bg-white/10"
        title="Drag to resize"
      >
        <div className="absolute left-1/2 top-1/2 h-12 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded bg-white/20" />
      </div>
    </div>
  );
}
