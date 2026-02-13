import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DatePipe, NgClass, UpperCasePipe } from '@angular/common';

import { TradeOrder } from '../../models/trade.model';
import { TradeService } from '../../services/trade.service';
import { NotificationService } from '../../services/notification.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-trade-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
    MatDialogModule,
    DatePipe,
    NgClass,
    UpperCasePipe,
  ],
  templateUrl: './trade-list.component.html',
  styleUrl: './trade-list.component.scss',
})
export class TradeListComponent implements OnInit {
  private readonly tradeService = inject(TradeService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);

  displayedColumns = [
    'id',
    'pair',
    'side',
    'type',
    'amount',
    'price',
    'status',
    'createdAt',
    'actions',
  ];

  dataSource = new MatTableDataSource<TradeOrder>([]);
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.loadTrades();
  }

  loadTrades(): void {
    this.loading = true;
    this.tradeService.getAll(this.currentPage + 1, this.pageSize).subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
        this.totalItems = response.total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTrades();
  }

  navigateToCreate(): void {
    this.router.navigate(['/trades/new']);
  }

  editTrade(trade: TradeOrder): void {
    this.router.navigate(['/trades', trade.id]);
  }

  deleteTrade(trade: TradeOrder): void {
    const data: ConfirmDialogData = {
      title: 'Eliminar Orden',
      message: `¿Estás seguro de eliminar la orden ${this.shortId(trade.id)} (${trade.pair} ${trade.side})?`,
    };

    this.dialog
      .open(ConfirmDialogComponent, { data, width: '400px' })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed && trade.id) {
          this.tradeService.delete(trade.id).subscribe({
            next: () => {
              this.notification.success('Orden eliminada exitosamente');
              this.loadTrades();
            },
          });
        }
      });
  }

  shortId(id?: string): string {
    return id ? id.substring(0, 8) + '...' : '-';
  }

  getSideClass(side: string): string {
    return side === 'buy' ? 'chip-buy' : 'chip-sell';
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      open: 'chip-open',
      executed: 'chip-executed',
      cancelled: 'chip-cancelled',
    };
    return classes[status] || '';
  }
}
