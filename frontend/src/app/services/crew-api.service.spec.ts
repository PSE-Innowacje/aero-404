import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CrewApiService } from './crew-api.service';
import { CrewMemberRequestDto } from '../models/crew.model';
import { environment } from '../../environments/environment';

describe('CrewApiService', () => {
  let service: CrewApiService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/api/v1/crew-members`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CrewApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should GET all crew members', () => {
      const mock = [{ id: 1, firstName: 'Jan', lastName: 'Kowalski', role: 'PILOT' }];
      service.getAll().subscribe((res) => expect(res).toEqual(mock));

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('getById', () => {
    it('should GET crew member by id', () => {
      const mock = { id: 3, firstName: 'Anna', lastName: 'Nowak', role: 'OBSERVER' };
      service.getById(3).subscribe((res) => expect(res).toEqual(mock));

      const req = httpMock.expectOne(`${baseUrl}/3`);
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('create', () => {
    it('should POST new crew member', () => {
      const dto: CrewMemberRequestDto = {
        firstName: 'Piotr',
        lastName: 'Zielinski',
        email: 'piotr@test.pl',
        weight: 80,
        role: 'PILOT',
        trainingExpiry: '2027-01-01',
      };
      const mock = { id: 5, ...dto };

      service.create(dto).subscribe((res) => expect(res).toEqual(mock));

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);
      req.flush(mock);
    });
  });

  describe('update', () => {
    it('should PUT updated crew member', () => {
      const dto: CrewMemberRequestDto = {
        firstName: 'Piotr',
        lastName: 'Zielinski',
        email: 'piotr@test.pl',
        weight: 85,
        role: 'OBSERVER',
        trainingExpiry: '2027-06-01',
      };
      const mock = { id: 5, ...dto };

      service.update(5, dto).subscribe((res) => expect(res).toEqual(mock));

      const req = httpMock.expectOne(`${baseUrl}/5`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(dto);
      req.flush(mock);
    });
  });

  describe('delete', () => {
    it('should DELETE crew member by id', () => {
      service.delete(8).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/8`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
