import type { LucideIcon } from "lucide-react";

export function StatChip({ icon: Icon, label, value, tone = "radar" }: { icon: LucideIcon; label: string; value: string | number; tone?: "radar" | "amber" | "alert" | "white" }) {
  const color = tone === "amber" ? "text-amberline border-amberline/30 bg-amberline/10" : tone === "alert" ? "text-alert border-alert/30 bg-alert/10" : tone === "white" ? "text-white border-white/10 bg-white/5" : "text-radar border-radar/30 bg-radar/10";
  return (
    <div className={`rounded border px-3 py-2 ${color}`}>
      <div className="flex items-center gap-2 text-xs uppercase text-slate-300"><Icon className="h-4 w-4" /> {label}</div>
      <div className="mt-1 text-lg font-bold">{value}</div>
    </div>
  );
}
