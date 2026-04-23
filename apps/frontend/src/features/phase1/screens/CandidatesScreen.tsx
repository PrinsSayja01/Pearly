import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, SlidersHorizontal } from "lucide-react";

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
  } = usePhase1Store();

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    role: "",
    language: "",
    location: "",
  });

  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      if (!setup.startDate) return;

      setLoading(true);

      try {
        const res = await axios.get(`${API_URL}/candidates`, {
          params: {
            date: setup.startDate,
            role: detectedProfession || filters.role || undefined,
            language: filters.language || undefined,
            location: filters.location || undefined,
          },
        });

        if (res.data?.candidates) {
          setCandidates(res.data.candidates);
        } else {
          setCandidates([]);
        }
      } catch (err: any) {
        console.error("API error:", err?.message);
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [setup.startDate, detectedProfession]);

  return (
    <div className="space-y-4 pb-20">

      <StepHeader
        step={3}
        total={6}
        title="Available specialists"
        subtitle="Select one to continue"
        onBack={() => setStep("setup")}
      />

      {/* FILTER BUTTON */}
      <div className="flex items-center">
        <Button
          variant="outline"
          size="sm"
          className="ml-auto h-9"
          onClick={() => setShowFilters((v) => !v)}
        >
          <SlidersHorizontal className="h-4 w-4 mr-1" />
          Filters
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
          <CardContent className="p-5 text-center text-sm">
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
          <CardContent className="p-5 text-center text-sm">
            No specialists available
          </CardContent>
        </Card>
      )}

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-background border-t">
        <Button
          className="w-full h-12"
          disabled={!selectedCandidateId}
          onClick={() => setStep("confirm")}
        >
          Select specialist <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};