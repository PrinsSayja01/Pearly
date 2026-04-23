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
    <div className="space-y-6 pb-24">

      <StepHeader
        step={2}
        total={6}
        title="When and where?"
        subtitle="Tell us your availability"
        onBack={() => setStep("input")}
      />

      {/* DATE SECTION */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm">
          <CalendarRange className="h-4 w-4 text-primary" />
          Select dates
        </Label>

        <div className="space-y-2">
          <Input
            type="date"
            value={setup.startDate || ""}
            onChange={(e) =>
              setSetup({ startDate: e.target.value })
            }
            className="h-12 text-base"
          />

          <Input
            type="date"
            value={setup.endDate || ""}
            onChange={(e) =>
              setSetup({ endDate: e.target.value })
            }
            className="h-12 text-base"
          />
        </div>

        {/* VALIDATION */}
        {setup.startDate &&
          setup.endDate &&
          new Date(setup.endDate) < new Date(setup.startDate) && (
            <p className="text-xs text-red-500">
              End date must be after start date
            </p>
          )}
      </div>

      {/* LOCATION */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-primary" />
          Location
        </Label>

        <Input
          placeholder="Enter city or address"
          value={setup.location || ""}
          onChange={(e) =>
            setSetup({ location: e.target.value })
          }
          className="h-12 text-base"
        />
      </div>

      {/* CTA (BOTTOM FIXED) */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-background border-t">
        <Button
          className="w-full h-12"
          disabled={!ready}
          onClick={() => setStep("candidates")}
        >
          Find specialists
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};