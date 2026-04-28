import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

import { usePhase1Store } from "../store";

export const DoneScreen = () => {
  const {
    selectedCandidate,
    teamMemberIds,
    reset,
  } = usePhase1Store();

  const allCandidates = JSON.parse(localStorage.getItem("candidates") || "[]");

  const teamMembers = allCandidates.filter((c: any) =>
    teamMemberIds.includes(String(c.id))
  );

  return (
    <div className="space-y-5">

      {/* SUCCESS */}
      <Card>
        <CardContent className="p-6 text-center space-y-3">

          <CheckCircle2 className="h-10 w-10 mx-auto text-green-600" />

          <h2 className="text-xl font-semibold">
            Project created
          </h2>

          <p className="text-sm text-muted-foreground">
            {selectedCandidate?.name} is leading your team
          </p>

        </CardContent>
      </Card>

      {/* TEAM */}
      <Card>
        <CardContent className="p-4 space-y-3">

          <div className="text-xs text-muted-foreground">
            Team Structure
          </div>

          {/* LEAD */}
          {selectedCandidate && (
            <div className="border-2 border-blue-500 bg-blue-50 rounded-xl p-3">
              <div className="font-medium text-blue-700">
                👑 {selectedCandidate.name}
              </div>
              <div className="text-xs text-muted-foreground">
                Team Lead
              </div>
            </div>
          )}

          {/* MEMBERS */}
          {teamMembers.length > 0 ? (
            teamMembers.map((m: any) => (
              <div key={m.id} className="border rounded-xl p-3">
                <div className="font-medium">
                  {m.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {m.trade}
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">
              No team members
            </div>
          )}

        </CardContent>
      </Card>

      <Button className="w-full" onClick={reset}>
        Start new project
      </Button>

    </div>
  );
};