import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Users, Calendar, ArrowUpRight, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import type { JobStatus } from "@/data/mock";

interface JobCardProps {
  id: string;
  title: string;
  type: string;
  client: string;
  address: string;
  city: string;
  status: JobStatus;
  progress: number;
  budget: number;
  spent: number;
  due: string;
  crew: number;
  urgent: boolean;
}

const statusStyle: Record<JobStatus, string> = {
  "Pending": "bg-muted text-muted-foreground",
  "In Progress": "bg-primary/10 text-primary",
  "Done": "bg-success/15 text-success",
  "Delayed": "bg-destructive/15 text-destructive",
};

export const JobCard = (j: JobCardProps) => {
  return (
    <Link to={`/app/jobs/${j.id}`}>
      <Card className="group hover:shadow-elegant hover:-translate-y-0.5 transition-smooth h-full overflow-hidden">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-primary">{j.type}</span>
                {j.urgent && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-destructive uppercase tracking-wider">
                    <AlertTriangle className="h-3 w-3" /> Urgent
                  </span>
                )}
              </div>
              <h3 className="font-semibold mt-1 group-hover:text-primary transition-smooth">{j.title}</h3>
              <div className="text-xs text-muted-foreground mt-1">{j.client}</div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-smooth" />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> {j.address} · {j.city}
          </div>

          <Badge className={statusStyle[j.status]} variant="secondary">{j.status}</Badge>

          {j.status !== "Pending" && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{j.progress}%</span>
              </div>
              <Progress value={j.progress} className="h-1.5" />
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
            <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{j.crew}</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />Due {j.due}</span>
            <span className="font-medium text-foreground">${(j.spent / 1000).toFixed(1)}k / ${(j.budget / 1000).toFixed(1)}k</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
