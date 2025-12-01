import { ArtistCard } from "./spotify-shop-checker";

interface CacheEntry {
    results: ArtistCard[];
    timestamp: number;
}

// Cache duration: 1 hour (in milliseconds)
const CACHE_DURATION = 60 * 60 * 1000;
const CACHE_PREFIX = 'spotify_shop_search_';

export const SearchCache = {
    get: (query: string): ArtistCard[] | null => {
        if (typeof window === 'undefined') return null;

        try {
            const item = localStorage.getItem(CACHE_PREFIX + query);
            if (!item) return null;

            const entry: CacheEntry = JSON.parse(item);

            // Check if expired
            if (Date.now() - entry.timestamp > CACHE_DURATION) {
                localStorage.removeItem(CACHE_PREFIX + query);
                return null;
            }

            return entry.results;
        } catch (e) {
            console.error('Error reading from cache:', e);
            return null;
        }
    },

    set: (query: string, results: ArtistCard[]) => {
        if (typeof window === 'undefined') return;

        try {
            const entry: CacheEntry = {
                results,
                timestamp: Date.now()
            };
            localStorage.setItem(CACHE_PREFIX + query, JSON.stringify(entry));
        } catch (e) {
            console.error('Error writing to cache:', e);
        }
    },

    clear: () => {
        if (typeof window === 'undefined') return;

        // Clear only our cache items
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(CACHE_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
    }
};
