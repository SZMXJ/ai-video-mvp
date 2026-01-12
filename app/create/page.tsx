"use client";

import { useState, useRef, useEffect } from "react";

/* ================= CONFIG ================= */

const styles = ["Cinematic", "Anime", "Realistic", "Sci-Fi", "Cyberpunk", "Fantasy"];
const ratios = ["Auto", "1:1", "4:3", "16:9", "21:9", "5:4", "3:2", "2:3", "9:16", "3:4", "4:5"];
const durations = ["4s", "8s", "12s"];

const PROMPT_ASSIST: Record<string, string> = {
  Cinematic:
    "cinematic lighting, dramatic atmosphere, shallow depth of field, smooth camera movement, 35mm lens, film grain, ultra high quality",
  Anime:
    "anime style, vibrant colors, detailed background, dynamic motion, expressive characters, high quality animation",
  Realistic:
    "photorealistic, natural lighting, realistic textures, depth of field, ultra high resolution, real world camera",
  "Sci-Fi":
    "futuristic sci-fi style, neon lighting, advanced technology, cinematic composition, epic scale, ultra detailed",
  Cyberpunk:
    "cyberpunk style, neon lights, dark atmosphere, rain, futuristic city, cinematic lighting, ultra detailed",
  Fantasy:
    "fantasy style, magical atmosphere, epic lighting, cinematic composition, ultra detailed, high quality",
};

/* ===== 多语言 Prompt Assist ===== */

const PROMPT_ASSIST_I18N: Record<string, Record<string, string>> = {
  zh: {
    Cinematic: "电影级灯光，戏剧化氛围，浅景深，平滑镜头运动，高质量画面",
    Anime: "动漫风格，色彩鲜艳，动态画面，高质量动画",
  },
};

/* ================= UTILS ================= */

function detectLanguage(text: string) {
  if (/[\u4e00-\u9fa5]/.test(text)) return "zh";
  if (/[\u3040-\u30ff]/.test(text)) return "jp";
  if (/[\uac00-\ud7af]/.test(text)) return "kr";
  return "en";
}

/* ================= TYPES ================= */

type GenerationJob = {
  id: string;
  prompt: string;
  status: "generating" | "done";
  progress: number;
};

/* ================= PAGE ================= */

