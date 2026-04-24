import { useEffect, useState, useMemo } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, UserPlus, Sparkles } from "lucide-react";

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

  // ❗ SAFETY
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

        // remove lead
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

  // 🧠 AI SORT (based on backend match_score)
  const sortedCandidates = useMemo(() => {
    return [...candidates].sort(
      (a, b) => (b.match_score || 0) - (a.match_score || 0)
    );
  }, [candidates]);

  // 🎯 AUTO TEAM SUGGESTION (top 2)
  const suggestedTeam = useMemo(() => {
    return sortedCandidates.slice(0, 2);
  }, [sortedCandidates]);

  // ⚡ AUTO SELECT (only once)
  useEffect(() => {
    if (teamMemberIds.length === 0 && suggestedTeam.length > 0) {
      suggestedTeam.forEach((m) => toggleTeamMember(m.id));
    }
  }, [suggestedTeam]);

  return (
    <div className="space-y-5 pb-28">

      <StepHeader
        step={5}
        total={6}
        title="Build your team"
        subtitle="AI suggests best matches"
        onBack={() => setStep("confirm")}
      />

      {/* 🔷 LEAD */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-center gap-3">
          <Users className="h-5 w-5 text-primary" />

          <div>
            <p className="text-sm font-medium">{lead.name}</p>
            <p className="text-xs text-muted-foreground">
              Team lead
            </p>
          </div>

          <div className="ml-auto text-xs text-muted-foreground">
            {teamMemberIds.length} selected
          </div>
        </CardContent>
      </Card>

      {/* 🤖 AI SUGGESTION */}
      {suggestedTeam.length > 0 && (
        <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
          <CardContent className="p-3 flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            AI selected best team for you
          </CardContent>
        </Card>
      )}

      {/* 👥 TEAM LIST */}
      <div className="space-y-3">

        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <UserPlus className="h-3 w-3" />
          Adjust team (optional)
        </div>

        {/* LOADING */}
        {loading && (
          <Card>
            <CardContent className="p-4 text-center text-sm">
              Finding best team...
            </CardContent>
          </Card>
        )}

        {/* LIST */}
        {!loading && sortedCandidates.length > 0 && (
          <div className="space-y-2">
            {sortedCandidates.map((w) => (
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
        {!loading && sortedCandidates.length === 0 && (
          <Card>
            <CardContent className="p-4 text-center text-sm text-muted-foreground">
              No additional members available
            </CardContent>
          </Card>
        )}

      </div>

      {/* 📱 CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-background border-t space-y-2">

        <Button
          variant="outline"
          className="w-full h-12"
          onClick={() => setStep("done")}
        >
          Work alone
        </Button>

        <Button
          className="w-full h-12 bg-gradient-primary"
          onClick={() => setStep("done")}
        >
          Confirm team
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>

      </div>
    </div>
  );
};