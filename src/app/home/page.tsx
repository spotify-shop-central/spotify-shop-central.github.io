'use client';

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Input } from "../../components/ui/input"
import { Button } from "../..//components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion"
import { ExternalLink, Music, ShoppingBag, Coffee, LogIn } from "lucide-react"
import { getArtistShopUrls, ArtistCard } from "../../lib/spotify-shop-checker"
import Image from "next/image"
import shopCentralLogo from "../../../public/shop-central-logo.png"

interface State {
  artists: ArtistCard[]
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}

// Global variable to store the artist shop URLs

function HomeContent() {
  const [state, setState] = useState<State>({ 
    artists: [], 
    loading: false,
    error: null,
    isAuthenticated: false
  })
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [globalArtistCards, setGlobalArtistCards] = useState<ArtistCard[]>([]);

  useEffect(() => {
    // Check if user is authenticated by checking for the access token cookie
    const checkAuth = async () => {
      const response = await fetch('/api/auth/spotify/check');
      const { isAuthenticated } = await response.json();
      setState(prev => ({ ...prev, isAuthenticated }));
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchArtistShopUrls = async (searchQuery: string): Promise<void> => {
      if (!searchQuery) {
        setGlobalArtistCards([]);
        setState({ artists: [], loading: false, error: null, isAuthenticated: state.isAuthenticated });
        return;
      }
      
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const artistCards = await getArtistShopUrls(searchQuery);
        setGlobalArtistCards(artistCards);
        setState({ 
          artists: artistCards, 
          loading: false,
          error: null,
          isAuthenticated: state.isAuthenticated
        });
      } catch (error) {
        console.error('Error fetching artist shop URLs:', error);
        setGlobalArtistCards([]);
        setState({ 
          artists: [], 
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred',
          isAuthenticated: state.isAuthenticated
        });
      }
    }
    
    if (query) {
      fetchArtistShopUrls(query);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get('query')?.toString() || '';
    setQuery(searchQuery);
  };

  const handleSpotifyLogin = () => {
    window.location.href = '/api/auth/spotify';
  };

  return (
    <div className="container mx-auto max-w-7xl p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center items-center gap-2">
          <Image src={shopCentralLogo} alt="Spotify Logo" width={100} height={100} className="mr-2"/>
          <h1 className="text-5xl font-bold tracking-tight">Spotify Shop Central</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Discover merchandise from your favorite artists by genre
        </p>
        <p className="text-muted-foreground text-sm">
          ** Not operated by, developed by, or affiliated with Spotify USA Inc. **
        </p>
        {!state.isAuthenticated && (
          <Button onClick={handleSpotifyLogin} className="mt-4">
            <LogIn className="mr-2 h-4 w-4" />
            Login with Spotify
          </Button>
        )}
      </div>

      <div className="max-w-4xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="about">
            <AccordionTrigger className="text-left">
              About Spotify Shop Central
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <div className="space-y-4">
                <p>
                  This page is a one-stop "shop" (no pun intended) for all Spotify merchandise pages. 
                  Spotify doesn't have a section to view different artists' merchandise pages, so I 
                  decided to build a platform so people can access them more easily.
                </p>
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <p className="font-semibold text-amber-800 dark:text-amber-200 mb-2">DISCLAIMER:</p>
                  <p className="text-amber-700 dark:text-amber-300">
                    All purchases are made directly through Spotify. This platform is mainly meant to 
                    make the links more accessible, but no payment information is collected or accessed. 
                    You will be redirected away from the platform to Spotify for any purchases.
                  </p>
                </div>
                <p>
                  If you would like to support me or my work, feel free to{" "}
                  <a 
                    href="https://buymeacoffee.com/gouthamswaminathan" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:text-primary/80 underline underline-offset-4"
                  >
                    buy me a coffee
                    <Coffee className="h-4 w-4" />
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  ! Thanks for visiting, and happy shopping!
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
        <Input 
          name="query" 
          placeholder="Enter genres (e.g., jazz, blues, rock)" 
          className="flex-1"
        />
        <Button type="submit" disabled={state.loading}>
          {state.loading ? 'Searching...' : 'Search'}
        </Button>
      </form>

      {state.error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-center">
          {state.error}
        </div>
      )}

      {state.loading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span>Finding artists...</span>
          </div>
        </div>
      )}

      {state.artists.length > 0 && !state.loading && (
        <div className="space-y-4">
          <div className="text-center">
            <Badge variant="secondary" className="text-sm">
              Found {state.artists.length} artists
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 h-[600px] overflow-y-scroll">
            {state.artists.map((artist) => (
              <Card key={artist.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="aspect-square w-full mb-3 overflow-hidden rounded-md bg-muted">
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
      )}

      {!state.loading && !state.error && state.artists.length === 0 && query && (
        <div className="text-center py-8 text-muted-foreground">
          No artists found for "{query}". Try different genres.
        </div>
      )}
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
      <HomeContent />
    </Suspense>
  )
}