export default function CreatePage() {
  const [mode, setMode] = useState<"text" | "image">("text");

  /* ===== 独立 Prompt ===== */
  const [textPrompt, setTextPrompt] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");

  const prompt = mode === "text" ? textPrompt : imagePrompt;
  const setPrompt = mode === "text" ? setTextPrompt : setImagePrompt;

  const [style, setStyle] = useState("Cinematic");
  const [ratio, setRatio] = useState("16:9");
  const [duration, setDuration] = useState("4s");

  const [startImage, setStartImage] = useState<File | null>(null);
  const [endImage, setEndImage] = useState<File | null>(null);

  /* ===== Credits ===== */
  const [userCredits, setUserCredits] = useState(66);
  const [showUpgrade, setShowUpgrade] = useState(false);

  /* ===== Global Status ===== */
  const [status, setStatus] = useState<"idle" | "generating" | "done">("idle");
  const [progress, setProgress] = useState(0);

  /* ===== Jobs Queue ===== */
  const [jobs, setJobs] = useState<GenerationJob[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const assistCountRef = useRef(0);

  /* 🧭 Newbie Guide */
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("create_guide_seen")) {
      setShowGuide(true);
      localStorage.setItem("create_guide_seen", "1");
    }
  }, []);

  const creditsCost =
    duration === "4s" ? 8 : duration === "8s" ? 16 : 24;

  /* ================= Generate ================= */

  const generate = () => {
    if (!prompt.trim()) return;

    if (userCredits < creditsCost) {
      setShowUpgrade(true);
      return;
    }

    setUserCredits((c) => c - creditsCost);

    const id = Date.now().toString();

    setJobs((prev) => [
      {
        id,
        prompt,
        status: "generating",
        progress: 0,
      },
      ...prev,
    ]);

    setPrompt("");
    setStatus("generating");
    setProgress(0);
  };

  /* ================= Prompt Assist ================= */

  const applyPromptAssist = () => {
    assistCountRef.current += 1;

    const lang = detectLanguage(prompt);
    const suffix =
      PROMPT_ASSIST_I18N[lang]?.[style] || PROMPT_ASSIST[style];

    if (!suffix) return;

    setPrompt((p) => {
      const cleaned = p.replace(new RegExp(suffix, "gi"), "").trim();
      return `${cleaned}${cleaned ? ", " : ""}${suffix}`;
    });
  };

  /* ================= Fake Progress ================= */

  useEffect(() => {
    if (status !== "generating") return;

    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setStatus("done");

          setJobs((prev) =>
            prev.map((job, i) =>
              i === 0 ? { ...job, status: "done", progress: 100 } : job
            )
          );

          return 100;
        }

        setJobs((prev) =>
          prev.map((job, i) =>
            i === 0 ? { ...job, progress: p + 5 } : job
          )
        );

        return p + 5;
      });
    }, 300);

    return () => clearInterval(timer);
  }, [status]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-black text-white relative">

      {/* 🧭 Newbie Guide Banner */}
      {showGuide && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm">
          ✨ Write a prompt → Click Prompt Assist → Generate your first video
          <button
            onClick={() => setShowGuide(false)}
            className="ml-3 text-cyan-400"
          >
            Got it
          </button>
        </div>
      )}

      {/* ================= LEFT ================= */}
      <aside className="w-full md:w-56 border-b md:border-b-0 md:border-r border-white/10 p-4 flex md:flex-col">
        <div className="text-sm text-white/50 mb-3">Create Mode</div>
        <NavButton active={mode === "text"} onClick={() => setMode("text")} label="Text to Video" />
        <NavButton active={mode === "image"} onClick={() => setMode("image")} label="Image to Video" />
        <div className="mt-auto pt-4 border-t border-white/10 hidden md:block">
          <div className="text-xs text-white/50">Credits</div>
          <div className="text-lg font-semibold">{userCredits}</div>
        </div>
      </aside>

      {/* ================= CENTER ================= */}
      <main className="w-full md:w-[36%] md:min-w-[440px] p-6 overflow-y-auto">
        <h1 className="text-xl font-semibold mb-4">
          {mode === "text" ? "Text to Video" : "Image to Video"}
        </h1>

        {mode === "image" && (
          <div className="mb-6 grid grid-cols-2 gap-4">
            <FrameBox title="Start Frame" file={startImage} onChange={setStartImage} />
            <FrameBox title="End Frame" file={endImage} onChange={setEndImage} />
          </div>
        )}

        <div className="relative mb-2">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-40 rounded-2xl bg-zinc-900 border border-white/10 p-4 pr-40"
            placeholder="Describe your video..."
          />

          <button
            onClick={applyPromptAssist}
            className="absolute right-3 top-3 text-xs rounded-lg px-3 py-1 bg-white/10 hover:bg-white/20"
          >
            ✨ Prompt Assist
          </button>

          <div className="absolute right-3 bottom-3 flex items-center gap-3">
            <div className="text-xs text-white/70">⚡ {creditsCost} credits</div>
            <button
              onClick={generate}
              className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-medium text-black"
            >
              Generate
            </button>
          </div>
        </div>

        {/* 🧭 Try Example */}
        <button
          onClick={() =>
            setPrompt(
              detectLanguage(prompt) === "zh"
                ? "生成一段电影级未来城市视频，夜晚，霓虹灯，航拍镜头"
                : "A cinematic futuristic city at night with neon lights, aerial camera"
            )
          }
          className="text-xs text-cyan-400 mb-6"
        >
          ✨ Try an example
        </button>

        <SelectPopover title="Style" value={style} options={styles} onChange={setStyle} />
        <SelectPopover title="Aspect Ratio" value={ratio} options={ratios} onChange={setRatio} />
        <SelectPopover title="Duration" value={duration} options={durations} onChange={setDuration} />
      </main>

      {/* ================= PREVIEW ================= */}
      <section className="w-full md:flex-1 p-6 border-t md:border-t-0 md:border-l border-white/10 overflow-y-auto">
        {jobs.length === 0 ? (
          <div className="h-full rounded-3xl bg-zinc-900 flex items-center justify-center text-white/40">
            Video Preview
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="mb-4 rounded-2xl bg-zinc-900 border border-white/10 p-4">
              <div className="text-xs text-white/40 mb-1">Prompt</div>
              <div className="text-sm mb-3 line-clamp-2">{job.prompt}</div>

              {job.status === "generating" ? (
                <>
                  <div className="text-xs text-white/60 mb-1">
                    Generating… {job.progress}%
                  </div>
                </>
              ) : (
                <div className="text-sm text-white/60">
                  ✅ Video generated · You can create another one
                </div>
              )}
            </div>
          ))
        )}
      </section>

      {/* ================= UPGRADE MODAL ================= */}
      {showUpgrade && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="w-[360px] rounded-2xl bg-zinc-900 border border-white/10 p-6">
            <h2 className="text-lg font-semibold mb-2">Not enough credits</h2>
            <p className="text-sm text-white/60 mb-4">
              You need {creditsCost} credits, but only have {userCredits}.
            </p>
            <button className="w-full mb-3 rounded-xl bg-cyan-400 py-2 text-black font-medium">
              Upgrade Plan
            </button>
            <button
              onClick={() => setShowUpgrade(false)}
              className="w-full text-sm text-white/50 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= COMPONENTS ================= */

function NavButton({ active, label, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`mb-2 rounded-xl px-4 py-3 ${
        active ? "bg-cyan-400 text-black" : "bg-white/5 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}

function FrameBox({ title, file, onChange }: any) {
  return (
    <label className="rounded-2xl border border-white/10 bg-zinc-900 p-4 flex flex-col items-center cursor-pointer">
      <div className="text-sm mb-2">{title}</div>
      {file ? file.name : "Click to upload"}
      <input type="file" hidden onChange={(e) => onChange(e.target.files?.[0] || null)} />
    </label>
  );
}

function SelectPopover({ title, value, options, onChange }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-5 relative">
      <div className="text-sm text-white/60 mb-2">{title}</div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 flex justify-between"
      >
        {value}
        <span>▾</span>
      </button>

      {open && (
        <div className="absolute w-full mt-2 bg-zinc-900 border border-white/10 rounded-xl z-50">
          {options.map((o: string) => (
            <button
              key={o}
              onClick={() => {
                onChange(o);
                setOpen(false);
              }}
              className={`w-full px-4 py-2 text-left hover:bg-white/10 ${
                o === value ? "text-cyan-400" : ""
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
