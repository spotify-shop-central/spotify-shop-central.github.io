'use server';

import { callLLM } from './call-llm';

///////////////////////////
// Types
///////////////////////////

export interface Track {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
    uri: string;
    external_urls: { spotify: string };
  }>;
  external_urls: { spotify: string };
}

export interface ArtistCard {
  id: string;
  name: string;
  image: string;
  shopUrl: string;
  spotifyUrl: string;
}

interface SpotifyArtist {
  id: string;
  name: string;
  images: Array<{ url: string; height: number; width: number }>;
  external_urls: { spotify: string };
  followers: { total: number };
  genres: string[];
}

///////////////////////////
// Auth helpers
///////////////////////////

async function getAccessToken(): Promise<string> {
  const clientId     = process.env.SPOTIFY_CLIENT_ID || '8edeefeea36745349e88b5f7cda23fd5';
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      'Missing Spotify credentials: set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET'
    );
  }

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret
  });

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  });

  if (!res.ok) {
    throw new Error(
      `Token request failed: ${res.status} ${res.statusText} – ${await res.text()}`
    );
  }

  const payload: { access_token: string } = await res.json();
  return payload.access_token;
}

///////////////////////////
// Genre utilities
///////////////////////////

function parseGenres(raw: string): string[] {
  if (!raw || !raw.trim()) return ['jazz'];            // sensible default
  return raw
    .split(',')
    .map(g => g.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 5);                                      // hard API cap
}

///////////////////////////
// Search helpers
///////////////////////////

/** One page (≤ 50) of tracks for a single genre & offset. */
async function searchTracksByGenre(
  genre: string,
  token: string,
  limit = 50,
  offset = 0
): Promise<Track[]> {
  const q   = `genre:"${genre}"`;
  const url =
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=${limit}&offset=${offset}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    throw new Error(
      `Search failed (${genre} offset ${offset}): ${res.status} ${res.statusText} – ${await res.text()}`
    );
  }

  const json = await res.json();
  return (json.tracks?.items ?? []) as Track[];
}

/** Grab up to pagesPerGenre × 50 tracks for every genre supplied. */
async function collectTracks(
  genres: string[],
  token: string,
  pagesPerGenre = 5
): Promise<Track[]> {
  const all: Track[] = [];

  for (const genre of genres) {
    for (let page = 0; page < pagesPerGenre; page++) {
      const offset = page * 50;
      const batch  = await searchTracksByGenre(genre, token, 50, offset);

      if (!batch.length) break;        // ran out of results early
      all.push(...batch);

      // Tiny delay to stay polite (optional)
      await new Promise(r => setTimeout(r, 100));
    }
  }

  return all;
}

///////////////////////////
// Artist extraction
///////////////////////////

function extractUniqueArtistIds(tracks: Track[]): string[] {
  const ids = new Set<string>();

  tracks.forEach(track => {
    track.artists?.forEach(a => ids.add(a.id));
  });

  return [...ids];
}

/** Fetch detailed artist information including images */
async function getArtistDetails(artistIds: string[], token: string): Promise<SpotifyArtist[]> {
  const artists: SpotifyArtist[] = [];
  
  // Spotify API allows up to 50 artists per request
  const batchSize = 50;
  
  for (let i = 0; i < artistIds.length; i += batchSize) {
    const batch = artistIds.slice(i, i + batchSize);
    const url = `https://api.spotify.com/v1/artists?ids=${batch.join(',')}`;
    
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!res.ok) {
      console.error(`Failed to fetch artists batch ${i}: ${res.status} ${res.statusText}`);
      continue;
    }
    
    const json = await res.json();
    if (json.artists) {
      artists.push(...json.artists);
    }
    
    // Small delay between batches
    await new Promise(r => setTimeout(r, 100));
  }
  
  return artists;
}

function buildArtistCards(artists: SpotifyArtist[]): ArtistCard[] {
  return artists.map(artist => ({
    id: artist.id,
    name: artist.name,
    image: artist.images?.[0]?.url || '/placeholder-artist.png', // Use largest image or fallback
    shopUrl: `https://shop.spotify.com/en/artist/${artist.id}/store`,
    spotifyUrl: artist.external_urls.spotify
  }));
}

///////////////////////////
// Artist search by name
///////////////////////////

interface SpotifySearchResponse {
  artists: {
    items: SpotifyArtist[];
  };
}

/** Search for a single artist by name using Spotify's search API */
async function searchArtistByName(artistName: string, token: string): Promise<SpotifyArtist | null> {
  const query = encodeURIComponent(artistName);
  const url = `https://api.spotify.com/v1/search?q=${query}&type=artist&limit=1`;
  
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (!res.ok) {
    console.error(`Failed to search for artist "${artistName}": ${res.status} ${res.statusText}`);
    return null;
  }
  
  const json: SpotifySearchResponse = await res.json();
  return json.artists?.items?.[0] || null;
}

/** Search for multiple artists by their names */
async function searchArtistsByNames(artistNames: string[], token: string): Promise<SpotifyArtist[]> {
  const artists: SpotifyArtist[] = [];
  
  for (const name of artistNames) {
    try {
      const artist = await searchArtistByName(name, token);
      if (artist) {
        artists.push(artist);
      }
      // Small delay to be polite to the API
      await new Promise(r => setTimeout(r, 100));
    } catch (error) {
      console.error(`Error searching for artist "${name}":`, error);
    }
  }
  
  return artists;
}

