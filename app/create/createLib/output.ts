export function pickOutputUrl(data: any): { url?: string; type?: "video" | "image" } {
    if (data?.video?.url) return { url: data.video.url, type: "video" };
    if (Array.isArray(data?.videos) && data.videos[0]?.url) return { url: data.videos[0].url, type: "video" };
  
    if (Array.isArray(data?.images) && data.images[0]?.url) return { url: data.images[0].url, type: "image" };
    if (data?.image?.url) return { url: data.image.url, type: "image" };
  
    return {};
  }
  