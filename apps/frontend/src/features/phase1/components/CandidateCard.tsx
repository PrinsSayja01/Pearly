import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, SlidersHorizontal, Sparkles } from "lucide-react";

import { usePhase1Store } from "../store";
import { CandidateCard } from "../components/CandidateCard"; // ✅ FIX
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

        setCandidates(res.data?.candidates || []);
      } catch (err: any) {
        console.error("API error:", err?.message);
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [setup.startDate, detectedProfession, filters]);

  return (
    <div className="space-y-4 pb-24">
      <StepHeader
        step={3}
        total={6}
        title="Available specialists"
        subtitle="Pick the best match for your job"
        onBack={() => setStep("setup")}
      />

      {/* FILTER BUTTON */}
      <div className="flex items-center">
        <Button
          variant="outline"
          size="sm"
          className="ml-auto h-9"
          onClick={() => setShowFilters(true)}
        >
          <SlidersHorizontal className="h-4 w-4 mr-1" />
          Filters
        </Button>
      </div>

      {/* LOADING */}
      {loading && (
        <>
          <div className="flex flex-col items-center py-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              <Sparkles className="h-6 w-6 text-primary" />
            </motion.div>
            <p className="text-sm mt-2 text-muted-foreground">
              Finding best specialists...
            </p>
          </div>

          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4 animate-pulse flex gap-3">
                  <div className="h-10 w-10 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-3 bg-muted rounded w-1/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
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

      {/* FILTER SHEET */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            className="w-full bg-white rounded-t-3xl p-4 space-y-3"
          >
            <div className="text-center text-sm font-medium">
              Filters
            </div>

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

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowFilters(false)}
              >
                Cancel
              </Button>

              <Button
                className="flex-1"
                onClick={() => setShowFilters(false)}
              >
                Apply
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-background border-t">
        <Button
          className="w-full h-12"
          disabled={!selectedCandidateId}
          onClick={() => setStep("confirm")}
        >
          Continue <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};