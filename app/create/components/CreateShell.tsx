"use client";

import React from "react";
import DividerDragHandle from "./DividerDragHandle";

export default function CreateShell(props: {
  shellRef: React.RefObject<HTMLDivElement>;
  splitPct: number;
  dividerHandlers: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerUp: () => void;
    onPointerCancel?: () => void;
  };
  children: React.ReactNode;
}) {
  const { shellRef, splitPct, dividerHandlers, children } = props;

  return (
    <div
      ref={shellRef}
      id="editor-shell"
      className={[
        "w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02]",
        "lg:grid",
      ].join(" ")}
      style={{
        gridTemplateColumns: `72px minmax(420px, ${splitPct}%) 8px minmax(520px, ${100 - splitPct}%)`,
      }}
    >
      {children}
      <DividerDragHandle handlers={dividerHandlers} />
    </div>
  );
}
