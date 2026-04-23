import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export const AppLayout = () => {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Right side */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header */}
        <header className="h-14 border-b border-border flex items-center px-4 md:px-6 gap-3 bg-card/70 backdrop-blur shrink-0 z-30">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-gradient-iridescent" />
            <span className="font-display text-lg">Pearly</span>
          </div>
        </header>

        {/* MAIN CONTENT (IMPORTANT FIX) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="w-full h-full">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};