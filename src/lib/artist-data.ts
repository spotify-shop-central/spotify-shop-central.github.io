export interface ArtistBio {
  id: string;
  name: string;
  slug: string;
  bio: string;
  genres: string[];
  spotifyId?: string;
  image?: string;
}

export const artistBios: Record<string, ArtistBio> = {
  'taylor-swift': {
    id: 'taylor-swift',
    name: 'Taylor Swift',
    slug: 'taylor-swift',
    bio: `Taylor Swift is one of the most successful artists of our time, known for her narrative songwriting that often draws from her personal life. From country roots to pop stardom, Taylor has continuously evolved her sound while maintaining her authentic storytelling. Her merchandise reflects her artistic journey, featuring exclusive items from each era of her career.

Explore limited edition vinyl, era-specific apparel, and collector's items that celebrate Taylor's musical evolution. From folklore cardigans to 1989 polaroids, each piece tells a story from Taylor's incredible discography.`,
    genres: ['pop', 'country', 'folk'],
    spotifyId: '06HL4z0CvFAxyc27GXpf02',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Taylor_Swift_at_the_Golden_Globes_2024_%28Enhanced%2C_cropped%29_1.jpg'
  },
  'the-weeknd': {
    id: 'the-weeknd',
    name: 'The Weeknd',
    slug: 'the-weeknd',
    bio: `The Weeknd has redefined contemporary R&B with his dark, atmospheric sound and cinematic approach to music. Known for hits like "Blinding Lights" and "Can't Feel My Face," he has become one of the most influential artists of the 2010s and beyond.

His merchandise collection features sleek, minimalist designs that reflect his aesthetic. From After Hours-inspired apparel to Dawn FM collectibles, explore official gear that captures The Weeknd's unique artistic vision.`,
    genres: ['r&b', 'pop', 'alternative'],
    spotifyId: '1Xyo4u8uXC1ZmMpatF05PJ',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/The_Weeknd_Portrait_by_Brian_Ziff.jpg'
  },
  'billie-eilish': {
    id: 'billie-eilish',
    name: 'Billie Eilish',
    slug: 'billie-eilish',
    bio: `Billie Eilish burst onto the scene with her unique sound and bold visual style. Known for her whispered vocals, dark themes, and oversized fashion, she has become a voice for a generation. Her music tackles topics from mental health to climate change with remarkable honesty.

Her merchandise reflects her distinctive aesthetic with streetwear-inspired designs, sustainable materials, and bold graphics. From limited edition vinyl to signature oversized apparel, each item embodies Billie's commitment to authenticity and environmental consciousness.`,
    genres: ['alternative', 'pop', 'indie'],
    spotifyId: '6qqNVTkY8uBg9cP3Jd7DAH',
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Billie_Eilish_at_Pukkelpop_Festival_-_18_AUGUST_2019_%2808%29_%28cropped%29.jpg'
  },
  'drake': {
    id: 'drake',
    name: 'Drake',
    slug: 'drake',
    bio: `Drake has dominated hip-hop and popular music for over a decade, seamlessly blending rap and R&B to create his signature sound. From Toronto to the world, he has become one of the best-selling music artists of all time, known for both his introspective lyrics and catchy hooks.

His merchandise line, including OVO brand collaborations, features premium streetwear and luxury items. Explore official Drake gear including exclusive album merchandise, OVO-branded apparel, and limited edition collectibles that represent his cultural impact.`,
    genres: ['hip-hop', 'rap', 'r&b'],
    spotifyId: '3TVXtAsR1Inumwj472S9r4',
    image: 'https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9'
  }
};

export function getArtistBio(slug: string): ArtistBio | null {
  return artistBios[slug] || null;
}

export function getAllArtistSlugs(): string[] {
  return Object.keys(artistBios);
} 