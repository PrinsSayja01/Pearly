import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound.tsx";
import { AppLayout } from "@/components/layout/AppLayout";
import Phase1Flow from "./pages/app/Phase1Flow";

// FUTURE FEATURES (DO NOT IMPLEMENT NOW)
// - Routes: Today, Jobs, JobDetail, Crew, Payments, Alerts, Settings,
//   RequestWizard, Inbox — all hidden for Phase 1 MVP.

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Phase1Flow />} />
          </Route>
          {/* Phase 1 redirects: collapse all legacy/non-Phase-1 routes to the single flow */}
          <Route path="/app/*" element={<Navigate to="/app" replace />} />
          <Route path="/index" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
