import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

type Candidate = {
  id: number;
  name: string;
  role: string;
  languages: string[];
  location: string;
  rating: number;
  skill: number;
  match_score?: number;
  match_reasons?: string[];
};

export const CandidateCard = ({
  worker,
  selected,
}: {
  worker: Candidate;
  selected?: boolean;
}) => {
  const score = worker.match_score || 0;

  // 🔥 MATCH LEVEL
  const getMatchLevel = () => {
    if (score >= 7) return { label: "Top Match", color: "bg-green-100 text-green-700" };
    if (score >= 5) return { label: "Good Match", color: "bg-blue-100 text-blue-700" };
    return { label: "Basic Match", color: "bg-gray-100 text-gray-600" };
  };

  const match = getMatchLevel();

  return (
    <Card
      className={`rounded-2xl border transition-all cursor-pointer ${
        selected
          ? "border-primary shadow-md scale-[1.01]"
          : "hover:shadow-sm"
      }`}
    >
      <CardContent className="p-4 space-y-3">

        {/* HEADER */}
        <div className="flex items-start justify-between">

          <div>
            <div className="font-semibold text-base">
              {worker.name}
            </div>
            <div className="text-xs text-muted-foreground capitalize">
              {worker.role}
            </div>
          </div>

          {/* MATCH BADGE */}
          <div
            className={`text-[10px] px-2 py-1 rounded-full font-medium ${match.color}`}
          >
            {match.label}
          </div>
        </div>

        {/* INFO ROW */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">

          <span>{worker.location}</span>

          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            {worker.rating}
          </span>
        </div>

        {/* LANGUAGES */}
        <div className="flex gap-2 flex-wrap">
          {worker.languages.map((lang) => (
            <span
              key={lang}
              className="text-[10px] px-2 py-0.5 rounded-full bg-muted"
            >
              {lang.toUpperCase()}
            </span>
          ))}
        </div>

        {/* MATCH REASONS */}
        {worker.match_reasons && worker.match_reasons.length > 0 && (
          <div className="text-[11px] text-muted-foreground">
            Match: {worker.match_reasons.join(", ")}
          </div>
        )}

        {/* SCORE (optional debug but useful now) */}
        <div className="text-[10px] text-right text-muted-foreground">
          Score: {score}
        </div>

      </CardContent>
    </Card>
  );
};