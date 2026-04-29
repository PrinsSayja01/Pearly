import { useEffect, useState, useRef } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import { buildSmartTeam } from "@/features/phase1/utils/teamEngine";
import { usePhase1Store } from "../store";
import { CandidateCard } from "../components/CandidateCard";
import { StepHeader } from "../components/StepHeader";

const API_URL = import.meta.env.VITE_API_URL;

const roles = [
  "roofer","plumber","electrician","carpenter",
  "painter","tiler","cleaner","helper",
];

const languages = ["de", "en", "pl", "ua", "ru", "tr"];
const locations = ["munich", "berlin", "hamburg"];

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

  const [manualRole, setManualRole] = useState("");
  const [selectedLang, setSelectedLang] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const [candidates, setCandidates] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const autoSelectedRef = useRef(false);

  const activeRole = manualRole || detectedProfession;

  useEffect(() => {
    autoSelectedRef.current = false;
  }, [activeRole, selectedLang, selectedLocation]);

  // 🔥 AVAILABILITY STATUS
  const getAvailabilityStatus = (worker: any) => {
    if (!setup.startDate) return { label: "Unknown", color: "text-gray-500" };

    if (worker.availability?.includes(setup.startDate)) {
      return { label: "Available now", color: "text-green-600" };
    }

    const future = worker.availability?.some((d: string) => d > setup.startDate);

    if (future) {
      return { label: "Available later", color: "text-yellow-600" };
    }

    return { label: "Not available", color: "text-red-500" };
  };

  // 🧠 BEST VS OTHERS
  const getComparisonInsight = (list: any[]) => {
    if (!list || list.length < 2) return null;

    const best = list[0];
    const second = list[1];

    const insights = [];

    if (best.skill > second.skill) insights.push("Higher skill");
    if (best.rating > second.rating) insights.push("Better rating");
    if ((best.match_score || 0) > (second.match_score || 0)) insights.push("Top match score");

    return insights;
  };

  // 🧠 PER CARD REASON
  const getCardReason = (worker: any, best: any) => {
    const reasons = [];

    if (worker.id === best?.id) {
      reasons.push("Best fit for your job");
    } else {
      if (worker.skill > best.skill) reasons.push("Higher skill but weaker match");
      if ((worker.match_score || 0) < (best.match_score || 0)) reasons.push("Lower match score");
    }

    return reasons;
  };

  // 🚀 AI RECOMMENDATION (CORE FEATURE)
  const getAIRecommendation = (list: any[]) => {
    if (!list || list.length === 0) return null;

    const best = list[0];
    const status = getAvailabilityStatus(best);

    if (status.label === "Available now") {
      return {
        type: "choose_now",
        text: "Best candidate is available now. Recommended to proceed immediately.",
      };
    }

    const betterLater = list.find((c) => {
      const s = getAvailabilityStatus(c);
      return s.label === "Available later" && c.skill >= best.skill;
    });

    if (betterLater) {
      return {
        type: "wait",
        text: "A stronger candidate is available later. You may wait for better quality.",
      };
    }

    return {
      type: "fallback",
      text: "No perfect match available now. Consider selecting best available option.",
    };
  };

  // 🚀 FETCH
  useEffect(() => {
    const fetchCandidates = async () => {
      if (!setup.startDate || !activeRole) return;

      setLoading(true);

      try {
        const res = await axios.get(`${API_URL}/candidates`, {
          params: {
            role: activeRole,
            language: selectedLang || undefined,
            location: selectedLocation || undefined,
          },
        });

        let list = res.data?.candidates || [];

        // strict role
        list = list.filter((c: any) => c.role === activeRole);

        // frontend safety
        if (selectedLang) {
          list = list.filter((c: any) => c.languages.includes(selectedLang));
        }

        if (selectedLocation) {
          list = list.filter((c: any) => c.location === selectedLocation);
        }

        const sorted = list.sort(
          (a: any, b: any) => (b.match_score || 0) - (a.match_score || 0)
        );

        setCandidates(sorted);
        setCount(sorted.length);

        localStorage.setItem("candidates", JSON.stringify(sorted));

        if (!autoSelectedRef.current && sorted.length > 0) {
          const best = sorted[0];

          selectCandidate(String(best.id));
          setSelectedCandidate(best);

          if (teamMemberIds.length === 0 && sorted.length > 1) {
            const smartTeam = buildSmartTeam({
              candidates: sorted,
              lead: best,
              jobRole: activeRole,
            });

            smartTeam.forEach((m: any) => {
              if (String(m.id) !== String(best.id)) {
                toggleTeamMember(String(m.id));
              }
            });
          }

          autoSelectedRef.current = true;
        }

      } catch (err: any) {
        setCandidates([]);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [setup.startDate, activeRole, selectedLang, selectedLocation]);

  const handleSelectLeader = (worker: any) => {
    const id = String(worker.id);

    if (id === String(selectedCandidateId)) return;

    if (teamMemberIds.includes(id)) {
      toggleTeamMember(id);
    }

    selectCandidate(id);
    setSelectedCandidate(worker);
  };

  const recommendation = getAIRecommendation(candidates);

  return (
    <div className="space-y-4 pb-28 max-w-md mx-auto">

      <StepHeader
        step={3}
        total={6}
        title="Choose specialist"
        subtitle="AI-driven decision support"
        onBack={() => setStep("setup")}
      />

      <div className="text-xs text-blue-600">
        Active role: {activeRole}
      </div>

      <div className="text-sm font-medium">
        {count} specialists found
      </div>

      {/* 🧠 AI RECOMMENDATION */}
      {recommendation && (
        <div className="text-xs bg-blue-50 p-3 rounded-lg text-blue-700">
          {recommendation.text}
        </div>
      )}

      {/* 🧠 WHY BEST */}
      {candidates.length > 1 && (
        <div className="text-xs bg-muted p-3 rounded-lg">
          <div className="font-medium">Why this is best:</div>
          {getComparisonInsight(candidates)?.map((r, i) => (
            <div key={i}>• {r}</div>
          ))}
        </div>
      )}

      {/* FILTERS */}
      <div className="flex gap-2 overflow-x-auto">
        {roles.map((r) => (
          <Button
            key={r}
            size="sm"
            variant={activeRole === r ? "default" : "outline"}
            onClick={() => setManualRole(r)}
          >
            {r}
          </Button>
        ))}
      </div>

      {/* LIST */}
      {!loading && candidates.length > 0 && (
        <div className="space-y-3">
          {candidates.map((w, i) => {
            const isLead = String(w.id) === String(selectedCandidateId);
            const status = getAvailabilityStatus(w);
            const reasons = getCardReason(w, candidates[0]);

            return (
              <div key={w.id} className="space-y-1">

                {i === 0 && (
                  <div className="text-xs text-green-600">
                    🎯 Best match
                  </div>
                )}

                <div
                  onClick={() => handleSelectLeader(w)}
                  className="cursor-pointer"
                >
                  <CandidateCard
                    worker={w}
                    selected={isLead}
                  />
                </div>

                <div className={`text-xs pl-2 ${status.color}`}>
                  {status.label}
                </div>

                {reasons.map((r: string, idx: number) => (
                  <div key={idx} className="text-[11px] text-muted-foreground pl-2">
                    • {r}
                  </div>
                ))}

              </div>
            );
          })}
        </div>
      )}

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