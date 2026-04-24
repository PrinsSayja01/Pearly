import { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, Sparkles, UserPlus } from "lucide-react";

import { usePhase1Store } from "../store";
import { CandidateCard } from "../components/CandidateCard";
import { StepHeader } from "../components/StepHeader";

const API_URL = import.meta.env.VITE_API_URL;

export const TeamFormationScreen = () => {
  const {
    selectedCandidate,
    teamMemberIds,
    toggleTeamMember,
    setStep,
    setup,
  } = usePhase1Store();

  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const autoSelectedRef = useRef(false);

  if (!selectedCandidate) {
    return <div className="text-center text-sm">No lead selected</div>;
  }

  const lead = selectedCandidate;

  // 🔥 FETCH
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/candidates`, {
          params: {
            startDate: setup.startDate,
            endDate: setup.endDate,
          },
        });

        const data = res.data?.candidates || [];

        setCandidates(
          data.filter((w: any) => String(w.id) !== String(lead.id))
        );
      } catch {
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [lead.id]);

  // 🧠 SORT
  const sorted = useMemo(() => {
    return [...candidates].sort(
      (a, b) => (b.match_score || 0) - (a.match_score || 0)
    );
  }, [candidates]);

  // 🎯 SUGGESTED
  const suggested = useMemo(() => sorted.slice(0, 2), [sorted]);

  // ⚡ AUTO SELECT (once)
  useEffect(() => {
    if (!autoSelectedRef.current && suggested.length > 0) {
      suggested.forEach((m) => toggleTeamMember(m.id));
      autoSelectedRef.current = true;
    }
  }, [suggested]);

  // 🧠 MATCH %
  const getMatchPercent = (score: number) => {
    return Math.min(100, Math.round(score * 10));
  };

  // 🧠 EXPLANATION
  const getExplanation = (w: any) => {
    const reasons = [];

    if (setup.location && w.location.includes(setup.location)) {
      reasons.push("near location");
    }

    if (w.skill >= 4) {
      reasons.push("high skill");
    }

    if (w.languages?.length > 1) {
      reasons.push("multi-language");
    }

    if (w.match_score > 5) {
      reasons.push("strong match");
    }

    return reasons.slice(0, 2);
  };

  return (
    <div className="space-y-5 pb-28">

      <StepHeader
        step={5}
        total={6}
        title="Build your team"
        subtitle="AI suggests, you control"
        onBack={() => setStep("confirm")}
      />

      {/* LEAD */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-center gap-3">
          <Users className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-medium">{lead.name}</p>
            <p className="text-xs text-muted-foreground">Team lead</p>
          </div>
          <div className="ml-auto text-xs text-muted-foreground">
            {teamMemberIds.length} selected
          </div>
        </CardContent>
      </Card>

      {/* 🤖 AI SUGGESTED */}
      {suggested.length > 0 && (
        <div className="space-y-2">

          <div className="flex items-center gap-2 text-xs text-primary">
            <Sparkles className="h-4 w-4" />
            AI Suggestions
          </div>

          {suggested.map((w) => (
            <div key={w.id} className="space-y-1">

              <div className="flex items-center justify-between px-1 text-xs">
                <span className="text-primary font-medium">
                  {getMatchPercent(w.match_score)}% match
                </span>
                <span className="text-muted-foreground">
                  {getExplanation(w).join(" • ")}
                </span>
              </div>

              <CandidateCard
                worker={w}
                selected={teamMemberIds.includes(w.id)}
                onSelect={() => toggleTeamMember(w.id)}
                compact
              />

            </div>
          ))}
        </div>
      )}

      {/* ✏️ MANUAL */}
      <div className="space-y-2">

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <UserPlus className="h-3 w-3" />
          Adjust team anytime
        </div>

        {loading && (
          <Card>
            <CardContent className="p-4 text-center text-sm">
              Finding best matches...
            </CardContent>
          </Card>
        )}

        {!loading && sorted.map((w) => (
          <div key={w.id} className="space-y-1">

            <div className="flex items-center justify-between px-1 text-xs">
              <span className="text-muted-foreground">
                {getMatchPercent(w.match_score)}% match
              </span>
              <span className="text-muted-foreground">
                {getExplanation(w).join(" • ")}
              </span>
            </div>

            <CandidateCard
              worker={w}
              selected={teamMemberIds.includes(w.id)}
              onSelect={() => toggleTeamMember(w.id)}
              compact
            />

          </div>
        ))}

      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-background border-t space-y-2">

        <Button
          variant="outline"
          className="w-full h-12"
          onClick={() => setStep("done")}
        >
          Work alone
        </Button>

        <Button
          className="w-full h-12 bg-gradient-to-r from-primary to-purple-500"
          onClick={() => setStep("done")}
        >
          Confirm team <ArrowRight className="ml-1 h-4 w-4" />
        </Button>

      </div>
    </div>
  );
};