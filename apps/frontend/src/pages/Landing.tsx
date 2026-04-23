import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, HardHat, MapPin, Wallet, ClipboardCheck, ShieldCheck, Phone } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/50">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-iridescent shadow-glow" />
            <span className="font-display text-2xl">Pearly</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#how" className="hover:text-foreground transition-smooth">How it works</a>
            <a href="#trades" className="hover:text-foreground transition-smooth">Trades</a>
            <a href="#features" className="hover:text-foreground transition-smooth">Features</a>
            <a href="#contact" className="hover:text-foreground transition-smooth">Contact</a>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild><Link to="/app">Sign in</Link></Button>
            <Button size="sm" className="bg-gradient-primary hover:opacity-90" asChild>
              <Link to="/app">Open app <ArrowRight className="h-3.5 w-3.5" /></Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-36 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
        <div className="container relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/60 backdrop-blur text-xs text-muted-foreground mb-8 animate-fade-in">
              <HardHat className="h-3 w-3 text-primary" />
              Construction & field-services platform
            </div>
            <h1 className="font-display text-6xl md:text-8xl leading-[0.95] tracking-tight animate-fade-in">
              Run every job site <span className="text-gradient italic">like clockwork</span>.
            </h1>
            <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed animate-fade-in">
              Pearly connects clients, skilled workers, and supervisors. Post a job, get matched with the right crew,
              track progress on site, and pay by milestone — all from one app, on phone or desktop.
            </p>
            <div className="mt-10 flex flex-wrap gap-3 animate-fade-in">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 shadow-elegant h-12" asChild>
                <Link to="/app">Open the app <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12" asChild>
                <a href="#how">See how it works</a>
              </Button>
            </div>
          </div>

          {/* Mockup */}
          <div className="mt-20 relative animate-fade-in">
            <div className="absolute -inset-4 bg-gradient-iridescent opacity-20 blur-3xl rounded-3xl" />
            <div className="relative grid md:grid-cols-3 gap-4">
              {/* Phone — worker view */}
              <div className="rounded-[2rem] border-8 border-foreground/90 bg-card shadow-elegant overflow-hidden mx-auto w-64 h-[500px] order-2 md:order-1">
                <div className="bg-gradient-primary text-primary-foreground p-4 pt-8">
                  <div className="text-[10px] opacity-80 uppercase tracking-wider">Today's job</div>
                  <div className="font-semibold text-sm mt-1">Apartment Rewiring</div>
                  <div className="flex items-center gap-1 text-xs mt-2 opacity-90">
                    <MapPin className="h-3 w-3" /> 412 Maple Ave
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <button className="w-full h-12 rounded-lg bg-success text-success-foreground font-semibold text-sm">✓ Clock in</button>
                  <button className="w-full h-12 rounded-lg border border-border font-medium text-sm flex items-center justify-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> Call client
                  </button>
                  <div className="pt-3 space-y-1.5">
                    {["Power off & safety check", "Demo old wiring", "Run new circuits", "Install outlets"].map((t, i) => (
                      <div key={t} className="flex items-center gap-2 p-2 rounded-md bg-secondary text-xs">
                        <div className={`h-4 w-4 rounded-full ${i < 2 ? "bg-success" : "border-2 border-border"}`} />
                        <span className={i < 2 ? "line-through text-muted-foreground" : ""}>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Desktop — supervisor view */}
              <div className="md:col-span-2 rounded-2xl border border-border bg-card shadow-elegant overflow-hidden order-1 md:order-2">
                <div className="h-9 border-b border-border flex items-center gap-1.5 px-4 bg-secondary/50">
                  <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
                  <span className="ml-3 text-xs text-muted-foreground">pearly.app/jobs</span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Supervisor · 4 active jobs</div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { t: "Apartment Rewiring", s: "In Progress", c: "bg-primary/10 text-primary" },
                      { t: "Bathroom Renovation", s: "Pending", c: "bg-muted text-muted-foreground" },
                      { t: "Roof Leak Repair", s: "Delayed", c: "bg-destructive/15 text-destructive" },
                      { t: "HVAC Install", s: "Done", c: "bg-success/15 text-success" },
                    ].map((j) => (
                      <div key={j.t} className="p-4 rounded-lg border border-border">
                        <div className="text-sm font-medium">{j.t}</div>
                        <span className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full font-semibold ${j.c}`}>{j.s}</span>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg bg-gradient-mesh border border-border/50 p-4 flex items-start gap-3">
                    <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                    <div className="text-xs">
                      <div className="font-semibold">Pearly suggests</div>
                      <div className="text-muted-foreground mt-0.5">Pavel Novak (0.8 mi away) is available now for the urgent roof repair.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 border-t border-border bg-secondary/30">
        <div className="container">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.25em] text-primary mb-4">How it works</div>
            <h2 className="font-display text-5xl md:text-6xl leading-tight">From request to paid — in one flow.</h2>
          </div>
          <div className="mt-14 grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { i: ClipboardCheck, t: "Request", b: "Client posts a job with location, scope, deadline." },
              { i: HardHat, t: "Crew", b: "Pearly matches qualified workers nearby." },
              { i: MapPin, t: "On site", b: "Crew clocks in. Supervisor tracks progress live." },
              { i: ClipboardCheck, t: "Work", b: "Tasks ticked off via mobile checklist." },
              { i: ShieldCheck, t: "Complete", b: "Client signs off. Photos & docs attached." },
              { i: Wallet, t: "Paid", b: "Milestone payments released from escrow." },
            ].map((s, i) => (
              <div key={s.t} className="p-5 rounded-xl bg-card border border-border">
                <div className="text-[10px] font-bold text-primary">STEP {i + 1}</div>
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center my-3">
                  <s.i className="h-4 w-4" />
                </div>
                <div className="font-semibold text-sm">{s.t}</div>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trades */}
      <section id="trades" className="py-24 border-t border-border">
        <div className="container">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.25em] text-primary mb-4">Trades supported</div>
            <h2 className="font-display text-5xl leading-tight">Built for every crew on site.</h2>
          </div>
          <div className="mt-12 flex flex-wrap gap-2">
            {["Electrical", "Plumbing", "Roofing", "HVAC", "Carpentry", "Tile & Flooring", "Painting", "Drywall", "Masonry", "Landscaping", "Demolition", "General contracting"].map((t) => (
              <span key={t} className="px-4 py-2 rounded-full border border-border bg-card text-sm hover:border-primary hover:text-primary transition-smooth">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 border-t border-border bg-secondary/30">
        <div className="container">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.25em] text-primary mb-4">Built for the field</div>
            <h2 className="font-display text-5xl md:text-6xl leading-tight">Simple on phone. Powerful on desktop.</h2>
          </div>

          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { i: Phone, t: "One-tap actions", b: "Clock in, mark done, call client. Built for gloves and bright sun." },
              { i: MapPin, t: "Location-aware", b: "Match nearby workers, get directions, geofence clock-ins." },
              { i: Wallet, t: "Milestone payments", b: "Escrow holds funds until each phase is signed off." },
              { i: Sparkles, t: "Smart alerts", b: "Replacement suggestions when a worker drops or a job slips." },
            ].map((f) => (
              <div key={f.t} className="p-6 rounded-xl bg-card border border-border hover:shadow-elegant hover:-translate-y-0.5 transition-smooth">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <f.i className="h-5 w-5" />
                </div>
                <div className="font-semibold">{f.t}</div>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-28 border-t border-border bg-gradient-mesh">
        <div className="container text-center max-w-3xl">
          <h2 className="font-display text-5xl md:text-7xl leading-tight">Get your next job running today.</h2>
          <p className="mt-6 text-lg text-muted-foreground">Post a project or join as a worker. Free during the pilot.</p>
          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90 h-12" asChild>
              <Link to="/app">Post a job <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12" asChild>
              <Link to="/app">I'm a worker</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-gradient-iridescent" />
            <span className="font-display text-lg text-foreground">Pearly</span>
          </div>
          <div>© 2026 Pearly. Field operations, simplified.</div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
