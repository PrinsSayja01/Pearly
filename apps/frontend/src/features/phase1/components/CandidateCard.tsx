import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Candidate {
  id: number;
  name: string;
  role: string;
  rating: number;
  location: string;
  availability: string[];
  skill: number;
  match_score?: number;
}

interface Props {
  worker: Candidate;
  selected?: boolean;
  onSelect?: () => void;
}

export const CandidateCard = ({ worker, selected, onSelect }: Props) => {

  const availableText = worker.availability?.[0] || "Not available";

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

              <Badge className="bg-gray-100 text-gray-700">
                <Clock className="h-3 w-3 mr-1" />
                {availableText}
              </Badge>
            </div>

            {/* 🧠 MATCH SCORE (VERY IMPORTANT) */}
            {worker.match_score !== undefined && (
              <div className="text-[10px] mt-1 text-primary font-medium">
                Match: {worker.match_score}
              </div>
            )}
          </div>

          {/* Skill */}
          <div className="text-right text-xs text-muted-foreground">
            Skill {worker.skill}/5
          </div>

        </CardContent>
      </Card>
    </button>
  );
};