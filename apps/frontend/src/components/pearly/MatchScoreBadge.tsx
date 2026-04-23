import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface MatchScoreBadgeProps {
  score: number; // 0-100
  reasons?: string[];
}

export const MatchScoreBadge = ({ score, reasons }: MatchScoreBadgeProps) => {
  const tone =
    score >= 90 ? "from-primary to-primary-glow text-primary-foreground"
    : score >= 75 ? "bg-accent/15 text-accent"
    : "bg-muted text-muted-foreground";

  const isGradient = score >= 90;

  return (
    <div className="space-y-1.5">
      <div
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-soft",
          isGradient ? `bg-gradient-to-r ${tone}` : tone,
        )}
      >
        <Sparkles className="h-3 w-3" /> {score}% match
      </div>
      {reasons && reasons.length > 0 && (
        <ul className="text-[10px] text-muted-foreground space-y-0.5">
          {reasons.map((r) => (
            <li key={r} className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-primary" /> {r}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
