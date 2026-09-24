"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, KeyRound } from "lucide-react";

export default function LoginPage() {
  const [token, setToken] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;
    setError(false);
    setLoading(true);

    const res = await signIn("credentials", {
      password: token.trim(),
      redirect: false,
    });

    if (res?.error) {
      setError(true);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <main className="min-h-screen bg-[#07090E] text-zinc-100 flex items-center justify-center p-6 selection:bg-zinc-800 font-sans antialiased">
      <div className="w-full max-w-[380px]">
        {/* Minimalist Logo / Branding */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <div className="w-3.5 h-3.5 rounded-sm bg-zinc-100" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-white">OmniDash</h1>
            <p className="text-[11px] text-zinc-500">Personal Space</p>
          </div>
        </div>

        {/* Clean Login Card */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 p-6 rounded-2xl backdrop-blur-xl shadow-2xl">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-white">Zugangsschlüssel</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Gib deinen 10-stelligen Token ein, um fortzufahren.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <input
                  type="password"
                  required
                  autoFocus
                  maxLength={64}
                  value={token}
                  onChange={(e) => {
                    setToken(e.target.value);
                    if (error) setError(false);
                  }}
                  placeholder="••••••••••"
                  className={`w-full bg-zinc-950/80 border ${
                    error ? "border-red-500/80 focus:ring-red-500/20" : "border-zinc-800 focus:border-zinc-500 focus:ring-zinc-700/30"
                  } rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 transition-all font-mono tracking-widest`}
                />
              </div>
              {error && (
                <p className="text-[11px] text-red-400 mt-2 font-medium">Ungültiger Schlüssel. Bitte erneut versuchen.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !token.trim()}
              className="w-full py-2.5 px-4 bg-zinc-100 hover:bg-white text-zinc-950 disabled:opacity-40 text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              {loading ? (
                "Prüfe..."
              ) : (
                <>
                  <span>Einloggen</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
