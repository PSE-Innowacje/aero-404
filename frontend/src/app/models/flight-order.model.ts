import { OperationStatus } from './planned-operation.model';
import { CrewMemberResponseDto } from './crew.model';
import { HelicopterResponseDto } from './helicopter.model';
import { AirfieldResponseDto } from './airfield.model';

export type FlightOrderStatus =
  | 'INTRODUCED'
  | 'SUBMITTED'
  | 'REJECTED'
  | 'ACCEPTED'
  | 'PARTIALLY_DONE'
  | 'DONE'
  | 'NOT_DONE';

export interface PlannedOperationSimpleDto {
  id: number;
  autoNumber: string;
  shortDescription: string;
  status: OperationStatus;
  routeKm: number;
}

export interface FlightOrderRequestDto {
  plannedDeparture: string;
  plannedLanding: string;
  pilotId?: number;
  helicopterId: number;
  crewMemberIds?: number[];
  departureAirfieldId: number;
  arrivalAirfieldId: number;
  operationIds: number[];
  estimatedRouteKm: number;
  actualDeparture?: string;
  actualLanding?: string;
}

export interface FlightOrderResponseDto {
  id: number;
  autoNumber: string;
  plannedDeparture: string;
  plannedLanding: string;
  actualDeparture: string | null;
  actualLanding: string | null;
  pilot: CrewMemberResponseDto;
  helicopter: HelicopterResponseDto;
  crewMembers: CrewMemberResponseDto[];
  departureAirfield: AirfieldResponseDto;
  arrivalAirfield: AirfieldResponseDto;
  plannedOperations: PlannedOperationSimpleDto[];
  crewWeight: number;
  estimatedRouteKm: number;
  status: FlightOrderStatus;
}

export interface FlightOrderCompleteRequest {
  result: string;
}
