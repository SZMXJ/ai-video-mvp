// lib/falProxy.ts

type Json = Record<string, any>;

export function ensureFalKey() {
  const key = process.env.FAL_KEY || process.env.FAL_API_KEY;
  if (!key) {
    throw new Error("Missing FAL_KEY (or FAL_API_KEY) in env");
  }
  return key;
}

/**
 * 直接调用 fal.run 的模型接口（你现在就在用这个）
 * modelPath 示例：
 *   "fal-ai/kling-video/v1"  或你自己项目里保存的任意 fal 模型路径
 */
export async function falRun(modelPath: string, input: any) {
  const key = ensureFalKey();

  const res = await fetch(`https://fal.run/${modelPath}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${key}`,
    },
    body: JSON.stringify(input),
  });

  const data = (await res.json().catch(() => ({}))) as Json;
  if (!res.ok) {
    throw new Error(data?.message || data?.error || "fal request failed");
  }
  return data;
}

/**
 * 查询队列任务状态
 * requestId：fal 返回的 request_id（有的模型字段叫 requestId / request_id）
 */
export async function falQueueStatus(requestId: string) {
  const key = ensureFalKey();

  const res = await fetch(`https://fal.run/queue/requests/${requestId}/status`, {
    method: "GET",
    headers: {
      Authorization: `Key ${key}`,
    },
  });

  const data = (await res.json().catch(() => ({}))) as Json;
  if (!res.ok) {
    throw new Error(data?.message || data?.error || "fal status failed");
  }
  return data;
}

/**
 * 获取队列任务最终结果
 */
export async function falQueueResult(requestId: string) {
  const key = ensureFalKey();

  const res = await fetch(`https://fal.run/queue/requests/${requestId}`, {
    method: "GET",
    headers: {
      Authorization: `Key ${key}`,
    },
  });

  const data = (await res.json().catch(() => ({}))) as Json;
  if (!res.ok) {
    throw new Error(data?.message || data?.error || "fal result failed");
  }
  return data;
}

/**
 * 小工具：从 fal 返回里尽量提取 requestId（兼容不同字段名）
 */
export function extractRequestId(data: any): string | null {
  if (!data) return null;
  return (
    data.requestId ||
    data.request_id ||
    data?.request?.id ||
    data?.request?.request_id ||
    null
  );
}
