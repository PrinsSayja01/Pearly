import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = ["Request", "Crew", "On Site", "Work", "Complete", "Paid"];

export const WorkflowStepper = ({ current = 2 }: { current?: number }) => {
  return (
    <div className="flex items-center w-full overflow-x-auto">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s} className="flex items-center flex-1 last:flex-none min-w-[60px]">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-smooth shrink-0",
                  done && "bg-gradient-primary border-transparent text-primary-foreground shadow-glow",
                  active && "border-primary text-primary bg-primary/5 animate-pulse-glow",
                  !done && !active && "border-border text-muted-foreground bg-card",
                )}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={cn("mt-2 text-[11px] whitespace-nowrap", active ? "text-foreground font-semibold" : "text-muted-foreground")}>
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 mb-6 rounded-full overflow-hidden bg-border min-w-[16px]">
                <div className={cn("h-full transition-smooth", done ? "bg-gradient-primary w-full" : "w-0")} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
