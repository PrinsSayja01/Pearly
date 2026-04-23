import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, AlertTriangle, CheckCircle2, UserPlus } from "lucide-react";
import { alerts } from "@/data/mock";

const iconMap = { delay: AlertTriangle, swap: UserPlus, ok: CheckCircle2 };
const colorMap: Record<string, string> = {
  delay: "text-destructive bg-destructive/10",
  swap: "text-primary bg-primary/10",
  ok: "text-success bg-success/10",
};

export const AIRecommendationPanel = () => {
  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-surface relative">
      <div className="absolute inset-0 bg-gradient-mesh opacity-50 pointer-events-none" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="h-7 w-7 rounded-md bg-gradient-iridescent flex items-center justify-center shadow-glow">
            <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          Pearly Suggests
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-3">
        {alerts.map((a) => {
          const Icon = iconMap[a.type as keyof typeof iconMap];
          return (
            <div key={a.id} className="flex gap-3 p-3 rounded-lg bg-card/70 backdrop-blur border border-border/50">
              <div className={`h-8 w-8 rounded-md flex items-center justify-center shrink-0 ${colorMap[a.type]}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{a.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{a.body}</div>
                <Button variant="link" size="sm" className="h-auto p-0 mt-1.5 text-primary text-xs">
                  {a.action} →
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
