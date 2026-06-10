export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  timeoutMs?: number;
};

export type AppError = {
  code: 'NETWORK_ERROR' | 'TIMEOUT' | 'HTTP_ERROR';
  message: string;
  fallbackAction: string;
  status?: number;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const normalizeError = (error: unknown, status?: number): AppError => {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return {
      code: 'TIMEOUT',
      message: '请求超时，当前保留本地状态。',
      fallbackAction: 'keep-local-state-and-retry',
      status
    };
  }

  if (typeof status === 'number') {
    return {
      code: 'HTTP_ERROR',
      message: `服务暂时不可用（HTTP ${status}），当前展示降级内容。`,
      fallbackAction: 'show-degraded-content',
      status
    };
  }

  return {
    code: 'NETWORK_ERROR',
    message: '网络异常，当前展示本地降级内容。',
    fallbackAction: 'show-degraded-content',
    status
  };
};

export const httpRequest = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), options.timeoutMs ?? 8000);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal
    });

    if (!response.ok) {
      throw normalizeError(null, response.status);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      throw error;
    }
    throw normalizeError(error);
  } finally {
    window.clearTimeout(timer);
  }
};