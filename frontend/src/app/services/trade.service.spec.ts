import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TradeService } from './trade.service';
import { TradeOrder, ApiResponse } from '../models/trade.model';
import { environment } from '../environments/environment';

describe('TradeService', () => {
  let service: TradeService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/trade_orders`;

  const mockTrade: TradeOrder = {
    id: 'abc-123',
    pair: 'BTCUSD',
    side: 'buy',
    type: 'limit',
    amount: 1,
    price: 100000,
    status: 'open',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TradeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll should return paginated trades', () => {
    const apiResponse: ApiResponse<TradeOrder[]> = {
      success: true,
      message: 'OK',
      data: [mockTrade],
      meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
    };

    service.getAll(1, 10).subscribe((result) => {
      expect(result.data).toEqual([mockTrade]);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
    });

    const req = httpMock.expectOne(`${baseUrl}?page=1&limit=10`);
    expect(req.request.method).toBe('GET');
    req.flush(apiResponse);
  });

  it('getById should return a single trade', () => {
    const apiResponse: ApiResponse<TradeOrder> = {
      success: true,
      message: 'OK',
      data: mockTrade,
    };

    service.getById('abc-123').subscribe((result) => {
      expect(result).toEqual(mockTrade);
      expect(result.id).toBe('abc-123');
    });

    const req = httpMock.expectOne(`${baseUrl}/abc-123`);
    expect(req.request.method).toBe('GET');
    req.flush(apiResponse);
  });

  it('create should POST and return created trade', () => {
    const { id, createdAt, updatedAt, ...payload } = mockTrade;
    const apiResponse: ApiResponse<TradeOrder> = {
      success: true,
      message: 'Created',
      data: mockTrade,
    };

    service.create(payload).subscribe((result) => {
      expect(result).toEqual(mockTrade);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(apiResponse);
  });

  it('update should PUT and return updated trade', () => {
    const changes = { price: 101000 };
    const updatedTrade = { ...mockTrade, price: 101000 };
    const apiResponse: ApiResponse<TradeOrder> = {
      success: true,
      message: 'Updated',
      data: updatedTrade,
    };

    service.update('abc-123', changes).subscribe((result) => {
      expect(result.price).toBe(101000);
    });

    const req = httpMock.expectOne(`${baseUrl}/abc-123`);
    expect(req.request.method).toBe('PUT');
    req.flush(apiResponse);
  });

  it('delete should DELETE the trade', () => {
    const apiResponse: ApiResponse<null> = {
      success: true,
      message: 'Deleted',
      data: null,
    };

    service.delete('abc-123').subscribe((result) => {
      expect(result).toBeUndefined();
    });

    const req = httpMock.expectOne(`${baseUrl}/abc-123`);
    expect(req.request.method).toBe('DELETE');
    req.flush(apiResponse);
  });
});
