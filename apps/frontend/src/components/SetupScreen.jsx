export default function SetupScreen({ setStep }) {
  return (
    <div className="space-y-4">

      <h2 className="text-lg font-semibold">When and where?</h2>

      <input
        type="date"
        className="w-full border p-3 rounded-lg"
      />

      <input
        placeholder="Location"
        className="w-full border p-3 rounded-lg"
      />

      <button
        className="w-full bg-indigo-600 text-white p-3 rounded-lg mt-3"
        onClick={() => setStep("candidates")}
      >
        Find specialists →
      </button>

    </div>
  );
}
