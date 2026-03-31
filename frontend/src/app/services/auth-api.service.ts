import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../models/auth.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/api/v1/auth/register`, data);
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/api/v1/auth/login`, data);
  }
}
