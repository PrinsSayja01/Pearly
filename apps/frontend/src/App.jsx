import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Phase1Flow from "./pages/app/Phase1Flow";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing */}
        <Route path="/" element={<Landing />} />

        {/* Main App */}
        <Route path="/app" element={<Phase1Flow />} />

        {/* Redirect fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
