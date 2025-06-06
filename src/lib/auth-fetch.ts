'use client';

import { useAuth } from '@clerk/nextjs';

/**
 * Custom hook for authenticated fetch requests
 */
export function useAuthenticatedFetch() {
  const { getToken } = useAuth();

  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    try {
      // Get the current session token
      const token = await getToken();
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Merge headers with Authorization
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Authenticated fetch error:', error);
      throw error;
    }
  };

  return authenticatedFetch;
}

/**
 * Server-side utility to verify Clerk tokens
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