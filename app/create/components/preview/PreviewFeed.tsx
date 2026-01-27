"use client";

import React, { useMemo } from "react";
import type { HistoryItem } from "../../createLib/types";
import PreviewEmpty from "../preview/PreviewEmpty";
import PreviewCard from "../preview/PreviewCard";


type Props = {
  feedTitle?: string;
  feedSub?: string;

  items: HistoryItem[];

  onRefreshOne: (it: HistoryItem) => void;
};

export default function PreviewFeed({
  feedTitle = "Preview",
  feedSub = "Latest results · newest on top (Kling-like feed)",
  items,
  onRefreshOne,
}: Props) {
  const feed = useMemo(() => {
    return [...items].sort((a, b) => b.createdAt - a.createdAt);
  }, [items]);

  return (
    <section className="flex flex-1 flex-col border-t border-white/10 bg-black/20 lg:border-l lg:border-t-0">
      <div className="border-b border-white/10 px-4 py-3">
        <div className="text-sm font-semibold">{feedTitle}</div>
        <div className="text-xs text-white/50">{feedSub}</div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {!feed.length ? (
          <PreviewEmpty />
        ) : (
          <div className="grid gap-4">
            {feed.map((it) => (
              <PreviewCard key={it.id} it={it} onRefresh={() => onRefreshOne(it)} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
