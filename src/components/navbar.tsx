"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "../lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../components/ui/navigation-menu";

// Featured artists data
const featuredArtists = [
  {
    title: "Taylor Swift",
    href: "/?query=pop",
    description: "Pop superstar with extensive merchandise collection.",
  },
  {
    title: "The Weeknd", 
    href: "/?query=r%26b",
    description: "R&B and pop artist with exclusive merch drops.",
  },
  {
    title: "Billie Eilish",
    href: "/?query=alternative",
    description: "Alternative pop with unique streetwear collaborations.",
  },
  {
    title: "Drake",
    href: "/?query=hip-hop",
    description: "Hip-hop icon with premium lifestyle merchandise.",
  },
];

// Popular genres data
const popularGenres = [
  {
    title: "Hip-Hop",
    href: "/?query=hip-hop",
    description: "Urban beats and rap culture merchandise.",
  },
  {
    title: "Pop",
    href: "/?query=pop",
    description: "Mainstream pop artists and trending merch.",
  },
  {
    title: "Rock",
    href: "/?query=rock",
    description: "Classic and modern rock band merchandise.",
  },
  {
    title: "Electronic",
    href: "/?query=electronic",
    description: "EDM and electronic music artist gear.",
  },
  {
    title: "R&B",
    href: "/?query=r%26b",
    description: "Smooth R&B and soul artist collections.",
  },
  {
    title: "Country",
    href: "/?query=country",
    description: "Country music stars and Americana merch.",
  },
];

// All genres data
const allGenres = [
  {
    title: "Jazz",
    href: "/?query=jazz",
    description: "Classic and contemporary jazz artists.",
  },
  {
    title: "Blues",
    href: "/?query=blues",
    description: "Blues legends and modern blues artists.",
  },
  {
    title: "Classical",
    href: "/?query=classical",
    description: "Orchestral and classical music merchandise.",
  },
  {
    title: "Folk",
    href: "/?query=folk",
    description: "Folk and acoustic artist collections.",
  },
  {
    title: "Reggae",
    href: "/?query=reggae",
    description: "Reggae and Caribbean music merch.",
  },
  {
    title: "Metal",
    href: "/?query=metal",
    description: "Heavy metal and metalcore band gear.",
  },
  {
    title: "Punk",
    href: "/?query=punk",
    description: "Punk rock and alternative merchandise.",
  },
  {
    title: "Indie",
    href: "/?query=indie",
    description: "Independent and alternative artist merch.",
  },
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
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
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
    </div>
  );
} 