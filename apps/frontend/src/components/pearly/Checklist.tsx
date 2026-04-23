import { useState } from "react";
import { checklist as initial } from "@/data/mock";
import { Check, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Checklist = () => {
  const [items, setItems] = useState(initial);

  const cycle = (id: string) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? { ...it, status: it.status === "todo" ? "doing" : it.status === "doing" ? "done" : "todo" }
          : it,
      ),
    );
  };

  return (
    <div className="divide-y divide-border rounded-xl border border-border bg-card overflow-hidden">
      {items.map((it) => (
        <button
          key={it.id}
          onClick={() => cycle(it.id)}
          className="w-full flex items-center gap-3 p-4 hover:bg-secondary/50 transition-smooth text-left active:scale-[0.99]"
        >
          <div
            className={cn(
              "h-7 w-7 rounded-full flex items-center justify-center shrink-0 transition-smooth",
              it.status === "done" && "bg-success text-success-foreground",
              it.status === "doing" && "bg-warning/20 text-warning",
              it.status === "todo" && "bg-muted text-muted-foreground",
            )}
          >
            {it.status === "done" ? <Check className="h-4 w-4" /> : it.status === "doing" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Circle className="h-3 w-3" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className={cn("text-sm font-medium", it.status === "done" && "line-through text-muted-foreground")}>
              {it.title}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">Assigned to {it.assignee}</div>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {it.status === "todo" ? "To do" : it.status === "doing" ? "In progress" : "Done"}
          </span>
        </button>
      ))}
    </div>
  );
};
