// /lib/gate.ts
import { NextResponse } from "next/server";

export function requireBetaKey(req: Request) {
  const betaKey = req.headers.get("x-beta-key")?.trim();
  if (!betaKey) {
    return { ok: false as const, res: NextResponse.json({ error: "Missing x-beta-key" }, { status: 401 }) };
  }
  return { ok: true as const, betaKey };
}
