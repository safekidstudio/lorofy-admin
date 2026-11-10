export function RouteLoader() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="flex min-h-[50vh] w-full items-center justify-center"
    >
      <span className="size-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
    </div>
  );
}
