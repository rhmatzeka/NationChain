"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="min-h-screen bg-obsidian p-6 text-white">
      <div className="mx-auto mt-20 max-w-xl rounded border border-alert/40 bg-alert/10 p-6 shadow-tactical">
        <AlertTriangle className="mb-4 h-8 w-8 text-alert" />
        <h1 className="text-2xl font-semibold">Command link interrupted</h1>
        <p className="mt-3 text-sm text-slate-300">{error.message}</p>
        <button onClick={reset} className="mt-6 inline-flex items-center gap-2 rounded border border-radar/50 px-4 py-2 text-sm text-radar hover:bg-radar/10">
          <RotateCcw className="h-4 w-4" /> Retry
        </button>
      </div>
    </main>
  );
}
