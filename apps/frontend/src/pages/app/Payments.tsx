import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { jobs, milestones } from "@/data/mock";
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";

const Payments = () => {
  const totalBudget = jobs.reduce((a, j) => a + j.budget, 0);
  const totalSpent = jobs.reduce((a, j) => a + j.spent, 0);

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Finance</div>
        <h1 className="font-display text-4xl mt-1">Payments</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <Card className="bg-gradient-primary text-primary-foreground border-transparent shadow-elegant overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
          <CardContent className="p-6 relative">
            <Wallet className="h-5 w-5 opacity-80" />
            <div className="mt-6 text-sm opacity-80">Total contracted</div>
            <div className="font-display text-4xl mt-1">${(totalBudget / 1000).toFixed(0)}k</div>
            <div className="text-xs mt-2 opacity-80">Across {jobs.length} jobs</div>
          </CardContent>
        </Card>
        <Card><CardContent className="p-6">
          <div className="text-sm text-muted-foreground">Paid out</div>
          <div className="font-display text-4xl mt-2">${(totalSpent / 1000).toFixed(1)}k</div>
          <Progress value={(totalSpent / totalBudget) * 100} className="h-1.5 mt-4" />
          <div className="text-xs text-success mt-2 flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> 12% MoM</div>
        </CardContent></Card>
        <Card><CardContent className="p-6">
          <div className="text-sm text-muted-foreground">In escrow</div>
          <div className="font-display text-4xl mt-2">${((totalBudget - totalSpent) / 1000).toFixed(1)}k</div>
          <div className="text-xs text-muted-foreground mt-4">Released on milestone approval</div>
          <div className="text-xs text-warning mt-2 flex items-center gap-1"><ArrowDownRight className="h-3 w-3" /> 1 awaiting review</div>
        </CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-5">
          <h3 className="font-semibold mb-4">Milestone payments — Apartment Rewiring</h3>
          <div className="space-y-2">
            {milestones.map((m) => (
              <div key={m.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-smooth">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{m.title}</div>
                  <div className="text-xs text-muted-foreground">{m.date}</div>
                </div>
                <Badge
                  variant="secondary"
                  className={`capitalize ${
                    m.status === "paid" ? "bg-success/15 text-success"
                      : m.status === "in_review" ? "bg-warning/15 text-warning"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {m.status.replace("_", " ")}
                </Badge>
                <div className="font-semibold w-20 text-right">${m.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;
