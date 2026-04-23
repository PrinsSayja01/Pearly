import { useEffect, useState } from "react";
import axios from "axios";

export default function CandidatesScreen({ setStep }) {
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState(null);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${API}/candidates?date=2026-04-25`)
      .then((res) => setCandidates(res.data.candidates))
      .catch(() => setCandidates([]));
  }, []);

  return (
    <div className="space-y-3">

      <h2 className="text-lg font-semibold">Available specialists</h2>

      {candidates.map((c) => (
        <div
          key={c.id}
          onClick={() => setSelected(c)}
          className={`p-3 rounded-lg border cursor-pointer ${
            selected?.id === c.id
              ? "border-indigo-600 bg-indigo-50"
              : "border-gray-200"
          }`}
        >
          <div className="font-medium">{c.name}</div>
          <div className="text-sm text-gray-500">
            {c.role} • ⭐ {c.rating}
          </div>
        </div>
      ))}

      <button
        disabled={!selected}
        onClick={() => setStep("confirm")}
        className="w-full bg-indigo-600 text-white p-3 rounded-lg mt-4 disabled:opacity-40"
      >
        Continue →
      </button>

    </div>
  );
}
