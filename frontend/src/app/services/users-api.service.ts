import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UserRequestDto, UserResponseDto } from '../models/user.model';
import { UserRole } from '../models/auth.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAll(): Observable<UserResponseDto[]> {
    return this.http.get<UserResponseDto[]>(`${this.apiUrl}/api/v1/users`);
  }

  create(data: UserRequestDto): Observable<UserResponseDto> {
    return this.http.post<UserResponseDto>(`${this.apiUrl}/api/v1/users`, data);
  }

  getById(id: number): Observable<UserResponseDto> {
    return this.http.get<UserResponseDto>(`${this.apiUrl}/api/v1/users/${id}`);
  }

  update(id: number, data: UserRequestDto): Observable<UserResponseDto> {
    return this.http.put<UserResponseDto>(`${this.apiUrl}/api/v1/users/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/v1/users/${id}`);
  }

  assignRole(id: number, role: UserRole): Observable<UserResponseDto> {
    const params = new HttpParams().set('role', role);
    return this.http.post<UserResponseDto>(
      `${this.apiUrl}/api/v1/users/${id}/assign-role`,
      null,
      { params },
    );
  }
}
