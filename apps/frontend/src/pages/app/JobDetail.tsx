import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { WorkflowStepper } from "@/components/pearly/WorkflowStepper";
import { Checklist } from "@/components/pearly/Checklist";
import { AIRecommendationPanel } from "@/components/pearly/AIRecommendationPanel";
import { SiteMap } from "@/components/pearly/SiteMap";
import { jobs, milestones, workers } from "@/data/mock";
import { ArrowLeft, Calendar, CheckCircle2, Phone, Wallet } from "lucide-react";

const JobDetail = () => {
  const { id } = useParams();
  const job = jobs.find((j) => j.id === id) ?? jobs[0];
  const crew = workers.slice(0, job.crew);

  return (
    <div className="space-y-6 max-w-7xl">
      <Link to="/app/jobs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-smooth">
        <ArrowLeft className="h-4 w-4" /> Back to jobs
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-primary">{job.type}</div>
          <h1 className="font-display text-3xl md:text-5xl mt-1">{job.title}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge className="bg-primary/10 text-primary" variant="secondary">{job.status}</Badge>
            <span className="text-xs text-muted-foreground">{job.client}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-11"><Phone className="h-4 w-4" /> Call</Button>
          <Button className="bg-gradient-primary hover:opacity-90 h-11">Update status</Button>
        </div>
      </div>

      <SiteMap address={job.address} city={job.city} />

      <Card><CardContent className="p-6"><WorkflowStepper current={3} /></CardContent></Card>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Calendar className="h-3.5 w-3.5" /> Due</div>
          <div className="text-2xl font-semibold mt-2">{job.due}</div>
          <Progress value={job.progress} className="h-1.5 mt-3" />
          <div className="text-xs text-muted-foreground mt-2">{job.progress}% complete</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Wallet className="h-3.5 w-3.5" /> Budget</div>
          <div className="text-2xl font-semibold mt-2">${(job.spent / 1000).toFixed(1)}k <span className="text-sm text-muted-foreground font-normal">/ ${(job.budget / 1000).toFixed(1)}k</span></div>
          <Progress value={(job.spent / job.budget) * 100} className="h-1.5 mt-3" />
        </CardContent></Card>
        <Card className="col-span-2 lg:col-span-1"><CardContent className="p-4">
          <div className="text-xs text-muted-foreground">Crew on this job</div>
          <div className="flex -space-x-2 mt-3">
            {crew.map((w) => (
              <div key={w.id} className="h-9 w-9 rounded-full bg-gradient-iridescent border-2 border-card text-[10px] font-bold flex items-center justify-center text-primary-foreground">
                {w.name.split(" ").map((n) => n[0]).join("")}
              </div>
            ))}
          </div>
          <div className="text-xs text-muted-foreground mt-2">{job.crew} workers assigned</div>
        </CardContent></Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="checklist">
            <TabsList>
              <TabsTrigger value="checklist">Checklist</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="crew">Crew</TabsTrigger>
            </TabsList>
            <TabsContent value="checklist" className="mt-4"><Checklist /></TabsContent>
            <TabsContent value="milestones" className="mt-4 space-y-3">
              {milestones.map((m) => (
                <Card key={m.id}><CardContent className="p-4 flex items-center gap-4">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center ${
                    m.status === "paid" ? "bg-success/15 text-success"
                      : m.status === "in_review" ? "bg-warning/15 text-warning"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{m.title}</div>
                    <div className="text-xs text-muted-foreground">Due {m.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${m.amount.toLocaleString()}</div>
                    <Badge variant="outline" className="text-[10px] capitalize">{m.status.replace("_", " ")}</Badge>
                  </div>
                </CardContent></Card>
              ))}
            </TabsContent>
            <TabsContent value="crew" className="mt-4 space-y-3">
              {crew.map((w) => (
                <Card key={w.id}><CardContent className="p-4 flex items-center gap-4">
                  <div className="h-11 w-11 rounded-full bg-gradient-iridescent text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {w.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{w.name}</div>
                    <div className="text-xs text-muted-foreground">{w.trade} · ★ {w.rating}</div>
                  </div>
                  <Button size="sm" variant="outline" className="h-9"><Phone className="h-3.5 w-3.5" /></Button>
                </CardContent></Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
        <div><AIRecommendationPanel /></div>
      </div>
    </div>
  );
};

export default JobDetail;
