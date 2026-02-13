import { Decimal } from "@prisma/client/runtime/library";

/**
 * Converts Prisma Decimal fields to numbers for JSON serialization.
 */
export function serializeOrder<
  T extends Record<string, unknown>,
>(order: T): Record<string, unknown> {
  const serialized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(order)) {
    if (value instanceof Decimal) {
      serialized[key] = value.toNumber();
    } else {
      serialized[key] = value;
    }
  }

  return serialized;
}

export function serializeOrders<
  T extends Record<string, unknown>,
>(orders: T[]): Record<string, unknown>[] {
  return orders.map(serializeOrder);
}
