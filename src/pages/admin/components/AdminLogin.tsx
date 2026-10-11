import { useState } from "react";
import type { AdminAuthState } from "@/hooks/useAdminAuth";
import { btnPrimary, inputCls, labelCls } from "./AdminUi";

export default function AdminLogin({ auth }: { auth: AdminAuthState }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    const res = await auth.signIn(email.trim(), password);
    setLoading(false);
    if (!res.ok) setError(res.error ?? "Unable to sign in. Check your details.");
  };

  return (
    <main className="min-h-screen bg-background-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="mx-auto w-14 h-14 rounded-2xl bg-primary-500 text-foreground-50 flex items-center justify-center">
            <i className="ri-shield-keyhole-line text-2xl" aria-hidden="true"></i>
          </span>
          <h1 className="mt-4 font-heading text-3xl text-foreground-950">Admin Panel</h1>
          <p className="mt-2 text-sm text-foreground-600">Paws and Claws — staff sign in</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-background-50 border border-background-200/80 p-6 md:p-8 space-y-5">
          <div>
            <label htmlFor="admin-email" className={labelCls}>Email address</label>
            <input
              id="admin-email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
              className={inputCls}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className={labelCls}>Password</label>
            <input
              id="admin-password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className={inputCls}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm text-red-700">
              <i className="ri-error-warning-line mt-0.5" aria-hidden="true"></i>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className={`${btnPrimary} w-full py-3`}>
            {loading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-foreground-50/40 border-t-foreground-50 animate-spin"></span>
                Signing in…
              </>
            ) : (
              <>
                <i className="ri-login-circle-line" aria-hidden="true"></i>
                Sign in
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-foreground-500">
            Protected area. Access is restricted to authorised staff accounts.
          </p>
        </form>
      </div>
    </main>
  );
}