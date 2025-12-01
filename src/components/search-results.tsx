"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ExternalLink, Music, ShoppingBag } from "lucide-react";
import { ArtistCard } from "../lib/spotify-shop-checker";
import { SearchCache } from "../lib/search-cache";

interface SearchResultsProps {
  query: string;
  searchFunction: (query: string) => Promise<ArtistCard[]>;
  showSpecialView?: boolean;
}

export interface SearchResultsRef {
  shuffle: () => void;
}

interface State {
  artists: ArtistCard[];
  loading: boolean;
  error: string | null;
  progress: number;
  loadingText: string;
}

// Loading messages for progress
const loadingMessages = [
  "🎵 Connecting to the music universe...",
  "🎤 Finding artists in your genre...",
  "🛍️ Discovering amazing merchandise...",
  "✨ Curating the perfect collection...",
  "🎶 Almost ready to rock..."
];

export const SearchResults = forwardRef<SearchResultsRef, SearchResultsProps>(({ query, searchFunction, showSpecialView = false }, ref) => {
  const [state, setState] = useState<State>({
    artists: [],
    loading: true,
    error: null,
    progress: 10,
    loadingText: loadingMessages[0]
  });

  useImperativeHandle(ref, () => ({
    shuffle: () => {
      setState(prev => ({
        ...prev,
        artists: [...prev.artists].sort(() => Math.random() - 0.5)
      }));
    }
  }));

  // Progress animation during loading
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let messageInterval: NodeJS.Timeout;

    if (state.loading) {
      interval = setInterval(() => {
        setState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + Math.random() * 15, 95)
        }));
      }, 300);

      messageInterval = setInterval(() => {
        setState(prev => ({
          ...prev,
          loadingText: loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
        }));
      }, 2000);
    }

    return () => {
      clearInterval(interval);
      clearInterval(messageInterval);
    };
  }, [state.loading]);

  // Search when query changes
  useEffect(() => {
    if (query) {
      handleSearch();
    }
  }, [query]);

  const handleSearch = async () => {
    // Check cache first
    const cachedResults = SearchCache.get(query);

    if (cachedResults) {
      setState(prev => ({
        ...prev,
        artists: cachedResults,
        loading: false,
        progress: 100,
        loadingText: "🎉 Ready to explore!"
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      progress: 10,
      loadingText: loadingMessages[0],
      artists: []
    }));

    try {
      // Ensure minimum loading time for better UX
      const [artistCards] = await Promise.all([
        searchFunction(query),
        new Promise(resolve => setTimeout(resolve, 800)) // Minimum 1.5 seconds
      ]);

      // Cache the results
      SearchCache.set(query, artistCards);

      setState(prev => ({
        ...prev,
        artists: artistCards,
        loading: false,
        progress: 100,
        loadingText: "🎉 Ready to explore!"
      }));
    } catch (error) {
      console.error('Error fetching artist results:', error);
      // Ensure error state also waits for minimum loading time
      await new Promise(resolve => setTimeout(resolve, 1000));
      setState(prev => ({
        ...prev,
        artists: [],
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
        progress: 0
      }));
    }
  };

  if (state.error) {
    return (
      <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-center max-w-2xl mx-auto">
        {state.error}
      </div>
    );
  }

  if (state.loading) {
    return (
      <div className="text-center py-8 space-y-4 max-w-md mx-auto">
        <div className="relative">
          <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300 ease-out rounded-full"
              style={{
                width: `${state.progress}%`,
                backgroundColor: '#1DB954', // Spotify Green
              }}
            />
          </div>
        </div>
        <p className="text-muted-foreground font-medium">{state.loadingText}</p>
      </div>
    );
  }

  if (!state.loading && state.artists.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No artists found for "{query}". Try a different search.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <Badge variant="secondary" className="text-sm">
          Found {state.artists.length === 1 ? "1 artist" : `${state.artists.length} artists`}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto">
        {state.artists.map((artist) => (
          <Card key={artist.id} className="group hover:shadow-lg transition-shadow h-[400px]">
            <CardHeader className="pb-3">
              <div className="aspect-square w-full mb-0 overflow-hidden rounded-md bg-muted">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&size=300&background=random`;
                  }}
                />
              </div>
              <CardTitle className="text-lg truncate" title={artist.name}>
                {artist.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1"
                  asChild
                >
                  <a
                    href={artist.shopUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Shop
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a
                    href={artist.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <Music className="h-4 w-4" />
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
});

SearchResults.displayName = "SearchResults"; 