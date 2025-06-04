import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI || 'https://spotify-shop-central--spotify-shop-central.us-central1.hosted.app/api/auth/spotify/callback';
const SCOPES = 'user-read-private user-read-email';

function generateRandomString(length: number) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export async function GET() {
  // Debug logging
  console.log('Environment variables:');
  console.log('CLIENT_ID:', CLIENT_ID);
  console.log('REDIRECT_URI:', REDIRECT_URI);
  console.log('All env vars containing SPOTIFY:', Object.keys(process.env).filter(key => key.includes('SPOTIFY')));

  const state = generateRandomString(16);
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID!,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
    state: state,
  });

  const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  console.log('Generated auth URL:', authUrl);

  return NextResponse.redirect(authUrl);
} 