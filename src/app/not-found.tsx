import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow justify-center">Error 404</p>
      <h1 className="mt-5 font-display text-6xl font-medium text-linen">Page not found</h1>
      <p className="mt-4 max-w-md text-linenDim">
        The page you're looking for has moved or no longer exists. Let's get you back to the collections.
      </p>
      <Link href="/" className="btn-brass mt-8">Back to Home</Link>
    </div>
  );
}
