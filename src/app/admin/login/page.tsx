import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { isAdminAuthenticated } from "@/lib/server/auth";

export default async function AdminLoginPage() {
  const authenticated = await isAdminAuthenticated();

  if (authenticated) {
    redirect("/admin");
  }

  return (
    <main className="container-shell flex min-h-screen items-center justify-center py-16">
      <div className="w-full max-w-xl space-y-6">
        <div className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/70">Private admin</p>
          <h1 className="text-4xl font-semibold text-slate-50">Self-hosted content operations</h1>
          <p className="text-sm text-slate-400">Use secure local credentials to access the editing workspace.</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
