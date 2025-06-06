import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '../../../lib/auth-utils';
import { getArtistShopUrlsFromLLM, getArtistShopUrls } from '../../../lib/spotify-shop-checker';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const result = await getCurrentUser();
    
    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    const { user } = result;
    const body = await request.json();
    const { query, searchType = 'llm' } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    console.log(`User ${user.email} searching for: "${query}" (type: ${searchType})`);

    // Determine which search function to use
    const searchFunction = searchType === 'genre' ? getArtistShopUrls : getArtistShopUrlsFromLLM;
    
    // Perform the search
    const artistCards = await searchFunction(query);

    // Log search activity (you could store this in a database if needed)
    console.log(`Search completed for user ${user.email}: ${artistCards.length} results`);

    return NextResponse.json({
      success: true,
      query,
      searchType,
      results: artistCards,
      user: {
        id: user.user_id,
        name: user.name,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Search API error:', error);
    
    // Handle different types of errors
    if (error instanceof Error) {
      if (error.message.includes('Not authenticated')) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
      
      if (error.message.includes('Spotify')) {
        return NextResponse.json(
          { error: 'Spotify API error occurred' },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const result = await getCurrentUser();
    
    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    const { user } = result;
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const searchType = searchParams.get('type') || 'llm';

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    console.log(`User ${user.email} searching for: "${query}" (type: ${searchType})`);

    // Determine which search function to use
    const searchFunction = searchType === 'genre' ? getArtistShopUrls : getArtistShopUrlsFromLLM;
    
    // Perform the search
    const artistCards = await searchFunction(query);

    return NextResponse.json({
      success: true,
      query,
      searchType,
      results: artistCards,
      user: {
        id: user.user_id,
        name: user.name,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 