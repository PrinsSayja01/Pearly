import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft, ArrowRight, Briefcase, MapPin, Wallet, CalendarRange,
  FileText, Sparkles, CheckCircle2, Users, Clock, DollarSign, Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { workers } from "@/data/mock";
import { Link } from "react-router-dom";

type WorkType = "Construction" | "Repair" | "Installation";

interface FormState {
  workType: WorkType | "";
  scope: string;
  address: string;
  city: string;
  budget: string;
  start: string;
  due: string;
  requirements: string;
}

const steps = [
  { id: 0, label: "Type of work", icon: Briefcase },
  { id: 1, label: "Location", icon: MapPin },
  { id: 2, label: "Budget & timeline", icon: Wallet },
  { id: 3, label: "Requirements", icon: FileText },
  { id: 4, label: "Pearly suggests", icon: Sparkles },
];

/* ---------- Mock matching engine ----------
   In production: NLP parses scope/requirements → required roles, then
   ranks candidates by skill match × availability × distance × rating × rate. */
const buildTeams = (form: FormState) => {
  const lc = `${form.scope} ${form.requirements}`.toLowerCase();
  const needs: string[] = [];
  if (/elect|wire|outlet|panel|circuit/.test(lc)) needs.push("Electrician");
  if (/plumb|pipe|leak|water|bath|sink/.test(lc)) needs.push("Plumber");
  if (/tile|floor|grout/.test(lc)) needs.push("Tile Setter");
  if (/roof|leak|shingle/.test(lc)) needs.push("Roofer");
  if (/hvac|air|duct|heat|cool/.test(lc)) needs.push("HVAC");
  if (needs.length === 0) needs.push(form.workType === "Construction" ? "Electrician" : "General Worker");

  const pickByTrade = (trade: string) =>
    workers.find((w) => w.trade.toLowerCase().includes(trade.toLowerCase().split(" ")[0]));

  const teamA = needs.map(pickByTrade).filter(Boolean) as typeof workers;
  // diversify B and C with offsets
  const teamB = workers.slice(1, 1 + Math.max(2, needs.length));
  const teamC = workers.slice(2, 2 + Math.max(2, needs.length));

  const cost = (team: typeof workers, hrs: number) =>
    Math.round(team.reduce((s, w) => s + w.rate * hrs, 0));

  return [
    {
      id: "team-a",
      label: "Best overall match",
      members: teamA.length ? teamA : workers.slice(0, 2),
      score: 94,
      timeline: "Start tomorrow · 5 days",
      hours: 38,
      reasons: ["All required trades covered", "2 workers within 2 mi", "Avg ★ 4.85"],
    },
    {
      id: "team-b",
      label: "Fastest start",
      members: teamB,
      score: 87,
      timeline: "Start today 4pm · 6 days",
      hours: 44,
      reasons: ["Available within hours", "Slightly higher cost"],
    },
    {
      id: "team-c",
      label: "Lowest cost",
      members: teamC,
      score: 79,
      timeline: "Start Apr 24 · 7 days",
      hours: 50,
      reasons: ["Apprentice pairing saves ~22%", "Slower delivery"],
    },
  ].map((t) => ({ ...t, estCost: cost(t.members, t.hours), needs }));
};

