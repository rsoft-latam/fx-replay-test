import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { UpperCasePipe } from '@angular/common';

import {
  TradeOrder,
  OrderSide,
  OrderType,
  OrderStatus,
  PAIRS,
  SIDES,
  ORDER_TYPES,
  MARKET_PRICES,
} from '../../models/trade.model';
import { TradeService } from '../../services/trade.service';
import { NotificationService } from '../../services/notification.service';
import { priceValidator } from '../../validators/price.validator';

@Component({
  selector: 'app-trade-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    UpperCasePipe,
  ],
  templateUrl: './trade-form.component.html',
  styleUrl: './trade-form.component.scss',
})
export class TradeFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly tradeService = inject(TradeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  form!: FormGroup;
  isEditMode = false;
  tradeId: string | null = null;
  loading = false;
  saving = false;

  readonly pairs = PAIRS;
  readonly sides = SIDES;
  readonly orderTypes = ORDER_TYPES;
  readonly marketPrices = MARKET_PRICES;

  get isMarketType(): boolean {
    return this.form?.get('type')?.value === 'market';
  }

  get currentMarketPrice(): number | null {
    const pair = this.form?.get('pair')?.value;
    return pair ? MARKET_PRICES[pair] ?? null : null;
  }

  ngOnInit(): void {
    this.initForm();
    this.tradeId = this.route.snapshot.paramMap.get('id');

    if (this.tradeId) {
      this.isEditMode = true;
      this.loadTrade(this.tradeId);
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      pair: ['', Validators.required],
      side: ['', Validators.required],
      type: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.0001)]],
      price: [null, [Validators.required, Validators.min(0), priceValidator()]],
      status: ['open' as OrderStatus],
    });

    // Re-validate price when pair, side, or type changes
    this.form.get('pair')!.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.form.get('price')!.updateValueAndValidity();
      });

    this.form.get('side')!.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.form.get('price')!.updateValueAndValidity();
      });

    this.form.get('type')!.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((type: OrderType) => {
        const priceCtrl = this.form.get('price')!;
        if (type === 'market') {
          priceCtrl.setValue(0);
          priceCtrl.disable();
        } else {
          priceCtrl.enable();
          if (priceCtrl.value === 0) {
            priceCtrl.setValue(null);
          }
        }
        priceCtrl.updateValueAndValidity();
      });
  }

  private loadTrade(id: string): void {
    this.loading = true;
    this.tradeService.getById(id).subscribe({
      next: (trade) => {
        this.form.patchValue({
          pair: trade.pair,
          side: trade.side,
          type: trade.type,
          amount: trade.amount,
          price: trade.price,
          status: trade.status,
        });
        if (trade.type === 'market') {
          this.form.get('price')!.disable();
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/trades']);
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.saving = true;
    const formValue = this.form.getRawValue();

    const payload: Omit<TradeOrder, 'id' | 'createdAt' | 'updatedAt'> = {
      pair: formValue.pair,
      side: formValue.side as OrderSide,
      type: formValue.type as OrderType,
      amount: formValue.amount,
      price: formValue.type === 'market' ? 0 : formValue.price,
      status: formValue.status as OrderStatus,
    };

    const request$ = this.isEditMode
      ? this.tradeService.update(this.tradeId!, payload)
      : this.tradeService.create(payload);

    request$.subscribe({
      next: () => {
        const msg = this.isEditMode
          ? 'Orden actualizada exitosamente'
          : 'Orden creada exitosamente';
        this.notification.success(msg);
        this.saving = false;
        this.router.navigate(['/trades']);
      },
      error: () => {
        this.saving = false;
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/trades']);
  }
}
