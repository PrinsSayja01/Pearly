import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, UserPlus } from "lucide-react";

import { workers } from "@/data/mock"; // only for team options (temporary)
import { usePhase1Store } from "../store";
import { CandidateCard } from "../components/CandidateCard";
import { StepHeader } from "../components/StepHeader";

export const TeamFormationScreen = () => {
  const {
    selectedCandidate, // ✅ FIX: use real selected worker
    teamMemberIds,
    toggleTeamMember,
    setStep,
  } = usePhase1Store();

  console.log("👥 TEAM SCREEN selectedCandidate:", selectedCandidate);

  // ❗ SAFETY
  if (!selectedCandidate) {
    return (
      <div className="text-center text-sm text-muted-foreground">
        No lead selected
      </div>
    );
  }

  // 🔥 lead from real API
  const lead = selectedCandidate;
  

  // ⚠️ TEMP: mock teammates (you will replace with API later)
  const others = workers.filter(
    (w) => String(w.id) !== String(lead.id)
  );

  return (
    <div className="space-y-5">

      <StepHeader
        step={5}
        total={6}
        title="Build your team"
        subtitle="Work alone or add members"
        onBack={() => setStep("confirm")}
      />

      {/* LEAD */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-3 flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-primary" />
          <span className="font-medium">{lead.name}</span>
          <span className="text-muted-foreground">is the lead</span>
          <span className="ml-auto text-xs text-muted-foreground">
            {teamMemberIds.length} added
          </span>
        </CardContent>
      </Card>

      {/* TEAM LIST */}
      <div className="space-y-2">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
          <UserPlus className="h-3 w-3" />
          Add team members (optional)
        </div>

        {others.map((w) => (
          <CandidateCard
            key={w.id}
            worker={w}
            selected={teamMemberIds.includes(w.id)}
            onSelect={() => toggleTeamMember(w.id)}
            compact
          />
        ))}
      </div>

      {/* CTA */}
      <div className="flex gap-2">

        {/* WORK SOLO */}
        <Button
          variant="outline"
          className="flex-1 h-12"
          onClick={() => {
            console.log("➡️ SOLO → DONE");
            setStep("done");
          }}
        >
          Work alone
        </Button>

        {/* TEAM */}
        <Button
          className="flex-1 h-12 bg-gradient-primary hover:opacity-90"
          onClick={() => {
            console.log("➡️ TEAM CONFIRMED → DONE");
            setStep("done");
          }}
          disabled={teamMemberIds.length === 0}
        >
          Confirm team <ArrowRight className="h-4 w-4" />
        </Button>

      </div>
    </div>
  );
};