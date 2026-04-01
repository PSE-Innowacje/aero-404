import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HelicopterApiService } from './helicopter-api.service';
import { HelicopterRequestDto } from '../models/helicopter.model';
import { environment } from '../../environments/environment';

describe('HelicopterApiService', () => {
  let service: HelicopterApiService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/api/v1/helicopters`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(HelicopterApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should GET all helicopters', () => {
      const mock = [{ id: 1, regNumber: 'SP-ABC', type: 'Mi-8', status: 'ACTIVE' as const }];
      service.getAll().subscribe((res) => expect(res).toEqual(mock));

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('getById', () => {
    it('should GET helicopter by id', () => {
      const mock = { id: 5, regNumber: 'SP-XYZ' };
      service.getById(5).subscribe((res) => expect(res).toEqual(mock));

      const req = httpMock.expectOne(`${baseUrl}/5`);
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('create', () => {
    it('should POST new helicopter', () => {
      const dto: HelicopterRequestDto = {
        regNumber: 'SP-NEW',
        type: 'Mi-8',
        maxCrew: 4,
        maxPayload: 3000,
        status: 'ACTIVE',
        rangeKm: 500,
      };
      const mock = { id: 10, ...dto };

      service.create(dto).subscribe((res) => expect(res).toEqual(mock));

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);
      req.flush(mock);
    });
  });

  describe('update', () => {
    it('should PUT updated helicopter', () => {
      const dto: HelicopterRequestDto = {
        regNumber: 'SP-UPD',
        type: 'Mi-8',
        maxCrew: 5,
        maxPayload: 3500,
        status: 'INACTIVE',
        rangeKm: 600,
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
    it('should DELETE helicopter by id', () => {
      service.delete(7).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/7`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
