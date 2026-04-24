import { storage } from "./storage";

const DEFAULT_BASE_URL = "http://localhost:8000/api/v1";

const apiBaseUrl =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  (import.meta.env.VITE_API_URL as string | undefined) ??
  DEFAULT_BASE_URL;

type RequestConfig = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  headers?: HeadersInit;
};

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const buildHeaders = (headers?: HeadersInit, hasBody = false) => {
  const token = storage.getAccessToken();
  const nextHeaders = new Headers(headers);

  if (hasBody && !nextHeaders.has("Content-Type")) {
    nextHeaders.set("Content-Type", "application/json");
  }

  if (token && !nextHeaders.has("Authorization")) {
    nextHeaders.set("Authorization", `Bearer ${token}`);
  }

  return nextHeaders;
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload !== null && "message" in payload
        ? String(payload.message)
        : "Request failed.";

    const details =
      typeof payload === "object" && payload !== null && "details" in payload
        ? payload.details
        : undefined;

    throw new ApiError(response.status, message, details);
  }

  return payload as T;
};

const request = async <T>(path: string, config: RequestConfig = {}) => {
  const hasBody = config.body !== undefined;
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: config.method ?? "GET",
    headers: buildHeaders(config.headers, hasBody),
    body: hasBody ? JSON.stringify(config.body) : undefined,
  });

  return parseResponse<T>(response);
};

export const apiClient = {
  get: <T>(path: string, headers?: HeadersInit) => request<T>(path, { method: "GET", headers }),
  post: <T>(path: string, body?: unknown, headers?: HeadersInit) =>
    request<T>(path, { method: "POST", body, headers }),
  patch: <T>(path: string, body?: unknown, headers?: HeadersInit) =>
    request<T>(path, { method: "PATCH", body, headers }),
  put: <T>(path: string, body?: unknown, headers?: HeadersInit) =>
    request<T>(path, { method: "PUT", body, headers }),
};
