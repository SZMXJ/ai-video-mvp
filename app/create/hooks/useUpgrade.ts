"use client";

export function useUpgrade(apiFetch: (url: string, init?: RequestInit) => Promise<Response>) {
  async function onUpgrade(pack: "10" | "30" | "100") {
    const res = await apiFetch("/api/billing/create-checkout", {
      method: "POST",
      body: JSON.stringify({ pack }),
    });
    const j = await res.json();
    if (!res.ok) throw new Error(j?.error ?? "Checkout error");
    if (j?.url) window.location.href = j.url;
  }

  return { onUpgrade };
}
