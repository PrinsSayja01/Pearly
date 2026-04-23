import { usePhase1Store } from "@/features/phase1/store";
import { AIInputScreen } from "@/features/phase1/screens/AIInputScreen";
import { SetupScreen } from "@/features/phase1/screens/SetupScreen";
import { CandidatesScreen } from "@/features/phase1/screens/CandidatesScreen";
import { ConfirmScreen } from "@/features/phase1/screens/ConfirmScreen";
import { TeamFormationScreen } from "@/features/phase1/screens/TeamFormationScreen";
import { DoneScreen } from "@/features/phase1/screens/DoneScreen";

const Phase1Flow = () => {
  const step = usePhase1Store((s) => s.step);

  console.log("CURRENT STEP:", step); // 🔍 DEBUG

  return (
    <div
      key={step} // ✅ VERY IMPORTANT → forces rerender
      className="-mx-4 -my-6 min-h-[calc(100vh-4rem)] bg-gradient-pearl"
    >
      <div className="max-w-md mx-auto px-4 pt-6 pb-24">

        {/* fallback */}
        {!step && <AIInputScreen />}

        {step === "input" && <AIInputScreen />}
        {step === "setup" && <SetupScreen />}
        {step === "candidates" && <CandidatesScreen />}
        {step === "confirm" && <ConfirmScreen />}
        {step === "team" && <TeamFormationScreen />}
        {step === "done" && <DoneScreen />}

      </div>
    </div>
  );
};

export default Phase1Flow;