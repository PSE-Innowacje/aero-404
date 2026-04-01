import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { FlightOrderApiService } from './flight-order-api.service';
import { FlightOrderRequestDto } from '../models/flight-order.model';
import { environment } from '../../environments/environment';

describe('FlightOrderApiService', () => {
  let service: FlightOrderApiService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/api/v1/flight-orders`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(FlightOrderApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should GET all flight orders without status', () => {
      service.getAll().subscribe();

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.keys().length).toBe(0);
      req.flush([]);
    });

    it('should GET flight orders with status filter', () => {
      service.getAll('SUBMITTED').subscribe();

      const req = httpMock.expectOne((r) => r.url === baseUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('status')).toBe('SUBMITTED');
      req.flush([]);
    });
  });

  describe('getById', () => {
    it('should GET flight order by id', () => {
      const mock = { id: 1, autoNumber: 'FO-001' };
      service.getById(1).subscribe((res) => expect(res).toEqual(mock));

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('create', () => {
    it('should POST new flight order', () => {
      const dto: FlightOrderRequestDto = {
        plannedDeparture: '2026-04-01T08:00',
        plannedLanding: '2026-04-01T12:00',
        helicopterId: 1,
        departureAirfieldId: 2,
        arrivalAirfieldId: 3,
        operationIds: [10],
        estimatedRouteKm: 150,
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
    it('should PUT updated flight order', () => {
      const dto: FlightOrderRequestDto = {
        plannedDeparture: '2026-04-02T09:00',
        plannedLanding: '2026-04-02T13:00',
        helicopterId: 2,
        departureAirfieldId: 3,
        arrivalAirfieldId: 4,
        operationIds: [11],
        estimatedRouteKm: 200,
      };

      service.update(5, dto).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/5`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(dto);
      req.flush({ id: 5 });
    });
  });

  describe('submit', () => {
    it('should POST to submit endpoint', () => {
      service.submit(6).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/6/submit`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBeNull();
      req.flush({ id: 6, status: 'SUBMITTED' });
    });
  });

  describe('reject', () => {
    it('should POST to reject endpoint', () => {
      service.reject(7).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/7/reject`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBeNull();
      req.flush({ id: 7, status: 'REJECTED' });
    });
  });

  describe('accept', () => {
    it('should POST to accept endpoint', () => {
      service.accept(8).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/8/accept`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBeNull();
      req.flush({ id: 8, status: 'ACCEPTED' });
    });
  });

  describe('complete', () => {
    it('should POST to complete endpoint with request body', () => {
      const request = { result: 'Lot zakończony pomyślnie' };

      service.complete(9, request).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/9/complete`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush({ id: 9, status: 'DONE' });
    });
  });
});
