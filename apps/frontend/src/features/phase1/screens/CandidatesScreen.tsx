import { useEffect, useState, useRef } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import { buildSmartTeam } from "@/features/phase1/utils/teamEngine";
import { usePhase1Store } from "../store";
import { CandidateCard } from "../components/CandidateCard";
import { StepHeader } from "../components/StepHeader";

const API_URL = import.meta.env.VITE_API_URL;

export const CandidatesScreen = () => {
  const {
    selectedCandidateId,
    selectCandidate,
    setSelectedCandidate,
    setStep,
    setup,
    detectedProfession,
    teamMemberIds,
    toggleTeamMember,
  } = usePhase1Store();

  const [candidates, setCandidates] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const autoSelectedRef = useRef(false);

  // 🔁 Reset auto-select when profession changes
  useEffect(() => {
    autoSelectedRef.current = false;
  }, [detectedProfession]);

  // 🚀 FETCH DATA
  useEffect(() => {
    const fetchCandidates = async () => {
      if (!setup.startDate) return;

      setLoading(true);

      try {
        const res = await axios.get(`${API_URL}/candidates`, {
          params: {
            role: detectedProfession || undefined,
          },
        });

        const list = res.data?.candidates || [];

        // ✅ STRICT FILTER (extra safety)
        const filtered = detectedProfession
          ? list.filter((c: any) => c.role === detectedProfession)
          : list;

        // ✅ SORT AFTER FILTER
        const sorted = [...filtered].sort(
          (a, b) => (b.match_score || 0) - (a.match_score || 0)
        );

        setCandidates(sorted);
        setCount(sorted.length);

        // store for next screens
        localStorage.setItem("candidates", JSON.stringify(sorted));

        // 🤖 AUTO SELECT BEST (ONLY ONCE)
        if (!autoSelectedRef.current && sorted.length > 0) {
          const best = sorted[0];

          selectCandidate(String(best.id));
          setSelectedCandidate(best);

          // 👷 AI TEAM BUILD (ONLY IF EMPTY)
          if (teamMemberIds.length === 0 && sorted.length > 1) {
            const smartTeam = buildSmartTeam({
              candidates: sorted,
              lead: best,
              jobRole: detectedProfession,
            });

            smartTeam.forEach((m: any) => {
              const id = String(m.id);
              if (id !== String(best.id)) {
                toggleTeamMember(id);
              }
            });
          }

          autoSelectedRef.current = true;
        }

      } catch (err: any) {
        console.error("❌ API error:", err?.message);
        setCandidates([]);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [setup.startDate, detectedProfession]);

  // 👑 CHANGE LEADER
  const handleSelectLeader = (worker: any) => {
    const id = String(worker.id);

    if (id === String(selectedCandidateId)) return;

    // remove from team if already added
    if (teamMemberIds.includes(id)) {
      toggleTeamMember(id);
    }

    selectCandidate(id);
    setSelectedCandidate(worker);
  };

  // 👷 TOGGLE TEAM MEMBER
  const handleToggleMember = (id: number | string) => {
    const strId = String(id);

    // prevent leader duplication
    if (strId === String(selectedCandidateId)) return;

    toggleTeamMember(strId);
  };

  return (
    <div className="space-y-4 pb-28 max-w-md mx-auto">

      <StepHeader
        step={3}
        total={6}
        title="Choose specialist"
        subtitle="Strict role matching"
        onBack={() => setStep("setup")}
      />

      <div className="text-sm font-medium">
        {count} specialists found
      </div>

      {/* ⏳ LOADING */}
      {loading && (
        <div className="text-center text-sm text-muted-foreground">
          Loading candidates...
        </div>
      )}

      {/* ❌ EMPTY */}
      {!loading && candidates.length === 0 && (
        <div className="text-center text-sm text-muted-foreground">
          No matching professionals found
        </div>
      )}

      {/* ✅ LIST */}
      {!loading && candidates.length > 0 && (
        <div className="space-y-3">

          {candidates.map((w, i) => {
            const id = String(w.id);
            const isLead = id === String(selectedCandidateId);
            const isTeam = teamMemberIds.includes(id);

            return (
              <div key={id} className="space-y-1">

                {/* 🎯 BEST MATCH */}
                {i === 0 && (
                  <div className="text-xs text-green-600">
                    🎯 Best match
                  </div>
                )}

                {/* 👑 SELECT LEADER */}
                <div
                  onClick={() => handleSelectLeader(w)}
                  className="cursor-pointer"
                >
                  <CandidateCard
                    worker={w}
                    selected={isLead}
                    isBest={i === 0}
                  />
                </div>

                {/* 👷 TEAM BUTTON */}
                {!isLead && (
                  <div className="pl-2">
                    <Button
                      size="sm"
                      variant={isTeam ? "default" : "outline"}
                      onClick={() => handleToggleMember(id)}
                    >
                      {isTeam ? "Added" : "Add to team"}
                    </Button>
                  </div>
                )}

              </div>
            );
          })}

        </div>
      )}

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-background border-t">
        <Button
          className="w-full"
          disabled={!selectedCandidateId}
          onClick={() => setStep("done")}
        >
          Confirm Team <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

    </div>
  );
};