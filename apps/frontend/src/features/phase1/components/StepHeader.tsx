import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface Props {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

export const StepHeader = ({ step, total, title, subtitle, onBack }: Props) => {
  const clickedRef = useRef(false); // 🔥 prevent accidental double trigger

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        {onBack ? (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 h-8 px-2"
            onClick={() => {
              if (clickedRef.current) return;
              clickedRef.current = true;

              console.log("⬅️ BACK CLICK");
              onBack();

              // reset after small delay
              setTimeout(() => {
                clickedRef.current = false;
              }, 300);
            }}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        ) : (
          <div />
        )}

        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Step {step} / {total}
        </div>
      </div>

      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-smooth ${
              i < step ? "bg-gradient-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      <div>
        <h1 className="font-display text-2xl">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};