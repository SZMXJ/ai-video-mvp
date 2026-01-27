"use client";

export function useApiFetch(betaKey: string) {
  async function apiFetch(url: string, init?: RequestInit) {
    if (!betaKey) throw new Error("Please enter your Beta Key first.");

    const headers = new Headers(init?.headers || {});

    // 只有非 FormData 且非 GET 的请求才自动补 application/json
    const method = (init?.method || "GET").toUpperCase();
    const isFormData = init?.body instanceof FormData;

    if (!isFormData && method !== "GET") {
      headers.set("Content-Type", headers.get("Content-Type") || "application/json");
    }

    headers.set("x-beta-key", betaKey);

    return fetch(url, { ...init, headers });
  }

  return { apiFetch };
}
