// src/features/phase1/components/CandidateCard.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { cn } from "@/lib/utils";
export interface Candidate {
  id: number;
  name: string;
  role: string;
  rating: number;
  location: string;
  available: string;
  rate: number;
}

interface Props {
  worker: Candidate;
  selected?: boolean;
  onSelect?: () => void;
}

export const CandidateCard = ({ worker, selected, onSelect }: Props) => {
  const isAvailableNow = /on site|today|now/i.test(worker.available || "");

  return (
    <button
      onClick={onSelect}
      className="w-full text-left active:scale-[0.98] transition"
    >
      <Card
        className={cn(
          "rounded-2xl border transition",
          selected
            ? "border-primary bg-primary/5"
            : "border-border hover:shadow-md"
        )}
      >
        <CardContent className="p-4 flex items-center gap-3">

          {/* Avatar */}
          <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
            {worker.name?.slice(0, 1)}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold truncate">
                {worker.name}
              </span>
              {selected && <Check className="h-4 w-4 text-primary" />}
            </div>

            <div className="text-xs text-muted-foreground">
              {worker.role}
            </div>

            <div className="flex items-center gap-3 mt-1 text-xs">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {worker.rating}
              </span>

              <span className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {worker.location}
              </span>

              <Badge
                className={cn(
                  isAvailableNow
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                )}
              >
                <Clock className="h-3 w-3 mr-1" />
                {worker.available}
              </Badge>
            </div>
          </div>

          {/* Rate */}
          <div className="text-right text-sm font-semibold">
            €{worker.rate}/h
          </div>

        </CardContent>
      </Card>
    </button>
  );
};