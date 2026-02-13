import prisma from "../prisma/client";
import { AppError } from "../utils/app-error";
import {
  CreateTradeOrderDto,
  UpdateTradeOrderDto,
  PaginationDto,
} from "../dtos/trade-order.dto";

const MARKET_PRICES: Record<string, number> = {
  BTCUSD: 100150.4,
  EURUSD: 1.035,
  ETHUSD: 3310,
};

export class TradeOrderService {
  private validateOrderPrice(
    type: string,
    side: string,
    price: number,
    pair: string
  ): void {
    const marketPrice = MARKET_PRICES[pair];

    if (marketPrice === undefined) {
      throw new AppError(`Invalid pair: ${pair}`, 400);
    }

    if (type === "market") {
      return;
    }

    if (type === "limit") {
      if (side === "buy" && price >= marketPrice) {
        throw new AppError(
          `Limit buy price (${price}) must be less than market price (${marketPrice}) for ${pair}`,
          400
        );
      }
      if (side === "sell" && price <= marketPrice) {
        throw new AppError(
          `Limit sell price (${price}) must be greater than market price (${marketPrice}) for ${pair}`,
          400
        );
      }
    }

    if (type === "stop") {
      if (side === "buy" && price <= marketPrice) {
        throw new AppError(
          `Stop buy price (${price}) must be greater than market price (${marketPrice}) for ${pair}`,
          400
        );
      }
      if (side === "sell" && price >= marketPrice) {
        throw new AppError(
          `Stop sell price (${price}) must be less than market price (${marketPrice}) for ${pair}`,
          400
        );
      }
    }
  }

  async create(data: CreateTradeOrderDto) {
    this.validateOrderPrice(data.type, data.side, data.price, data.pair);

    const order = await prisma.tradeOrder.create({
      data: {
        side: data.side,
        type: data.type,
        amount: data.amount,
        price: data.type === "market" ? MARKET_PRICES[data.pair] : data.price,
        pair: data.pair,
      },
    });

    return order;
  }

  async findAll(pagination: PaginationDto) {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.tradeOrder.findMany({
        where: { isDeleted: false },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.tradeOrder.count({
        where: { isDeleted: false },
      }),
    ]);

    return {
      orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const order = await prisma.tradeOrder.findUnique({
      where: { id },
    });

    if (!order || order.isDeleted) {
      throw new AppError("Trade order not found", 404);
    }

    return order;
  }

  async update(id: string, data: UpdateTradeOrderDto) {
    const existing = await this.findById(id);

    const side = data.side ?? existing.side;
    const type = data.type ?? existing.type;
    const price = data.price ?? existing.price.toNumber();
    const pair = data.pair ?? existing.pair;

    this.validateOrderPrice(type, side, price, pair);

    const order = await prisma.tradeOrder.update({
      where: { id },
      data: {
        ...(data.side && { side: data.side }),
        ...(data.type && { type: data.type }),
        ...(data.amount !== undefined && { amount: data.amount }),
        ...(data.price !== undefined && {
          price: type === "market" ? MARKET_PRICES[pair] : data.price,
        }),
        ...(data.pair && { pair: data.pair }),
        ...(data.status && { status: data.status }),
      },
    });

    return order;
  }

  async softDelete(id: string) {
    await this.findById(id);

    const order = await prisma.tradeOrder.update({
      where: { id },
      data: { isDeleted: true },
    });

    return order;
  }
}
