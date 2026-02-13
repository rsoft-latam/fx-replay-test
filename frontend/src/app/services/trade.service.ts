import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { TradeOrder, ApiResponse, PaginatedResponse } from '../models/trade.model';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class TradeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/trade_orders`;

  getAll(page: number = 1, limit: number = 10): Observable<PaginatedResponse<TradeOrder>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<ApiResponse<TradeOrder[]>>(this.baseUrl, { params }).pipe(
      map(response => ({
        data: response.data,
        total: response.meta?.total ?? 0,
        page: response.meta?.page ?? page,
        limit: response.meta?.limit ?? limit,
      }))
    );
  }

  getById(id: string): Observable<TradeOrder> {
    return this.http.get<ApiResponse<TradeOrder>>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  create(order: Omit<TradeOrder, 'id' | 'createdAt' | 'updatedAt'>): Observable<TradeOrder> {
    return this.http.post<ApiResponse<TradeOrder>>(this.baseUrl, order).pipe(
      map(response => response.data)
    );
  }

  update(id: string, order: Partial<TradeOrder>): Observable<TradeOrder> {
    return this.http.put<ApiResponse<TradeOrder>>(`${this.baseUrl}/${id}`, order).pipe(
      map(response => response.data)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${id}`).pipe(
      map(() => void 0)
    );
  }
}
