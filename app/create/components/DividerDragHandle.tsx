"use client";

import React from "react";

export default function DividerDragHandle(props: {
  handlers: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerUp: () => void;
    onPointerCancel?: () => void;
  };
}) {
  const { handlers } = props;

  return (
    <div className="hidden lg:block">
      <div
        onPointerDown={handlers.onPointerDown}
        onPointerMove={handlers.onPointerMove}
        onPointerUp={handlers.onPointerUp}
        onPointerCancel={handlers.onPointerCancel ?? handlers.onPointerUp}
        className="relative h-full w-[8px] cursor-col-resize bg-white/5 hover:bg-white/10"
        title="Drag to resize"
      >
        <div className="absolute left-1/2 top-1/2 h-12 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded bg-white/20" />
      </div>
    </div>
  );
}
