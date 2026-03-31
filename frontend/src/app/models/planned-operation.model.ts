export type OperationStatus =
  | 'INTRODUCED'
  | 'REJECTED'
  | 'CONFIRMED'
  | 'SCHEDULED'
  | 'PARTIALLY_DONE'
  | 'DONE'
  | 'RESIGNED';

export type ActivityType =
  | 'VISUAL_INSPECTION'
  | 'SCAN_3D'
  | 'FAULT_LOCATION'
  | 'PHOTOS'
  | 'PATROL';

export interface UserSimpleDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface OperationCommentDto {
  id: number;
  text: string;
  createdBy: UserSimpleDto;
  createdAt: string;
}

export interface OperationHistoryDto {
  [key: string]: unknown;
}

export interface PlannedOperationRequestDto {
  orderNumber?: string;
  shortDescription: string;
  proposedDateFrom?: string;
  proposedDateTo?: string;
  activityTypes: ActivityType[];
  additionalInfo?: string;
  contactEmails?: string;
}

export interface PlannedOperationResponseDto {
  id: number;
  autoNumber: string;
  orderNumber: string;
  shortDescription: string;
  kmlFileName: string;
  routeKm: number;
  routePoints: string;
  proposedDateFrom: string;
  proposedDateTo: string;
  plannedDateFrom: string;
  plannedDateTo: string;
  activityTypes: ActivityType[];
  additionalInfo: string;
  status: OperationStatus;
  createdBy: UserSimpleDto;
  contactEmails: string;
  remarksAfterExecution: string;
  comments: OperationCommentDto[];
  history: OperationHistoryDto[];
}

export interface CommentRequest {
  text: string;
}
