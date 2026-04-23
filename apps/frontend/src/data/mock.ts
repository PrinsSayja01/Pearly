export type JobStatus = "Pending" | "In Progress" | "Done" | "Delayed";
export type TaskStatus = "todo" | "doing" | "done";

export const jobs = [
  {
    id: "j-1042",
    title: "Apartment Rewiring — 3rd Floor",
    type: "Electrical",
    client: "Hillcrest Residences",
    address: "412 Maple Ave, Unit 3B",
    city: "Brooklyn, NY",
    status: "In Progress" as JobStatus,
    progress: 62,
    budget: 8400,
    spent: 5200,
    start: "Apr 18",
    due: "Apr 24",
    crew: 4,
    urgent: false,
  },
  {
    id: "j-1043",
    title: "Bathroom Renovation",
    type: "Plumbing + Tile",
    client: "Marisol García",
    address: "88 Linden St",
    city: "Queens, NY",
    status: "Pending" as JobStatus,
    progress: 0,
    budget: 14200,
    spent: 0,
    start: "Apr 22",
    due: "May 06",
    crew: 3,
    urgent: false,
  },
  {
    id: "j-1044",
    title: "Roof Leak Repair — URGENT",
    type: "Roofing",
    client: "North Star Cafe",
    address: "1500 Broadway",
    city: "Manhattan, NY",
    status: "Delayed" as JobStatus,
    progress: 35,
    budget: 3600,
    spent: 1100,
    start: "Apr 20",
    due: "Apr 21",
    crew: 2,
    urgent: true,
  },
  {
    id: "j-1045",
    title: "HVAC Install — Office Build-out",
    type: "HVAC",
    client: "Atelier Mar Studio",
    address: "210 W 28th St",
    city: "Manhattan, NY",
    status: "Done" as JobStatus,
    progress: 100,
    budget: 22000,
    spent: 21400,
    start: "Mar 28",
    due: "Apr 15",
    crew: 5,
    urgent: false,
  },
];

export const workers = [
  { id: "w1", name: "Carlos Méndez", trade: "Lead Electrician", rating: 4.9, available: "On site", distance: "—", rate: 65 },
  { id: "w2", name: "Tomás Silva", trade: "Plumber", rating: 4.8, available: "Today 2pm", distance: "1.2 mi", rate: 55 },
  { id: "w3", name: "Aisha Brown", trade: "Tile Setter", rating: 4.9, available: "Tomorrow", distance: "3.4 mi", rate: 50 },
  { id: "w4", name: "Pavel Novak", trade: "Roofer", rating: 4.7, available: "Today 4pm", distance: "0.8 mi", rate: 60 },
  { id: "w5", name: "Jordan Lee", trade: "HVAC Tech", rating: 4.8, available: "Apr 23", distance: "5.1 mi", rate: 70 },
  { id: "w6", name: "Mei Wong", trade: "Apprentice Electrician", rating: 4.6, available: "On site", distance: "—", rate: 35 },
];

export const checklist = [
  { id: "c1", title: "Power off & safety check", status: "done" as TaskStatus, assignee: "Carlos" },
  { id: "c2", title: "Demo old wiring — kitchen + hall", status: "done" as TaskStatus, assignee: "Carlos" },
  { id: "c3", title: "Run new circuits to panel", status: "doing" as TaskStatus, assignee: "Carlos" },
  { id: "c4", title: "Install outlets & switches", status: "doing" as TaskStatus, assignee: "Mei" },
  { id: "c5", title: "Inspector walkthrough", status: "todo" as TaskStatus, assignee: "Carlos" },
  { id: "c6", title: "Patch & paint touch-ups", status: "todo" as TaskStatus, assignee: "Mei" },
];

export const milestones = [
  { id: "m1", title: "Materials delivered", amount: 1800, status: "paid", date: "Apr 17" },
  { id: "m2", title: "Rough-in complete", amount: 3400, status: "paid", date: "Apr 20" },
  { id: "m3", title: "Inspection passed", amount: 2000, status: "in_review", date: "Apr 23" },
  { id: "m4", title: "Final walkthrough", amount: 1200, status: "upcoming", date: "Apr 24" },
];

export const alerts = [
  { id: "a1", type: "delay", title: "Roof Leak Repair past due", body: "Job j-1044 missed deadline by 1 day. Suggest adding Pavel Novak (0.8 mi away).", action: "Assign worker" },
  { id: "a2", type: "swap", title: "Worker unavailable tomorrow", body: "Tomás Silva called out sick. Aisha Brown is closest qualified replacement.", action: "Swap" },
  { id: "a3", type: "ok", title: "Materials delivered on time", body: "Hillcrest Residences — all electrical materials confirmed on site.", action: "View" },
];
