import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { QueryClient, QueryFunction } from "@tanstack/react-query";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



// Helper function to process dates when parsing JSON from server
function reviveDates(key: string, value: any): any {
  // Simple ISO date regex pattern for string date detection
  const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
  
  // If the value is a string and matches date pattern, convert to Date
  if (typeof value === 'string' && datePattern.test(value)) {
    return new Date(value);
  }
  return value;
}

// Helper function to prepare data for sending to server
function prepareDataForSending(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }
  
  // Don't alter Date objects as JSON.stringify will handle them correctly
  if (data instanceof Date) {
    return data;
  }
  
  if (Array.isArray(data)) {
    return data.map(item => prepareDataForSending(item));
  }
  
  if (typeof data === 'object') {
    const prepared: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      prepared[key] = prepareDataForSending(value);
    }
    return prepared;
  }
  
  return data;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  url: string,
  options: { method?: string; data?: unknown } = {}
): Promise<any> {
  const { method = 'GET', data } = options;
  
  // Prepare data before sending
  const preparedData = data ? prepareDataForSending(data) : undefined;
  
  const headers: Record<string, string> = {};
  
  if (data) {
    headers["Content-Type"] = "application/json";
  }
  
  // Get session ID from localStorage for mobile/iframe fallback
  const sessionId = localStorage.getItem('sessionId');
  if (sessionId) {
    headers["Authorization"] = `Bearer ${sessionId}`; // Fallback; primary auth via cookie
  }
  
  const res = await fetch(url, {
    method,
    headers,
    body: preparedData ? JSON.stringify(preparedData) : undefined,
    credentials: "include", // Always include cookies for session-based auth
  });

  await throwIfResNotOk(res);
  
  // Parse JSON response with date handling
  const text = await res.text();
  return JSON.parse(text, reviveDates);
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Special handling for auth endpoint - return cached user data if available
    if (queryKey[0] === '/api/auth/me') {
      const cachedUserData = localStorage.getItem('userData');
      if (cachedUserData) {
        try {
          return JSON.parse(cachedUserData);
        } catch (e) {
          // If parsing fails, continue with normal fetch
        }
      }
    }
    
    // Get session ID from localStorage for mobile/iframe fallback
    const sessionId = localStorage.getItem('sessionId');
    const headers: Record<string, string> = {};
    
    if (sessionId) {
      headers["Authorization"] = `Bearer ${sessionId}`; // Fallback only
    }
    
    const res = await fetch(queryKey[0] as string, {
      headers,
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    
    // Parse JSON with date handling
    const text = await res.text();
    return JSON.parse(text, reviveDates);
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 0,
      retry: 1,
    },
    mutations: {
      retry: false,
    },
  },
});
