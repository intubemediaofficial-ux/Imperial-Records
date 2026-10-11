import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-royal flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="font-hindi text-5xl text-saffron">ॐ</p>
      <h1 className="mt-4 font-display text-5xl font-bold text-gold-gradient">404</h1>
      <p className="mt-3 text-muted">This page could not be found.</p>
      <Link href="/" className="mt-8 rounded-full bg-gold-gradient px-6 py-3 font-semibold text-ink">Back to Home</Link>
    </div>
  );
}
