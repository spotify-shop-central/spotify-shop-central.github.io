'use server';

import { createClerkClient } from '@clerk/backend';
import { auth } from '@clerk/nextjs/server';

export interface UserProfile {
  user_id: string;
  email: string;
  name: string;
  createdAt: Date;
  clerkUserId: string;
  orgId?: string;
}

export async function getOrCreateUser(
  clerkUserId?: string
): Promise<{ user: UserProfile } | { error: string }> {
  try {
    // Get current auth context if clerkUserId not provided
    const { userId: currentUserId, orgId: activeClerkOrgId } = await auth();
    const targetUserId = clerkUserId || currentUserId;

    if (!targetUserId) {
      return { error: 'Unauthorized - No user ID found' };
    }

    /* ───────────── Clerk ───────────── */
    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    
    if (!process.env.CLERK_SECRET_KEY) {
      return { error: 'Clerk secret key not configured' };
    }

    const clerkUser = await clerk.users.getUser(targetUserId);

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) {
      return { error: 'Email not found in Clerk profile' };
    }

    const name =
      `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() ||
      'No Name';
    const createdAt = new Date(clerkUser.createdAt);

    /* ───── Check existing metadata ───── */
    const existingUserId = clerkUser.privateMetadata?.user_id as string;
    const userId = existingUserId || `user_${targetUserId}`;

    /* ───── Update Clerk metadata if needed ───── */
    if (!existingUserId) {
      await clerk.users.updateUserMetadata(targetUserId, {
        privateMetadata: { 
          user_id: userId,
          last_updated: new Date().toISOString()
        }
      });
    }

    const userProfile: UserProfile = {
      user_id: userId,
      email,
      name,
      createdAt,
      clerkUserId: targetUserId,
      orgId: activeClerkOrgId || undefined
    };

    return { user: userProfile };
  } catch (err) {
    console.error('Error in getOrCreateUser:', err);
    return { error: 'Internal Server Error' };
  }
}

/* Convenience wrapper to get current authenticated user */
export async function getCurrentUser(): Promise<{ user: UserProfile } | { error: string }> {
  const { userId } = await auth();
  
  if (!userId) {
    return { error: 'Not authenticated' };
  }

  return getOrCreateUser(userId);
}

/* Get user by Clerk ID */
export async function getUser(clerkUserId: string) {
  return getOrCreateUser(clerkUserId);
}

/* Check if user has access to perform actions */
export async function requireAuth(): Promise<{ user: UserProfile } | never> {
  const result = await getCurrentUser();
  
  if ('error' in result) {
    throw new Error(result.error);
  }
  
  return result;
} 