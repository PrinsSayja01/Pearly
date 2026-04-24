import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

import { usePhase1Store } from "../store";

export const DoneScreen = () => {
  const {
    selectedCandidate,
    teamMemberIds,
    selectedTeamMembers, // ✅ IMPORTANT (you must store this)
    detectedProfession,
    reset,
  } = usePhase1Store();

  const lead = selectedCandidate;

  const team = selectedTeamMembers || [];

  return (
    <div className="space-y-5 animate-fade-in pb-10">

      {/* ✅ SUCCESS CARD */}
      <Card className="border-green-300 bg-green-50 rounded-2xl">
        <CardContent className="p-6 text-center space-y-3">

          <div className="h-14 w-14 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
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

      {/* ✅ TEAM LIST */}
      {team.length > 0 && (
        <Card className="rounded-2xl">
          <CardContent className="p-4 space-y-3">

            <div className="text-xs text-muted-foreground uppercase">
              Team Members
            </div>

            {/* LEAD */}
            <div className="text-sm font-medium">
              {lead?.name} (Lead)
            </div>

            {/* MEMBERS */}
            {team.map((w: any) => (
              <div
                key={w.id}
                className="text-sm text-muted-foreground flex justify-between"
              >
                <span>{w.name}</span>
                <span className="text-xs">{w.role}</span>
              </div>
            ))}

          </CardContent>
        </Card>
      )}

      {/* CTA */}
      <Button
        className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-purple-500 text-white"
        onClick={() => {
          console.log("🔄 Reset flow");
          reset();
        }}
      >
        Start new project
      </Button>

    </div>
  );
};