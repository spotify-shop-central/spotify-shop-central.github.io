"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ExternalLink, Music, ShoppingBag, Heart } from "lucide-react";
import { ArtistBio } from "../lib/artist-data";
import { ArtistCard } from "../lib/spotify-shop-checker";

interface ArtistPageProps {
  artistBio: ArtistBio;
  artistCard?: ArtistCard;
}

export function ArtistPage({ artistBio, artistCard }: ArtistPageProps) {
  // Generate shop and Spotify URLs
  const shopUrl = artistCard?.shopUrl || `https://shop.spotify.com/en/artist/${artistBio.spotifyId}/store`;
  const spotifyUrl = artistCard?.spotifyUrl || `https://open.spotify.com/artist/${artistBio.spotifyId}`;
  const artistImage = artistBio.image || artistCard?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(artistBio.name)}&size=400&background=random`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <Badge variant="secondary" className="mb-4">Featured Artist</Badge>
      </div>
      
      <Card className="overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <div className="aspect-square w-full overflow-hidden bg-muted">
              <img
                src={artistImage}
                alt={artistBio.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(artistBio.name)}&size=400&background=random`;
                }}
              />
            </div>
          </div>
          
          <div className="md:w-2/3 p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-3xl mb-2">{artistBio.name}</CardTitle>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">
                  <Heart className="w-3 h-3 mr-1" />
                  Fan Favorite
                </Badge>
                <Badge variant="outline">
                  <ShoppingBag className="w-3 h-3 mr-1" />
                  Official Merch
                </Badge>
                {artistBio.genres.map((genre) => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            
            <CardContent className="px-0">
              <div className="prose prose-sm max-w-none mb-6">
                {artistBio.bio.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
              
              <div className="flex gap-3">
                <Button size="lg" asChild className="flex-1">
                  <a
                    href={shopUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    Shop Official Merch
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                
                <Button variant="outline" size="lg" asChild>
                  <a
                    href={spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <Music className="h-5 w-5" />
                    Listen on Spotify
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
} 