import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, UserPlus } from "lucide-react";
import { alerts } from "@/data/mock";

const iconMap = { delay: AlertTriangle, swap: UserPlus, ok: CheckCircle2 };
const tone: Record<string, string> = {
  delay: "text-destructive bg-destructive/10 border-destructive/30",
  swap: "text-primary bg-primary/10 border-primary/30",
  ok: "text-success bg-success/10 border-success/30",
};

const Alerts = () => (
  <div className="space-y-6 max-w-3xl">
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">Inbox</div>
      <h1 className="font-display text-4xl mt-1">Alerts</h1>
    </div>
    <div className="space-y-3">
      {alerts.map((a) => {
        const Icon = iconMap[a.type as keyof typeof iconMap];
        return (
          <Card key={a.id} className={`border ${tone[a.type].split(" ")[2]}`}>
            <CardContent className="p-4 flex gap-3">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${tone[a.type]}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{a.title}</div>
                <div className="text-sm text-muted-foreground mt-0.5">{a.body}</div>
                <Button size="sm" className="mt-3 bg-gradient-primary hover:opacity-90">{a.action}</Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  </div>
);

export default Alerts;
