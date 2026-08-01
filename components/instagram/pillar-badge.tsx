import { IgContentPillar } from "@/lib/services/instagram";

interface PillarBadgeProps {
  pillar?: IgContentPillar | null;
}

export function PillarBadge({ pillar }: PillarBadgeProps) {
  if (!pillar) return null;

  const pillarConfig: Record<IgContentPillar, { label: string; className: string }> = {
    platform_pain: { label: "Platform Pain", className: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300" },
    solution: { label: "Solution", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
    education: { label: "Education", className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
    comparison: { label: "Comparison", className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
    case_study: { label: "Case Study", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  };

  const config = pillarConfig[pillar];
  if (!config) return null;

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
