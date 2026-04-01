import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AirfieldApiService } from './airfield-api.service';
import { AirfieldRequestDto } from '../models/airfield.model';
import { environment } from '../../environments/environment';

describe('AirfieldApiService', () => {
  let service: AirfieldApiService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/api/v1/airfields`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AirfieldApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should GET all airfields', () => {
      const mock = [{ id: 1, name: 'Lotnisko A', latitude: 51.1, longitude: 17.0 }];
      service.getAll().subscribe((res) => expect(res).toEqual(mock));

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('getById', () => {
    it('should GET airfield by id', () => {
      const mock = { id: 2, name: 'Lotnisko B', latitude: 52.0, longitude: 18.0 };
      service.getById(2).subscribe((res) => expect(res).toEqual(mock));

      const req = httpMock.expectOne(`${baseUrl}/2`);
      expect(req.request.method).toBe('GET');
      req.flush(mock);
    });
  });

  describe('create', () => {
    it('should POST new airfield', () => {
      const dto: AirfieldRequestDto = { name: 'Nowe', latitude: 50.0, longitude: 19.0 };
      const mock = { id: 3, ...dto };

      service.create(dto).subscribe((res) => expect(res).toEqual(mock));

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);
      req.flush(mock);
    });
  });

  describe('update', () => {
    it('should PUT updated airfield', () => {
      const dto: AirfieldRequestDto = { name: 'Zmienione', latitude: 51.5, longitude: 20.0 };
      const mock = { id: 4, ...dto };

      service.update(4, dto).subscribe((res) => expect(res).toEqual(mock));

      const req = httpMock.expectOne(`${baseUrl}/4`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(dto);
      req.flush(mock);
    });
  });

  describe('delete', () => {
    it('should DELETE airfield by id', () => {
      service.delete(5).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/5`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
