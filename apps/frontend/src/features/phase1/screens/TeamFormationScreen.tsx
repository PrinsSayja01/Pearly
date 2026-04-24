import { useEffect, useRef, useMemo, useState } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, Sparkles } from "lucide-react";

import { usePhase1Store } from "../store";
import { CandidateCard } from "../components/CandidateCard";
import { StepHeader } from "../components/StepHeader";

export const TeamFormationScreen = () => {
  const {
    selectedCandidate,
    teamMemberIds,
    toggleTeamMember,
    setStep,
    candidates,
    setup,
  } = usePhase1Store();

  const [thinking, setThinking] = useState(true);
  const autoSelectedRef = useRef(false);

  if (!selectedCandidate) {
    return <div className="text-center text-sm">No lead selected</div>;
  }

  const lead = selectedCandidate;

  // 🧠 AI SCORING
  const scored = useMemo(() => {
    return (candidates || [])
      .filter((w) => String(w.id) !== String(lead.id))
      .map((w: any) => {
        let score = 0;
        let reasons: string[] = [];

        // role diversity
        if (w.role !== lead.role) {
          score += 2;
          reasons.push("role balance");
        }

        // location
        if (setup?.location && w.location?.includes(setup.location)) {
          score += 1;
          reasons.push("nearby");
        }

        // skill
        score += w.skill * 0.5;
        if (w.skill >= 4) reasons.push("high skill");

        // rating
        score += w.rating * 0.3;
        if (w.rating >= 4.5) reasons.push("top rated");

        return {
          ...w,
          ai_score: Number(score.toFixed(2)),
          reasons,
        };
      })
      .sort((a, b) => b.ai_score - a.ai_score);
  }, [candidates, lead, setup]);

  // 🎯 AI TOP PICKS
  const aiTopIds = useMemo(
    () => scored.slice(0, 2).map((c) => c.id),
    [scored]
  );

  // 🤖 AI THINKING
  useEffect(() => {
    const t = setTimeout(() => setThinking(false), 1000);
    return () => clearTimeout(t);
  }, []);

  // 🔥 AUTO SELECT (ONLY ONCE)
  useEffect(() => {
    if (autoSelectedRef.current || thinking) return;

    if (teamMemberIds.length === 0) {
      aiTopIds.forEach((id) => toggleTeamMember(id));
      autoSelectedRef.current = true;
    }
  }, [thinking, aiTopIds]);

  return (
    <div className="space-y-5 pb-28">

      <StepHeader
        step={5}
        total={6}
        title="Build your team"
        subtitle="AI suggests, you control"
        onBack={() => setStep("confirm")}
      />

      {/* 👑 LEAD */}
      <Card className="bg-primary/5 border-primary/20 rounded-2xl">
        <CardContent className="p-4 flex items-center gap-3">
          <Users className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-semibold">{lead.name}</p>
            <p className="text-xs text-muted-foreground">Team lead</p>
          </div>

          <div className="ml-auto text-xs text-muted-foreground">
            {teamMemberIds.length} selected
          </div>
        </CardContent>
      </Card>

      {/* 🧠 AI THINKING */}
      {thinking && (
        <div className="flex flex-col items-center py-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <Sparkles className="h-6 w-6 text-primary" />
          </motion.div>

          <p className="text-sm mt-2 text-muted-foreground">
            AI is building your team...
          </p>
        </div>
      )}

      {/* 📋 FULL LIST (IMPORTANT FIX) */}
      {!thinking && (
        <div className="space-y-3">

          <div className="text-xs text-muted-foreground">
            Tap to add/remove team members
          </div>

          {scored.map((w) => {
            const isAI = aiTopIds.includes(w.id);

            return (
              <div key={w.id}>
                <CandidateCard
                  worker={w}
                  selected={teamMemberIds.includes(w.id)}
                  onSelect={() => toggleTeamMember(w.id)}
                />

                {/* 🤖 AI LABEL */}
                {isAI && (
                  <div className="text-[11px] text-primary px-1 mt-1">
                    AI suggestion • {w.reasons.join(", ")} (score {w.ai_score})
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 📱 CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-background border-t space-y-2">

        <Button
          variant="outline"
          className="w-full h-12 rounded-xl"
          onClick={() => setStep("done")}
        >
          Work alone
        </Button>

        <Button
          className="w-full h-12 rounded-xl bg-gradient-primary hover:opacity-90"
          onClick={() => setStep("done")}
          disabled={teamMemberIds.length === 0}
        >
          Confirm team
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>

      </div>
    </div>
  );
};