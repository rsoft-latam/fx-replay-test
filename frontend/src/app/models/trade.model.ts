export type OrderSide = 'buy' | 'sell';
export type OrderType = 'limit' | 'market' | 'stop';
export type OrderStatus = 'open' | 'cancelled' | 'executed';

export interface TradeOrder {
  id?: string;
  side: OrderSide;
  type: OrderType;
  amount: number;
  price: number;
  status: OrderStatus;
  pair: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const PAIRS = ['BTCUSD', 'EURUSD', 'ETHUSD'] as const;
export const SIDES: OrderSide[] = ['buy', 'sell'];
export const ORDER_TYPES: OrderType[] = ['limit', 'market', 'stop'];

export const MARKET_PRICES: Record<string, number> = {
  BTCUSD: 100150.4,
  EURUSD: 1.035,
  ETHUSD: 3310,
};
