export type HelicopterStatus = 'ACTIVE' | 'INACTIVE';

export interface HelicopterRequestDto {
  regNumber: string;
  type: string;
  description?: string;
  maxCrew: number;
  maxPayload: number;
  status: HelicopterStatus;
  reviewDate?: string;
  rangeKm: number;
}

export interface HelicopterResponseDto {
  id: number;
  regNumber: string;
  type: string;
  description: string;
  maxCrew: number;
  maxPayload: number;
  status: HelicopterStatus;
  reviewDate: string;
  rangeKm: number;
}
