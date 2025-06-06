'use client';

import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion"
import { Search as SearchIcon } from "lucide-react"
import { getArtistShopUrls, getArtistShopUrlsFromLLM } from "../../lib/spotify-shop-checker"
import { SearchResults } from "../../components/search-results"
import Image from "next/image"
import shopCentralLogo from "../../../public/shop-central-logo.png"

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const queryType = searchParams.get('type') || '';   // default empty means LLM

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get('query')?.toString() || '';
    if (searchQuery) {
      // Update URL and trigger search
      window.history.pushState({}, '', `/home?query=${encodeURIComponent(searchQuery)}`);
      window.location.reload();
    }
  };

  // Determine which search function to use - LLM by default
  const searchFunction = (queryType === 'regular' || queryType === 'genre')
    ? getArtistShopUrls
    : getArtistShopUrlsFromLLM;

  // Show search interface when no query is present
  if (!query) {
    return (
      <div className="container mx-auto max-w-7xl p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center gap-2">
            <Image src={shopCentralLogo} alt="Spotify Logo" width={100} height={100} className="mr-2"/>
            <h1 className="text-5xl font-bold tracking-tight">Search Dashboard</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Your personalized music merchandise discovery platform
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="features">
              <AccordionTrigger className="text-left">
                Advanced Search Features
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">✨ AI-Powered Search (Default)</h4>
                      <p className="text-green-700 dark:text-green-300 text-sm">
                        Smart search that understands your queries and finds the most relevant artists and merchandise.
                      </p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🎵 Genre Search</h4>
                      <p className="text-blue-700 dark:text-blue-300 text-sm">
                        Traditional genre-based search. Use the navbar "Genres" section for classic genre filtering.
                      </p>
                    </div>
                  </div>
                  <p className="text-sm">
                    <strong>Privacy Note:</strong> Your searches are not stored or tracked. We only use your email for authentication.
                    <br />
                    However, your searches may be anonymized and used to train the models used in the search functionality.
                    <br />
                    <br />
                    <em><strong>Model used: Google: Gemma 3n 4B (free)</strong> via <a href="https://openrouter.ai/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 underline underline-offset-4">OpenRouter</a></em>
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="tips">
              <AccordionTrigger className="text-left">
                Search Tips & Examples
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">AI-Powered Search Examples:</h4>
                    <div className="flex flex-wrap gap-2">
                      {['trending pop artists', 'classic rock legends', 'indie folk bands', 'electronic dance music', 'alternative hip-hop', 'acoustic singer-songwriters', 'modern jazz artists', 'viral tiktok songs'].map(example => (
                        <Button 
                          key={example}
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const input = document.querySelector('input[name="query"]') as HTMLInputElement;
                            if (input) input.value = example;
                          }}
                        >
                          {example}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Smart Search Tips:</h4>
                    <p className="text-sm">Try natural language queries like "artists similar to Taylor Swift" or "bands with great vinyl releases"</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
          <Input 
            name="query" 
            placeholder="Ask for any music style or artist type..." 
            className="flex-1"
          />
          <Button type="submit">
            <SearchIcon className="mr-2 h-4 w-4" />
            Search
          </Button>
        </form>
      </div>
    );
  }

  // Show results page with SearchResults component
  return (
    <div className="container mx-auto max-w-7xl p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center items-center gap-2">
          <Image src={shopCentralLogo} alt="Spotify Logo" width={100} height={100} className="mr-2"/>
          <h1 className="text-5xl font-bold tracking-tight">Search Results</h1>
        </div>
      </div>
      <Button variant="outline" onClick={() => router.back()}>
        Back
      </Button>
      <SearchResults 
        query={query} 
        searchFunction={searchFunction}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
