import { TestBed } from '@angular/core/testing';
import { UserDataService } from './user-data.service';
import { LoginResponse } from '../models/auth.model';

const mockUser: LoginResponse = {
  token: 'jwt-token-123',
  email: 'admin@aero-404.pl',
  role: 'ADMIN',
};

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

describe('UserDataService', () => {
  let service: UserDataService;

  beforeEach(() => {
    localStorageMock.clear();
    vi.stubGlobal('localStorage', localStorageMock);
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserDataService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not be logged in initially', () => {
    expect(service.isLoggedIn()).toBe(false);
    expect(service.user()).toBeNull();
    expect(service.token()).toBeNull();
    expect(service.role()).toBeNull();
  });

  describe('setUser', () => {
    it('should set user data and update signals', () => {
      service.setUser(mockUser);

      expect(service.isLoggedIn()).toBe(true);
      expect(service.user()).toEqual(mockUser);
      expect(service.token()).toBe('jwt-token-123');
      expect(service.role()).toBe('ADMIN');
    });

    it('should persist user data to localStorage', () => {
      service.setUser(mockUser);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'userData',
        JSON.stringify(mockUser),
      );
    });
  });

  describe('clearUser', () => {
    it('should clear user data and signals', () => {
      service.setUser(mockUser);
      service.clearUser();

      expect(service.isLoggedIn()).toBe(false);
      expect(service.user()).toBeNull();
      expect(service.token()).toBeNull();
      expect(service.role()).toBeNull();
    });

    it('should remove data from localStorage', () => {
      service.setUser(mockUser);
      service.clearUser();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('userData');
    });
  });

  describe('loadFromStorage', () => {
    it('should load user from localStorage', () => {
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockUser));
      service.loadFromStorage();

      expect(service.isLoggedIn()).toBe(true);
      expect(service.user()).toEqual(mockUser);
    });

    it('should do nothing if localStorage is empty', () => {
      localStorageMock.getItem.mockReturnValueOnce(null as any);
      service.loadFromStorage();

      expect(service.isLoggedIn()).toBe(false);
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorageMock.getItem.mockReturnValueOnce('{invalid json');
      service.loadFromStorage();

      expect(service.isLoggedIn()).toBe(false);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('userData');
    });
  });
});
