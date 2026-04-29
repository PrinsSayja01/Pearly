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

        const list = res.data?.candidates || [];

        // ✅ STRICT ROLE FILTER
        let filtered = list.filter(
          (c: any) => c.role === activeRole
        );

        // ✅ FRONTEND EXTRA FILTERS (safety)
        if (selectedLang) {
          filtered = filtered.filter((c: any) =>
            c.languages.includes(selectedLang)
          );
        }

        if (selectedLocation) {
          filtered = filtered.filter(
            (c: any) =>
              c.location.toLowerCase() === selectedLocation.toLowerCase()
          );
        }

        // ✅ SORT AFTER FILTER
        const sorted = filtered.sort(
          (a: any, b: any) =>
            (b.match_score || 0) - (a.match_score || 0)
        );

        setCandidates(sorted);
        setCount(sorted.length);

        localStorage.setItem("candidates", JSON.stringify(sorted));

        // 🤖 AUTO SELECT
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

  return (
    <div className="space-y-4 pb-28 max-w-md mx-auto">

      <StepHeader
        step={3}
        total={6}
        title="Choose specialist"
        subtitle="Strict role + smart filters"
        onBack={() => setStep("setup")}
      />

      {/* ACTIVE ROLE */}
      <div className="text-xs text-blue-600 font-medium">
        Active role: {activeRole || "Not detected"}
      </div>

      <div className="text-sm font-medium">
        {count} specialists found
      </div>

      {/* ROLE FILTER */}
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

      {/* LANGUAGE FILTER */}
      <div className="flex gap-2">
        {languages.map((l) => (
          <Button
            key={l}
            size="sm"
            variant={selectedLang === l ? "default" : "outline"}
            onClick={() =>
              setSelectedLang(selectedLang === l ? "" : l)
            }
          >
            {l.toUpperCase()}
          </Button>
        ))}
      </div>

      {/* LOCATION FILTER */}
      <div className="flex gap-2 overflow-x-auto">
        {locations.map((loc) => (
          <Button
            key={loc}
            size="sm"
            variant={selectedLocation === loc ? "default" : "outline"}
            onClick={() =>
              setSelectedLocation(
                selectedLocation === loc ? "" : loc
              )
            }
          >
            {loc}
          </Button>
        ))}
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center text-sm text-muted-foreground">
          Loading candidates...
        </div>
      )}

      {/* EMPTY */}
      {!loading && candidates.length === 0 && (
        <div className="text-center text-sm text-muted-foreground">
          No matching professionals found
        </div>
      )}

      {/* LIST */}
      {!loading && candidates.length > 0 && (
        <div className="space-y-3">
          {candidates.map((w, i) => {
            const id = String(w.id);
            const isLead = id === String(selectedCandidateId);

            return (
              <div key={id}>
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
                    isBest={i === 0}
                  />
                </div>
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