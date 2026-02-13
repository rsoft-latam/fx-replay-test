import { z } from "zod";

const VALID_PAIRS = ["BTCUSD", "EURUSD", "ETHUSD"] as const;

export const createTradeOrderSchema = z.object({
  side: z.enum(["buy", "sell"], {
    message: "side must be 'buy' or 'sell'",
  }),
  type: z.enum(["limit", "market", "stop"], {
    message: "type must be 'limit', 'market', or 'stop'",
  }),
  amount: z
    .number({ message: "amount must be a number" })
    .positive("amount must be greater than 0"),
  price: z
    .number({ message: "price must be a number" })
    .nonnegative("price must be 0 or greater"),
  pair: z.enum(VALID_PAIRS, {
    message: `pair must be one of: ${VALID_PAIRS.join(", ")}`,
  }),
});

export const updateTradeOrderSchema = z.object({
  side: z.enum(["buy", "sell"]).optional(),
  type: z.enum(["limit", "market", "stop"]).optional(),
  amount: z.number().positive("amount must be greater than 0").optional(),
  price: z.number().nonnegative("price must be 0 or greater").optional(),
  pair: z.enum(VALID_PAIRS).optional(),
  status: z.enum(["open", "cancelled", "executed"]).optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type CreateTradeOrderDto = z.infer<typeof createTradeOrderSchema>;
export type UpdateTradeOrderDto = z.infer<typeof updateTradeOrderSchema>;
export type PaginationDto = z.infer<typeof paginationSchema>;
