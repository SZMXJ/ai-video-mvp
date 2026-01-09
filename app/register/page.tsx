export default function RegisterPage() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            Create Account
          </h1>
  
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 focus:outline-none focus:border-cyan-400"
            />
  
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 focus:outline-none focus:border-cyan-400"
            />
  
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 focus:outline-none focus:border-cyan-400"
            />
  
            <button className="w-full rounded-xl bg-cyan-400 py-3 font-medium text-black hover:bg-cyan-300 transition">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }
  