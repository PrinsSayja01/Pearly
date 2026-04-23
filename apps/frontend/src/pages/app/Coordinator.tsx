import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle, CheckCircle2, Clock, Inbox as InboxIcon, MapPin, Users,
  ArrowRightLeft, Shield, Sparkles, XCircle, Phone, CalendarClock,
} from "lucide-react";
import { jobs, workers } from "@/data/mock";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { toast } from "sonner";

/* ---------- Mock data specific to Coordinator queue ---------- */

type RequestStatus = "new" | "matching" | "awaiting_confirm" | "confirmed";

interface IncomingRequest {
  id: string;
  client: string;
  title: string;
  trade: string;
  city: string;
  budget: number;
  start: string;
  status: RequestStatus;
  suggestedCrew: { id: string; name: string; trade: string; confirmed: boolean }[];
}

const initialRequests: IncomingRequest[] = [
  {
    id: "r-2201",
    client: "Hillcrest Residences",
    title: "Lobby lighting upgrade",
    trade: "Electrical",
    city: "Brooklyn, NY",
    budget: 6200,
    start: "Apr 23",
    status: "awaiting_confirm",
    suggestedCrew: [
      { id: "w1", name: "Carlos Méndez", trade: "Lead Electrician", confirmed: true },
      { id: "w6", name: "Mei Wong", trade: "Apprentice Electrician", confirmed: false },
    ],
  },
  {
    id: "r-2202",
    client: "Marisol García",
    title: "Kitchen sink replacement",
    trade: "Plumbing",
    city: "Queens, NY",
    budget: 1800,
    start: "Apr 22",
    status: "matching",
    suggestedCrew: [
      { id: "w2", name: "Tomás Silva", trade: "Plumber", confirmed: false },
    ],
  },
  {
    id: "r-2203",
    client: "North Star Cafe",
    title: "Emergency roof patch",
    trade: "Roofing",
    city: "Manhattan, NY",
    budget: 2400,
    start: "Today",
    status: "new",
    suggestedCrew: [],
  },
];

interface DoubleBooking {
  id: string;
  worker: { id: string; name: string; trade: string };
  conflicts: { jobId: string; jobTitle: string; date: string; client: string; priority: "high" | "med" }[];
  recommendation: string;
}

const initialConflicts: DoubleBooking[] = [
  {
    id: "c-1",
    worker: { id: "w2", name: "Tomás Silva", trade: "Plumber" },
    conflicts: [
      { jobId: "j-1043", jobTitle: "Bathroom Renovation", date: "Apr 22 · 8am", client: "Marisol García", priority: "med" },
      { jobId: "r-2202", jobTitle: "Kitchen sink replacement", date: "Apr 22 · 9am", client: "Marisol García", priority: "high" },
    ],
    recommendation: "Keep Tomás on the bathroom reno (longer engagement). Reassign sink replacement to Aisha Brown — closest available plumber, 1.4 mi away.",
  },
  {
    id: "c-2",
    worker: { id: "w4", name: "Pavel Novak", trade: "Roofer" },
    conflicts: [
      { jobId: "j-1044", jobTitle: "Roof Leak Repair — URGENT", date: "Today · 2pm", client: "North Star Cafe", priority: "high" },
      { jobId: "r-2203", jobTitle: "Emergency roof patch", date: "Today · 3pm", client: "North Star Cafe", priority: "high" },
    ],
    recommendation: "Same client — bundle both jobs into a single 4-hour visit. Notify Pavel and the client to consolidate.",
  },
];

/* ---------- Components ---------- */

const statusStyles: Record<RequestStatus, string> = {
  new: "bg-primary/10 text-primary border-primary/20",
  matching: "bg-accent/10 text-accent border-accent/20",
  awaiting_confirm: "bg-warning/10 text-warning border-warning/20",
  confirmed: "bg-success/10 text-success border-success/20",
};

const statusLabel: Record<RequestStatus, string> = {
  new: "New",
  matching: "Matching",
  awaiting_confirm: "Awaiting confirm",
  confirmed: "Confirmed",
};

