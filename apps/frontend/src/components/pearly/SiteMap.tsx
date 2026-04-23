import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SiteMap = ({ address, city }: { address: string; city: string }) => (
  <div className="relative rounded-xl overflow-hidden border border-border h-56 bg-secondary">
    {/* Stylized map background */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(hsl(var(--border)) 1px, transparent 1px),
          linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
      }}
    />
    <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
    {/* Roads */}
    <div className="absolute top-1/2 left-0 right-0 h-2 bg-card/80" />
    <div className="absolute left-1/3 top-0 bottom-0 w-2 bg-card/80" />
    {/* Pin */}
    <div className="absolute left-1/3 top-1/2 -translate-x-1/2 -translate-y-full">
      <div className="relative">
        <div className="absolute -inset-3 bg-primary/30 rounded-full animate-ping" />
        <div className="relative h-10 w-10 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-elegant">
          <MapPin className="h-5 w-5" fill="currentColor" />
        </div>
      </div>
    </div>
    {/* Address card */}
    <div className="absolute bottom-3 left-3 right-3 bg-card/95 backdrop-blur rounded-lg p-3 border border-border flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{address}</div>
        <div className="text-xs text-muted-foreground">{city}</div>
      </div>
      <Button size="sm" variant="outline" className="h-9">
        <Navigation className="h-3.5 w-3.5" /> Directions
      </Button>
    </div>
  </div>
);
