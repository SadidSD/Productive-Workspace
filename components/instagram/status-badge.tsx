import { IgPostStatus } from "@/lib/services/instagram";

interface StatusBadgeProps {
  status: IgPostStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig: Record<IgPostStatus, { label: string; className: string }> = {
    idea: { label: "Idea 💡", className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700" },
    draft: { label: "Draft 📝", className: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800" },
    scripted: { label: "Scripted ✍️", className: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800" },
    shot: { label: "Shot 🎥", className: "bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300 border-orange-200 dark:border-orange-800" },
    editing: { label: "Editing ✂️", className: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800" },
    ready: { label: "Ready ✨", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" },
    scheduled: { label: "Scheduled 📅", className: "bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800" },
    published: { label: "Posted 🚀", className: "bg-pink-100 text-pink-800 dark:bg-pink-950/40 dark:text-pink-300 border-pink-200 dark:border-pink-800" },
    missed: { label: "Missed ⚠️", className: "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300 border-red-200 dark:border-red-800" },
  };

  const config = statusConfig[status] || { label: status, className: "bg-muted text-muted-foreground" };

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
