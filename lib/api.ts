export type ApiMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export async function apiRequest<T = any>(
  path: string,
  method: ApiMethod = 'GET',
  data?: any,
  init?: RequestInit
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init?.headers || {}),
  };

  const res = await fetch(path, {
    method,
    headers,
    credentials: 'include',
    body: data !== undefined ? JSON.stringify(data) : undefined,
    ...init,
  });

  const text = await res.text();
  const isJSON = res.headers.get('content-type')?.includes('application/json');
  const parsed = isJSON && text ? JSON.parse(text) : text;

  if (!res.ok) {
    const message = (parsed && (parsed.message || parsed.error)) || (typeof parsed === 'string' ? parsed : 'Request failed');
    throw new Error(message);
  }

  return parsed as T;
}



