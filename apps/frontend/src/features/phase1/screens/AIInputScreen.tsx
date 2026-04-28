import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { usePhase1Store } from "../store";
import { detectProfession } from "@/utils/professionMap";
import { StepHeader } from "../components/StepHeader";

export const AIInputScreen = () => {
  const {
    taskInput,
    setTaskInput,
    setDetected,
    setStep,
    detectedProfession,
    suggestions = [],
  } = usePhase1Store();

  useEffect(() => {
    if (taskInput.trim().length < 3) return;

    const res = detectProfession(taskInput);

    if (res.profession) {
      setDetected(res.profession, res.suggestions);
    }
  }, [taskInput]);

  return (
    <div className="space-y-5 max-w-md mx-auto">

      <StepHeader step={1} total={6} title="Describe your job" />

      <Textarea
        value={taskInput}
        onChange={(e) => setTaskInput(e.target.value)}
        placeholder="Fix pipe leak, install light, clean apartment..."
      />

      {/* ✅ AI DETECTION RESULT */}
      {detectedProfession && (
        <Card>
          <CardContent className="flex flex-wrap gap-2 p-4">
            <Badge className="bg-primary text-white">
              {detectedProfession}
            </Badge>

            {suggestions.map((s) => (
              <Badge key={s} variant="outline">
                {s}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}

      <Button
        className="w-full"
        onClick={() => setStep("setup")}
      >
        Continue <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};