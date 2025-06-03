import SpotifyWebApi from 'spotify-web-api-node';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Track {
  artists: Array<{ uri: string; name: string }>;
  name: string;
  id: string;
  external_urls: { spotify: string };
}

interface RecommendationsResponse {
  tracks: Track[];
}

class SpotifyShopChecker {
  private spotify: SpotifyWebApi;

  constructor() {
    this.spotify = new SpotifyWebApi({
      clientId: process.env.SPOTIPY_CLIENT_ID,
      clientSecret: process.env.SPOTIPY_CLIENT_SECRET,
    });
  }

  async initialize(): Promise<void> {
    try {
      const data = await this.spotify.clientCredentialsGrant();
      this.spotify.setAccessToken(data.body['access_token']);
      console.log('Spotify client initialized successfully');
    } catch (error) {
      console.error('Error initializing Spotify client:', error);
      throw error;
    }
  }

  async generateResults(): Promise<RecommendationsResponse> {
    try {
      const result = await this.spotify.getRecommendations({
        seed_genres: ['jazz'],
        limit: 100,
      });
      return result.body;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  }

  async collectResults(iterations: number = 50): Promise<Track[]> {
    const allTracks: Track[] = [];
    
    console.log(`Collecting ${iterations * 100} tracks...`);
    
    for (let i = 0; i < iterations; i++) {
      try {
        const results = await this.generateResults();
        allTracks.push(...results.tracks);
        
        if (i % 10 === 0) {
          console.log(`Collected ${allTracks.length} tracks so far...`);
        }
        
        // Add a small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error on iteration ${i}:`, error);
        // Continue with other iterations
      }
    }
    
    console.log(`Total tracks collected: ${allTracks.length}`);
    return allTracks;
  }

  extractArtistIds(tracks: Track[]): string[] {
    const artistIds = tracks.map(track => {
      if (track.artists && track.artists.length > 0) {
        const uri = track.artists[0].uri;
        return uri.replace('spotify:artist:', '');
      }
      return null;
    }).filter((id): id is string => id !== null);

    // Remove duplicates
    return [...new Set(artistIds)];
  }

  generateShopUrls(artistIds: string[]): string[] {
    return artistIds.map(id => `https://open.spotify.com/artist/${id}/store`);
  }

  async run(): Promise<string[]> {
    try {
      await this.initialize();
      
      // Collect tracks (reduced iterations for reasonable execution time)
      const tracks = await this.collectResults(50); // This will give us 5000 tracks
      
      // Extract artist IDs
      const artistIds = this.extractArtistIds(tracks);
      console.log(`Found ${artistIds.length} unique artists`);
      
      // Generate shop URLs
      const shopUrls = this.generateShopUrls(artistIds);
      
      console.log('\n=== RESULTS ===');
      console.log(`Total tracks analyzed: ${tracks.length}`);
      console.log(`Unique artists: ${artistIds.length}`);
      console.log(`Shop URLs generated: ${shopUrls.length}`);
      console.log('\nShop URLs:');
      shopUrls.forEach(shop => console.log(shop));
      
      return shopUrls;
      
    } catch (error) {
      console.error('Error in main execution:', error);
      throw error;
    }
  }
}

export default SpotifyShopChecker; 