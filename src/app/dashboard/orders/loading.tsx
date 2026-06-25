export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center justify-between pb-6 border-b border-border">
        <div className="space-y-2">
          <div className="h-7 w-48 rounded-lg bg-muted" />
          <div className="h-4 w-32 rounded-lg bg-muted" />
        </div>
        <div className="h-9 w-28 rounded-lg bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 rounded-xl border border-border bg-muted" />
        ))}
      </div>
      <div className="h-64 rounded-xl border border-border bg-muted" />
    </div>
  );
}