const Coordinator = () => {
  const [requests, setRequests] = useState<IncomingRequest[]>(initialRequests);
  const [conflicts, setConflicts] = useState<DoubleBooking[]>(initialConflicts);

  const stats = useMemo(() => ({
    incoming: requests.filter((r) => r.status === "new" || r.status === "matching").length,
    awaiting: requests.filter((r) => r.status === "awaiting_confirm").length,
    confirmed: requests.filter((r) => r.status === "confirmed").length,
    conflicts: conflicts.length,
  }), [requests, conflicts]);

  const toggleConfirm = (reqId: string, workerId: string) => {
    setRequests((prev) => prev.map((r) => r.id !== reqId ? r : {
      ...r,
      suggestedCrew: r.suggestedCrew.map((c) =>
        c.id === workerId ? { ...c, confirmed: !c.confirmed } : c
      ),
    }));
  };

  const dispatchRequest = (reqId: string) => {
    setRequests((prev) => prev.map((r) =>
      r.id === reqId ? { ...r, status: "confirmed" as RequestStatus } : r
    ));
    toast.success("Crew dispatched", { description: "Workers notified, client confirmation sent." });
  };

  const autoMatch = (reqId: string) => {
    const req = requests.find((r) => r.id === reqId);
    if (!req) return;
    const candidate = workers.find((w) => w.trade.toLowerCase().includes(req.trade.toLowerCase().slice(0, 4)));
    if (!candidate) return;
    setRequests((prev) => prev.map((r) => r.id !== reqId ? r : {
      ...r,
      status: "awaiting_confirm" as RequestStatus,
      suggestedCrew: [{ id: candidate.id, name: candidate.name, trade: candidate.trade, confirmed: false }],
    }));
    toast("Pearly matched a crew", { description: `${candidate.name} suggested for ${req.title}.` });
  };

  const resolveConflict = (conflictId: string, keepJobId: string) => {
    setConflicts((prev) => prev.filter((c) => c.id !== conflictId));
    toast.success("Conflict resolved", { description: `Worker locked to ${keepJobId}. Replacement queued for the other job.` });
  };

  const acceptAISuggestion = (conflictId: string) => {
    setConflicts((prev) => prev.filter((c) => c.id !== conflictId));
    toast.success("AI plan applied", { description: "Schedule and notifications updated." });
  };

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Coordinator · Tuesday Apr 21</div>
        <h1 className="font-display text-4xl md:text-5xl mt-1">Operations desk</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Triage incoming requests, confirm crew availability, and resolve scheduling conflicts before they hit the field.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Incoming requests", value: stats.incoming, icon: InboxIcon, tone: "text-primary bg-primary/10" },
          { label: "Awaiting confirmation", value: stats.awaiting, icon: Clock, tone: "text-warning bg-warning/10" },
          { label: "Confirmed today", value: stats.confirmed, icon: CheckCircle2, tone: "text-success bg-success/10" },
          { label: "Open conflicts", value: stats.conflicts, icon: AlertTriangle, tone: "text-destructive bg-destructive/10" },
        ].map((s) => (
          <Card key={s.label} className="hover:shadow-soft transition-smooth">
            <CardContent className="p-4">
              <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center", s.tone)}>
                <s.icon className="h-4 w-4" />
              </div>
              <div className="mt-3 text-2xl font-semibold">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Incoming requests queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Incoming requests</h2>
            <Badge variant="outline" className="text-xs">{requests.length} in queue</Badge>
          </div>

          <div className="space-y-3">
            {requests.map((req) => {
              const allConfirmed = req.suggestedCrew.length > 0 && req.suggestedCrew.every((c) => c.confirmed);
              return (
                <Card key={req.id} className="overflow-hidden">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className={cn("text-[10px] uppercase tracking-wider", statusStyles[req.status])}>
                            {statusLabel[req.status]}
                          </Badge>
                          <span className="text-xs text-muted-foreground">#{req.id}</span>
                        </div>
                        <h3 className="font-semibold mt-2">{req.title}</h3>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3 flex-wrap">
                          <span>{req.client}</span>
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{req.city}</span>
                          <span className="flex items-center gap-1"><CalendarClock className="h-3 w-3" />{req.start}</span>
                          <span>${req.budget.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {req.suggestedCrew.length === 0 ? (
                      <div className="rounded-lg border border-dashed p-4 flex items-center justify-between gap-3">
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          No crew matched yet — Pearly can auto-suggest.
                        </div>
                        <Button size="sm" onClick={() => autoMatch(req.id)}>
                          <Sparkles className="h-4 w-4" /> Auto-match
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-xs uppercase tracking-wider text-muted-foreground">Suggested crew · confirm availability</div>
                        {req.suggestedCrew.map((c) => (
                          <div key={c.id} className="flex items-center justify-between gap-3 rounded-lg border bg-card p-3">
                            <div className="min-w-0">
                              <div className="text-sm font-medium truncate">{c.name}</div>
                              <div className="text-xs text-muted-foreground">{c.trade}</div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Phone className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant={c.confirmed ? "default" : "outline"}
                                onClick={() => toggleConfirm(req.id, c.id)}
                                className={cn(c.confirmed && "bg-success hover:bg-success/90 text-success-foreground")}
                              >
                                {c.confirmed ? (<><CheckCircle2 className="h-3.5 w-3.5" /> Confirmed</>) : "Confirm"}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {req.suggestedCrew.length > 0 && (
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {req.suggestedCrew.filter((c) => c.confirmed).length}/{req.suggestedCrew.length} confirmed
                        </div>
                        <Button
                          size="sm"
                          disabled={!allConfirmed || req.status === "confirmed"}
                          onClick={() => dispatchRequest(req.id)}
                          className="bg-gradient-primary hover:opacity-90"
                        >
                          {req.status === "confirmed" ? "Dispatched" : "Dispatch crew"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Conflicts panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4 text-destructive" /> Schedule conflicts
            </h2>
            <Badge variant="outline" className="text-xs">{conflicts.length}</Badge>
          </div>

          {conflicts.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-sm text-muted-foreground">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-success" />
                All clear. No double-bookings detected.
              </CardContent>
            </Card>
          ) : (
            conflicts.map((c) => (
              <Card key={c.id} className="border-destructive/30 bg-destructive/5">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-full bg-destructive/15 flex items-center justify-center">
                      <ArrowRightLeft className="h-4 w-4 text-destructive" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate">{c.worker.name}</div>
                      <div className="text-xs text-muted-foreground">{c.worker.trade} · double-booked</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {c.conflicts.map((job) => (
                      <div key={job.jobId} className="rounded-lg bg-card border p-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-sm font-medium truncate">{job.jobTitle}</div>
                          <Badge variant="outline" className={cn(
                            "text-[10px] uppercase",
                            job.priority === "high" ? "border-destructive/40 text-destructive" : "border-warning/40 text-warning"
                          )}>
                            {job.priority}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                          <CalendarClock className="h-3 w-3" />{job.date} · {job.client}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2 h-7 text-xs w-full"
                          onClick={() => resolveConflict(c.id, job.jobId)}
                        >
                          Keep on this job
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-2">
                    <div className="text-xs font-medium flex items-center gap-1.5 text-primary">
                      <Sparkles className="h-3.5 w-3.5" /> Pearly recommends
                    </div>
                    <p className="text-xs text-foreground/80 leading-relaxed">{c.recommendation}</p>
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" className="flex-1 bg-gradient-primary hover:opacity-90" onClick={() => acceptAISuggestion(c.id)}>
                        Apply plan
                      </Button>
                      <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => setConflicts((prev) => prev.filter((x) => x.id !== c.id))}>
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          <Card>
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Quick links</div>
              <div className="space-y-1.5 text-sm">
                <Link to="/app/jobs" className="flex items-center justify-between hover:text-primary transition-smooth">
                  <span>All active jobs</span><span className="text-muted-foreground">{jobs.length}</span>
                </Link>
                <Link to="/app/crew" className="flex items-center justify-between hover:text-primary transition-smooth">
                  <span>Crew availability</span><span className="text-muted-foreground">{workers.length}</span>
                </Link>
                <Link to="/app/alerts" className="flex items-center justify-between hover:text-primary transition-smooth">
                  <span>Alerts feed</span><span className="text-muted-foreground">3</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Coordinator;
