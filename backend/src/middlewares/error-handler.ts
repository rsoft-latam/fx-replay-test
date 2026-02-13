import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error";
import { sendError } from "../utils/api-response";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.message);
    return;
  }

  console.error("Unexpected error:", err);
  sendError(res, 500, "Internal server error");
}
