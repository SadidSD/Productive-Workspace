import { IgPostStatus } from "@/lib/services/instagram";

interface StatusBadgeProps {
  status: IgPostStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig: Record<IgPostStatus, { label: string; className: string }> = {
    idea: { label: "Idea", className: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300" },
    draft: { label: "Draft", className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
    ready: { label: "Ready", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
    scheduled: { label: "Scheduled", className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
    published: { label: "Published", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
    missed: { label: "Missed", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
  };

  const config = statusConfig[status];
  if (!config) return null;

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
