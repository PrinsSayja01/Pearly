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
    selectedCandidateId,
    selectCandidate,
    setSelectedCandidate,
    teamMemberIds,
    toggleTeamMember,
    setStep,
  } = usePhase1Store();

  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const autoSelectedRef = useRef(false);

  if (!selectedCandidate) {
    return <div>No lead selected</div>;
  }

  const lead = selectedCandidate;

  // 📦 FETCH
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/candidates`);
        const data = res.data?.candidates || [];
        setCandidates(data);
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  // 📊 SORT
  const sorted = useMemo(() => {
    return [...candidates].sort(
      (a, b) => (b.match_score || 0) - (a.match_score || 0)
    );
  }, [candidates]);

  const suggested = useMemo(() => sorted.slice(0, 3), [sorted]);

  const manualList = useMemo(() => {
    const ids = suggested.map((s) => String(s.id));
    return sorted.filter((w) => !ids.includes(String(w.id)));
  }, [sorted]);

  // 🤖 AUTO TEAM
  useEffect(() => {
    if (!autoSelectedRef.current && suggested.length > 0) {
      suggested.forEach((m) => {
        const id = String(m.id);
        if (id !== String(lead.id) && !teamMemberIds.includes(id)) {
          toggleTeamMember(id);
        }
      });
      autoSelectedRef.current = true;
    }
  }, [suggested]);

  // 🔥 CHANGE LEADER (CORE FIX)
  const handleSelectLeader = (worker: any) => {
    const newId = String(worker.id);

    // remove from team if exists
    if (teamMemberIds.includes(newId)) {
      toggleTeamMember(newId);
    }

    selectCandidate(newId);
    setSelectedCandidate(worker);
  };

  const handleToggleMember = (id: number | string) => {
    const strId = String(id);

    // prevent adding leader as member
    if (strId === String(selectedCandidateId)) return;

    toggleTeamMember(strId);
  };

  return (
    <div className="space-y-5 pb-28">

      <StepHeader
        step={5}
        total={6}
        title="Build your team"
        subtitle="AI suggests, you control"
        onBack={() => setStep("candidates")}
      />

      {/* 👑 CURRENT LEADER */}
      <Card className="border-2 border-blue-500 bg-blue-50 rounded-2xl">
        <CardContent className="p-4 flex items-center gap-3">
          <Users className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-sm font-medium">{lead.name}</p>
            <p className="text-xs text-muted-foreground">
              Team lead (click others to change)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ⭐ AI SUGGESTED */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-primary">
          <Sparkles className="h-4 w-4" />
          AI Suggested Team
        </div>

        {suggested.map((w) => {
          const isLead = String(selectedCandidateId) === String(w.id);
          const isTeam = teamMemberIds.includes(String(w.id));

          return (
            <div key={w.id} className="space-y-1">

              <div className="flex gap-2">

                {/* SELECT LEADER */}
                <div
                  onClick={() => handleSelectLeader(w)}
                  className="flex-1"
                >
                  <CandidateCard
                    worker={w}
                    selected={isLead}
                    compact
                  />
                </div>

                {/* ADD MEMBER */}
                {!isLead && (
                  <Button
                    size="sm"
                    variant={isTeam ? "default" : "outline"}
                    onClick={() => handleToggleMember(w.id)}
                  >
                    {isTeam ? "Added" : "Add"}
                  </Button>
                )}

              </div>

            </div>
          );
        })}
      </div>

      {/* 🧠 MANUAL */}
      <div className="space-y-3">

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <UserPlus className="h-3 w-3" />
          Adjust team
        </div>

        {manualList.map((w) => {
          const isLead = String(selectedCandidateId) === String(w.id);
          const isTeam = teamMemberIds.includes(String(w.id));

          return (
            <div key={w.id} className="flex gap-2">

              <div
                onClick={() => handleSelectLeader(w)}
                className="flex-1"
              >
                <CandidateCard
                  worker={w}
                  selected={isLead}
                  compact
                />
              </div>

              {!isLead && (
                <Button
                  size="sm"
                  variant={isTeam ? "default" : "outline"}
                  onClick={() => handleToggleMember(w.id)}
                >
                  {isTeam ? "Added" : "Add"}
                </Button>
              )}

            </div>
          );
        })}

      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-background border-t space-y-2">

        <Button
          variant="outline"
          className="w-full"
          onClick={() => setStep("done")}
        >
          Work alone
        </Button>

        <Button
          className="w-full bg-gradient-to-r from-primary to-purple-500 text-white"
          onClick={() => setStep("done")}
        >
          Confirm team <ArrowRight className="ml-1 h-4 w-4" />
        </Button>

      </div>
    </div>
  );
};