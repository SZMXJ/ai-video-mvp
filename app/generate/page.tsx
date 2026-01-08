"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";


export default function GeneratePage() {
  const params = useSearchParams();
  const prompt = params.get("prompt");
  const style = params.get("style");
  const { user, setUser } = useUser();

  const [status, setStatus] = useState<"loading" | "done">("loading");

  useEffect(() => {
    if (!user.loggedIn || user.credits <= 0) return;
  
    const timer = setTimeout(() => {
      setUser({
        ...user,
        credits: user.credits - 1,
        history: [
          {
            prompt: prompt || "",
            style: style || "",
            time: new Date().toLocaleString(),
          },
          ...user.history,
        ],
      });
      setStatus("done");
    }, 3000);
  
    return () => clearTimeout(timer);
  }, []);
  

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      {status === "loading" ? (
        <>
          <h1 className="text-2xl font-semibold mb-4">
            Generating your video…
          </h1>
          <p className="text-gray-400 mb-6 text-center max-w-md">
            Prompt: {prompt} <br />
            Style: {style}
          </p>
          <div className="w-64 h-2 bg-zinc-800 rounded overflow-hidden">
            <div className="h-full w-1/2 bg-white animate-pulse" />
          </div>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-semibold mb-6">
            Your AI video is ready 🎉
          </h1>
          <div className="aspect-video w-full max-w-3xl bg-zinc-800 rounded-lg flex items-center justify-center text-gray-400 mb-6">
            Video Preview
          </div>
          <button className="bg-white text-black px-6 py-3 rounded font-semibold">
            Download Video
          </button>
        </>
      )}
    </main>
  );
}
