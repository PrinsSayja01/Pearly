import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { workers } from "@/data/mock";
import { MapPin, Phone, Plus, Star, Sparkles, SlidersHorizontal } from "lucide-react";
import { MatchScoreBadge } from "@/components/pearly/MatchScoreBadge";

const availableTone = (a: string) =>
  a === "On site" ? "bg-success/15 text-success"
    : a.startsWith("Today") ? "bg-primary/10 text-primary"
    : a === "Tomorrow" ? "bg-warning/15 text-warning"
    : "bg-muted text-muted-foreground";

// Mock AI ranking — in production this would come from the matching engine
const matchData: Record<string, { score: number; reasons: string[] }> = {
  w4: { score: 96, reasons: ["Trade matches roof leak", "0.8 mi from site", "★ 4.7 · 18 jobs done"] },
  w1: { score: 91, reasons: ["Already on related site", "Lead-level experience"] },
  w2: { score: 84, reasons: ["Free today 2pm", "Multi-trade certified"] },
  w3: { score: 78, reasons: ["Tile specialist", "Available tomorrow"] },
  w5: { score: 71, reasons: ["HVAC primary trade", "5.1 mi · longer travel"] },
  w6: { score: 64, reasons: ["Apprentice level", "Pair with lead recommended"] },
};

const Crew = () => {
  const ranked = [...workers].sort(
    (a, b) => (matchData[b.id]?.score ?? 0) - (matchData[a.id]?.score ?? 0),
  );

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Crew assignment</div>
          <h1 className="font-display text-4xl mt-1">Smart team matching</h1>
          <p className="text-muted-foreground mt-2 text-sm max-w-xl">
            Ranked by Pearly's matching engine — combines skills, availability, distance, past performance and rate.
          </p>
        </div>
        <Button variant="outline" className="h-10 self-start">
          <SlidersHorizontal className="h-4 w-4" /> Tune weights
        </Button>
      </div>

      <Card className="border-primary/20 bg-gradient-surface relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
        <CardContent className="relative p-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-md bg-gradient-iridescent flex items-center justify-center shadow-glow shrink-0">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex-1 text-sm">
            <span className="font-medium">Optimal crew for "Roof Leak Repair":</span>{" "}
            <span className="text-muted-foreground">Pavel Novak (lead) + Mei Wong (assist) · est. cost </span>
            <span className="font-semibold">$760</span>
            <span className="text-muted-foreground"> · ETA 4 hrs</span>
          </div>
          <Button size="sm" className="bg-gradient-primary hover:opacity-90">Assemble crew</Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ranked.map((w, idx) => {
          const match = matchData[w.id] ?? { score: 60, reasons: [] };
          return (
            <Card key={w.id} className="hover:shadow-elegant transition-smooth relative">
              {idx === 0 && (
                <div className="absolute -top-2 left-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
                  Top pick
                </div>
              )}
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-iridescent text-primary-foreground font-bold flex items-center justify-center">
                    {w.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold">{w.name}</div>
                    <div className="text-xs text-muted-foreground">{w.trade}</div>
                    <div className="flex items-center gap-1 text-xs mt-1">
                      <Star className="h-3 w-3 fill-warning text-warning" />
                      <span className="font-medium">{w.rating}</span>
                    </div>
                  </div>
                  <MatchScoreBadge score={match.score} reasons={match.reasons} />
                </div>

                <div className="flex items-center justify-between">
                  <Badge className={availableTone(w.available)} variant="secondary">{w.available}</Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {w.distance}
                  </span>
                  <span className="text-sm font-semibold">${w.rate}/hr</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button size="lg" variant="outline" className="h-11"><Phone className="h-4 w-4" /></Button>
                  <Button size="lg" className="h-11 bg-gradient-primary hover:opacity-90">
                    <Plus className="h-4 w-4" /> Assign
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Crew;
