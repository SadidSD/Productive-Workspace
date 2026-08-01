import { IgScriptFormula } from "@/lib/services/instagram";

interface FormulaBadgeProps {
  formula?: IgScriptFormula | null;
}

export function FormulaBadge({ formula }: FormulaBadgeProps) {
  if (!formula) return null;

  const labels: Record<IgScriptFormula, string> = {
    problem_agitate_solve: "PAS",
    before_after_bridge: "BAB",
    list: "List",
    opinion_reasoning: "Opinion",
  };

  const label = labels[formula];
  if (!label) return null;

  return (
    <span className="inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
      {label}
    </span>
  );
}
