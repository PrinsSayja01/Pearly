import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

import { usePhase1Store } from "../store";
import { CandidateCard } from "../components/CandidateCard";
import { StepHeader } from "../components/StepHeader";

const API_URL = import.meta.env.VITE_API_URL;

const roles = ["plumber", "electrician", "technician"];
const languages = ["de", "en"];
const locations = ["munich", "berlin", "hamburg"];

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

  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔁 toggle filter
  const toggleFilter = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key as keyof typeof prev] === value ? "" : value,
    }));
  };

  // 🚀 FETCH (progressive)
  useEffect(() => {
    const fetchCandidates = async () => {
      if (!setup.startDate) return;

      setLoading(true);

      try {
        console.log("📡 FETCH:", {
          startDate: setup.startDate,
          endDate: setup.endDate,
          filters,
        });

        const res = await axios.get(`${API_URL}/candidates`, {
          params: {
            startDate: setup.startDate,
            endDate: setup.endDate,
            role: detectedProfession || filters.role || undefined,
            language: filters.language || undefined,
            location: filters.location || undefined,
          },
        });

        setCandidates(res.data?.candidates || []);
      } catch (err: any) {
        console.error("❌ API error:", err?.message);
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [setup.startDate, setup.endDate, detectedProfession, filters]);

  return (
    <div className="space-y-4 pb-24 max-w-md mx-auto">

      {/* HEADER */}
      <StepHeader
        step={3}
        total={6}
        title="Choose specialist"
        subtitle="Smart matching based on your filters"
        onBack={() => setStep("setup")}
      />

      {/* ACTIVE FILTERS */}
      <div className="text-xs text-muted-foreground">
        Active:{" "}
        {Object.entries(filters)
          .filter(([_, v]) => v)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", ") || "none"}
      </div>

      {/* ROLE */}
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground">Role</div>
        <div className="flex gap-2 overflow-x-auto">
          {roles.map((r) => (
            <Button
              key={r}
              size="sm"
              variant={filters.role === r ? "default" : "outline"}
              className="rounded-full whitespace-nowrap"
              onClick={() => toggleFilter("role", r)}
            >
              {r}
            </Button>
          ))}
        </div>
      </div>

      {/* LANGUAGE */}
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground">
          Language (optional)
        </div>
        <div className="flex gap-2">
          {languages.map((l) => (
            <Button
              key={l}
              size="sm"
              variant={filters.language === l ? "default" : "outline"}
              className="rounded-full"
              onClick={() => toggleFilter("language", l)}
            >
              {l.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      {/* LOCATION */}
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground">Location</div>
        <div className="flex gap-2 overflow-x-auto">
          {locations.map((loc) => (
            <Button
              key={loc}
              size="sm"
              variant={filters.location === loc ? "default" : "outline"}
              className="rounded-full whitespace-nowrap"
              onClick={() => toggleFilter("location", loc)}
            >
              {loc}
            </Button>
          ))}
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <Card>
          <CardContent className="p-5 text-center text-sm">
            Finding best specialists...
          </CardContent>
        </Card>
      )}

      {/* LIST */}
      {!loading && candidates.length > 0 && (
        <div className="space-y-3">

          {candidates.map((w, index) => (
            <div
              key={w.id}
              onClick={() => {
                selectCandidate(String(w.id));
                setSelectedCandidate(w);
              }}
              className="cursor-pointer"
            >
              {/* 🧠 AI TAG (TOP MATCH) */}
              {index === 0 && (
                <div className="text-[10px] text-green-600 mb-1">
                  🎯 Best match
                </div>
              )}

              {/* ⚠️ RELAXED MATCH */}
              {w.relaxed && (
                <div className="text-[10px] text-yellow-600 mb-1">
                  Showing closest match
                </div>
              )}

              {/* 🧠 EXPLAINABLE AI */}
              {w.match_reasons?.length > 0 && (
                <div className="text-[10px] text-muted-foreground mb-1">
                  Why: {w.match_reasons.join(", ")}
                </div>
              )}

              <CandidateCard
                worker={w}
                selected={String(selectedCandidateId) === String(w.id)}
              />
            </div>
          ))}

        </div>
      )}

      {/* EMPTY */}
      {!loading && candidates.length === 0 && (
        <Card>
          <CardContent className="p-5 text-center text-sm">
            No strong matches. Try removing filters.
          </CardContent>
        </Card>
      )}

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-background border-t max-w-md mx-auto">
        <Button
          className="w-full h-12"
          disabled={!selectedCandidateId}
          onClick={() => setStep("confirm")}
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};