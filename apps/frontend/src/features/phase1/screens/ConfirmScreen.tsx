import { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CalendarRange, MapPin, Briefcase } from "lucide-react";

import { usePhase1Store } from "@/features/phase1/store";
import { CandidateCard } from "../components/CandidateCard";
import { StepHeader } from "../components/StepHeader";

export const ConfirmScreen = () => {
  const worker = usePhase1Store((s) => s.selectedCandidate);
  const detectedProfession = usePhase1Store((s) => s.detectedProfession);
  const setup = usePhase1Store((s) => s.setup);
  const taskInput = usePhase1Store((s) => s.taskInput);
  const setStep = usePhase1Store((s) => s.setStep);

  const [loading, setLoading] = useState(false);

  // ❗ SAFETY GUARD
  if (!worker) {
    return (
      <div className="text-center space-y-3">
        <p>No candidate selected</p>
        <Button onClick={() => setStep("candidates")}>
          Go back
        </Button>
      </div>
    );
  }

  // ✅ FINAL ASYNC HANDLER
  const handleConfirm = async () => {
    if (loading) return; // prevent double click

    try {
      setLoading(true);

      console.log("📡 SAVING PROJECT...");

      await axios.post("http://127.0.0.1:8002/projects", {
        task: taskInput,
        profession: detectedProfession,
        setup,
        candidate: worker,
      });

      console.log("✅ PROJECT SAVED");

      setStep("team");

    } catch (err: any) {
      console.error("❌ SAVE ERROR:", err?.message);

      alert("Something went wrong while saving project");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">

      <StepHeader
        step={4}
        total={6}
        title="Confirm your specialist"
        subtitle="Final step before assignment"
        onBack={() => setStep("candidates")}
      />

      {/* SELECTED WORKER */}
      <CandidateCard worker={worker} selected />

      {/* DETAILS */}
      <Card>
        <CardContent className="p-4 space-y-3 text-sm">

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span>Profession</span>
            </div>
            <span className="font-medium">
              {detectedProfession || worker.role}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarRange className="h-4 w-4 text-muted-foreground" />
              <span>Dates</span>
            </div>
            <span className="font-medium">
              {setup.startDate} → {setup.endDate}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>Location</span>
            </div>
            <span className="font-medium">
              {setup.location}
            </span>
          </div>

        </CardContent>
      </Card>

      {/* CTA */}
      <Button
        className="w-full h-12 bg-gradient-primary hover:opacity-90"
        onClick={handleConfirm}
        disabled={loading}
      >
        {loading ? "Saving..." : "Confirm & Continue"}
        <ArrowRight className="h-4 w-4" />
      </Button>

    </div>
  );
};