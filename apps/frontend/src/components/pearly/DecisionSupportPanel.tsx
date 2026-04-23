import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingDown, Clock, DollarSign, ArrowRight } from "lucide-react";

interface SignalProps {
  icon: typeof Clock;
  label: string;
  value: string;
  delta: string;
  tone: "ok" | "warn" | "risk";
}

const toneMap = {
  ok: "text-success bg-success/10",
  warn: "text-warning bg-warning/10",
  risk: "text-destructive bg-destructive/10",
};

const Signal = ({ icon: Icon, label, value, delta, tone }: SignalProps) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-card/60 border border-border/50">
    <div className={`h-9 w-9 rounded-md flex items-center justify-center ${toneMap[tone]}`}>
      <Icon className="h-4 w-4" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold mt-0.5">{value}</div>
    </div>
    <div className={`text-xs font-medium ${tone === "ok" ? "text-success" : tone === "warn" ? "text-warning" : "text-destructive"}`}>
      {delta}
    </div>
  </div>
);

const actions = [
  { title: "Reroute Pavel to Roof Leak Repair", subtitle: "Saves ~6 hrs · 0.8 mi away · keeps SLA", confidence: 92 },
  { title: "Push Bathroom Reno start to Apr 23", subtitle: "Frees Tomás · avoids overlap conflict", confidence: 78 },
  { title: "Order extra conduit for Hillcrest", subtitle: "Predicted 12% over on materials", confidence: 64 },
];

export const DecisionSupportPanel = () => {
  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-surface relative">
      <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
      <CardContent className="relative p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-gradient-iridescent flex items-center justify-center shadow-glow">
              <Brain className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <div>
              <div className="text-sm font-semibold">Decision support</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Live · updated 2 min ago</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Op risk</div>
            <div className="text-lg font-semibold text-warning">Medium</div>
          </div>
        </div>

        <div className="space-y-2">
          <Signal icon={Clock} label="Schedule pressure" value="2 jobs at risk this week" delta="+1" tone="warn" />
          <Signal icon={DollarSign} label="Budget burn rate" value="62% spent at 58% time" delta="+4%" tone="risk" />
          <Signal icon={TrendingDown} label="Crew utilization" value="83% · healthy" delta="-2%" tone="ok" />
        </div>

        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Suggested actions</div>
          <div className="space-y-2">
            {actions.map((a) => (
              <div key={a.title} className="p-3 rounded-lg bg-card/70 backdrop-blur border border-border/50 hover:border-primary/40 transition-smooth">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{a.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{a.subtitle}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] text-muted-foreground">Confidence</div>
                    <div className="text-sm font-semibold text-primary">{a.confidence}%</div>
                  </div>
                </div>
                <Progress value={a.confidence} className="h-1 mt-2" />
                <div className="flex items-center justify-end mt-2">
                  <Button variant="link" size="sm" className="h-auto p-0 text-primary text-xs">
                    Apply <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
