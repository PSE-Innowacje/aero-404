import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  FlightOrderCompleteRequest,
  FlightOrderRequestDto,
  FlightOrderResponseDto,
  FlightOrderStatus,
} from '../models/flight-order.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FlightOrderApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAll(status?: FlightOrderStatus): Observable<FlightOrderResponseDto[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<FlightOrderResponseDto[]>(
      `${this.apiUrl}/api/v1/flight-orders`,
      { params },
    );
  }

  getById(id: number): Observable<FlightOrderResponseDto> {
    return this.http.get<FlightOrderResponseDto>(
      `${this.apiUrl}/api/v1/flight-orders/${id}`,
    );
  }

  create(dto: FlightOrderRequestDto): Observable<FlightOrderResponseDto> {
    return this.http.post<FlightOrderResponseDto>(
      `${this.apiUrl}/api/v1/flight-orders`,
      dto,
    );
  }

  update(id: number, dto: FlightOrderRequestDto): Observable<FlightOrderResponseDto> {
    return this.http.put<FlightOrderResponseDto>(
      `${this.apiUrl}/api/v1/flight-orders/${id}`,
      dto,
    );
  }

  submit(id: number): Observable<FlightOrderResponseDto> {
    return this.http.post<FlightOrderResponseDto>(
      `${this.apiUrl}/api/v1/flight-orders/${id}/submit`,
      null,
    );
  }

  reject(id: number): Observable<FlightOrderResponseDto> {
    return this.http.post<FlightOrderResponseDto>(
      `${this.apiUrl}/api/v1/flight-orders/${id}/reject`,
      null,
    );
  }

  accept(id: number): Observable<FlightOrderResponseDto> {
    return this.http.post<FlightOrderResponseDto>(
      `${this.apiUrl}/api/v1/flight-orders/${id}/accept`,
      null,
    );
  }

  complete(id: number, request: FlightOrderCompleteRequest): Observable<FlightOrderResponseDto> {
    return this.http.post<FlightOrderResponseDto>(
      `${this.apiUrl}/api/v1/flight-orders/${id}/complete`,
      request,
    );
  }
}
