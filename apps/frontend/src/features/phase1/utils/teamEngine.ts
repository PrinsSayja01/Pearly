export const buildSmartTeam = ({
  candidates,
  lead,
  jobRole,
}: any) => {
  if (!lead) return [];

  const ROLE_RULES: Record<string, string[]> = {
    electrician: ["electrician", "helper"],
    plumber: ["plumber", "helper"],
    carpenter: ["carpenter", "helper"],
    roofer: ["roofer", "carpenter"],
    painter: ["painter", "tiler"],
    tiler: ["tiler", "painter"],
    cleaner: ["cleaner"],
    helper: ["helper"],
  };

  const requiredRoles = ROLE_RULES[jobRole] || [jobRole];

  // team size logic
  let teamSize = 1;
  if (lead.skill >= 4) teamSize = 2;
  if (lead.skill >= 4.5) teamSize = 3;

  const pool = candidates.filter(
    (c: any) => String(c.id) !== String(lead.id)
  );

  const roleMatched = pool.filter((c: any) =>
    requiredRoles.includes(c.role)
  );

  const score = (c: any) => {
    let s = 0;
    if (c.role === lead.role) s += 2;
    if (requiredRoles.includes(c.role)) s += 2;
    if (c.skill >= 4) s += 2;
    if (c.rating >= 4.5) s += 1;
    if (c.location === lead.location) s += 1;
    return s;
  };

  return roleMatched
    .sort((a: any, b: any) => score(b) - score(a))
    .slice(0, teamSize);
};