import { useEffect, useState, useRef, useMemo } from "react";
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

  // ✅ MULTI LANGUAGE
  const [selectedLangs, setSelectedLangs] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");

  const [candidates, setCandidates] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const autoSelectedRef = useRef(false);

  const activeRole = manualRole || detectedProfession;

  useEffect(() => {
    autoSelectedRef.current = false;
  }, [activeRole, selectedLangs, selectedLocation]);

  // 🔁 toggle multi lang
  const toggleLang = (lang: string) => {
    setSelectedLangs((prev) =>
      prev.includes(lang)
        ? prev.filter((l) => l !== lang)
        : [...prev, lang]
    );
  };

  // 🔥 availability logic
  const getAvailability = (worker: any) => {
    if (!setup.startDate) return "unknown";

    if (worker.availability?.includes(setup.startDate)) return "now";

    const future = worker.availability?.some((d: string) => d > setup.startDate);
    if (future) return "later";

    return "none";
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
            // ✅ FIX: send array, not string
            languages: selectedLangs.length ? selectedLangs : undefined,
            location: selectedLocation || undefined,
          },
        });

        let list = res.data?.candidates || [];

        // ✅ HARD ROLE FILTER
        list = list.filter((c: any) => c.role === activeRole);

        // ✅ OR LANGUAGE FILTER (frontend safety)
        if (selectedLangs.length > 0) {
          list = list.filter((c: any) =>
            c.languages.some((l: string) =>
              selectedLangs.includes(l)
            )
          );
        }

        // ✅ LOCATION FILTER
        if (selectedLocation) {
          list = list.filter(
            (c: any) => c.location === selectedLocation
          );
        }

        // ✅ SORT AFTER FILTER
        const sorted = [...list].sort(
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
              if (String(m.id) !== String(best.id)) {
                toggleTeamMember(String(m.id));
              }
            });
          }

          autoSelectedRef.current = true;
        }

      } catch (err) {
        console.error("API error", err);
        setCandidates([]);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [setup.startDate, activeRole, selectedLangs, selectedLocation]);

  // 🧠 dynamic filter availability
  const availableLangs = useMemo(() => {
    return new Set(candidates.flatMap((c) => c.languages));
  }, [candidates]);

  const availableLocations = useMemo(() => {
    return new Set(candidates.map((c) => c.location));
  }, [candidates]);

  const handleSelectLeader = (worker: any) => {
    if (getAvailability(worker) === "none") return;

    const id = String(worker.id);

    if (teamMemberIds.includes(id)) {
      toggleTeamMember(id);
    }

    selectCandidate(id);
    setSelectedCandidate(worker);
  };

  const handleToggleTeam = (worker: any) => {
    const id = String(worker.id);

    if (id === selectedCandidateId) return;
    if (getAvailability(worker) === "none") return;

    toggleTeamMember(id);
  };

  return (
    <div className="space-y-4 pb-28 max-w-md mx-auto">

      <StepHeader
        step={3}
        total={6}
        title="Choose specialist"
        subtitle="Strict + OR language filtering"
        onBack={() => setStep("setup")}
      />

      <div className="text-xs text-blue-600">
        Active role: {activeRole}
      </div>

      <div className="text-sm font-medium">
        {count} specialists found
      </div>

      {/* 🌍 LANGUAGE FILTER */}
      <div className="flex gap-2 flex-wrap">
        {languages.map((l) => (
          <Button
            key={l}
            size="sm"
            disabled={!availableLangs.has(l)}
            variant={selectedLangs.includes(l) ? "default" : "outline"}
            onClick={() => toggleLang(l)}
          >
            {l.toUpperCase()}
          </Button>
        ))}
      </div>

      {/* 📍 LOCATION FILTER */}
      <div className="flex gap-2">
        {locations.map((loc) => (
          <Button
            key={loc}
            size="sm"
            disabled={!availableLocations.has(loc)}
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

      {/* LIST */}
      {!loading && candidates.length > 0 && (
        <div className="space-y-3">
          {candidates.map((w, i) => {
            const id = String(w.id);
            const isLead = id === selectedCandidateId;
            const isTeam = teamMemberIds.includes(id);

            const availability = getAvailability(w);
            const disabled = availability === "none";

            return (
              <div key={id} className="space-y-1">

                {i === 0 && (
                  <div className="text-xs text-green-600">
                    🎯 Best match
                  </div>
                )}

                <div
                  onClick={() => !disabled && handleSelectLeader(w)}
                  className={`
                    cursor-pointer rounded-xl border
                    ${isLead ? "border-blue-600 shadow-md" : ""}
                    ${isTeam ? "border-purple-500 border-dashed" : ""}
                    ${disabled ? "opacity-40 cursor-not-allowed" : ""}
                  `}
                >
                  <CandidateCard worker={w} selected={isLead} />
                </div>

                <div className="text-xs pl-2">
                  {availability === "now" && "🟢 Available now"}
                  {availability === "later" && "🟡 Available later"}
                  {availability === "none" && "🔴 Not available"}
                </div>

                {!isLead && !disabled && (
                  <div className="pl-2">
                    <Button
                      size="sm"
                      variant={isTeam ? "default" : "outline"}
                      onClick={() => handleToggleTeam(w)}
                    >
                      {isTeam ? "Remove" : "Add to team"}
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