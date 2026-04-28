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
  "plumber","electrician","roofer","carpenter",
  "painter","tiler","cleaner","helper",
];

const languages = ["de", "en", "pl", "ua", "ru", "tr"];
const locations = ["munich", "berlin", "hamburg"];

const RELATED_ROLES: Record<string, string[]> = {
  roofer: ["carpenter"],
  plumber: ["helper"],
  electrician: ["helper"],
  carpenter: ["roofer"],
  painter: ["tiler"],
  tiler: ["painter"],
  cleaner: [],
  helper: [],
};

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

  const [filters, setFilters] = useState({
    role: "",
    language: "",
    location: "",
  });

  const [skill, setSkill] = useState(0);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const autoSelectedRef = useRef(false);

  // reset auto select on filter change
  useEffect(() => {
    autoSelectedRef.current = false;
  }, [filters, detectedProfession, skill]);

  const toggleFilter = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key as keyof typeof prev] === value ? "" : value,
    }));
  };

  // 🚀 FETCH + AI ENGINE
  useEffect(() => {
    const fetchCandidates = async () => {
      if (!setup.startDate) return;

      setLoading(true);

      try {
        const res = await axios.get(`${API_URL}/candidates`, {
          params: {
            startDate: setup.startDate,
            endDate: setup.endDate,
            role: filters.role || detectedProfession || undefined,
            language: filters.language || undefined,
            location: filters.location || undefined,
            minSkill: skill || undefined,
          },
        });

        const list = res.data?.candidates || [];

        setCandidates(list);
        setCount(res.data?.count || 0);

        localStorage.setItem("candidates", JSON.stringify(list));

        // 🤖 AUTO SELECT + TEAM
        if (!autoSelectedRef.current && list.length > 0) {
          const best = list[0];

          selectCandidate(String(best.id));
          setSelectedCandidate(best);

          if (teamMemberIds.length === 0 && list.length > 1) {
            const smartTeam = buildSmartTeam({
              candidates: list,
              lead: best,
              jobRole: filters.role || detectedProfession,
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
  }, [setup.startDate, setup.endDate, detectedProfession, filters, skill]);

  // 👑 CHANGE LEADER
  const handleSelectLeader = (worker: any) => {
    const id = String(worker.id);

    if (id === String(selectedCandidateId)) return;

    if (teamMemberIds.includes(id)) {
      toggleTeamMember(id);
    }

    selectCandidate(id);
    setSelectedCandidate(worker);
  };

  // 👷 TEAM TOGGLE
  const handleToggleMember = (id: number | string) => {
    const strId = String(id);

    if (strId === String(selectedCandidateId)) return;

    toggleTeamMember(strId);
  };

  return (
    <div className="space-y-4 pb-28 max-w-md mx-auto">

      <StepHeader
        step={3}
        total={6}
        title="Build your team"
        subtitle="Smart matching + AI team building"
        onBack={() => setStep("setup")}
      />

      <div className="text-sm font-medium">
        {count} specialists found
      </div>

      {/* ROLE */}
      <div className="flex gap-2 overflow-x-auto">
        {roles.map((r) => (
          <Button
            key={r}
            size="sm"
            variant={filters.role === r ? "default" : "outline"}
            onClick={() => toggleFilter("role", r)}
          >
            {r}
          </Button>
        ))}
      </div>

      {/* RELATED */}
      {(filters.role || detectedProfession) && (
        <div className="flex gap-2 flex-wrap">
          {(RELATED_ROLES[filters.role || detectedProfession] || []).map((r) => (
            <Button
              key={r}
              size="sm"
              variant="secondary"
              onClick={() => toggleFilter("role", r)}
            >
              Suggest: {r}
            </Button>
          ))}
        </div>
      )}

      {/* LANGUAGE */}
      <div className="flex gap-2">
        {languages.map((l) => (
          <Button
            key={l}
            size="sm"
            variant={filters.language === l ? "default" : "outline"}
            onClick={() => toggleFilter("language", l)}
          >
            {l.toUpperCase()}
          </Button>
        ))}
      </div>

      {/* LOCATION */}
      <div className="flex gap-2 overflow-x-auto">
        {locations.map((loc) => (
          <Button
            key={loc}
            size="sm"
            variant={filters.location === loc ? "default" : "outline"}
            onClick={() => toggleFilter("location", loc)}
          >
            {loc}
          </Button>
        ))}
      </div>

      {/* SKILL */}
      <div>
        <div className="text-xs">Skill: {skill}+</div>
        <input
          type="range"
          min="0"
          max="5"
          value={skill}
          onChange={(e) => setSkill(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* LIST */}
      {!loading && candidates.length > 0 && (
        <div className="space-y-3">
          {candidates.map((w, i) => {
            const id = String(w.id);
            const isLead = id === String(selectedCandidateId);
            const isTeam = teamMemberIds.includes(id);

            return (
              <div key={id} className="space-y-1">

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