import { NavLink } from "@/components/NavLink";
import { Sparkles } from "lucide-react";

// FUTURE FEATURES (DO NOT IMPLEMENT NOW)
// - Payments (Pearly Bank)
// - Chat system
// - Notifications
// - Dashboard / analytics
// - Advanced AI recommendations
// - Profile system
// - Multi-project workflow
// - Settings, Crew, Inbox, Alerts, Jobs list, Role switcher

export const Sidebar = () => {
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-sidebar-border">
        <div className="h-8 w-8 rounded-lg bg-gradient-iridescent shadow-glow" />
        <div>
          <div className="font-display text-xl leading-none">Pearly</div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">Phase 1 MVP</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-0.5">
        <NavLink
          to="/app"
          end
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-smooth"
          activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
        >
          <Sparkles className="h-4 w-4" />
          New job
        </NavLink>
      </nav>
    </aside>
  );
};
