import { usePhase1Store } from "@/features/phase1/store";



export default function Confirm() {
  const setStep = usePhase1Store((s) => s.setStep);

  return (
    <div style={{ padding: 20 }}>
      <h2>Confirm Booking</h2>

      <p>Are you sure you want to assign this specialist?</p>

      <button
        style={{ position: "relative", zIndex: 999 }}
        className="px-4 py-2 bg-purple-500 text-white"
        onClick={() => {
          console.log("CLICK → CHANGE STEP");
          setStep("done");
        }}
      >
        Confirm →
      </button>
    </div>
  );
}