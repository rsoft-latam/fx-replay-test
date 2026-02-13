import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { TradeFormComponent } from './trade-form.component';
import { ApiResponse, TradeOrder } from '../../models/trade.model';
import { environment } from '../../environments/environment';

describe('TradeFormComponent', () => {
  let component: TradeFormComponent;
  let fixture: ComponentFixture<TradeFormComponent>;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/trade_orders`;

  function setup(routeId: string | null = null) {
    TestBed.configureTestingModule({
      imports: [TradeFormComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? routeId : null),
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TradeFormComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  }

  afterEach(() => {
    httpMock.verify();
  });

  describe('Create mode', () => {
    beforeEach(() => setup(null));

    it('should create in create mode', () => {
      expect(component).toBeTruthy();
      expect(component.isEditMode).toBe(false);
    });

    it('should initialize form with empty values', () => {
      expect(component.form.get('pair')!.value).toBe('');
      expect(component.form.get('side')!.value).toBe('');
      expect(component.form.get('type')!.value).toBe('');
      expect(component.form.get('amount')!.value).toBeNull();
      expect(component.form.get('status')!.value).toBe('open');
    });

    it('should mark form as invalid when empty', () => {
      expect(component.form.valid).toBe(false);
    });

    it('should mark form as valid with correct Limit Buy data', () => {
      component.form.patchValue({
        pair: 'BTCUSD',
        side: 'buy',
        type: 'limit',
        amount: 1,
        price: 100000,
      });

      expect(component.form.valid).toBe(true);
    });

    it('should disable price field when type is market', () => {
      component.form.get('type')!.setValue('market');

      expect(component.form.get('price')!.disabled).toBe(true);
      expect(component.form.get('price')!.value).toBe(0);
    });

    it('should re-enable price field when switching from market to limit', () => {
      component.form.get('type')!.setValue('market');
      expect(component.form.get('price')!.disabled).toBe(true);

      component.form.get('type')!.setValue('limit');
      expect(component.form.get('price')!.disabled).toBe(false);
    });

    it('isMarketType should reflect the type control', () => {
      expect(component.isMarketType).toBe(false);

      component.form.get('type')!.setValue('market');
      expect(component.isMarketType).toBe(true);
    });

    it('currentMarketPrice should return price for selected pair', () => {
      expect(component.currentMarketPrice).toBeNull();

      component.form.get('pair')!.setValue('BTCUSD');
      expect(component.currentMarketPrice).toBe(100150.4);

      component.form.get('pair')!.setValue('EURUSD');
      expect(component.currentMarketPrice).toBe(1.035);
    });

    it('should submit a new order via create', () => {
      component.form.patchValue({
        pair: 'ETHUSD',
        side: 'sell',
        type: 'limit',
        amount: 2,
        price: 3400,
      });

      component.onSubmit();

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body.pair).toBe('ETHUSD');
      expect(req.request.body.side).toBe('sell');
      expect(req.request.body.price).toBe(3400);

      const apiResponse: ApiResponse<TradeOrder> = {
        success: true,
        message: 'Created',
        data: {
          id: 'new-id',
          ...req.request.body,
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z',
        },
      };
      req.flush(apiResponse);
    });
  });

  describe('Edit mode', () => {
    const tradeId = 'edit-123';

    beforeEach(() => setup(tradeId));

    it('should be in edit mode', () => {
      const apiResponse: ApiResponse<TradeOrder> = {
        success: true,
        message: 'OK',
        data: {
          id: tradeId,
          pair: 'EURUSD',
          side: 'buy',
          type: 'stop',
          amount: 10000,
          price: 1.05,
          status: 'open',
        },
      };

      const req = httpMock.expectOne(`${baseUrl}/${tradeId}`);
      req.flush(apiResponse);

      expect(component.isEditMode).toBe(true);
      expect(component.form.get('pair')!.value).toBe('EURUSD');
      expect(component.form.get('amount')!.value).toBe(10000);
    });
  });
});
