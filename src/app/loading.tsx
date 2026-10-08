export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-espresso">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-walnut border-t-brass" />
        <p className="font-display text-xl tracking-wide text-brass">CH FURNITURE</p>
      </div>
    </div>
  );
}
