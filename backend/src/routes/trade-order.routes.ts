import { Router } from "express";
import { TradeOrderController } from "../controllers/trade-order.controller";
import { validate } from "../middlewares/validate";
import {
  createTradeOrderSchema,
  updateTradeOrderSchema,
} from "../dtos/trade-order.dto";

const router = Router();
const controller = new TradeOrderController();

/**
 * @swagger
 * components:
 *   schemas:
 *     TradeOrder:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         side:
 *           type: string
 *           enum: [buy, sell]
 *         type:
 *           type: string
 *           enum: [limit, market, stop]
 *         amount:
 *           type: number
 *           format: decimal
 *         price:
 *           type: number
 *           format: decimal
 *         status:
 *           type: string
 *           enum: [open, cancelled, executed]
 *         pair:
 *           type: string
 *           enum: [BTCUSD, EURUSD, ETHUSD]
 *         isDeleted:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateTradeOrder:
 *       type: object
 *       required:
 *         - side
 *         - type
 *         - amount
 *         - price
 *         - pair
 *       properties:
 *         side:
 *           type: string
 *           enum: [buy, sell]
 *           example: buy
 *         type:
 *           type: string
 *           enum: [limit, market, stop]
 *           example: limit
 *         amount:
 *           type: number
 *           example: 1.5
 *         price:
 *           type: number
 *           example: 99000
 *         pair:
 *           type: string
 *           enum: [BTCUSD, EURUSD, ETHUSD]
 *           example: BTCUSD
 *     UpdateTradeOrder:
 *       type: object
 *       properties:
 *         side:
 *           type: string
 *           enum: [buy, sell]
 *         type:
 *           type: string
 *           enum: [limit, market, stop]
 *         amount:
 *           type: number
 *         price:
 *           type: number
 *         pair:
 *           type: string
 *           enum: [BTCUSD, EURUSD, ETHUSD]
 *         status:
 *           type: string
 *           enum: [open, cancelled, executed]
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *     PaginatedResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TradeOrder'
 *         meta:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *             page:
 *               type: integer
 *             limit:
 *               type: integer
 *             totalPages:
 *               type: integer
 */

/**
 * @swagger
 * /trade_orders:
 *   post:
 *     summary: Create a new trade order
 *     tags: [Trade Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTradeOrder'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 */
router.post(
  "/",
  validate(createTradeOrderSchema),
  controller.create.bind(controller)
);

/**
 * @swagger
 * /trade_orders:
 *   get:
 *     summary: List all trade orders (paginated)
 *     tags: [Trade Orders]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
router.get("/", controller.findAll.bind(controller));

/**
 * @swagger
 * /trade_orders/{id}:
 *   get:
 *     summary: Get a trade order by ID
 *     tags: [Trade Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Order not found
 */
router.get("/:id", controller.findById.bind(controller));

/**
 * @swagger
 * /trade_orders/{id}:
 *   put:
 *     summary: Update a trade order
 *     tags: [Trade Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTradeOrder'
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Order not found
 */
router.put(
  "/:id",
  validate(updateTradeOrderSchema),
  controller.update.bind(controller)
);

/**
 * @swagger
 * /trade_orders/{id}:
 *   delete:
 *     summary: Soft delete a trade order
 *     tags: [Trade Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 */
router.delete("/:id", controller.softDelete.bind(controller));

export default router;
