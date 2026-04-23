import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

import { usePhase1Store } from "../store";
import { CandidateCard } from "../components/CandidateCard";
import { StepHeader } from "../components/StepHeader";

const API_URL = import.meta.env.VITE_API_URL;

const LANGUAGES = ["de", "en", "es"];
const LOCATIONS = ["munich", "berlin", "hamburg"];

export const CandidatesScreen = () => {
  const {
    selectedCandidateId,
    selectCandidate,
    setSelectedCandidate,
    setStep,
    setup,
    detectedProfession,
  } = usePhase1Store();

  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCandidates = async () => {
    if (!setup.startDate) return;

    setLoading(true);

    try {
      const res = await axios.get(`${API_URL}/candidates`, {
        params: {
          date: setup.startDate,
          role: detectedProfession || undefined,
          language: selectedLanguage || undefined,
          location: selectedLocation || undefined,
        },
      });

      setCandidates(res.data?.candidates || []);
    } catch (err: any) {
      console.error(err?.message);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [setup.startDate, selectedLanguage, selectedLocation]);

  return (
    <div className="space-y-4 pb-24 px-3">

      <StepHeader
        step={3}
        total={6}
        title="Choose a specialist"
        subtitle="We found the best matches for your task"
        onBack={() => setStep("setup")}
      />

      {/* ROLE (auto detected) */}
      <div className="text-sm text-muted-foreground">
        Showing results for: <span className="font-medium text-foreground">{detectedProfession}</span>
      </div>

      {/* LANGUAGE FILTER */}
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground">Language (optional)</div>
        <div className="flex gap-2 overflow-x-auto">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() =>
                setSelectedLanguage((prev) => (prev === lang ? null : lang))
              }
              className={`px-3 py-1.5 rounded-full text-sm border ${
                selectedLanguage === lang
                  ? "bg-primary text-white"
                  : "bg-muted"
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* LOCATION FILTER */}
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground">Location</div>
        <div className="flex gap-2 overflow-x-auto">
          {LOCATIONS.map((loc) => (
            <button
              key={loc}
              onClick={() =>
                setSelectedLocation((prev) => (prev === loc ? null : loc))
              }
              className={`px-3 py-1.5 rounded-full text-sm border ${
                selectedLocation === loc
                  ? "bg-primary text-white"
                  : "bg-muted"
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <Card>
          <CardContent className="p-4 text-center text-sm">
            Finding best matches...
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
            No specialists match your criteria
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
          Continue <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

    </div>
  );
};