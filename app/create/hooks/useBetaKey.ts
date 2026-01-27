"use client";

import { useEffect, useState } from "react";

export function useBetaKey() {
  const [betaKey, setBetaKey] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("beta_key") || "";
    setBetaKey(saved);
  }, []);

  function saveBetaKey(v: string) {
    const k = v.trim();
    setBetaKey(k);
    localStorage.setItem("beta_key", k);
  }

  async function apiFetch(url: string, init?: RequestInit) {
    if (!betaKey) throw new Error("Please enter your Beta Key first.");
    const headers = new Headers(init?.headers || {});

    // 只有非 FormData 且非 GET 才补 content-type
    if (!(init?.body instanceof FormData) && init?.method && init.method !== "GET") {
      headers.set("Content-Type", headers.get("Content-Type") || "application/json");
    }
    headers.set("x-beta-key", betaKey);

    return fetch(url, { ...init, headers });
  }

  return { betaKey, saveBetaKey, apiFetch };
}
