"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "../lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../components/ui/navigation-menu";
import { Button } from "../components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { SignedIn } from "@clerk/nextjs";
import { SignUpButton } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { SignedOut } from "@clerk/nextjs";
import { LogIn } from "lucide-react";
import shopCentralLogo from "../../public/shop-central-logo.png";

// Featured artists data (LLM-powered)
const featuredArtists = [
  {
    title: "Billboard Top 100",
    href: "/home?query=billboard-top-100&type=featured",
    description: "Current chart-topping artists and their latest merch.",
  },
  {
    title: "Vinyl Collections",
    href: "/home?query=vinyl-collections&type=featured",
    description: "Artists with special vinyl releases and collector items.",
  },
  {
    title: "Up-and-coming Artists",
    href: "/home?query=up-and-coming-artists&type=featured",
    description: "Emerging talents with fresh merchandise drops.",
  },
  {
    title: "All-Time Favorites",
    href: "/home?query=all-time-favorites&type=featured",
    description: "Legendary artists with timeless merchandise collections.",
  },
];

// Popular genres data
const popularGenres = [
  {
    title: "Taylor Swift",
    href: "/artist/taylor-swift",
    description: "Pop superstar with extensive merchandise collection.",
  },
  {
    title: "The Weeknd", 
    href: "/artist/the-weeknd",
    description: "R&B and pop artist with exclusive merch drops.",
  },
  {
    title: "Billie Eilish",
    href: "/artist/billie-eilish",
    description: "Alternative pop with unique streetwear collaborations.",
  },
  {
    title: "Drake",
    href: "/artist/drake",
    description: "Hip-hop icon with premium lifestyle merchandise.",
  },
];
// All genres data
const allGenres = [
  {
    title: "Hip-Hop",
    href: "/genre?query=hip-hop",
    description: "Urban beats and rap culture merchandise.",
  },
  {
    title: "Pop",
    href: "/genre?query=pop",
    description: "Mainstream pop artists and trending merch.",
  },
  {
    title: "Rock",
    href: "/genre?query=rock",
    description: "Classic and modern rock band merchandise.",
  },
  {
    title: "Electronic",
    href: "/genre?query=electronic",
    description: "EDM and electronic music artist gear.",
  },
  {
    title: "R&B",
    href: "/genre?query=r-and-b",
    description: "Smooth R&B and soul artist collections.",
  },
  {
    title: "Country",
    href: "/genre?query=country",
    description: "Country music stars and Americana merch.",
  },
  {
    title: "Jazz",
    href: "/genre?query=jazz",
    description: "Classic and contemporary jazz artists.",
  },
  {
    title: "Classical",
    href: "/genre?query=classical",
    description: "Orchestral and classical music merchandise.",
  }
];

// Reusable list item component
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">
            {title || "Loading..."}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children || "Please wait..."}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export function Navbar() {
  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Navigation Menu */}
          <div className="flex items-center gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src={shopCentralLogo}
                alt="Shop Central Logo"
                width={32}
                height={32}
                className="rounded-full hover:opacity-80 transition-opacity"
              />
            </Link>
            
            <NavigationMenu>
              <NavigationMenuList>
                {/* Featured */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    Featured
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {featuredArtists.map((artist) => (
                        <ListItem
                          key={artist.title}
                          title={artist.title}
                          href={artist.href}
                        >
                          {artist.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Popular */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    Popular
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {popularGenres.map((genre) => (
                        <ListItem
                          key={genre.title}
                          title={genre.title}
                          href={genre.href}
                        >
                          {genre.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Genres */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    Genres
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {allGenres.map((genre) => (
                        <ListItem
                          key={genre.title}
                          title={genre.title}
                          href={genre.href}
                        >
                          {genre.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side - Authentication */}
          <div className="flex items-center space-x-4">
            <SignedOut>
              <div className="flex items-center space-x-2">
                <SignInButton>
                  <Button variant="ghost" size="sm">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button size="sm">
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8"
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </div>
  );
} 