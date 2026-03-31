import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { UserDataService } from '../services/user-data.service';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let userDataService: UserDataService;

  beforeEach(() => {
    localStorageMock.clear();
    vi.stubGlobal('localStorage', localStorageMock);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    userDataService = TestBed.inject(UserDataService);
  });

  afterEach(() => {
    httpMock.verify();
    vi.restoreAllMocks();
  });

  it('should add Authorization header when user is logged in', () => {
    userDataService.setUser({
      token: 'my-jwt-token',
      email: 'test@test.pl',
      role: 'ADMIN',
    });

    http.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer my-jwt-token');
    req.flush({});
  });

  it('should not add Authorization header when user is not logged in', () => {
    http.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
