import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PlannedOperationApiService } from './planned-operation-api.service';
import { PlannedOperationRequestDto } from '../models/planned-operation.model';
import { environment } from '../../environments/environment';

describe('PlannedOperationApiService', () => {
  let service: PlannedOperationApiService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/api/v1/operations`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PlannedOperationApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should GET all operations without status', () => {
      service.getAll().subscribe();

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.keys().length).toBe(0);
      req.flush([]);
    });

    it('should GET operations with status filter', () => {
      service.getAll('CONFIRMED').subscribe();

      const req = httpMock.expectOne((r) => r.url === baseUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('status')).toBe('CONFIRMED');
      req.flush([]);
    });
  });

  describe('getById', () => {
    it('should GET operation by id', () => {
      const mock = { id: 1, shortDescription: 'Test' };
      service.getById(1).subscribe((res) => expect(res).toEqual(mock));

      const req = httpMock.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('create', () => {
    it('should POST FormData with dto as JSON Blob', () => {
      const dto: PlannedOperationRequestDto = {
        shortDescription: 'Inspekcja',
        activityTypes: ['VISUAL_INSPECTION'],
      };

      service.create(dto).subscribe();

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBeInstanceOf(FormData);
      expect(req.request.body.has('dto')).toBe(true);
      expect(req.request.body.has('kmlFile')).toBe(false);
      req.flush({ id: 1 });
    });

    it('should include kmlFile when provided', () => {
      const dto: PlannedOperationRequestDto = {
        shortDescription: 'Inspekcja',
        activityTypes: ['SCAN_3D'],
      };
      const file = new File(['<kml></kml>'], 'route.kml', { type: 'application/vnd.google-earth.kml+xml' });

      service.create(dto, file).subscribe();

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.body.has('kmlFile')).toBe(true);
      req.flush({ id: 2 });
    });
  });

  describe('update', () => {
    it('should PUT FormData with dto as JSON Blob', () => {
      const dto: PlannedOperationRequestDto = {
        shortDescription: 'Updated',
        activityTypes: ['PATROL'],
      };

      service.update(5, dto).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/5`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toBeInstanceOf(FormData);
      expect(req.request.body.has('dto')).toBe(true);
      req.flush({ id: 5 });
    });

    it('should include kmlFile in update when provided', () => {
      const dto: PlannedOperationRequestDto = {
        shortDescription: 'Updated',
        activityTypes: ['PHOTOS'],
      };
      const file = new File(['data'], 'route.kml');

      service.update(5, dto, file).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/5`);
      expect(req.request.body.has('kmlFile')).toBe(true);
      req.flush({ id: 5 });
    });
  });

  describe('delete', () => {
    it('should DELETE operation by id', () => {
      service.delete(3).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/3`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('resign', () => {
    it('should POST to resign endpoint with null body', () => {
      service.resign(4).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/4/resign`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBeNull();
      req.flush({ id: 4, status: 'RESIGNED' });
    });
  });

  describe('reject', () => {
    it('should POST to reject endpoint with null body', () => {
      service.reject(6).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/6/reject`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBeNull();
      req.flush({ id: 6, status: 'REJECTED' });
    });
  });

  describe('confirm', () => {
    it('should POST to confirm endpoint with date params', () => {
      service.confirm(7, '2026-04-01', '2026-04-10').subscribe();

      const req = httpMock.expectOne((r) => r.url === `${baseUrl}/7/confirm`);
      expect(req.request.method).toBe('POST');
      expect(req.request.params.get('plannedDateFrom')).toBe('2026-04-01');
      expect(req.request.params.get('plannedDateTo')).toBe('2026-04-10');
      expect(req.request.body).toBeNull();
      req.flush({ id: 7, status: 'CONFIRMED' });
    });
  });

  describe('addComment', () => {
    it('should POST comment to comments endpoint', () => {
      const mockComment = { id: 1, text: 'Uwaga' };
      service.addComment(8, 'Uwaga').subscribe((res) => expect(res).toEqual(mockComment));

      const req = httpMock.expectOne(`${baseUrl}/8/comments`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ text: 'Uwaga' });
      req.flush(mockComment);
    });
  });
});
