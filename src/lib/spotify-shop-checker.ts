'use server';

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
  const clientId     = process.env.SPOTIPY_CLIENT_ID;
  const clientSecret = process.env.SPOTIPY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      'Missing Spotify credentials: set SPOTIPY_CLIENT_ID and SPOTIPY_CLIENT_SECRET'
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
// Public entry point
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
