import { JobCard } from "@/components/pearly/JobCard";
import { jobs } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Jobs = () => {
  const buckets = {
    all: jobs,
    active: jobs.filter((j) => j.status === "In Progress"),
    pending: jobs.filter((j) => j.status === "Pending"),
    delayed: jobs.filter((j) => j.status === "Delayed"),
    done: jobs.filter((j) => j.status === "Done"),
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">All jobs</div>
          <h1 className="font-display text-4xl mt-1">Jobs</h1>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90 h-11">
          <Plus className="h-4 w-4" /> New job
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="overflow-x-auto">
          <TabsTrigger value="all">All ({buckets.all.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({buckets.active.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({buckets.pending.length})</TabsTrigger>
          <TabsTrigger value="delayed">Delayed ({buckets.delayed.length})</TabsTrigger>
          <TabsTrigger value="done">Done ({buckets.done.length})</TabsTrigger>
        </TabsList>
        {(Object.keys(buckets) as (keyof typeof buckets)[]).map((k) => (
          <TabsContent key={k} value={k} className="mt-5">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {buckets[k].map((j) => <JobCard key={j.id} {...j} />)}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Jobs;
