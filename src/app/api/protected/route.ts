import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, requireAuth } from '../../../lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    // Use the new auth utility
    const { user } = await requireAuth();

    // Your protected logic here
    const data = {
      message: 'This is protected data',
      user: {
        id: user.user_id,
        email: user.email,
        name: user.name,
        clerkUserId: user.clerkUserId,
        orgId: user.orgId
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Protected route error:', error);
    
    // Handle authentication errors specifically
    if (error instanceof Error && error.message.includes('Not authenticated')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Alternative approach using getCurrentUser for more flexibility
    const result = await getCurrentUser();
    
    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    const { user } = result;
    const body = await request.json();
    
    // Your protected logic here
    const responseData = {
      message: 'Data processed successfully',
      user: {
        id: user.user_id,
        email: user.email,
        name: user.name,
      },
      receivedData: body,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Protected route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 