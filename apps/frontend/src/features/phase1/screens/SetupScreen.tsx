import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, CalendarRange } from "lucide-react";
import { usePhase1Store } from "@/features/phase1/store";
import { StepHeader } from "../components/StepHeader";

export const SetupScreen = () => {
  const { setup, setSetup, setStep } = usePhase1Store();

  const ready =
    setup.startDate &&
    setup.endDate &&
    setup.location &&
    new Date(setup.endDate) >= new Date(setup.startDate);

  return (
    <div className="space-y-5">
      <StepHeader
        step={2}
        total={5}
        title="When and where?"
        subtitle="Required to find available specialists."
        onBack={() => {
          console.log("⬅️ BACK TO INPUT");
          setStep("input");
        }}
      />

      <div className="space-y-4">

        <div>
          <Label className="flex items-center gap-2 mb-1.5">
            <CalendarRange className="h-4 w-4 text-primary" />
            Date range
          </Label>

          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={setup.startDate || ""}
              onChange={(e) =>
                setSetup({ startDate: e.target.value })
              }
            />

            <Input
              type="date"
              value={setup.endDate || ""}
              onChange={(e) =>
                setSetup({ endDate: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <Label className="flex items-center gap-2 mb-1.5">
            <MapPin className="h-4 w-4 text-primary" />
            Location
          </Label>

          <Input
            value={setup.location || ""}
            onChange={(e) =>
              setSetup({ location: e.target.value })
            }
          />
        </div>

      </div>

      <Button
        disabled={!ready}
        onClick={() => {
          console.log("➡️ GO TO CANDIDATES");
          setStep("candidates");
        }}
      >
        Find specialists <ArrowRight />
      </Button>
    </div>
  );
};