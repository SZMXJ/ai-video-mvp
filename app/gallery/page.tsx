export default function GalleryPage() {
    const videos = [
      { id: 1, prompt: "Cyberpunk city at night" },
      { id: 2, prompt: "Anime girl walking in rain" },
      { id: 3, prompt: "Realistic drone over desert" },
    ];
  
    return (
      <main className="min-h-screen bg-black text-white px-6 pt-24 max-w-6xl mx-auto">
        <h1 className="text-3xl mb-10">Your Generations</h1>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((v) => (
            <div
              key={v.id}
              className="bg-neutral-900 rounded-xl p-4"
            >
              <div className="aspect-video bg-black rounded mb-3 flex items-center justify-center text-gray-500">
                Video #{v.id}
              </div>
              <p className="text-sm text-gray-400">{v.prompt}</p>
            </div>
          ))}
        </div>
      </main>
    );
  }
  