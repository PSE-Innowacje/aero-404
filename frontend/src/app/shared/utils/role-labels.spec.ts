import { roleLabel } from './role-labels';

describe('roleLabel', () => {
  it('should return "Administrator" for ADMIN', () => {
    expect(roleLabel('ADMIN')).toBe('Administrator');
  });

  it('should return "Osoba planująca" for PLANNER', () => {
    expect(roleLabel('PLANNER')).toBe('Osoba planująca');
  });

  it('should return "Osoba nadzorująca" for SUPERVISOR', () => {
    expect(roleLabel('SUPERVISOR')).toBe('Osoba nadzorująca');
  });

  it('should return "Pilot" for PILOT', () => {
    expect(roleLabel('PILOT')).toBe('Pilot');
  });

  it('should return raw role for unknown role', () => {
    expect(roleLabel('UNKNOWN')).toBe('UNKNOWN');
  });
});
