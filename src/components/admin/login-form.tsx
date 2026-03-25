"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  return (
    <form
      className="space-y-5 rounded-3xl border border-slate-800 bg-slate-950/60 p-8"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        setError("");

        startTransition(async () => {
          const response = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: formData.get("username"),
              password: formData.get("password")
            })
          });

          if (!response.ok) {
            setError("Invalid credentials. Update your environment variables before production use.");
            return;
          }

          router.push("/admin");
          router.refresh();
        });
      }}
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-50">Admin login</h1>
        <p className="text-sm text-slate-400">Protected internal workspace for editing portfolio content.</p>
      </div>
      <label className="block space-y-2">
        <span className="text-sm text-slate-200">Username</span>
        <input name="username" className="focus-ring w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100" />
      </label>
      <label className="block space-y-2">
        <span className="text-sm text-slate-200">Password</span>
        <input
          name="password"
          type="password"
          className="focus-ring w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100"
        />
      </label>
      {error ? <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{error}</div> : null}
      <button disabled={isPending} className="focus-ring rounded-full bg-cyan-400 px-5 py-3 text-sm font-medium text-slate-950">
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
