import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/pearly/JobCard";
import { AIRecommendationPanel } from "@/components/pearly/AIRecommendationPanel";
import { DecisionSupportPanel } from "@/components/pearly/DecisionSupportPanel";
import { VoiceQuickAction } from "@/components/pearly/VoiceQuickAction";
import { WorkflowStepper } from "@/components/pearly/WorkflowStepper";
import { Checklist } from "@/components/pearly/Checklist";
import { jobs } from "@/data/mock";
import { useRoleStore } from "@/store/useRoleStore";
import { AlertTriangle, ClipboardList, HardHat, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import Coordinator from "./Coordinator";

const Today = () => {
  const { role } = useRoleStore();
  const urgent = jobs.filter((j) => j.urgent || j.status === "Delayed");
  const active = jobs.filter((j) => j.status === "In Progress");

  if (role === "coordinator") return <Coordinator />;

  /* ---------- WORKER VIEW (mobile-first, single job focus) ---------- */
  if (role === "worker") {
    const job = active[0] ?? jobs[0];
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Good morning, Carlos</div>
          <h1 className="font-display text-3xl mt-1">Today's job</h1>
        </div>

        <Card className="overflow-hidden border-primary/30 shadow-elegant">
          <div className="bg-gradient-primary text-primary-foreground p-5">
            <div className="text-xs opacity-80">{job.type}</div>
            <h2 className="text-xl font-semibold mt-1">{job.title}</h2>
            <div className="flex items-center gap-1.5 text-sm mt-2 opacity-90">
              <MapPin className="h-4 w-4" /> {job.address}
            </div>
          </div>
          <CardContent className="p-5 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Button size="lg" className="h-14 bg-success hover:bg-success/90 text-success-foreground text-base">
                ✓ Clock in
              </Button>
              <Button size="lg" variant="outline" className="h-14 text-base">
                <Phone className="h-5 w-5" /> Call client
              </Button>
            </div>
            <Button asChild size="lg" className="w-full h-12 bg-gradient-primary hover:opacity-90">
              <Link to={`/app/jobs/${job.id}`}>Open job →</Link>
            </Button>
          </CardContent>
        </Card>

        <VoiceQuickAction />

        <div>
          <h3 className="font-semibold mb-3 px-1">Today's checklist</h3>
          <Checklist />
        </div>
      </div>
    );
  }

  /* ---------- CLIENT VIEW (project tracking) ---------- */
  if (role === "client") {
    return (
      <div className="space-y-8 max-w-5xl">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Hillcrest Residences</div>
          <h1 className="font-display text-4xl mt-1">Your projects</h1>
        </div>
        <Card><CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Apartment Rewiring — 3rd Floor</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Crew of 4 · $8.4k budget</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">Step 4 of 6</span>
          </div>
          <WorkflowStepper current={3} />
        </CardContent></Card>
        <div className="grid sm:grid-cols-2 gap-4">
          {jobs.slice(0, 2).map((j) => <JobCard key={j.id} {...j} />)}
        </div>
      </div>
    );
  }

  /* ---------- SUPERVISOR VIEW (operations overview) ---------- */
  const stats = [
    { label: "Active jobs", value: active.length.toString(), icon: ClipboardList, tone: "text-primary bg-primary/10" },
    { label: "Urgent / delayed", value: urgent.length.toString(), icon: AlertTriangle, tone: "text-destructive bg-destructive/10" },
    { label: "Crew on site", value: "11", icon: HardHat, tone: "text-success bg-success/10" },
    { label: "Today's revenue", value: "$4.2k", icon: () => <span className="font-bold text-base">$</span>, tone: "text-accent bg-accent/10" },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Supervisor · Tuesday Apr 21</div>
        <h1 className="font-display text-4xl md:text-5xl mt-1">Today on site</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Card key={s.label} className="hover:shadow-soft transition-smooth">
            <CardContent className="p-4">
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${s.tone}`}>
                <s.icon className="h-4 w-4" />
              </div>
              <div className="mt-3 text-2xl font-semibold">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {urgent.length > 0 && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-destructive font-semibold mb-3">
              <AlertTriangle className="h-4 w-4" /> Needs attention
            </div>
            <div className="space-y-2">
              {urgent.map((j) => (
                <Link key={j.id} to={`/app/jobs/${j.id}`} className="flex items-center gap-3 p-3 rounded-lg bg-card hover:shadow-soft transition-smooth">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{j.title}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" />{j.address}</div>
                  </div>
                  <span className="text-xs font-medium text-destructive">{j.status}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold">Active jobs</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {jobs.map((j) => <JobCard key={j.id} {...j} />)}
          </div>
        </div>
        <div className="space-y-6">
          <DecisionSupportPanel />
          <AIRecommendationPanel />
        </div>
      </div>
    </div>
  );
};

export default Today;
