import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UsersApiService } from './users-api.service';
import { UserRequestDto } from '../models/user.model';
import { environment } from '../../environments/environment';

describe('UsersApiService', () => {
  let service: UsersApiService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/api/v1/users`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UsersApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should GET all users', () => {
      const mock = [{ id: 1, firstName: 'Jan', lastName: 'K', email: 'j@t.pl', role: 'ADMIN' }];
      service.getAll().subscribe((res) => expect(res).toEqual(mock));

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('getById', () => {
    it('should GET user by id', () => {
      const mock = { id: 2, firstName: 'Anna', email: 'a@t.pl' };
      service.getById(2).subscribe((res) => expect(res).toEqual(mock));

      const req = httpMock.expectOne(`${baseUrl}/2`);
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('create', () => {
    it('should POST new user', () => {
      const dto: UserRequestDto = {
        firstName: 'Piotr',
        lastName: 'Z',
        email: 'p@t.pl',
        password: 'pass123',
        role: 'PILOT',
      };
      const mock = { id: 3, ...dto };

      service.create(dto).subscribe((res) => expect(res).toEqual(mock));

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);
      req.flush(mock);
    });
  });

  describe('update', () => {
    it('should PUT updated user', () => {
      const dto: UserRequestDto = {
        firstName: 'Piotr',
        lastName: 'Z',
        email: 'p@t.pl',
        password: 'newpass',
        role: 'PLANNER',
      };
      const mock = { id: 3, ...dto };

      service.update(3, dto).subscribe((res) => expect(res).toEqual(mock));

      const req = httpMock.expectOne(`${baseUrl}/3`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(dto);
      req.flush(mock);
    });
  });

  describe('delete', () => {
    it('should DELETE user by id', () => {
      service.delete(4).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/4`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('assignRole', () => {
    it('should POST to assign-role with role param', () => {
      const mock = { id: 5, role: 'SUPERVISOR' };
      service.assignRole(5, 'SUPERVISOR').subscribe((res) => expect(res).toEqual(mock));

      const req = httpMock.expectOne((r) => r.url === `${baseUrl}/5/assign-role`);
      expect(req.request.method).toBe('POST');
      expect(req.request.params.get('role')).toBe('SUPERVISOR');
      expect(req.request.body).toBeNull();
      req.flush(mock);
    });
  });
});
