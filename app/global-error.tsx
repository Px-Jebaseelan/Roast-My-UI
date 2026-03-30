'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="bg-[#050508] text-white flex items-center justify-center min-h-screen font-sans">
        <div className="text-center p-8 border border-red-500/30 bg-red-500/5 rounded-3xl backdrop-blur-md max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-red-500">Global Engine Failure</h2>
          <p className="mb-8 text-zinc-400 text-sm">A catastrophic application error occurred at the root level.</p>
          <button onClick={() => reset()} className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition-colors">
            Force Reset
          </button>
        </div>
      </body>
    </html>
  );
}
