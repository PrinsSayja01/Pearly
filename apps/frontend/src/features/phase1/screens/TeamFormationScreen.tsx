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
  } = usePhase1Store();

  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const autoSelectedRef = useRef(false); // ⚡ prevent re-auto-select

  if (!selectedCandidate) {
    return (
      <div className="text-center text-sm text-muted-foreground">
        No lead selected
      </div>
    );
  }

  const lead = selectedCandidate;

  // 🔥 FETCH
  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/candidates`);
        const data = res.data?.candidates || [];

        const filtered = data.filter(
          (w: any) => String(w.id) !== String(lead.id)
        );

        setCandidates(filtered);
      } catch (err: any) {
        console.error("❌ Team fetch error:", err?.message);
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [lead.id]);

  // 🧠 AI SORT
  const sorted = useMemo(() => {
    return [...candidates].sort(
      (a, b) => (b.match_score || 0) - (a.match_score || 0)
    );
  }, [candidates]);

  // 🎯 AI SUGGESTION
  const suggested = useMemo(() => sorted.slice(0, 2), [sorted]);

  // ⚡ AUTO SELECT (ONLY ONCE)
  useEffect(() => {
    if (!autoSelectedRef.current && suggested.length > 0) {
      suggested.forEach((m) => toggleTeamMember(m.id));
      autoSelectedRef.current = true;
    }
  }, [suggested]);

  return (
    <div className="space-y-5 pb-28">

      <StepHeader
        step={5}
        total={6}
        title="Build your team"
        subtitle="AI suggests, you decide"
        onBack={() => setStep("confirm")}
      />

      {/* 👑 LEAD */}
      <Card className="rounded-2xl border-primary/20 bg-primary/5">
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

      {/* 🤖 AI SUGGESTION BLOCK */}
      {suggested.length > 0 && (
        <div className="space-y-2">

          <div className="flex items-center gap-2 text-xs text-primary">
            <Sparkles className="h-4 w-4" />
            AI Suggested Team
          </div>

          <div className="space-y-2">
            {suggested.map((w) => (
              <CandidateCard
                key={w.id}
                worker={w}
                selected={teamMemberIds.includes(w.id)}
                onSelect={() => toggleTeamMember(w.id)}
                compact
              />
            ))}
          </div>

        </div>
      )}

      {/* ✏️ MANUAL SELECTION */}
      <div className="space-y-2">

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <UserPlus className="h-3 w-3" />
          Adjust team (optional)
        </div>

        {/* LOADING */}
        {loading && (
          <Card className="rounded-xl">
            <CardContent className="p-4 text-center text-sm">
              Finding best matches...
            </CardContent>
          </Card>
        )}

        {/* LIST */}
        {!loading && sorted.length > 0 && (
          <div className="space-y-2">
            {sorted.map((w) => (
              <CandidateCard
                key={w.id}
                worker={w}
                selected={teamMemberIds.includes(w.id)}
                onSelect={() => toggleTeamMember(w.id)}
                compact
              />
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading && sorted.length === 0 && (
          <Card>
            <CardContent className="p-4 text-center text-sm text-muted-foreground">
              No candidates available
            </CardContent>
          </Card>
        )}

      </div>

      {/* 📱 MOBILE CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-background border-t space-y-2">

        <Button
          variant="outline"
          className="w-full h-12 rounded-xl"
          onClick={() => setStep("done")}
        >
          Work alone
        </Button>

        <Button
          className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-purple-500 text-white"
          onClick={() => setStep("done")}
        >
          Confirm team
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>

      </div>
    </div>
  );
};