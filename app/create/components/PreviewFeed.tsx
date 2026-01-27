"use client";

import React from "react";
import type { HistoryItem } from "../createLib/types";
import PreviewCard from "./PreviewCard";
import PreviewEmptyState from "./PreviewEmptyState";

type Props = {
  feed: HistoryItem[];
  onRefresh: (item: HistoryItem) => void;

  // UI text
  title?: string;
  subtitle?: string;
};

export default function PreviewFeed({
  feed,
  onRefresh,
  title = "Preview",
  subtitle = "Latest results · newest on top (Kling-like feed)",
}: Props) {
  return (
    <section className="flex flex-1 flex-col border-t border-white/10 bg-black/20 lg:border-l lg:border-t-0">
      <div className="border-b border-white/10 px-4 py-3">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-white/50">{subtitle}</div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {!feed.length ? (
          <PreviewEmptyState />
        ) : (
          <div className="grid gap-4">
            {feed.map((it) => (
              <PreviewCard key={it.id} item={it} onRefresh={onRefresh} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
