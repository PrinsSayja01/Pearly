import { useState } from "react";

export default function AIInputScreen({ setStep }) {
  const [text, setText] = useState("");

  return (
    <div className="space-y-4">

      <h2 className="text-lg font-semibold">
        Describe your job
      </h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Fix sink, install lights..."
        className="w-full h-28 p-3 border rounded-lg"
      />

      <button
        onClick={() => {
          if (!text.trim()) return;
          setStep("setup");
        }}
        className="w-full bg-gradient-primary text-white p-3 rounded-lg"
      >
        Continue →
      </button>

    </div>
  );
}