const RequestWizard = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>({
    workType: "",
    scope: "",
    address: "",
    city: "",
    budget: "",
    start: "",
    due: "",
    requirements: "",
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const teams = useMemo(() => buildTeams(form), [form]);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const canNext = () => {
    if (step === 0) return form.workType && form.scope.trim().length >= 4;
    if (step === 1) return form.address.trim() && form.city.trim();
    if (step === 2) return form.budget && form.start && form.due;
    if (step === 3) return true;
    return false;
  };

  if (confirmed) {
    const team = teams.find((t) => t.id === selected) ?? teams[0];
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <Card className="border-success/30 bg-success/5">
          <CardContent className="p-8 text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-success text-success-foreground flex items-center justify-center mx-auto shadow-glow">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h2 className="font-display text-3xl">Request sent</h2>
              <p className="text-muted-foreground mt-2">
                Pearly notified {team.members.length} workers. You'll see confirmations as they accept.
              </p>
            </div>
            <div className="flex gap-2 justify-center pt-2">
              <Button asChild variant="outline"><Link to="/app">Back to dashboard</Link></Button>
              <Button asChild className="bg-gradient-primary hover:opacity-90"><Link to="/app/jobs">Track project</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">New work request</div>
        <h1 className="font-display text-3xl md:text-4xl mt-1">Tell Pearly what you need</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          We'll structure your request, identify the trades involved and propose 3 ranked teams.
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {steps.map((s, i) => {
          const active = i === step;
          const done = i < step;
          return (
            <div key={s.id} className="flex items-center gap-2 shrink-0">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold border transition-smooth",
                  done && "bg-success text-success-foreground border-success",
                  active && "bg-gradient-primary text-primary-foreground border-transparent shadow-glow",
                  !done && !active && "bg-card text-muted-foreground border-border",
                )}
              >
                {done ? <CheckCircle2 className="h-4 w-4" /> : <s.icon className="h-3.5 w-3.5" />}
              </div>
              <span className={cn("text-xs whitespace-nowrap", active ? "font-medium" : "text-muted-foreground")}>
                {s.label}
              </span>
              {i < steps.length - 1 && <div className="w-6 h-px bg-border mx-1" />}
            </div>
          );
        })}
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-6 md:p-8 space-y-6">
          {step === 0 && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-3 gap-3">
                {(["Construction", "Repair", "Installation"] as WorkType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => update("workType", t)}
                    className={cn(
                      "p-4 rounded-lg border-2 text-left transition-smooth",
                      form.workType === t
                        ? "border-primary bg-primary/5 shadow-soft"
                        : "border-border hover:border-primary/40",
                    )}
                  >
                    <div className="font-semibold">{t}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {t === "Construction" ? "Build / renovate"
                        : t === "Repair" ? "Fix existing issue"
                        : "Install equipment"}
                    </div>
                  </button>
                ))}
              </div>
              <div>
                <Label>Describe the work</Label>
                <Textarea
                  value={form.scope}
                  onChange={(e) => update("scope", e.target.value.slice(0, 500))}
                  placeholder="e.g. Replace bathroom plumbing, install new tile floor and vanity."
                  className="mt-1.5 min-h-[100px]"
                  maxLength={500}
                />
                <div className="text-[10px] text-muted-foreground mt-1 text-right">{form.scope.length}/500</div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <Label>Street address</Label>
                <Input
                  value={form.address}
                  onChange={(e) => update("address", e.target.value.slice(0, 120))}
                  placeholder="412 Maple Ave, Unit 3B"
                  className="mt-1.5"
                  maxLength={120}
                />
              </div>
              <div>
                <Label>City</Label>
                <Input
                  value={form.city}
                  onChange={(e) => update("city", e.target.value.slice(0, 60))}
                  placeholder="Brooklyn, NY"
                  className="mt-1.5"
                  maxLength={60}
                />
              </div>
              <Card className="bg-muted/40 border-dashed">
                <CardContent className="p-4 text-xs text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Pearly uses location to rank workers by travel time and to detect site-specific licensing requirements.
                </CardContent>
              </Card>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <Label>Budget (USD)</Label>
                <Input
                  type="number"
                  value={form.budget}
                  onChange={(e) => update("budget", e.target.value)}
                  placeholder="8000"
                  className="mt-1.5"
                  min={0}
                  max={1000000}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Earliest start</Label>
                  <Input type="date" value={form.start} onChange={(e) => update("start", e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label>Must complete by</Label>
                  <Input type="date" value={form.due} onChange={(e) => update("due", e.target.value)} className="mt-1.5" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <Label>Special requirements (optional)</Label>
                <Textarea
                  value={form.requirements}
                  onChange={(e) => update("requirements", e.target.value.slice(0, 500))}
                  placeholder="e.g. licensed electrician required, work after 6pm, English + Spanish speaker preferred."
                  className="mt-1.5 min-h-[100px]"
                  maxLength={500}
                />
              </div>
              <Card className="border-primary/20 bg-gradient-surface relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
                <CardContent className="relative p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Sparkles className="h-4 w-4 text-primary" /> Pearly parsed your request
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {buildTeams(form)[0].needs.map((n) => (
                      <Badge key={n} variant="secondary" className="bg-primary/10 text-primary">{n}</Badge>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Required trades inferred from your description. Tap "See teams" to view ranked options.
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-lg">3 teams ranked for your job</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Scored across skills, availability, distance, performance and rate.
                  </p>
                </div>
              </div>
              {teams.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => setSelected(t.id)}
                  className={cn(
                    "w-full text-left rounded-xl border-2 p-5 transition-smooth",
                    selected === t.id
                      ? "border-primary bg-primary/5 shadow-elegant"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {idx === 0 && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-primary text-primary-foreground">
                            Top pick
                          </span>
                        )}
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">{t.label}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex -space-x-2">
                          {t.members.map((m) => (
                            <div key={m.id} className="h-9 w-9 rounded-full bg-gradient-iridescent border-2 border-card text-[10px] font-bold flex items-center justify-center text-primary-foreground">
                              {m.name.split(" ").map((n) => n[0]).join("")}
                            </div>
                          ))}
                        </div>
                        <div className="text-sm">
                          <div className="font-medium">{t.members.map((m) => m.name.split(" ")[0]).join(", ")}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Star className="h-3 w-3 fill-warning text-warning" />
                            {(t.members.reduce((s, m) => s + m.rating, 0) / t.members.length).toFixed(2)} avg
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Match</div>
                      <div className="text-2xl font-semibold text-primary">{t.score}%</div>
                      <Progress value={t.score} className="h-1 w-20 mt-1" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Crew</div>
                        <div className="text-sm font-medium">{t.members.length} workers</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Timeline</div>
                        <div className="text-sm font-medium">{t.timeline}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Estimated</div>
                        <div className="text-sm font-medium">${t.estCost.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>

                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {t.reasons.map((r) => (
                      <li key={r} className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {r}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          )}

          {/* Footer nav */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            {step < 4 ? (
              <Button
                className="bg-gradient-primary hover:opacity-90"
                disabled={!canNext()}
                onClick={() => setStep((s) => s + 1)}
              >
                {step === 3 ? "See teams" : "Continue"} <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                className="bg-gradient-primary hover:opacity-90"
                disabled={!selected}
                onClick={() => setConfirmed(true)}
              >
                Send to team <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestWizard;
