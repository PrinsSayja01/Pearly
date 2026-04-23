import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Candidate } from "../store";

interface Props {
  worker: Candidate;
  selected?: boolean;
  onSelect?: () => void;
  compact?: boolean;
}

export const CandidateCard = ({ worker, selected, onSelect, compact }: Props) => {
  const isAvailableNow = /on site|today|now/i.test(worker.available);
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left transition-smooth",
        "active:scale-[0.99]",
      )}
    >
      <Card
        className={cn(
          "border rounded-2xl overflow-hidden transition-smooth",
          selected
            ? "border-primary/60 bg-gradient-pearl-card shadow-elegant"
            : "border-border/60 bg-gradient-pearl-card shadow-soft hover:shadow-elegant",
        )}
      >
        <CardContent className={cn("p-4 flex items-center gap-3", compact && "p-3")}>
          <div className="h-12 w-12 shrink-0 rounded-full bg-gradient-iridescent flex items-center justify-center text-primary-foreground font-bold">
            {worker.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <div className="font-semibold truncate">{worker.name}</div>
              {selected && <Check className="h-4 w-4 text-primary shrink-0" />}
            </div>
            <div className="text-xs text-muted-foreground">{worker.trade}</div>
            <div className="flex items-center gap-3 mt-1.5 text-xs">
              <span className="inline-flex items-center gap-1">
                <Star className="h-3 w-3 fill-warning text-warning" />
                {worker.rating}
              </span>
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {worker.distance}
              </span>
              <Badge
                variant="secondary"
                className={cn(
                  "h-5 px-1.5 text-[10px] gap-1",
                  isAvailableNow
                    ? "bg-success/15 text-success border border-success/30"
                    : "bg-muted text-muted-foreground",
                )}
              >
                <Clock className="h-3 w-3" />
                {worker.available}
              </Badge>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Rate</div>
            <div className="font-semibold text-sm">${worker.rate}/h</div>
          </div>
        </CardContent>
      </Card>
    </button>
  );
};
