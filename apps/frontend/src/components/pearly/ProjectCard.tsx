import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Calendar, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  id: string;
  name: string;
  client: string;
  status: string;
  progress: number;
  budget: number;
  spent: number;
  deadline: string;
  team: number;
  tags: string[];
}

const statusColor: Record<string, string> = {
  "In Progress": "bg-primary/10 text-primary",
  "Team Forming": "bg-warning/15 text-warning",
  "Review": "bg-accent/15 text-accent",
};

export const ProjectCard = (p: ProjectCardProps) => {
  return (
    <Link to={`/app/projects/${p.id}`}>
      <Card className="group hover:shadow-elegant hover:-translate-y-0.5 transition-smooth h-full overflow-hidden">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs text-muted-foreground">{p.client}</div>
              <h3 className="font-semibold mt-0.5 group-hover:text-primary transition-smooth">{p.name}</h3>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-smooth" />
          </div>

          <div className="flex flex-wrap gap-1.5">
            <Badge className={statusColor[p.status] ?? "bg-secondary"} variant="secondary">{p.status}</Badge>
            {p.tags.map((t) => (
              <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
            ))}
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{p.progress}%</span>
            </div>
            <Progress value={p.progress} className="h-1.5" />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
            <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{p.team}</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{p.deadline}</span>
            <span className="font-medium text-foreground">${(p.spent / 1000).toFixed(1)}k / ${(p.budget / 1000).toFixed(0)}k</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
