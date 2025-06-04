import { NextResponse } from 'next/server';

const CLIENT_ID = '8edeefeea36745349e88b5f7cda23fd5';
const REDIRECT_URI = 'https://spotify-shop-central--spotify-shop-central.us-central1.hosted.app/api/auth/spotify/callback';
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
  const state = generateRandomString(16);
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID!,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
    state: state,
  });

  return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
} 