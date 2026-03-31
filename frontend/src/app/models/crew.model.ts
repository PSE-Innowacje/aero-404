export type CrewRole = 'PILOT' | 'OBSERVER';

export interface CrewMemberRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  weight: number;
  role: CrewRole;
  licenseNumber?: string;
  licenseExpiry?: string;
  trainingExpiry: string;
}

export interface CrewMemberResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  weight: number;
  role: CrewRole;
  licenseNumber: string;
  licenseExpiry: string;
  trainingExpiry: string;
}
