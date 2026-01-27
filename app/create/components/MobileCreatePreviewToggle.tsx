"use client";

import React from "react";

export default function MobileCreatePreviewToggle(props: {
  value: "create" | "preview";
  onChange: (v: "create" | "preview") => void;
}) {
  const { value, onChange } = props;

  return (
    <div className="flex w-full items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/5 p-1 lg:hidden">
      <button
        onClick={() => onChange("create")}
        className={[
          "flex-1 rounded-2xl px-3 py-2 text-sm font-semibold transition",
          value === "create" ? "bg-cyan-400 text-black" : "text-white/80 hover:bg-white/10",
        ].join(" ")}
      >
        Create
      </button>
      <button
        onClick={() => onChange("preview")}
        className={[
          "flex-1 rounded-2xl px-3 py-2 text-sm font-semibold transition",
          value === "preview" ? "bg-cyan-400 text-black" : "text-white/80 hover:bg-white/10",
        ].join(" ")}
      >
        Preview
      </button>
    </div>
  );
}
