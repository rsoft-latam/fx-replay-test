import { Request, Response, NextFunction } from "express";
import { TradeOrderService } from "../services/trade-order.service";
import { paginationSchema } from "../dtos/trade-order.dto";
import { sendResponse } from "../utils/api-response";
import { serializeOrder, serializeOrders } from "../utils/serializer";

const service = new TradeOrderService();

function getParamId(req: Request): string {
  const id = req.params.id;
  if (Array.isArray(id)) return id[0];
  return id;
}

export class TradeOrderController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await service.create(req.body);
      sendResponse({
        res,
        statusCode: 201,
        message: "Trade order created successfully",
        data: serializeOrder(order as unknown as Record<string, unknown>),
      });
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination = paginationSchema.parse(req.query);
      const { orders, meta } = await service.findAll(pagination);
      sendResponse({
        res,
        message: "Trade orders retrieved successfully",
        data: serializeOrders(
          orders as unknown as Record<string, unknown>[]
        ),
        meta,
      });
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await service.findById(getParamId(req));
      sendResponse({
        res,
        message: "Trade order retrieved successfully",
        data: serializeOrder(order as unknown as Record<string, unknown>),
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await service.update(getParamId(req), req.body);
      sendResponse({
        res,
        message: "Trade order updated successfully",
        data: serializeOrder(order as unknown as Record<string, unknown>),
      });
    } catch (error) {
      next(error);
    }
  }

  async softDelete(req: Request, res: Response, next: NextFunction) {
    try {
      await service.softDelete(getParamId(req));
      sendResponse({
        res,
        message: "Trade order deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
