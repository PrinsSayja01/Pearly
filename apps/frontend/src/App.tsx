import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import { AppLayout } from "@/components/layout/AppLayout";
import Phase1Flow from "./pages/app/Phase1Flow";

// ✅ create once (important)
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>

            {/* Landing */}
            <Route path="/" element={<Landing />} />

            {/* Dashboard Layout (KEEP YOUR UI EXACTLY SAME) */}
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<Phase1Flow />} />
            </Route>

            {/* Force Phase1 only */}
            <Route path="/app/*" element={<Navigate to="/app" replace />} />

            {/* Legacy redirect */}
            <Route path="/index" element={<Navigate to="/" replace />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </BrowserRouter>

      </TooltipProvider>
    </QueryClientProvider>
  );
}