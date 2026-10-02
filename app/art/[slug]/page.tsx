import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import LikeButton from '@/components/LikeButton'
import CommentBox from '@/components/CommentBox'
import ViewTracker from '@/components/ViewTracker'

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Get artwork + artist
  const { data: artwork, error } = await supabase
    .from('artworks')
    .select(`
      *,
      artists (
        name,
        phone,
        tower,
        apartment,
        instagram_url,
        linkedin_url,
        photo_url
      )
    `)
    .eq('slug', slug)
    .single()

  if (error || !artwork) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">
          Artwork not found
        </h1>

        {error && (
          <p className="mt-4 text-red-600">
            {error.message}
          </p>
        )}
      </main>
    )
  }

  // Get likes
  const { count: likeCount } = await supabase
    .from('likes')
    .select('*', {
      count: 'exact',
      head: true,
    })
    .eq('artwork_id', artwork.id)

  // Get all artworks for browsing
  const { data: allArtworks } = await supabase
    .from('artworks')
    .select('id, slug, title, display_order')
    .order('display_order', { ascending: true })
    .order('id', { ascending: true })

  const artworks = allArtworks ?? []

  const currentIndex = artworks.findIndex(
    (item) => item.id === artwork.id
  )

  const previousArtwork =
    currentIndex > 0
      ? artworks[currentIndex - 1]
      : null

  const nextArtwork =
    currentIndex >= 0 &&
    currentIndex < artworks.length - 1
      ? artworks[currentIndex + 1]
      : null

  const artworkNumber =
    currentIndex >= 0 ? currentIndex + 1 : 1

  const totalArtworks = artworks.length

  // Phone / WhatsApp
  const rawPhone = artwork.artists?.phone || ''
  const digitsOnly = rawPhone.replace(/\D/g, '')

  const whatsappPhone =
    digitsOnly.length === 10
      ? `91${digitsOnly}`
      : digitsOnly

  const buyingMessage = encodeURIComponent(
    `Hi, I saw "${artwork.title}" at the PWF Art Exhibition and I am interested in buying this artwork.`
  )

  const customOrderMessage = encodeURIComponent(
    `Hi, I saw "${artwork.title}" at the PWF Art Exhibition and would like to discuss a custom artwork.`
  )

  const isAvailable = artwork.status === 'available'
  const isSold = artwork.status === 'sold'
  const isNotForSale = artwork.status === 'not_for_sale'

  return (
    <main className="mx-auto max-w-xl p-6">

      <ViewTracker artworkId={artwork.id} />

      {/* Exhibition navigation */}
      <div className="mb-6 flex items-center justify-between">

        <Link
          href="/gallery"
          className="text-sm font-medium underline"
        >
          ← Gallery
        </Link>

        <span className="text-sm text-gray-500">
          Artwork {artworkNumber} of {totalArtworks}
        </span>

      </div>

      {/* Painting title */}
      <h1 className="text-3xl font-bold">
        {artwork.title}
      </h1>

      <p className="mt-2 text-lg">
        by {artwork.artists?.name}
      </p>

      {/* Painting image */}
      {artwork.image_url && (
        <img
          src={artwork.image_url}
          alt={artwork.title}
          className="mt-6 w-full rounded-lg"
        />
      )}

      <p className="mt-5">
        {artwork.medium} • {artwork.size}
      </p>

      <LikeButton
        artworkId={artwork.id}
        initialLikes={likeCount ?? 0}
      />

      {/* Story */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold">
          Story Behind the Painting
        </h2>

        <p className="mt-2">
          {artwork.story}
        </p>
      </section>

      {/* Buyer Experience */}
      <section className="mt-8 rounded-xl border p-5">

        <h2 className="text-xl font-semibold">
          Artwork Availability
        </h2>

        <div className="mt-3">

          {isAvailable && (
            <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
              ● Available
            </span>
          )}

          {isSold && (
            <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-800">
              Sold
            </span>
          )}

          {isNotForSale && (
            <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
              Not for Sale
            </span>
          )}

        </div>

        {artwork.for_sale && artwork.price && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Price
            </p>

            <p className="text-3xl font-bold">
              ₹{Number(artwork.price).toLocaleString('en-IN')}
            </p>
          </div>
        )}

        {isAvailable &&
          artwork.for_sale &&
          whatsappPhone && (
            <a
              href={`https://wa.me/${whatsappPhone}?text=${buyingMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 block rounded-lg bg-black px-5 py-3 text-center font-semibold text-white"
            >
              Interested in Buying
            </a>
          )}

        {artwork.accepts_custom_order &&
          whatsappPhone && (
            <a
              href={`https://wa.me/${whatsappPhone}?text=${customOrderMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block rounded-lg border border-black px-5 py-3 text-center font-semibold"
            >
              🎨 Request a Custom Order
            </a>
          )}

        {artwork.commission_note && (
          <p className="mt-3 text-sm text-gray-600">
            {artwork.commission_note}
          </p>
        )}

        {artwork.artists?.phone && (
          <a
            href={`tel:${artwork.artists.phone}`}
            className="mt-3 block text-center text-sm font-medium underline"
          >
            📞 Call Artist
          </a>
        )}

      </section>

      {/* Artist */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold">
          Artist
        </h2>

        <p className="mt-2 font-semibold">
          {artwork.artists?.name}
        </p>

        <p>
          {artwork.artists?.tower}
          {' • '}
          Apartment {artwork.artists?.apartment}
        </p>
      </section>

      <CommentBox artworkId={artwork.id} />

      {/* Previous / Next */}
      <nav className="mt-10 border-t pt-6">

        <div className="flex items-center justify-between gap-4">

          {previousArtwork ? (
            <Link
              href={`/art/${previousArtwork.slug}`}
              className="font-semibold"
            >
              ← Previous
            </Link>
          ) : (
            <span />
          )}

          <Link
            href="/gallery"
            className="text-sm underline"
          >
            View Gallery
          </Link>

          {nextArtwork ? (
            <Link
              href={`/art/${nextArtwork.slug}`}
              className="font-semibold"
            >
              Next →
            </Link>
          ) : (
            <span />
          )}

        </div>

      </nav>

    </main>
  )
}