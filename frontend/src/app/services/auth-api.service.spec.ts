import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthApiService } from './auth-api.service';
import { LoginRequest, RegisterRequest } from '../models/auth.model';
import { environment } from '../../environments/environment';

describe('AuthApiService', () => {
  let service: AuthApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('register', () => {
    it('should POST to /api/v1/auth/register', () => {
      const request: RegisterRequest = {
        firstName: 'Jan',
        lastName: 'Kowalski',
        email: 'jan@example.com',
        password: 'haslo123',
      };
      const mockResponse = { id: 1, email: 'jan@example.com', role: 'PILOT' as const };

      service.register(request).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(mockResponse);
    });
  });

  describe('login', () => {
    it('should POST to /api/v1/auth/login', () => {
      const request: LoginRequest = {
        email: 'admin@aero-404.pl',
        password: 'haslo123',
      };
      const mockResponse = {
        token: 'jwt-token',
        email: 'admin@aero-404.pl',
        role: 'ADMIN' as const,
      };

      service.login(request).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(mockResponse);
    });
  });
});
