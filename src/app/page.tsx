'use client';

import { Suspense } from "react"
import { Button } from "../components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion"
import { ExternalLink, Coffee, LogIn, Search, Sparkles } from "lucide-react"
import Image from "next/image"
import shopCentralLogo from "../../public/shop-central-logo.png"
import Link from "next/link"
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs"

function HomeContent() {
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
      </div>

      <div className="max-w-4xl mx-auto">
        <Accordion type="single" collapsible className="w-full" defaultValue="about">
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
                <p>
                  <strong>How it works:</strong> 
                  Browse by genre to discover artists and their official merchandise. 
                  You'll quickly get a list of artists with links to their stores and artist pages.
                </p>
                <p>
                  If you would like to support me or my work, feel free to{" "}
                  <a 
                    href="https://buymeacoffee.com/gooth" 
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

      {/* Disclaimer and Authentication Information */}
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <p className="font-semibold text-amber-800 dark:text-amber-200 mb-2">DISCLAIMER:</p>
          <p className="text-amber-700 dark:text-amber-300 mb-3">
            All purchases are made directly through Spotify. This platform is mainly meant to 
            make the links more accessible, but no payment information is collected or accessed. 
            You will be redirected away from the platform to Spotify for any purchases.
          </p>
          <p className="text-amber-700 dark:text-amber-300 text-sm justify-center items-center text-center">
            ** Not operated by, developed by, or affiliated with Spotify USA Inc. **
          </p>
        </div>

        <SignedOut>
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Sparkles className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  Unlock Custom AI-Powered Searches
                </h3>
                <p className="text-green-700 dark:text-green-300 mb-4">
                  Create an account to access our advanced search features! Get personalized artist recommendations 
                  for Billboard Top 100, vinyl collections, up-and-coming artists, and all-time favorites powered by AI.
                </p>
                <div className="bg-green-100 dark:bg-green-900/30 rounded-md p-3 mb-4">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <strong>Privacy First:</strong> We only collect your email address for authentication. 
                    No personal data, purchase history, or browsing behavior is stored or shared. 
                    <br />
                    However, your searches may be anonymized and used to train the models used in the search functionality.
                    <br />
                    <br />
                    <em><strong>Model used: Google: Gemma 3n 4B (free)</strong> via <a href="https://openrouter.ai/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 underline underline-offset-4">OpenRouter</a></em>
                  </p>
                </div>
                <div className="flex gap-3">
                  <SignUpButton>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign Up for Free
                    </Button>
                  </SignUpButton>
                  <SignInButton>
                    <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                      Already have an account? Sign In
                    </Button>
                  </SignInButton>
                </div>
              </div>
            </div>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
            <div className="flex justify-center mb-3">
              <Search className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Ready to Explore?
            </h3>
            <p className="text-blue-700 dark:text-blue-300 mb-4">
              You're all set! Access your personalized search dashboard with AI-powered recommendations.
            </p>
            <Link href="/home">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Search className="mr-2 h-4 w-4" />
                Go to Search Dashboard
              </Button>
            </Link>
          </div>
        </SignedIn>
      </div>
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
