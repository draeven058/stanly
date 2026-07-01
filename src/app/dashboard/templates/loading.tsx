export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center justify-between pb-6 border-b border-border">
        <div className="space-y-2">
          <div className="h-7 w-40 rounded-lg bg-muted" />
          <div className="h-4 w-56 rounded-lg bg-muted" />
        </div>
        <div className="h-9 w-28 rounded-lg bg-muted" />
      </div>

      <div className="space-y-4">
        <div className="h-9 w-full max-w-md rounded-lg bg-muted" />
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-7 w-20 rounded-full bg-muted" />
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-border">
            <div className="aspect-video bg-muted" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-3 w-16 rounded-full bg-muted" />
              <div className="h-3 w-full rounded bg-muted" />
              <div className="h-9 w-full rounded-lg bg-muted mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
