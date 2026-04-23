import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
interface Props {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

export const StepHeader = ({
  step,
  total,
  title,
  subtitle,
  onBack,
}: Props) => {
  const clickedRef = useRef(false);

  return (
    <div className="space-y-4">

      {/* TOP BAR */}
      <div className="flex items-center justify-between">
        {onBack ? (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 h-9 px-2"
            onClick={() => {
              if (clickedRef.current) return;
              clickedRef.current = true;

              onBack();

              setTimeout(() => {
                clickedRef.current = false;
              }, 300);
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        ) : (
          <div />
        )}

        <div className="text-[11px] text-muted-foreground">
          {step} / {total}
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "h-1 flex-1 rounded-full origin-left",
              i < step
                ? "bg-gradient-to-r from-purple-400 to-blue-400"
                : "bg-muted"
            )}
          />
        ))}
      </div>

      {/* TITLE */}
      <div>
        <h1 className="text-xl font-semibold leading-tight">
          {title}
        </h1>

        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};