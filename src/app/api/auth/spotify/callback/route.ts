import { NextResponse, NextRequest } from 'next/server';
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '8edeefeea36745349e88b5f7cda23fd5';
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI || 'https://spotify-shop-central--spotify-shop-central.us-central1.hosted.app/api/auth/spotify/callback';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!state) {
    const url = request.nextUrl.clone()
    url.pathname = '/home'
    return NextResponse.redirect(url);
  }

  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
    },
    body: new URLSearchParams({
      code: code!,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });

  const data = await tokenResponse.json();

  // Create absolute URL for redirect
  const redirectUrl = new URL('/', request.url);
  const response = NextResponse.redirect(redirectUrl);
  
  response.cookies.set('spotify_access_token', data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: data.expires_in,
  });
  
  response.cookies.set('spotify_refresh_token', data.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  return response;
} 