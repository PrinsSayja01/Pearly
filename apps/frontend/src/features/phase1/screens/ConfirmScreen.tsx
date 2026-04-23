import { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CalendarRange, MapPin, Briefcase } from "lucide-react";

import { usePhase1Store } from "@/features/phase1/store";
import { CandidateCard } from "../components/CandidateCard";
import { StepHeader } from "../components/StepHeader";

const API_URL = import.meta.env.VITE_API_URL;

export const ConfirmScreen = () => {
  const worker = usePhase1Store((s) => s.selectedCandidate);
  const detectedProfession = usePhase1Store((s) => s.detectedProfession);
  const setup = usePhase1Store((s) => s.setup);
  const taskInput = usePhase1Store((s) => s.taskInput);
  const setStep = usePhase1Store((s) => s.setStep);

  const [loading, setLoading] = useState(false);

  if (!worker) {
    return (
      <div className="text-center p-4">
        <p>No candidate selected</p>
        <Button onClick={() => setStep("candidates")}>Go back</Button>
      </div>
    );
  }

  const handleConfirm = async () => {
    if (loading) return;

    try {
      setLoading(true);

      await axios.post(`${API_URL}/projects`, {
        task: taskInput,
        profession: detectedProfession || worker.role,
        setup,
        candidate: worker,
      });

      setStep("team");
    } catch (err: any) {
      console.error(err?.message);
      alert("Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 pb-20">

      <StepHeader
        step={4}
        total={6}
        title="Confirm your specialist"
        subtitle="Final step before assignment"
        onBack={() => setStep("candidates")}
      />

      <CandidateCard worker={worker} selected />

      <Card>
        <CardContent className="p-4 space-y-3 text-sm">

          <div className="flex justify-between">
            <span>Profession</span>
            <span className="font-medium">
              {detectedProfession || worker.role}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Dates</span>
            <span>
              {setup.startDate} → {setup.endDate}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Location</span>
            <span>{setup.location}</span>
          </div>

        </CardContent>
      </Card>

      {/* CTA FIXED FOR MOBILE */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-background border-t">
        <Button
          className="w-full h-12"
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? "Saving..." : "Confirm & Continue"}
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

    </div>
  );
};