/** Parse artist names from LLM response */
function parseArtistNames(llmResponse: string): string[] {
  try {
    // Try to parse as JSON array first
    const parsed = JSON.parse(llmResponse);
    if (Array.isArray(parsed)) {
      return parsed.filter(name => typeof name === 'string' && name.trim());
    }
  } catch {
    // If JSON parsing fails, try to extract from text
    const matches = llmResponse.match(/\[(.*?)\]/);
    if (matches) {
      return matches[1]
        .split(',')
        .map(name => name.trim().replace(/['"]/g, ''))
        .filter(Boolean);
    }
    
    // Fallback: split by commas and clean up
    return llmResponse
      .split(',')
      .map(name => name.trim().replace(/['"[\]]/g, ''))
      .filter(Boolean);
  }
  
  return [];
}

///////////////////////////
// Recommendations helper
///////////////////////////

/**
 * Get artist cards using Spotify's /recommendations endpoint seeded by genres.
 * This provides more relevant genre-based suggestions than plain search.
 */
export async function getArtistShopUrlsByRecommendations(rawGenres = ''): Promise<ArtistCard[]> {
  if (!rawGenres.trim()) return [];

  const token  = await getAccessToken();
  const genres = parseGenres(rawGenres).slice(0, 5); // Spotify allows up to 5 seed genres

  // Encode each genre individually but preserve commas between them
  const genreParam = genres.map(g => encodeURIComponent(g)).join(',');
  const url = `https://api.spotify.com/v1/recommendations?seed_genres=${genreParam}&limit=100&market=US`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    console.warn(`Recommendations endpoint failed (${res.status}). Falling back to searchTracksByGenre approach.`);
    // Fallback: use existing genre-based search
    try {
      return await getArtistShopUrls(rawGenres);
    } catch (fallbackErr) {
      throw new Error(`Recommendations failed: ${res.status} ${res.statusText} – ${await res.text()}`);
    }
  }

  const json = await res.json();
  const tracks: Track[] = json.tracks ?? [];

  if (!tracks.length) return [];

  const artistIds = extractUniqueArtistIds(tracks);
  const artists   = await getArtistDetails(artistIds, token);
  return buildArtistCards(artists);
}

///////////////////////////
// Public entry points
///////////////////////////

/**
 * Given a comma‑separated list of genres,
 * return artist cards with name, image, and shop URLs.
 *
 * Example: getArtistShopUrls("jazz,blues")
 */
export async function getArtistShopUrls(rawGenres = ''): Promise<ArtistCard[]> {
  // 1 token for all subsequent calls
  const token  = await getAccessToken();
  const genres = parseGenres(rawGenres);

  console.log(`Collecting artists for genres: ${genres.join(', ')}`);

  const tracks     = await collectTracks(genres, token, 5);   // 5 × 50 = 250 tracks per genre
  const artistIds  = extractUniqueArtistIds(tracks);
  
  console.log(`Found ${artistIds.length} unique artists, fetching details...`);
  
  const artists    = await getArtistDetails(artistIds, token);
  const artistCards = buildArtistCards(artists);

  console.log(
    `Final results: ${tracks.length} tracks → ${artistIds.length} unique artists → ${artistCards.length} artist cards`
  );

  return artistCards;
}

/**
 * Given a user query, use LLM to get artist names, then search for them on Spotify
 * and return artist cards with shop URLs.
 */
export async function getArtistShopUrlsFromLLM(userQuery: string): Promise<ArtistCard[]> {
  if (!userQuery?.trim()) {
    return [];
  }

  try {
    // 1. Get access token
    const token = await getAccessToken();
    
    // 2. Use LLM to get artist names
    console.log(`Getting artist suggestions from LLM for query: "${userQuery}"`);
    const llmResponse = await callLLM(userQuery);
    const artistNames = parseArtistNames(llmResponse.content || '');
    
    console.log(`LLM suggested artists: ${artistNames.join(', ')}`);
    
    if (artistNames.length === 0) {
      console.log('No artists found from LLM, falling back to genre-based search');
      return await getArtistShopUrls(userQuery);
    }
    
    // 3. Search for artists on Spotify
    console.log(`Searching for ${artistNames.length} artists on Spotify...`);
    const artists = await searchArtistsByNames(artistNames, token);
    
    // 4. Build artist cards
    const artistCards = buildArtistCards(artists);
    
    console.log(`Final results: ${artistNames.length} LLM suggestions → ${artists.length} found artists → ${artistCards.length} artist cards`);
    
    return artistCards;
  } catch (error) {
    console.error('Error in getArtistShopUrlsFromLLM:', error);
    
    // Fallback to genre-based search if LLM fails
    console.log('LLM failed, falling back to genre-based search');
    try {
      return await getArtistShopUrls(userQuery);
    } catch (fallbackError) {
      console.error('Fallback search also failed:', fallbackError);
      throw new Error(`Both LLM and fallback search failed. LLM error: ${error instanceof Error ? error.message : 'Unknown error'}. Fallback error: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown error'}`);
    }
  }
}
