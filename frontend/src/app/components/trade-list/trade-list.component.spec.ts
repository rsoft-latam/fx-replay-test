import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TradeListComponent } from './trade-list.component';
import { ApiResponse, TradeOrder } from '../../models/trade.model';
import { environment } from '../../environments/environment';

describe('TradeListComponent', () => {
  let component: TradeListComponent;
  let fixture: ComponentFixture<TradeListComponent>;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/trade_orders`;

  const mockTrades: TradeOrder[] = [
    {
      id: 'abc-12345678',
      pair: 'BTCUSD',
      side: 'buy',
      type: 'limit',
      amount: 1,
      price: 100000,
      status: 'open',
      createdAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'def-87654321',
      pair: 'EURUSD',
      side: 'sell',
      type: 'market',
      amount: 5000,
      price: 0,
      status: 'executed',
      createdAt: '2026-01-02T00:00:00Z',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeListComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TradeListComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function flushInitialLoad() {
    const apiResponse: ApiResponse<TradeOrder[]> = {
      success: true,
      message: 'OK',
      data: mockTrades,
      meta: { total: 2, page: 1, limit: 10, totalPages: 1 },
    };
    const req = httpMock.expectOne(`${baseUrl}?page=1&limit=10`);
    req.flush(apiResponse);
  }

  it('should create', () => {
    fixture.detectChanges();
    flushInitialLoad();
    expect(component).toBeTruthy();
  });

  it('should load trades on init', () => {
    fixture.detectChanges();
    flushInitialLoad();

    expect(component.dataSource.data.length).toBe(2);
    expect(component.totalItems).toBe(2);
    expect(component.loading).toBe(false);
  });

  it('should set loading to true while fetching', () => {
    fixture.detectChanges();
    expect(component.loading).toBe(true);
    flushInitialLoad();
    expect(component.loading).toBe(false);
  });

  it('shortId should truncate long ids', () => {
    expect(component.shortId('abc-12345678')).toBe('abc-1234...');
    expect(component.shortId(undefined)).toBe('-');
  });

  it('getSideClass should return correct class', () => {
    expect(component.getSideClass('buy')).toBe('chip-buy');
    expect(component.getSideClass('sell')).toBe('chip-sell');
  });

  it('getStatusClass should return correct class', () => {
    expect(component.getStatusClass('open')).toBe('chip-open');
    expect(component.getStatusClass('executed')).toBe('chip-executed');
    expect(component.getStatusClass('cancelled')).toBe('chip-cancelled');
  });

  it('onPageChange should update page and reload', () => {
    fixture.detectChanges();
    flushInitialLoad();

    component.onPageChange({ pageIndex: 2, pageSize: 5, length: 20 });

    expect(component.currentPage).toBe(2);
    expect(component.pageSize).toBe(5);

    const req = httpMock.expectOne(`${baseUrl}?page=3&limit=5`);
    req.flush({
      success: true,
      message: 'OK',
      data: [],
      meta: { total: 20, page: 3, limit: 5, totalPages: 4 },
    });
  });
});
