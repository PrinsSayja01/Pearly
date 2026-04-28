import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { usePhase1Store } from "../store";
import { detectProfession } from "@/utils/professionMap"; // ✅ FIX
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

    const profession = detectProfession(taskInput);

    if (profession) {
      setDetected(profession, []);
    }
  }, [taskInput]);

  return (
    <div className="space-y-5">
      <StepHeader step={1} total={6} title="Describe your job" />

      <Textarea
        value={taskInput}
        onChange={(e) => setTaskInput(e.target.value)}
        placeholder="Fix pipe leak..."
      />

      {detectedProfession && (
        <Card>
          <CardContent className="flex gap-2 flex-wrap">
            <Badge>{detectedProfession}</Badge>
            {suggestions.map((s) => (
              <Badge key={s}>{s}</Badge>
            ))}
          </CardContent>
        </Card>
      )}

      <Button onClick={() => setStep("setup")}>
        Continue <ArrowRight />
      </Button>
    </div>
  );
};