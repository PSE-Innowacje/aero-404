import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { adminGuard } from './admin.guard';
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

describe('adminGuard', () => {
  let userDataService: UserDataService;
  let router: Router;

  beforeEach(() => {
    localStorageMock.clear();
    vi.stubGlobal('localStorage', localStorageMock);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: { createUrlTree: vi.fn(() => 'operations-url-tree' as unknown as UrlTree) },
        },
      ],
    });
    userDataService = TestBed.inject(UserDataService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should allow access for ADMIN role', () => {
    userDataService.setUser({ token: 'tok', email: 'admin@test.pl', role: 'ADMIN' });

    const result = TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('should redirect PLANNER to /operations', () => {
    userDataService.setUser({ token: 'tok', email: 'p@test.pl', role: 'PLANNER' });

    const result = TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));
    expect(result).not.toBe(true);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/operations']);
  });

  it('should redirect SUPERVISOR to /operations', () => {
    userDataService.setUser({ token: 'tok', email: 's@test.pl', role: 'SUPERVISOR' });

    const result = TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));
    expect(result).not.toBe(true);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/operations']);
  });

  it('should redirect PILOT to /operations', () => {
    userDataService.setUser({ token: 'tok', email: 'pi@test.pl', role: 'PILOT' });

    const result = TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));
    expect(result).not.toBe(true);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/operations']);
  });

  it('should redirect when no user logged in', () => {
    const result = TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));
    expect(result).not.toBe(true);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/operations']);
  });
});
