import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

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

// ✅ RELATED ROLES
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
  } = usePhase1Store();

  const [filters, setFilters] = useState({
    role: "",
    language: "",
    location: "",
  });

  const [skill, setSkill] = useState(0); // ✅ NEW
  const [candidates, setCandidates] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const toggleFilter = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key as keyof typeof prev] === value ? "" : value,
    }));
  };

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
            minSkill: skill || undefined, // ✅ NEW
          },
        });

        setCandidates(res.data?.candidates || []);
        setCount(res.data?.count || 0);
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

  return (
    <div className="space-y-4 pb-24 max-w-md mx-auto">

      <StepHeader
        step={3}
        total={6}
        title="Choose specialist"
        subtitle="Smart matching based on filters"
        onBack={() => setStep("setup")}
      />

      {/* COUNTER */}
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

      {/* ✅ RELATED ROLE SUGGESTIONS */}
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

      {/* ✅ SKILL SLIDER */}
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

      {/* LOADING */}
      {loading && (
        <Card>
          <CardContent className="p-5 text-center">
            Finding specialists...
          </CardContent>
        </Card>
      )}

      {/* LIST */}
      {!loading && candidates.length > 0 && (
        <div className="space-y-3">
          {candidates.map((w, i) => (
            <div key={w.id}>
              {i === 0 && <div className="text-xs text-green-600">🎯 Best match</div>}
              {w.relaxed && <div className="text-xs text-yellow-600">Closest match</div>}
              {w.match_reasons?.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  Why: {w.match_reasons.join(", ")}
                </div>
              )}
              <CandidateCard
                worker={w}
                selected={String(selectedCandidateId) === String(w.id)}
                onSelect={() => {
                  selectCandidate(String(w.id));
                  setSelectedCandidate(w);
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* EMPTY + AUTO SUGGEST */}
      {!loading && candidates.length === 0 && (
        <Card>
          <CardContent className="text-center space-y-2">
            <div>No matches. Try removing filters.</div>

            {(filters.role || detectedProfession) && (
              <div className="flex gap-2 flex-wrap justify-center">
                {(RELATED_ROLES[filters.role || detectedProfession] || []).map((r) => (
                  <Button
                    key={r}
                    size="sm"
                    onClick={() => toggleFilter("role", r)}
                  >
                    Try {r}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-background border-t">
        <Button
          className="w-full"
          disabled={!selectedCandidateId}
          onClick={() => setStep("confirm")}
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};