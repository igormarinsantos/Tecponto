import type { IncomingMessage, ServerResponse } from "node:http";

export type ApiRequest = IncomingMessage & { body?: unknown };
export type ApiResponse = ServerResponse;

export const readJson = async <T>(request: ApiRequest): Promise<T> => {
  if (request.body && typeof request.body === "object") return request.body as T;
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  const body = Buffer.concat(chunks).toString("utf8");
  return JSON.parse(body || "{}") as T;
};

export const sendJson = (response: ApiResponse, status: number, body: unknown, headers: Record<string, string> = {}) => {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json");
  Object.entries(headers).forEach(([name, value]) => response.setHeader(name, value));
  response.end(JSON.stringify(body));
};

export const sendEmpty = (response: ApiResponse, status = 204) => {
  response.statusCode = status;
  response.end();
};

export const requestUrl = (request: ApiRequest) => new URL(request.url ?? "/", `https://${request.headers.host ?? "tecponto.sbs"}`);
