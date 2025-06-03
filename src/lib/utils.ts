export interface Artist {
  id: string
  name: string
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIPY_CLIENT_ID
  const clientSecret = process.env.SPOTIPY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Missing Spotify credentials')
  }

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  })

  if (!res.ok) {
    throw new Error('Failed to get token')
  }

  const data = await res.json()
  return data.access_token as string
}

async function searchArtists(query: string, token: string): Promise<Artist[]> {
  const res = await fetch(`https://api.spotify.com/v1/search?type=artist&q=${encodeURIComponent(query)}`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  if (!res.ok) {
    throw new Error('Failed to search artists')
  }

  const data = await res.json()
  return data.artists.items.map((a: any) => ({ id: a.id, name: a.name })) as Artist[]
}

function generateShopUrls(artists: Artist[]): string[] {
  return artists.map(a => `https://open.spotify.com/artist/${a.id}/store`)
}

export async function getArtistShopUrls(query: string): Promise<string[]> {
  const token = await getAccessToken()
  const artists = await searchArtists(query, token)
  return generateShopUrls(artists)
}
