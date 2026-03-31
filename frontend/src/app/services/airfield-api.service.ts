import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AirfieldRequestDto, AirfieldResponseDto } from '../models/airfield.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AirfieldApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAll(): Observable<AirfieldResponseDto[]> {
    return this.http.get<AirfieldResponseDto[]>(`${this.apiUrl}/api/v1/airfields`);
  }

  getById(id: number): Observable<AirfieldResponseDto> {
    return this.http.get<AirfieldResponseDto>(`${this.apiUrl}/api/v1/airfields/${id}`);
  }

  create(data: AirfieldRequestDto): Observable<AirfieldResponseDto> {
    return this.http.post<AirfieldResponseDto>(`${this.apiUrl}/api/v1/airfields`, data);
  }

  update(id: number, data: AirfieldRequestDto): Observable<AirfieldResponseDto> {
    return this.http.put<AirfieldResponseDto>(`${this.apiUrl}/api/v1/airfields/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/v1/airfields/${id}`);
  }
}
