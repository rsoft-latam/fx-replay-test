import { Response } from "express";

interface ApiResponseOptions<T> {
  res: Response;
  statusCode?: number;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
}

export function sendResponse<T>({
  res,
  statusCode = 200,
  message,
  data,
  meta,
}: ApiResponseOptions<T>): void {
  const body: Record<string, unknown> = {
    success: true,
    message,
    data: data ?? null,
  };

  if (meta) {
    body.meta = meta;
  }

  res.status(statusCode).json(body);
}

export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  errors?: unknown
): void {
  const body: Record<string, unknown> = {
    success: false,
    message,
  };

  if (errors) {
    body.errors = errors;
  }

  res.status(statusCode).json(body);
}
