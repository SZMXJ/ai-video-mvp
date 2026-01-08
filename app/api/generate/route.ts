import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  // 假装在生成视频（延迟 2 秒）
  await new Promise((r) => setTimeout(r, 2000));

  return NextResponse.json({
    success: true,
    message: "视频生成成功（模拟）",
    data: {
      videoId: "demo-video-001",
      previewUrl: "https://via.placeholder.com/640x360.png?text=AI+Video",
      script: body.text,
    },
  });
}
