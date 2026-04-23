import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, SlidersHorizontal } from "lucide-react";

import { usePhase1Store } from "../store";
import { CandidateCard } from "../components/CandidateCard";
import { StepHeader } from "../components/StepHeader";

export const CandidatesScreen = () => {
  const {
    selectedCandidateId,
    selectCandidate,
    setSelectedCandidate,
    setStep,
    setup,
    detectedProfession,
  } = usePhase1Store();

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    role: "",
    language: "",
    location: "",
  });

  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ CORRECT API CALL (INSIDE ASYNC)
  useEffect(() => {
    const fetchCandidates = async () => {
      if (!setup.startDate) {
        console.warn("⚠️ No start date");
        return;
      }

      setLoading(true);

      try {
        console.log("📡 API CALL →", setup.startDate);

        const res = await axios.get(
          "http://127.0.0.1:8002/candidates",
          {
            params: {
              date: setup.startDate,
              role: detectedProfession || filters.role || undefined,
              language: filters.language || undefined,
              location: filters.location || undefined,
            },
          }
        );

        console.log("✅ API RESPONSE:", res.data);

        if (Array.isArray(res.data)) {
          setCandidates(res.data);
        } else if (res.data?.candidates) {
          setCandidates(res.data.candidates);
        } else {
          setCandidates([]);
        }

      } catch (err: any) {
        console.error("❌ API error:", err?.message);
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [setup.startDate, detectedProfession]); // ✅ important deps

  return (
    <div className="space-y-5">

      <StepHeader
        step={3}
        total={6}
        title="Available specialists"
        subtitle="Select one to continue"
        onBack={() => setStep("setup")}
      />

      {/* FILTER BUTTON */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="ml-auto h-8"
          onClick={() => setShowFilters((v) => !v)}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
        </Button>
      </div>

      {/* FILTER PANEL */}
      {showFilters && (
        <Card>
          <CardContent className="p-3 space-y-2">
            <Input
              placeholder="Role"
              value={filters.role}
              onChange={(e) =>
                setFilters((f) => ({ ...f, role: e.target.value }))
              }
            />
            <Input
              placeholder="Language"
              value={filters.language}
              onChange={(e) =>
                setFilters((f) => ({ ...f, language: e.target.value }))
              }
            />
            <Input
              placeholder="Location"
              value={filters.location}
              onChange={(e) =>
                setFilters((f) => ({ ...f, location: e.target.value }))
              }
            />
          </CardContent>
        </Card>
      )}

      {/* LOADING */}
      {loading && (
        <Card>
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            Loading specialists...
          </CardContent>
        </Card>
      )}

      {/* LIST */}
      {!loading && candidates.length > 0 && (
        <div className="space-y-2">
          {candidates.map((w) => (
            <div
              key={w.id}
              onClick={() => {
                console.log("✅ SELECT:", w);

                selectCandidate(String(w.id));
                setSelectedCandidate(w);
              }}
              className="cursor-pointer"
            >
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
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            No specialists available
          </CardContent>
        </Card>
      )}

      {/* CTA */}
      <div className="sticky bottom-3 pt-2">
        <Button
          className="w-full h-12 bg-gradient-primary hover:opacity-90 shadow-elegant"
          disabled={!selectedCandidateId}
          onClick={() => {
            if (!selectedCandidateId) {
              alert("Please select a specialist");
              return;
            }

            console.log("➡️ GO TO CONFIRM:", selectedCandidateId);
            setStep("confirm");
          }}
        >
          Select specialist <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

    </div>
  );
};