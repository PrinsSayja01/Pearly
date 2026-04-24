import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

import { workers } from "@/data/mock";
import { usePhase1Store } from "../store";

export const DoneScreen = () => {
  const {
    selectedCandidateId,
    teamMemberIds,
    detectedProfession,
    reset,
  } = usePhase1Store();

  const lead = workers.find((w) => w.id === selectedCandidateId);
  const team = workers.filter((w) => teamMemberIds.includes(w.id));

  return (
    <div className="space-y-5 animate-fade-in">

      <Card className="border-success/30 bg-success/5">
        <CardContent className="p-6 text-center space-y-3">

          <div className="h-14 w-14 rounded-full bg-success text-success-foreground flex items-center justify-center mx-auto shadow-glow">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <div>
            <h2 className="font-display text-2xl">
              Project created
            </h2>

            <p className="text-sm text-muted-foreground mt-1">
              {lead?.name || "Specialist"} assigned as your{" "}
              {detectedProfession || "worker"}.
              {team.length > 0
                ? ` Team of ${team.length + 1} assembled.`
                : " Working solo."}
            </p>
          </div>

        </CardContent>
      </Card>

      {team.length > 0 && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Team
            </div>

            <div className="text-sm font-medium">
              {lead?.name} (Lead)
            </div>

            {team.map((w) => (
              <div key={w.id} className="text-sm text-muted-foreground">
                {w.name} — {w.trade}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2">
        <Button
          className="w-full h-12 bg-gradient-primary hover:opacity-90"
          onClick={() => {
            console.log("🔄 Reset flow");
            reset();
          }}
        >
          Start new project
        </Button>
      </div>

    </div>
  );
};