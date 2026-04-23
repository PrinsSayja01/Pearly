import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell, MapPin, Clock, DollarSign, Users, CheckCircle2, X,
  Briefcase, Calendar, Sparkles, Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { workers } from "@/data/mock";

type Status = "new" | "accepted" | "declined";

interface Offer {
  id: string;
  title: string;
  type: string;
  client: string;
  address: string;
  city: string;
  start: string;
  due: string;
  hours: number;
  rate: number;
  match: number;
  matchReasons: string[];
  teammates: string[]; // worker ids
  expiresIn: string;
}

const initialOffers: Offer[] = [
  {
    id: "o1",
    title: "Roof Leak Repair — URGENT",
    type: "Roofing",
    client: "North Star Cafe",
    address: "1500 Broadway",
    city: "Manhattan, NY",
    start: "Today 4:00 PM",
    due: "Tomorrow EOD",
    hours: 6,
    rate: 60,
    match: 96,
    matchReasons: ["0.8 mi from site", "Roofing certified", "Available now"],
    teammates: ["w6"],
    expiresIn: "expires in 12 min",
  },
  {
    id: "o2",
    title: "Apartment Rewiring assist — 3rd Floor",
    type: "Electrical",
    client: "Hillcrest Residences",
    address: "412 Maple Ave",
    city: "Brooklyn, NY",
    start: "Apr 22 · 8:00 AM",
    due: "Apr 24",
    hours: 24,
    rate: 35,
    match: 84,
    matchReasons: ["Apprentice fit", "Pair with Carlos (lead)", "2.1 mi"],
    teammates: ["w1"],
    expiresIn: "expires in 2 hr",
  },
  {
    id: "o3",
    title: "Bathroom plumbing rough-in",
    type: "Plumbing",
    client: "Marisol García",
    address: "88 Linden St",
    city: "Queens, NY",
    start: "Apr 23 · 9:00 AM",
    due: "Apr 28",
    hours: 32,
    rate: 55,
    match: 71,
    matchReasons: ["Trade match", "4.2 mi · longer travel"],
    teammates: ["w3"],
    expiresIn: "expires tomorrow",
  },
];

const Inbox = () => {
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [status, setStatus] = useState<Record<string, Status>>({
    o1: "new", o2: "new", o3: "new",
  });
  const [open, setOpen] = useState<string | null>("o1");

  const act = (id: string, next: "accepted" | "declined") => {
    setStatus((s) => ({ ...s, [id]: next }));
    setOpen(null);
  };

  const findWorker = (id: string) => workers.find((w) => w.id === id);

  const newCount = Object.values(status).filter((s) => s === "new").length;
  const acceptedCount = Object.values(status).filter((s) => s === "accepted").length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Hi Carlos</div>
          <h1 className="font-display text-3xl md:text-4xl mt-1">New work for you</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Pearly matched these jobs to your trade, schedule and location. Tap to review.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary px-3 py-1.5 text-xs">
            <Bell className="h-3 w-3" /> {newCount} new
          </Badge>
          <Badge variant="secondary" className="bg-success/15 text-success px-3 py-1.5 text-xs">
            <CheckCircle2 className="h-3 w-3" /> {acceptedCount} accepted
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        {offers.map((o) => {
          const st = status[o.id];
          const isOpen = open === o.id;

          return (
            <Card
              key={o.id}
              className={cn(
                "overflow-hidden transition-smooth",
                st === "accepted" && "border-success/40 bg-success/5",
                st === "declined" && "opacity-60",
                st === "new" && "hover:shadow-elegant",
              )}
            >
              <button
                onClick={() => setOpen(isOpen ? null : o.id)}
                className="w-full text-left p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-lg bg-gradient-iridescent flex items-center justify-center shrink-0 shadow-glow">
                    <Briefcase className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium text-primary">{o.type}</span>
                      {st === "new" && (
                        <span className="text-[10px] uppercase tracking-wider text-warning font-semibold">
                          {o.expiresIn}
                        </span>
                      )}
                      {st === "accepted" && (
                        <Badge className="bg-success/15 text-success" variant="secondary">Accepted · in your jobs</Badge>
                      )}
                      {st === "declined" && (
                        <Badge variant="secondary">Declined</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold mt-1">{o.title}</h3>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" /> {o.address} · {o.city}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Match</div>
                    <div className="text-xl font-semibold text-primary flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" /> {o.match}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Start</div>
                      <div className="text-xs font-medium">{o.start}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Hours</div>
                      <div className="text-xs font-medium">~{o.hours} hrs</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Pay</div>
                      <div className="text-xs font-medium">${o.rate}/hr · ${o.rate * o.hours}</div>
                    </div>
                  </div>
                </div>
              </button>

              {isOpen && st === "new" && (
                <div className="px-5 pb-5 space-y-4 animate-fade-in border-t border-border bg-muted/30">
                  <div className="pt-4">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                      Why Pearly matched you
                    </div>
                    <ul className="flex flex-wrap gap-1.5">
                      {o.matchReasons.map((r) => (
                        <li key={r} className="text-xs bg-card border border-border px-2 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-success" /> {r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                      Team you'd join
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        <div className="h-10 w-10 rounded-full bg-gradient-primary border-2 border-card text-xs font-bold flex items-center justify-center text-primary-foreground">
                          You
                        </div>
                        {o.teammates.map((tid) => {
                          const w = findWorker(tid);
                          if (!w) return null;
                          return (
                            <div key={tid} className="h-10 w-10 rounded-full bg-gradient-iridescent border-2 border-card text-xs font-bold flex items-center justify-center text-primary-foreground">
                              {w.name.split(" ").map((n) => n[0]).join("")}
                            </div>
                          );
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" /> {o.teammates.length + 1} workers · led by{" "}
                        {findWorker(o.teammates[0])?.name ?? "you"}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button
                      variant="outline"
                      className="h-12 flex-1 sm:flex-initial"
                      onClick={() => act(o.id, "declined")}
                    >
                      <X className="h-4 w-4" /> Decline
                    </Button>
                    <Button variant="outline" className="h-12">
                      <Phone className="h-4 w-4" /> Call coordinator
                    </Button>
                    <Button
                      className="h-12 flex-1 bg-gradient-primary hover:opacity-90"
                      onClick={() => act(o.id, "accepted")}
                    >
                      <CheckCircle2 className="h-4 w-4" /> Accept & join team
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Inbox;
