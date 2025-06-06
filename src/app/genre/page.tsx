'use client';

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "../../components/ui/button"
import { SearchResults } from "../../components/search-results"
import { getArtistShopUrlsByRecommendations } from "../../lib/spotify-shop-checker"
import Image from "next/image"
import shopCentralLogo from "../../../public/shop-central-logo.png"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

function GenreContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  if (!query) {
    return (
      <div className="container mx-auto max-w-7xl p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center gap-2">
            <Image src={shopCentralLogo} alt="Spotify Logo" width={100} height={100} className="mr-2"/>
            <h1 className="text-5xl font-bold tracking-tight">Genre Discovery</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Explore artists by music genre
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No genre specified. Please select a genre from the navigation.</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center items-center gap-2">
          <Image src={shopCentralLogo} alt="Spotify Logo" width={100} height={100} className="mr-2"/>
          <h1 className="text-5xl font-bold tracking-tight">
            {query.charAt(0).toUpperCase() + query.slice(1)} Artists
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Discover merchandise from top {query} artists
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <SearchResults
        query={query}
        searchFunction={getArtistShopUrlsByRecommendations}
      />
    </div>
  );
}

export default function GenrePage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
      <GenreContent />
    </Suspense>
  );
} 