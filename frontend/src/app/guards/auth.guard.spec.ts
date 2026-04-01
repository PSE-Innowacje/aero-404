import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
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

function createJwt(exp: number): string {
  const header = btoa(JSON.stringify({ alg: 'HS256' }));
  const payload = btoa(JSON.stringify({ exp }));
  return `${header}.${payload}.signature`;
}

describe('authGuard', () => {
  let userDataService: UserDataService;
  let router: Router;

  beforeEach(() => {
    localStorageMock.clear();
    vi.stubGlobal('localStorage', localStorageMock);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: { createUrlTree: vi.fn(() => 'login-url-tree' as unknown as UrlTree) },
        },
      ],
    });
    userDataService = TestBed.inject(UserDataService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should allow access when user is logged in with valid token', () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600;
    userDataService.setUser({
      token: createJwt(futureExp),
      email: 'test@test.pl',
      role: 'ADMIN',
    });

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('should redirect when token is expired', () => {
    const pastExp = Math.floor(Date.now() / 1000) - 3600;
    userDataService.setUser({
      token: createJwt(pastExp),
      email: 'test@test.pl',
      role: 'ADMIN',
    });

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).not.toBe(true);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(userDataService.isLoggedIn()).toBe(false);
  });

  it('should redirect to /login when user is not logged in', () => {
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

    expect(result).not.toBe(true);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
  });

  it('should clear user and redirect when token is missing', () => {
    localStorageMock.getItem.mockReturnValueOnce(
      JSON.stringify({ email: 'test@test.pl', role: 'ADMIN' }),
    );
    userDataService.loadFromStorage();

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

    expect(result).not.toBe(true);
    expect(userDataService.isLoggedIn()).toBe(false);
  });
});
