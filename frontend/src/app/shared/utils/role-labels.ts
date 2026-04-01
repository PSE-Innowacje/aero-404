const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrator',
  PLANNER: 'Osoba planująca',
  SUPERVISOR: 'Osoba nadzorująca',
  PILOT: 'Pilot',
};

export function roleLabel(role: string): string {
  return ROLE_LABELS[role] ?? role;
}
