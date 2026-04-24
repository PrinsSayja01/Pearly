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
    detectedProfession,
  } = usePhase1Store();

  const [thinking, setThinking] = useState(true);
  const autoSelectedRef = useRef(false);

  if (!selectedCandidate) {
    return (
      <div className="text-center text-sm text-muted-foreground">
        No lead selected
      </div>
    );
  }

  const lead = selectedCandidate;

  // 🧠 SMART SCORE ENGINE
  const scoredCandidates = useMemo(() => {
    return (candidates || [])
      .filter((w) => String(w.id) !== String(lead.id))
      .map((w: any) => {
        let score = 0;
        let reasons: string[] = [];

        // ROLE BALANCE (avoid same role overload)
        if (w.role !== lead.role) {
          score += 2;
          reasons.push("role balance");
        }

        // LANGUAGE MATCH
        if (w.languages?.includes("en")) {
          score += 1;
          reasons.push("language match");
        }

        // LOCATION MATCH
        if (setup?.location && w.location?.includes(setup.location)) {
          score += 1;
          reasons.push("nearby");
        }

        // SKILL
        score += w.skill * 0.5;
        if (w.skill >= 4) reasons.push("high skill");

        // RATING
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

  // 🎯 AI SELECT TOP 2 (SMART)
  const suggested = useMemo(() => scoredCandidates.slice(0, 2), [scoredCandidates]);

  // 🤖 AI THINKING SIMULATION
  useEffect(() => {
    const timer = setTimeout(() => {
      setThinking(false);
    }, 1200); // delay for wow effect

    return () => clearTimeout(timer);
  }, []);

  // 🔥 AUTO SELECT ONCE
  useEffect(() => {
    if (autoSelectedRef.current) return;

    if (!thinking && suggested.length && teamMemberIds.length === 0) {
      suggested.forEach((m) => toggleTeamMember(m.id));
      autoSelectedRef.current = true;
    }
  }, [thinking, suggested, teamMemberIds]);

  const remaining = scoredCandidates.filter(
    (w) => !suggested.some((s) => s.id === w.id)
  );

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
            AI is building your best team...
          </p>
        </div>
      )}

      {/* 🤖 AI RESULT */}
      {!thinking && suggested.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-primary font-medium">
            <Sparkles className="h-3 w-3" />
            AI Suggested Team
          </div>

          {suggested.map((w) => (
            <div key={w.id}>
              <CandidateCard
                worker={w}
                selected={teamMemberIds.includes(w.id)}
                onSelect={() => toggleTeamMember(w.id)}
              />

              {/* 🎯 EXPLAINABLE AI */}
              <div className="text-[11px] text-muted-foreground px-1 mt-1">
                Why selected: {w.reasons.join(", ")} (score {w.ai_score})
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✋ MANUAL CONTROL */}
      {!thinking && (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            Adjust team (tap to add/remove)
          </div>

          {remaining.map((w) => (
            <CandidateCard
              key={w.id}
              worker={w}
              selected={teamMemberIds.includes(w.id)}
              onSelect={() => toggleTeamMember(w.id)}
            />
          ))}
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