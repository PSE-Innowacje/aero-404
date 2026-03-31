import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HelicopterRequestDto, HelicopterResponseDto } from '../models/helicopter.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HelicopterApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAll(): Observable<HelicopterResponseDto[]> {
    return this.http.get<HelicopterResponseDto[]>(`${this.apiUrl}/api/v1/helicopters`);
  }

  getById(id: number): Observable<HelicopterResponseDto> {
    return this.http.get<HelicopterResponseDto>(`${this.apiUrl}/api/v1/helicopters/${id}`);
  }

  create(data: HelicopterRequestDto): Observable<HelicopterResponseDto> {
    return this.http.post<HelicopterResponseDto>(`${this.apiUrl}/api/v1/helicopters`, data);
  }

  update(id: number, data: HelicopterRequestDto): Observable<HelicopterResponseDto> {
    return this.http.put<HelicopterResponseDto>(`${this.apiUrl}/api/v1/helicopters/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/v1/helicopters/${id}`);
  }
}
