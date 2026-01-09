export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#050b2e] via-[#120b3f] to-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur bg-black/40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold text-green-400">
            VideoAI Hub
          </div>

          <a
            href="/generate"
            className="hidden md:inline-flex px-8 py-3 rounded-full bg-red-600 hover:bg-red-500 transition font-semibold shadow-lg"
          >
            立即生成视频
          </a>

          <nav className="flex gap-6 text-sm text-gray-300">
            <a href="#" className="hover:text-white">首页</a>
            <a href="#features" className="hover:text-white">功能</a>
            <a href="#pricing" className="hover:text-white">定价</a>
            <a href="#" className="hover:text-white">博客</a>
            <a href="#" className="hover:text-white">登录</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center text-center px-6">
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          autoPlay
          loop
          muted
          playsInline
          src="https://www.w3schools.com/html/mov_bbb.mp4"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            用 AI 瞬间创造惊人视频
          </h1>
          <p className="mt-6 text-lg text-gray-300">
            从文本、图像或现有视频开始，免费试用
          </p>
          <a
            href="/generate"
            className="inline-flex mt-10 px-10 py-4 rounded-full bg-green-400 text-black font-bold text-lg hover:bg-green-300 transition"
          >
            开始创作 →
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-14">
          强大的 AI 视频功能
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "文本到视频", desc: "输入一句话，AI 自动生成高清视频" },
            { title: "图像动画化", desc: "让静态图片动起来" },
            { title: "视频编辑", desc: "一键剪辑、增强、重绘" },
            { title: "风格转换", desc: "卡通、写实、科幻任你选" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition"
            >
              <div className="h-32 bg-black/40 rounded mb-4 flex items-center justify-center text-gray-400">
                视频预览
              </div>
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-sm text-gray-400 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 bg-black/40">
        <h2 className="text-3xl font-bold text-center mb-10">
          看看大家在创造什么
        </h2>
        <div className="flex gap-6 overflow-x-auto px-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="min-w-[280px] bg-white/5 rounded-lg p-4"
            >
              <div className="h-40 bg-black/40 rounded mb-3" />
              <p className="text-sm text-gray-300">
                提示：未来城市飞行车
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Us */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          为什么选择 VideoAI Hub
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border border-white/10">
            <thead>
              <tr className="bg-white/5">
                <th className="p-4 text-left">优势</th>
                <th className="p-4">VideoAI Hub</th>
                <th className="p-4">其他平台</th>
              </tr>
            </thead>
            <tbody className="text-center text-gray-300">
              <tr className="border-t border-white/10">
                <td className="p-4 text-left">生成速度</td>
                <td className="p-4 text-green-400">秒级</td>
                <td className="p-4">分钟级</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="p-4 text-left">免费试用</td>
                <td className="p-4 text-green-400">无限低清</td>
                <td className="p-4">有限</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="p-4 text-left">操作复杂度</td>
                <td className="p-4 text-green-400">3 步</td>
                <td className="p-4">多步骤</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-black/40">
        <h2 className="text-3xl font-bold text-center mb-12">
          简单透明的定价
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">
          {[
            { name: "Free", price: "￥0", highlight: true },
            { name: "Basic", price: "$9 / 月" },
            { name: "Pro", price: "$29 / 月" },
          ].map((plan, i) => (
            <div
              key={i}
              className={`rounded-xl p-8 text-center ${
                plan.highlight
                  ? "bg-green-400 text-black"
                  : "bg-white/5 text-white"
              }`}
            >
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="text-3xl font-extrabold mt-4">{plan.price}</p>
              <button className="mt-6 px-6 py-3 rounded-full font-semibold bg-black text-white">
                选择方案
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <a
            href="/generate"
            className="inline-flex px-10 py-4 rounded-full bg-red-600 hover:bg-red-500 transition font-bold"
          >
            加入数百万创作者
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 text-center text-gray-400 text-sm">
        <div className="mb-6">
          <input
            placeholder="获取 AI 视频提示灵感"
            className="px-4 py-2 rounded bg-black/40 border border-white/10"
          />
        </div>
        <div className="flex justify-center gap-6">
          <a href="#">隐私政策</a>
          <a href="#">使用条款</a>
          <a href="#">联系我们</a>
        </div>
        <p className="mt-6">© 2026 VideoAI Hub</p>
      </footer>
    </main>
  );
}
