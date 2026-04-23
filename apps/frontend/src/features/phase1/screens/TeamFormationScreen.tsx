import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, UserPlus } from "lucide-react";

import { workers } from "@/data/mock";
import { usePhase1Store } from "../store";
import { CandidateCard } from "../components/CandidateCard";
import { StepHeader } from "../components/StepHeader";

export const TeamFormationScreen = () => {
  const {
    selectedCandidate,
    teamMemberIds,
    toggleTeamMember,
    setStep,
  } = usePhase1Store();

  if (!selectedCandidate) {
    return (
      <div className="text-center text-sm text-muted-foreground">
        No lead selected
      </div>
    );
  }

  const lead = selectedCandidate;

  const others = workers.filter(
    (w) => String(w.id) !== String(lead.id)
  );

  return (
    <div className="space-y-5 pb-28">

      <StepHeader
        step={5}
        total={6}
        title="Build your team"
        subtitle="Add members or continue solo"
        onBack={() => setStep("confirm")}
      />

      {/* LEAD CARD (MORE VISUAL) */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-center gap-3">
          <Users className="h-5 w-5 text-primary" />

          <div>
            <p className="text-sm font-medium">
              {lead.name}
            </p>
            <p className="text-xs text-muted-foreground">
              Team lead
            </p>
          </div>

          <div className="ml-auto text-xs text-muted-foreground">
            {teamMemberIds.length} added
          </div>
        </CardContent>
      </Card>

      {/* TEAM LIST */}
      <div className="space-y-3">
        <div className="text-xs text-muted-foreground flex items-center gap-1">
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

      {/* STICKY CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-background border-t space-y-2">

        {/* SOLO */}
        <Button
          variant="outline"
          className="w-full h-12"
          onClick={() => setStep("done")}
        >
          Work alone
        </Button>

        {/* TEAM CONFIRM */}
        <Button
          className="w-full h-12"
          disabled={teamMemberIds.length === 0}
          onClick={() => setStep("done")}
        >
          Confirm team
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>

      </div>
    </div>
  );
};