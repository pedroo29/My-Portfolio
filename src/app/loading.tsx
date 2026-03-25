export default function GlobalLoading() {
  return (
    <main className="container-shell py-16">
      <div className="space-y-6">
        <div className="h-12 w-64 animate-pulse rounded-2xl bg-slate-800" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-64 animate-pulse rounded-3xl bg-slate-900" />
          <div className="h-64 animate-pulse rounded-3xl bg-slate-900" />
          <div className="h-64 animate-pulse rounded-3xl bg-slate-900" />
        </div>
      </div>
    </main>
  );
}
