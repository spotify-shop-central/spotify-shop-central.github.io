'use client';
import { notFound } from 'next/navigation';
import { getArtistBio, getAllArtistSlugs } from '../../../lib/artist-data';
import { ArtistPage } from '../../../components/artist-page';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import shopCentralLogo from '../../../../public/shop-central-logo.png';


export default function Artist() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug || '';
  const artistBio = getArtistBio(slug);

  if (!artistBio) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-7xl p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center items-center gap-2">
          <Image src={shopCentralLogo} alt="Spotify Logo" width={100} height={100} className="mr-2"/>
          <h1 className="text-5xl font-bold tracking-tight">Spotify Shop Central</h1>
        </div>
      </div>

      <ArtistPage artistBio={artistBio} />
    </div>
  );
} 