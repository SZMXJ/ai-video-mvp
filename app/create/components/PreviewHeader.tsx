"use client";

import React from "react";

export default function PreviewHeader() {
  return (
    <div className="border-b border-white/10 px-4 py-3">
      <div className="text-sm font-semibold">Preview</div>
      <div className="text-xs text-white/50">Latest results · newest on top (Kling-like feed)</div>
    </div>
  );
}
