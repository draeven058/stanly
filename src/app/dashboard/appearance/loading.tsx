export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between pb-6 border-b border-border">
        <div className="space-y-2">
          <div className="h-7 w-36 rounded-lg bg-muted" />
          <div className="h-4 w-64 rounded-lg bg-muted" />
        </div>
        <div className="h-9 w-28 rounded-lg bg-muted" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[800px]">
        <div className="space-y-4">
          <div className="h-10 w-full rounded-lg bg-muted" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl border border-border bg-muted" />
          ))}
        </div>
        <div className="rounded-xl border border-border bg-muted hidden lg:block" />
      </div>
    </div>
  );
}
