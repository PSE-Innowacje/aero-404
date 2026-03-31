import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  CommentRequest,
  OperationCommentDto,
  OperationStatus,
  PlannedOperationRequestDto,
  PlannedOperationResponseDto,
} from '../models/planned-operation.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PlannedOperationApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAll(status?: OperationStatus): Observable<PlannedOperationResponseDto[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<PlannedOperationResponseDto[]>(
      `${this.apiUrl}/api/v1/operations`,
      { params },
    );
  }

  getById(id: number): Observable<PlannedOperationResponseDto> {
    return this.http.get<PlannedOperationResponseDto>(
      `${this.apiUrl}/api/v1/operations/${id}`,
    );
  }

  create(
    dto: PlannedOperationRequestDto,
    kmlFile?: File,
  ): Observable<PlannedOperationResponseDto> {
    const formData = new FormData();
    formData.append(
      'dto',
      new Blob([JSON.stringify(dto)], { type: 'application/json' }),
    );
    if (kmlFile) {
      formData.append('kmlFile', kmlFile);
    }
    return this.http.post<PlannedOperationResponseDto>(
      `${this.apiUrl}/api/v1/operations`,
      formData,
    );
  }

  update(
    id: number,
    dto: PlannedOperationRequestDto,
    kmlFile?: File,
  ): Observable<PlannedOperationResponseDto> {
    const formData = new FormData();
    formData.append(
      'dto',
      new Blob([JSON.stringify(dto)], { type: 'application/json' }),
    );
    if (kmlFile) {
      formData.append('kmlFile', kmlFile);
    }
    return this.http.put<PlannedOperationResponseDto>(
      `${this.apiUrl}/api/v1/operations/${id}`,
      formData,
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/v1/operations/${id}`);
  }

  resign(id: number): Observable<PlannedOperationResponseDto> {
    return this.http.post<PlannedOperationResponseDto>(
      `${this.apiUrl}/api/v1/operations/${id}/resign`,
      null,
    );
  }

  reject(id: number): Observable<PlannedOperationResponseDto> {
    return this.http.post<PlannedOperationResponseDto>(
      `${this.apiUrl}/api/v1/operations/${id}/reject`,
      null,
    );
  }

  confirm(
    id: number,
    plannedDateFrom: string,
    plannedDateTo: string,
  ): Observable<PlannedOperationResponseDto> {
    const params = new HttpParams()
      .set('plannedDateFrom', plannedDateFrom)
      .set('plannedDateTo', plannedDateTo);
    return this.http.post<PlannedOperationResponseDto>(
      `${this.apiUrl}/api/v1/operations/${id}/confirm`,
      null,
      { params },
    );
  }

  addComment(id: number, text: string): Observable<OperationCommentDto> {
    const body: CommentRequest = { text };
    return this.http.post<OperationCommentDto>(
      `${this.apiUrl}/api/v1/operations/${id}/comments`,
      body,
    );
  }
}
