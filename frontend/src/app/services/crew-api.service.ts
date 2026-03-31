import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CrewMemberRequestDto, CrewMemberResponseDto } from '../models/crew.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CrewApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAll(): Observable<CrewMemberResponseDto[]> {
    return this.http.get<CrewMemberResponseDto[]>(`${this.apiUrl}/api/v1/crew-members`);
  }

  getById(id: number): Observable<CrewMemberResponseDto> {
    return this.http.get<CrewMemberResponseDto>(`${this.apiUrl}/api/v1/crew-members/${id}`);
  }

  create(data: CrewMemberRequestDto): Observable<CrewMemberResponseDto> {
    return this.http.post<CrewMemberResponseDto>(`${this.apiUrl}/api/v1/crew-members`, data);
  }

  update(id: number, data: CrewMemberRequestDto): Observable<CrewMemberResponseDto> {
    return this.http.put<CrewMemberResponseDto>(`${this.apiUrl}/api/v1/crew-members/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/v1/crew-members/${id}`);
  }
}
