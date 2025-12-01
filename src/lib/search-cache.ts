import { ArtistCard } from "./spotify-shop-checker";

interface CacheEntry {
    results: ArtistCard[];
    timestamp: number;
}

// Simple in-memory cache
// Key: query string
// Value: CacheEntry
const searchCache = new Map<string, CacheEntry>();

// Cache duration: 1 hour (in milliseconds)
const CACHE_DURATION = 60 * 60 * 1000;

export const SearchCache = {
    get: (query: string): ArtistCard[] | null => {
        const entry = searchCache.get(query);
        if (!entry) return null;

        // Check if expired
        if (Date.now() - entry.timestamp > CACHE_DURATION) {
            searchCache.delete(query);
            return null;
        }

        return entry.results;
    },

    set: (query: string, results: ArtistCard[]) => {
        searchCache.set(query, {
            results,
            timestamp: Date.now()
        });
    },

    clear: () => {
        searchCache.clear();
    }
};
