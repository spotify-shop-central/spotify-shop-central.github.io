'use client';

import { useAuth } from '@clerk/nextjs';

export interface AuthenticatedFetchOptions extends RequestInit {
  timeout?: number;
}

/**
 * Custom hook for authenticated fetch requests
 */
export function useAuthenticatedFetch() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const authenticatedFetch = async (url: string, options: AuthenticatedFetchOptions = {}) => {
    if (!isLoaded) {
      throw new Error('Authentication not loaded yet');
    }

    if (!isSignedIn) {
      throw new Error('User not signed in');
    }

    try {
      // Get the current session token
      const token = await getToken();
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      const { timeout = 10000, ...fetchOptions } = options;

      // Merge headers with Authorization
      const headers = {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
        Authorization: `Bearer ${token}`,
      };

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          throw new Error('Authentication failed - please sign in again');
        }
        if (response.status === 403) {
          throw new Error('Access denied - insufficient permissions');
        }
        if (response.status === 404) {
          throw new Error('Resource not found');
        }
        if (response.status >= 500) {
          throw new Error('Server error - please try again later');
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      }
      
      return response.text();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      console.error('Authenticated fetch error:', error);
      throw error;
    }
  };

  return {
    authenticatedFetch,
    isAuthenticated: isSignedIn,
    isLoading: !isLoaded,
  };
}

/**
 * Utility function for making authenticated API calls to your search endpoint
 */
export function useSearchAPI() {
  const { authenticatedFetch, isAuthenticated, isLoading } = useAuthenticatedFetch();

  const search = async (query: string, searchType: 'llm' | 'genre' = 'llm') => {
    return authenticatedFetch('/api/search', {
      method: 'POST',
      body: JSON.stringify({ query, searchType }),
    });
  };

  const searchGet = async (query: string, searchType: 'llm' | 'genre' = 'llm') => {
    const params = new URLSearchParams({ query, type: searchType });
    return authenticatedFetch(`/api/search?${params}`);
  };

  return {
    search,
    searchGet,
    isAuthenticated,
    isLoading,
  };
}

/**
 * Server-side utility to verify Clerk tokens (kept for compatibility)
 */
export async function verifyClerkToken(token: string) {
  try {
    const response = await fetch(`https://api.clerk.dev/v1/verify_token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
} 