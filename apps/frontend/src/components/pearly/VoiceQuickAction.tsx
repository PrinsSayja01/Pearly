import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const samplePhrases = [
  "Outlets installed in kitchen — moving to hallway",
  "Need 2 more boxes of conduit on site",
  "Inspector arrived, starting walkthrough",
];

export const VoiceQuickAction = () => {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [parsed, setParsed] = useState<null | { task: string; status: string }>(null);

  useEffect(() => {
    if (!recording) return;
    const phrase = samplePhrases[Math.floor(Math.random() * samplePhrases.length)];
    let i = 0;
    setTranscript("");
    setParsed(null);
    const id = setInterval(() => {
      i++;
      setTranscript(phrase.slice(0, i));
      if (i >= phrase.length) {
        clearInterval(id);
        setTimeout(() => {
          setRecording(false);
          setParsed({ task: "Install outlets & switches", status: "In progress → next: hallway" });
        }, 400);
      }
    }, 35);
    return () => clearInterval(id);
  }, [recording]);

  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-surface relative">
      <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
      <CardContent className="relative p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-7 w-7 rounded-md bg-gradient-iridescent flex items-center justify-center shadow-glow">
            <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <div>
            <div className="text-sm font-semibold">Voice update</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Hands-free · works on site</div>
          </div>
        </div>

        <button
          onClick={() => setRecording(true)}
          disabled={recording}
          className={cn(
            "w-full h-20 rounded-xl flex items-center justify-center gap-3 font-medium text-base transition-smooth",
            recording
              ? "bg-destructive/10 text-destructive border-2 border-destructive/40"
              : "bg-gradient-primary text-primary-foreground hover:opacity-90 active:scale-[0.99]",
          )}
        >
          <span
            className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center",
              recording ? "bg-destructive text-destructive-foreground animate-pulse-glow" : "bg-primary-foreground/20",
            )}
          >
            <Mic className="h-5 w-5" />
          </span>
          {recording ? "Listening…" : "Hold to talk"}
        </button>

        {transcript && (
          <div className="mt-3 p-3 rounded-lg bg-card/70 border border-border/50">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">You said</div>
            <div className="text-sm mt-1">"{transcript}"</div>
          </div>
        )}

        {parsed && (
          <div className="mt-2 p-3 rounded-lg bg-success/10 border border-success/30 flex items-start gap-2">
            <div className="h-6 w-6 rounded-full bg-success text-success-foreground flex items-center justify-center shrink-0 mt-0.5">
              <Check className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">Updated: {parsed.task}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{parsed.status}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
