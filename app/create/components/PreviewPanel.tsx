"use client";

import React from "react";
import type { HistoryItem } from "../createLib/types";
import StatusPill from "./StatusPill";
import PreviewHeader from "./PreviewHeader";

export default function PreviewPanel(props: {
  mobileView: "create" | "preview";
  feed: HistoryItem[];
  onRefresh: (it: HistoryItem) => void;
}) {
  const { mobileView, feed, onRefresh } = props;

  return (
    <section
      className={[
        "flex flex-1 flex-col border-t border-white/10 bg-black/20 lg:border-l lg:border-t-0",
        "lg:block",
        mobileView === "preview" ? "block" : "hidden",
      ].join(" ")}
    >
      <PreviewHeader />

      <div className="flex-1 overflow-auto p-4">
        {!feed.length ? (
          <div className="flex h-full items-center justify-center text-white/40">
            No generation yet. Create something on the left →
          </div>
        ) : (
          <div className="grid gap-4">
            {feed.map((it) => {
              const isVideo = it.outputType === "video";
              const isImage = it.outputType === "image";
              const dt = new Date(it.createdAt);

              return (
                <div key={it.id} className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
                  <div className="flex flex-col gap-2 border-b border-white/10 bg-black/30 px-4 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs text-white/50">
                        {dt.toLocaleString()} · <span className="text-white/70">{it.mode}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusPill s={it.status} />
                        {typeof it.chargedCredits === "number" && (
                          <span className="text-[11px] text-white/50">Charged: {it.chargedCredits}</span>
                        )}
                      </div>
                    </div>

                    <div className="text-sm font-medium">{it.modelId}</div>
                    {it.prompt ? <div className="text-xs text-white/60 line-clamp-3">{it.prompt}</div> : null}
                    {it.error ? <div className="text-xs text-rose-200/90">Error: {it.error}</div> : null}
                  </div>

                  <div className="p-3 sm:p-4">
                    {it.outputUrl ? (
                      isVideo ? (
                        <video
                          src={it.outputUrl}
                          controls
                          playsInline
                          preload="metadata"
                          className="w-full rounded-xl border border-white/10 bg-black"
                        />
                      ) : isImage ? (
                        <img src={it.outputUrl} className="w-full rounded-xl border border-white/10" alt="output" />
                      ) : (
                        <div className="flex h-[320px] items-center justify-center text-white/40">
                          Output ready, but type unknown.
                        </div>
                      )
                    ) : (
                      <div className="flex h-[320px] items-center justify-center text-white/40">Waiting for output…</div>
                    )}

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs text-white/40">
                        {it.requestId ? (
                          <span>
                            request_id: <span className="text-white/60">{it.requestId}</span>
                          </span>
                        ) : (
                          <span>request_id: —</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {it.requestId && !it.outputUrl && it.status !== "FAILED" ? (
                          <button
                            onClick={() => onRefresh(it)}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10"
                          >
                            Refresh result
                          </button>
                        ) : null}

                        {it.outputUrl ? (
                          <a
                            href={it.outputUrl}
                            target="_blank"
                            className="rounded-full bg-cyan-400 px-3 py-1.5 text-xs font-semibold text-black hover:bg-cyan-300"
                            rel="noreferrer"
                          >
                            Open →
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
